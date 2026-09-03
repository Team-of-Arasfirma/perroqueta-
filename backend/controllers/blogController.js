import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";
import Blog from "../models/Blog.js";
import {
  calculateReadingTime,
  generateExcerpt,
  normalizeBoolean,
  sanitizeRichTextHtml,
  sanitizeSlug,
  sanitizeText,
} from "../utils/blogUtils.js";

const uploadImage = (file) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "perroqueta/blogs", resource_type: "image" },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(file.buffer);
  });

const removeCloudinaryImage = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary cleanup error:", error);
  }
};

const uniqueSlug = async (value, excludeId) => {
  const base = sanitizeSlug(value) || `blog-${Date.now()}`;
  let slug = base;
  let count = 1;
  while (await Blog.exists({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) })) {
    slug = `${base}-${count++}`;
  }
  return slug;
};

const bool = (value, fallback) =>
  value === undefined ? fallback : normalizeBoolean(value, fallback);

const parseDate = (value, fallback = new Date()) => {
  const date = value ? new Date(value) : fallback;
  return Number.isNaN(date?.getTime?.()) ? fallback : date;
};

const imageObject = (url = "", publicId = "", altText = "") => ({
  url,
  publicId,
  altText: sanitizeText(altText),
});

const buildPayload = async ({ blog, body, file, adminName }) => {
  const title = sanitizeText(body.title);
  const content = sanitizeRichTextHtml(body.content || "");
  const category = sanitizeText(body.category);
  const categorySlug = sanitizeSlug(body.categorySlug || category);
  const subCategory = sanitizeText(body.subCategory || "");
  const subCategorySlug = subCategory
    ? sanitizeSlug(body.subCategorySlug || subCategory)
    : "";
  const status = body.status === "Draft" || body.published === "false" || body.published === false
    ? "Draft"
    : "Published";
  const published = status === "Published";
  const uploaded = file ? await uploadImage(file) : null;
  const removeCoverImage = body.removeCoverImage === "true" || body.removeCoverImage === true;
  const oldUrl = blog?.coverImage || blog?.featuredImage?.url || "";
  const oldPublicId = blog?.coverImagePublicId || blog?.featuredImage?.publicId || "";
  const coverImage = uploaded?.secure_url || (removeCoverImage ? "" : oldUrl);
  const coverImagePublicId = uploaded?.public_id || (removeCoverImage ? "" : oldPublicId);
  const slug = await uniqueSlug(body.slug || (blog && title === blog.title ? blog.slug : title), blog?._id);
  const date = parseDate(body.date, blog?.date || blog?.publishedAt || new Date());
  const excerpt = sanitizeText(body.excerpt) || generateExcerpt(content, 220);

  return {
    title,
    slug,
    category,
    categorySlug,
    subCategory,
    subCategorySlug,
    date,
    status,
    published,
    publishedAt: published ? (blog?.publishedAt || date) : null,
    content,
    coverImage,
    coverImagePublicId,
    featuredImage: imageObject(coverImage, coverImagePublicId, body.coverImageAltText || body.featuredImageAltText || title),
    excerpt,
    author: sanitizeText(body.author) || sanitizeText(adminName),
    metaTitle: sanitizeText(body.metaTitle),
    metaDescription: sanitizeText(body.metaDescription),
    metaKeywords: sanitizeText(body.metaKeywords),
    canonicalUrl: sanitizeText(body.canonicalUrl),
    ogTitle: sanitizeText(body.ogTitle),
    ogDescription: sanitizeText(body.ogDescription),
    robotsIndex: bool(body.robotsIndex, blog?.robotsIndex ?? true),
    robotsFollow: bool(body.robotsFollow, blog?.robotsFollow ?? true),
    readingTime: calculateReadingTime(content),
    uploaded,
    oldPublicId,
  };
};

const publicFilter = (req) => {
  const filter = { published: true, status: "Published" };
  if (req.query.categorySlug) filter.categorySlug = sanitizeSlug(req.query.categorySlug);
  if (req.query.subCategorySlug) filter.subCategorySlug = sanitizeSlug(req.query.subCategorySlug);
  return filter;
};

