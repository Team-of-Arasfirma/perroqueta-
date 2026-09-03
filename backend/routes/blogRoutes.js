import express from "express";
import {
  createBlog,
  deleteBlog,
  getBlogById,
  getBlogBySlug,
  getBlogCategories,
  getBlogSubCategories,
  getBlogs,
  updateBlog,
} from "../controllers/blogController.js";
import { requireAuth, requirePermission } from "../middleware/authMiddleware.js";
import uploadBlogImage from "../middleware/uploadBlogImage.js";

const router = express.Router();

router.get("/", getBlogs);
router.get("/categories", getBlogCategories);
router.get("/sub-categories", getBlogSubCategories);
router.get("/admin/:id", requireAuth, requirePermission("blogs", "view"), getBlogById);
router.post("/", requireAuth, requirePermission("blogs", "create"), uploadBlogImage.single("coverImage"), createBlog);
router.put("/:id", requireAuth, requirePermission("blogs", "edit"), uploadBlogImage.single("coverImage"), updateBlog);
router.delete("/:id", requireAuth, requirePermission("blogs", "delete"), deleteBlog);
router.get("/:slug", getBlogBySlug);

export default router;

