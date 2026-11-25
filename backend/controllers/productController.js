import mongoose from "mongoose";
import Product from "../models/Product.js";

const writableFields = [
  "name", "brand", "series", "breadcrumbLabel", "detailHeading", "status",
  "displayOrder", "sectionOrder", "cards", "hero", "options", "profiles",
  "selectedSpecifications", "technicalProfile", "overview", "specifications",
  "applications", "brochure", "seo",
];

function readChanges(body) {
  return Object.fromEntries(writableFields
    .filter((field) => Object.hasOwn(body, field))
    .map((field) => [field, body[field]]));
}

function isProductBody(body) {
  return body && typeof body === "object" && !Array.isArray(body);
}

function errorResponse(res, status, message) {
  return res.status(status).json({ success: false, message });
}

function productError(res, error) {
  if (error.code === 11000) return errorResponse(res, 409, "Product slug already exists.");
  if (error.name === "VersionError" || error.name === "DocumentNotFoundError") {
    return errorResponse(res, 409, "Product changed during this request. Reload and try again.");
  }
  if (error.name === "ValidationError" || error.name === "CastError") {
    return errorResponse(res, 400, error.message);
  }
  console.error("Product request failed:", error);
  return errorResponse(res, 500, "Unable to complete product request.");
}

async function listProducts(res, filter) {
  try {
    const products = await Product.find(filter).sort({ displayOrder: 1, slug: 1 }).lean();
    return res.json({ success: true, products });
  } catch (error) {
    return productError(res, error);
  }
}

async function findProduct(res, filter) {
  try {
    const product = await Product.findOne(filter).lean();
    if (!product) return errorResponse(res, 404, "Product not found.");
    return res.json({ success: true, product });
  } catch (error) {
    return productError(res, error);
  }
}

export const listPublicProducts = (_req, res) => listProducts(res, { status: "published" });
export const listAdminProducts = (_req, res) => listProducts(res, {});
export const getPublicProduct = (req, res) =>
  findProduct(res, { slug: req.params.slug, status: "published" });

export const getAdminProduct = (req, res) => {
  const { key } = req.params;
  return findProduct(res, mongoose.isObjectIdOrHexString(key)
    ? { $or: [{ _id: key }, { slug: key }] }
    : { slug: key });
};

export async function createProduct(req, res) {
  if (!isProductBody(req.body)) return errorResponse(res, 400, "A product object is required.");
  try {
    const product = await Product.create({ ...readChanges(req.body), slug: req.body.slug });
    return res.status(201).json({ success: true, product });
  } catch (error) {
    return productError(res, error);
  }
}

export async function updateProduct(req, res) {
  if (!mongoose.isObjectIdOrHexString(req.params.id)) {
    return errorResponse(res, 400, "Invalid product ID.");
  }
  if (!isProductBody(req.body)) return errorResponse(res, 400, "A product object is required.");
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return errorResponse(res, 404, "Product not found.");
    if (Object.hasOwn(req.body, "slug") && req.body.slug !== product.slug) {
      return errorResponse(res, 400, "Product slug cannot be changed.");
    }
    product.set(readChanges(req.body));
    await product.save();
    return res.json({ success: true, product });
  } catch (error) {
    return productError(res, error);
  }
}
