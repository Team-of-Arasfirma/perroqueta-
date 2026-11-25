import "dotenv/config";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import mongoose from "mongoose";
import Product from "../models/Product.js";

export const seedRecords = JSON.parse(
  await readFile(new URL("./data/products.json", import.meta.url), "utf8")
);

export async function seedProducts() {
  await Product.createIndexes();

  const documents = await Promise.all(seedRecords.map(async (record) => {
    const product = new Product(record);
    await product.validate();
    const now = new Date();
    return { ...product.toObject(), createdAt: now, updatedAt: now, __v: 0 };
  }));

  const result = await Product.collection.bulkWrite(documents.map((document) => ({
    updateOne: {
      filter: { slug: document.slug },
      update: { $setOnInsert: document },
      upsert: true,
    },
  })));

  return { processed: documents.length, inserted: result.upsertedCount };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI is required.");
    await mongoose.connect(process.env.MONGO_URI);
    const { inserted, processed } = await seedProducts();
    console.log(`Products: ${processed} seed slugs, ${inserted} inserted, ${processed - inserted} already present.`);
  } catch (error) {
    console.error("Product seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}
