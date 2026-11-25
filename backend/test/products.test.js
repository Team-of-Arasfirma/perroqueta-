import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { once } from "node:events";
import { readdir } from "node:fs/promises";
import { test } from "node:test";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import app from "../app.js";
import Admin from "../models/Admin.js";
import Product from "../models/Product.js";
import { seedProducts, seedRecords } from "../scripts/seedProducts.js";

const expectedSlugs = [
  "upvc-roofing-sheets",
  "stone-coated-roofing",
  "ceramic-roofing-tiles",
  "wpc-interior-wall-panels",
  "puf-panels",
  "clay-ceiling-tiles",
  "terracotta-clay-jali",
  "solar-structures",
];

test("all eight seeds validate and reference assets with exact casing", async () => {
  assert.deepEqual(seedRecords.map(({ slug }) => slug), expectedSlugs);
  for (const record of seedRecords) {
    await new Product(record).validate();
    for (const [, url] of JSON.stringify(record).matchAll(/"url":"(\/assets\/[^"]+)"/g)) {
      let directory = new URL("../../frontend/public/", import.meta.url);
      for (const segment of url.slice(1).split("/")) {
        assert.ok((await readdir(directory)).includes(segment), url);
        directory = new URL(encodeURIComponent(segment) + "/", directory);
      }
    }
  }

  const [upvc, stone, ceramic, wpc, puf, clay, jali, solar] = seedRecords;
  assert.deepEqual(
    [upvc, ceramic, wpc, puf, jali].map(({ hero }) => hero.defaultOptionId),
    ["orange", "red", "2", "gray", "meadows"],
  );
  assert.equal(upvc.options.find(({ id }) => id === "red").image.url, "/assets/products/upvc/CHERRY.png");
  assert.deepEqual(stone.profiles.map(({ colors }) => colors.length), [5, 4, 5, 3]);
  assert.equal(stone.hero.defaultProfileId, "tradix");
  assert.equal(stone.hero.defaultColorId, "arctic-blue");
  assert.deepEqual(wpc.options.map(({ profileId }) => profileId), ["12mm", "12mm", "12mm", "15mm", "15mm"]);
  assert.deepEqual(wpc.profiles.map(({ measurements }) => measurements.map(({ value }) => value)),
    [["153mm", "24mm", "7mm", "14mm", "12mm"], ["152mm", "25mm", "15mm"]]);
  assert.equal(clay.name, "Clay Ceiling Tiles");
  assert.equal(jali.name, "Terracotta Clay Jali");
  assert.equal(clay.hero.selectorType, "none");
  assert.equal(solar.hero.selectorType, "none");
  assert.deepEqual(solar.hero.badges, ["Ground Mounted", "Rooftop"]);
});

test("selection constraints reject unresolved defaults and duplicate scoped IDs", async () => {
  const [, stone, , wpc] = seedRecords;
  const duplicateProfile = structuredClone(stone);
  duplicateProfile.profiles.push(duplicateProfile.profiles[0]);
  await assert.rejects(new Product(duplicateProfile).validate(), /Profile IDs must be unique/);

  const badStone = structuredClone(stone);
  badStone.hero.defaultColorId = "frost-green";
  badStone.profiles[0].colors.push(badStone.profiles[0].colors[0]);
  await assert.rejects(new Product(badStone).validate(), (error) =>
    Boolean(error.errors["hero.defaultColorId"] && error.errors["profiles.0.colors"]));

  const badWpc = structuredClone(wpc);
  badWpc.status = "hidden";
  badWpc.hero.defaultOptionId = "999";
  badWpc.options[0].profileId = "missing";
  badWpc.options.push(badWpc.options[0]);
  await assert.rejects(new Product(badWpc).validate(), (error) =>
    ["status", "hero.defaultOptionId", "options.0.profileId", "options"]
      .every((path) => error.errors[path]));

  await assert.rejects(new Product({
    ...stone, hero: { ...stone.hero, defaultProfileId: "missing" },
  }).validate(), /Default profile must reference an existing profile/);
});

