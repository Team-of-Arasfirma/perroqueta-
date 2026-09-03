import express from "express";
import {
  createApplication,
  deleteApplication,
  getApplicationById,
  getApplications,
  updateApplicationStatus,
} from "../controllers/applicationController.js";
import { requireAuth, requirePermission } from "../middleware/authMiddleware.js";
import { handleResumeUpload } from "../middleware/uploadResume.js";

const router = express.Router();

router.post("/", handleResumeUpload, createApplication);
router.get("/", requireAuth, requirePermission("applications", "view"), getApplications);
router.get("/:id", requireAuth, requirePermission("applications", "view"), getApplicationById);
router.patch("/:id/status", requireAuth, requirePermission("applications", "edit"), updateApplicationStatus);
router.delete("/:id", requireAuth, requirePermission("applications", "delete"), deleteApplication);

export default router;
