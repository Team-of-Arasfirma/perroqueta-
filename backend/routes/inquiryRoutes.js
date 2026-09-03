import express from "express";

import {
  createInquiry,
  getInquiries,
  getInquiryById,
  updateInquiryStatus,
  deleteInquiry,
} from "../controllers/inquiryController.js";

import { requireAuth, requirePermission } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", createInquiry);

router.get("/", requireAuth, requirePermission("inquiries", "view"), getInquiries);

router.get("/:id", requireAuth, requirePermission("inquiries", "view"), getInquiryById);

router.patch("/:id/status", requireAuth, requirePermission("inquiries", "edit"), updateInquiryStatus);

router.delete("/:id", requireAuth, requirePermission("inquiries", "delete"), deleteInquiry);

export default router;
