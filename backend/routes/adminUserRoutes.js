import express from "express";
import {
  createAdminUser,
  deleteAdminUser,
  getAdminUserById,
  getAdminUsers,
  toggleAdminUserStatus,
  updateAdminUser,
} from "../controllers/adminUserController.js";
import { requireAuth, requireSuperAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(requireAuth, requireSuperAdmin);

router.get("/", getAdminUsers);
router.get("/:id", getAdminUserById);
router.post("/", createAdminUser);
router.put("/:id", updateAdminUser);
router.patch("/:id/status", toggleAdminUserStatus);
router.delete("/:id", deleteAdminUser);

export default router;