test("MongoDB seed is idempotent and product routes enforce lifecycle and permissions", async (t) => {
  const dbName = "perroqueta_products_test_" + randomUUID().replaceAll("-", "");
  await mongoose.connect(process.env.PRODUCT_TEST_MONGO_URI || "mongodb://127.0.0.1:27017", { dbName });
  t.after(async () => {
    try {
      await mongoose.connection.dropDatabase();
    } finally {
      await mongoose.disconnect();
    }
  });

  assert.deepEqual(await seedProducts(), { processed: 8, inserted: 8 });
  assert.deepEqual(await seedProducts(), { processed: 8, inserted: 0 });
  assert.equal(await Product.countDocuments(), 8);

  process.env.JWT_SECRET = randomUUID();
  const [admin, viewer, denied] = await Admin.create([
    { name: "Admin", email: "admin@example.test", passwordHash: "fixture", role: "super_admin" },
    { name: "Viewer", email: "viewer@example.test", passwordHash: "fixture", permissions: { products: { view: true } } },
    { name: "Denied", email: "denied@example.test", passwordHash: "fixture" },
  ]);

  const server = app.listen(0, "127.0.0.1");
  t.after(() => new Promise((resolve) => server.close(resolve)));
  await once(server, "listening");
  const base = "http://127.0.0.1:" + server.address().port + "/api/products";
  const request = async (route, expected, { method = "GET", body, actor } = {}) => {
    const headers = { "Content-Type": "application/json" };
    if (actor) headers.Authorization = "Bearer " + jwt.sign({}, process.env.JWT_SECRET, {
      subject: String(actor._id),
    });
    const response = await fetch(base + route, {
      method, headers, body: body === undefined ? undefined : JSON.stringify(body),
    });
    const payload = await response.json();
    assert.equal(response.status, expected, JSON.stringify(payload));
    return payload;
  };

  assert.deepEqual((await request("?published=true", 200)).products.map(({ slug }) => slug), expectedSlugs);
  for (const record of seedRecords) {
    const { product } = await request("/slug/" + record.slug, 200);
    const { _id, __v, createdAt, updatedAt, ...content } = product;
    const expected = JSON.parse(JSON.stringify(new Product(record)));
    delete expected._id;
    assert.deepEqual(content, expected, record.slug);
  }

  await request("/admin", 401);
  await request("/admin", 403, { actor: denied });
  assert.equal((await request("/admin", 200, { actor: viewer })).products.length, 8);
  const { product } = await request("/admin/" + expectedSlugs[0], 200, { actor: viewer });
  await request("/admin/" + product._id, 200, { actor: viewer });
  await request("", 403, { method: "POST", actor: viewer, body: seedRecords[0] });
  await request("", 409, { method: "POST", actor: admin, body: seedRecords[0] });

  const { product: draft } = await request("", 201, {
    method: "POST", actor: admin, body: { ...seedRecords[0], slug: "test-draft", status: "draft" },
  });
  await request("/slug/test-draft", 404);
  assert.equal((await request("?published=false", 200)).products.length, 8);
  await request("/" + draft._id, 400, { method: "PUT", actor: admin, body: { slug: "renamed" } });
  await request("/" + draft._id, 403, { method: "PUT", actor: viewer, body: { status: "published" } });
  await request("/" + draft._id, 200, { method: "PUT", actor: admin, body: { status: "published" } });
  await request("/slug/test-draft", 200);
  await request("/" + draft._id, 200, { method: "PUT", actor: admin, body: { status: "archived" } });
  await request("/slug/test-draft", 404);

  await request("/" + product._id, 200, { method: "PUT", actor: admin, body: { status: "archived" } });
  assert.deepEqual(await seedProducts(), { processed: 8, inserted: 0 });
  await request("/slug/" + product.slug, 404);
});
