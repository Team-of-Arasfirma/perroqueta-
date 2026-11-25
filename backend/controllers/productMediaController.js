import cloudinary from "../config/cloudinary.js";

function uploadImage(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({
      folder: "perroqueta/products",
      resource_type: "image",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
    }, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
    stream.once("error", reject);
    stream.end(buffer);
  });
}

export async function uploadProductMedia(req, res) {
  if (!req.file) return res.status(400).json({ success: false, message: "Choose a product image first." });

  try {
    const result = await uploadImage(req.file.buffer);
    return res.status(201).json({
      success: true,
      media: {
        url: result.secure_url,
        publicId: result.public_id,
        alt: typeof req.body?.alt === "string" ? req.body.alt : "",
      },
    });
  } catch (error) {
    console.error("Product media upload failed:", error.message);
    return res.status(502).json({ success: false, message: "Image upload failed. Check the image and try again." });
  }
}
