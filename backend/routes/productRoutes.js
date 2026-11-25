import { Router } from "express";

import {
  createProduct,
  getAdminProduct,
  getPublicProduct,
  listAdminProducts,
  listPublicProducts,
  updateProduct,
} from "../controllers/productController.js";
import { requireAuth, requirePermission } from "../middleware/authMiddleware.js";

import { uploadProductMedia } from "../controllers/productMediaController.js";
import { receiveProductImage, requireProductUploadPermission } from "../middleware/uploadProductImage.js";

const router = Router();

router.get("/", listPublicProducts);
router.get("/slug/:slug", getPublicProduct);
router.get("/admin", requireAuth, requirePermission("products", "view"), listAdminProducts);
router.get("/admin/:key", requireAuth, requirePermission("products", "view"), getAdminProduct);
router.post("/media", requireAuth, requireProductUploadPermission, receiveProductImage, uploadProductMedia);
router.post("/", requireAuth, requirePermission("products", "create"), createProduct);
router.put("/:id", requireAuth, requirePermission("products", "edit"), updateProduct);

export default router;
