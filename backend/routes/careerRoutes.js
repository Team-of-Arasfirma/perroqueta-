import express from "express";
import {
  createCareer,
  deleteCareer,
  getCareerBySlug,
  getCareers,
  updateCareer,
} from "../controllers/careerController.js";
import { requireAuth, requirePermission } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/", getCareers);
router.get("/slug/:slug", getCareerBySlug);
router.post("/", requireAuth, requirePermission("careers", "create"), createCareer);
router.put("/:id", requireAuth, requirePermission("careers", "edit"), updateCareer);
router.delete("/:id", requireAuth, requirePermission("careers", "delete"), deleteCareer);
export default router;
