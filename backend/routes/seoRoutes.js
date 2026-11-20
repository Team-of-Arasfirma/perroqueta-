import express from "express";
import { getSeoSetting, getSeoSettings, upsertSeoSetting, validatePageKey } from "../controllers/seoController.js";
import { requireAuth, requirePermission } from "../middleware/authMiddleware.js";

const router = express.Router();
router.param("pageKey", validatePageKey);

router.get("/public/:pageKey", getSeoSetting);
router.use(requireAuth);
router.get("/", requirePermission("seo", "view"), getSeoSettings);
router.get("/:pageKey", requirePermission("seo", "view"), getSeoSetting);
router.put("/:pageKey", requirePermission("seo", "view"), requirePermission("seo", "edit"), upsertSeoSetting);

export default router;
