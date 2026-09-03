import express from "express";
import { getDashboardSummary } from "../controllers/dashboardController.js";
import { requireAuth, requirePermission } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", requireAuth, requirePermission("dashboard", "view"), getDashboardSummary);

export default router;