export const getBlogs = async (req, res) => {
  try {
    const filter = req.query.status === "all" ? {} : { ...publicFilter(req) };
    if (req.query.status === "Draft") { filter.status = "Draft"; filter.published = false; }
    if (req.query.published === "all") delete filter.published;
    if (req.query.published === "false") { filter.published = false; filter.status = "Draft"; }
    const blogs = await Blog.find(filter).sort({ date: -1, createdAt: -1 }).lean();
    return res.json({ success: true, blogs, total: blogs.length, page: 1, pages: 1 });
  } catch (error) {
    console.error("Get blogs error:", error);
    return res.status(500).json({ success: false, message: "Unable to load blogs." });
  }
};

export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: sanitizeSlug(req.params.slug), published: true, status: "Published" }).lean();
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found." });
    return res.json({ success: true, blog });
  } catch (error) {
    console.error("Get blog by slug error:", error);
    return res.status(500).json({ success: false, message: "Unable to load blog." });
  }
};

export const getBlogById = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid blog ID." });
  const blog = await Blog.findById(req.params.id).lean();
  if (!blog) return res.status(404).json({ success: false, message: "Blog not found." });
  return res.json({ success: true, blog });
};

export const getBlogCategories = async (req, res) => {
  const rows = await Blog.aggregate([
    { $match: { categorySlug: { $ne: "" } } },
    { $group: { _id: "$categorySlug", name: { $first: "$category" }, categorySlug: { $first: "$categorySlug" } } },
    { $sort: { name: 1 } },
  ]);
  return res.json({ success: true, categories: rows.map(({ _id, ...item }) => item) });
};

export const getBlogSubCategories = async (req, res) => {
  const match = { subCategorySlug: { $ne: "" } };
  if (req.query.categorySlug) match.categorySlug = sanitizeSlug(req.query.categorySlug);
  const rows = await Blog.aggregate([
    { $match: match },
    { $group: { _id: { categorySlug: "$categorySlug", subCategorySlug: "$subCategorySlug" }, name: { $first: "$subCategory" }, categorySlug: { $first: "$categorySlug" }, subCategorySlug: { $first: "$subCategorySlug" } } },
    { $sort: { name: 1 } },
  ]);
  return res.json({ success: true, subCategories: rows.map(({ _id, ...item }) => item) });
};

export const createBlog = async (req, res) => {
  let uploaded;
  try {
    const payload = await buildPayload({ blog: null, body: req.body, file: req.file, adminName: req.admin?.name });
    uploaded = payload.uploaded;
    if (!payload.title || !payload.category || !payload.categorySlug || !payload.content) {
      return res.status(400).json({ success: false, message: "Title, category, category slug and content are required." });
    }
    const blog = await Blog.create(payload);
    return res.status(201).json({ success: true, message: "Blog created successfully.", blog });
  } catch (error) {
    if (uploaded?.public_id) await removeCloudinaryImage(uploaded.public_id);
    console.error("Create blog error:", error);
    return res.status(error.code === 11000 ? 409 : 500).json({ success: false, message: error.code === 11000 ? "Blog slug already exists." : error.message || "Unable to create blog." });
  }
};

export const updateBlog = async (req, res) => {
  let uploaded;
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid blog ID." });
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found." });
    const payload = await buildPayload({ blog, body: req.body, file: req.file, adminName: req.admin?.name });
    uploaded = payload.uploaded;
    if (!payload.title || !payload.category || !payload.categorySlug || !payload.content) {
      return res.status(400).json({ success: false, message: "Title, category, category slug and content are required." });
    }
    const previousPublicId = blog.coverImagePublicId || blog.featuredImage?.publicId || "";
    Object.assign(blog, payload);
    delete blog.uploaded;
    delete blog.oldPublicId;
    await blog.save();
    if (previousPublicId && previousPublicId !== payload.coverImagePublicId) await removeCloudinaryImage(previousPublicId);
    return res.json({ success: true, message: "Blog updated successfully.", blog });
  } catch (error) {
    if (uploaded?.public_id) await removeCloudinaryImage(uploaded.public_id);
    console.error("Update blog error:", error);
    return res.status(error.code === 11000 ? 409 : 500).json({ success: false, message: error.code === 11000 ? "Blog slug already exists." : error.message || "Unable to update blog." });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid blog ID." });
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found." });
    await removeCloudinaryImage(blog.coverImagePublicId || blog.featuredImage?.publicId);
    return res.json({ success: true, message: "Blog deleted successfully." });
  } catch (error) {
    console.error("Delete blog error:", error);
    return res.status(500).json({ success: false, message: "Unable to delete blog." });
  }
};

