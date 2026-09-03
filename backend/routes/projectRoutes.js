import express from "express";
import multer from "multer";

import {
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  updateProject,
} from "../controllers/projectController.js";

import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter: (req, file, callback) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return callback(
        new Error(
          "Only JPG, PNG and WEBP images are allowed."
        )
      );
    }

    callback(null, true);
  },
});

/*
  Public routes
*/
router.get("/", getProjects);

router.get("/:id", getProjectById);

/*
  Admin routes
*/
router.post(
  "/",
  requireAuth,
  upload.single("image"),
  createProject
);

router.put(
  "/:id",
  requireAuth,
  upload.single("image"),
  updateProject
);

router.delete(
  "/:id",
  requireAuth,
  deleteProject
);

export default router;