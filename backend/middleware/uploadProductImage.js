import multer from "multer";
import { hasPermission } from "../utils/adminPermissions.js";

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1, fields: 1, fieldSize: 4096, parts: 3 },
  fileFilter(_req, file, callback) {
    if (!allowedTypes.includes(file.mimetype)) {
      return callback(new Error("Choose a JPG, JPEG, PNG or WEBP image."));
    }
    callback(null, true);
  },
}).single("image");

export function requireProductUploadPermission(req, res, next) {
  if (hasPermission(req.admin, "products", "create") || hasPermission(req.admin, "products", "edit")) {
    return next();
  }
  return res.status(403).json({ success: false, message: "Product create or edit permission is required." });
}

export function receiveProductImage(req, res, next) {
  upload(req, res, (error) => {
    if (error) {
      const tooLarge = error.code === "LIMIT_FILE_SIZE";
      return res.status(tooLarge ? 413 : 400).json({
        success: false,
        message: tooLarge ? "Product images must be 5 MB or smaller." : error.message,
      });
    }
    return next();
  });
}
