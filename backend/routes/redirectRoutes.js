import express from "express";
import { createRedirect, deleteRedirect, getRedirectById, getRedirects, resolveRedirect, toggleRedirectStatus, updateRedirect } from "../controllers/redirectController.js";
import { requireAuth, requirePermission } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/resolve", resolveRedirect);
router.get("/", requireAuth, requirePermission("redirects", "view"), getRedirects);
router.get("/:id", requireAuth, requirePermission("redirects", "view"), getRedirectById);
router.post("/", requireAuth, requirePermission("redirects", "create"), createRedirect);
router.put("/:id", requireAuth, requirePermission("redirects", "edit"), updateRedirect);
router.patch("/:id/status", requireAuth, requirePermission("redirects", "edit"), toggleRedirectStatus);
router.delete("/:id", requireAuth, requirePermission("redirects", "delete"), deleteRedirect);
export default router;
