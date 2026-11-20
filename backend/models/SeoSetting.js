import mongoose from "mongoose";

export const SEO_PAGE_KEYS = ["home", "about", "project", "careers", "products", "blog"];

const seoSettingSchema = new mongoose.Schema({
  pageKey: { type: String, required: true, enum: SEO_PAGE_KEYS, unique: true },
  metaTitle: { type: String, trim: true, default: "" },
  metaDescription: { type: String, trim: true, default: "" },
}, { timestamps: true });

export default mongoose.model("SeoSetting", seoSettingSchema);
