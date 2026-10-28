import multer from "multer";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (!["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.mimetype)) {
      return cb(new Error("Only JPG, JPEG, PNG and WEBP images are allowed."), false);
    }
    cb(null, true);
  },
  // Busboy flags a file at the limit, so reserve one byte for an inclusive 10MB cap.
  limits: { fileSize: MAX_IMAGE_BYTES + 1 },
});

// Handle upload errors here so both existing Blog routes return JSON.
const uploadBlogImage = {
  single(fieldName) {
    const handleUpload = upload.single(fieldName);
    return (req, res, next) => {
      handleUpload(req, res, (error) => {
        if (!error) return next();
        const tooLarge = error.code === "LIMIT_FILE_SIZE";
        return res.status(tooLarge ? 413 : 400).json({
          success: false,
          message: tooLarge
            ? "Blog image must be 10MB or smaller."
            : error.message || "Unable to upload blog image.",
        });
      });
    };
  },
};

export default uploadBlogImage;

