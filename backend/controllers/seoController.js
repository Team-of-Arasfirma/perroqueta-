import SeoSetting, { SEO_PAGE_KEYS } from "../models/SeoSetting.js";

const publicFields = "pageKey metaTitle metaDescription -_id";

export const validatePageKey = (req, res, next) => {
  if (!SEO_PAGE_KEYS.includes(req.params.pageKey)) {
    return res.status(404).json({ success: false, message: "Unknown SEO page." });
  }
  return next();
};

export const getSeoSettings = async (req, res) => {
  res.set("Cache-Control", "no-store");
  const settings = await SeoSetting.find().sort("pageKey").lean();
  return res.json({ success: true, settings });
};

export const getSeoSetting = async (req, res) => {
  res.set("Cache-Control", "no-store");
  const setting = await SeoSetting.findOne({ pageKey: req.params.pageKey })
    .select(publicFields).lean();
  return res.json({ success: true, setting });
};

export const upsertSeoSetting = async (req, res) => {
  const { metaTitle, metaDescription } = req.body ?? {};
  if (typeof metaTitle !== "string" || typeof metaDescription !== "string") {
    return res.status(400).json({ success: false, message: "SEO title and meta description must be strings." });
  }

  const filter = { pageKey: req.params.pageKey };
  const update = { $set: { metaTitle, metaDescription } };
  const options = { upsert: true, returnDocument: "after", runValidators: true };
  let setting;
  try {
    setting = await SeoSetting.findOneAndUpdate(filter, update, options);
  } catch (error) {
    if (error.code !== 11000) throw error;
    setting = await SeoSetting.findOneAndUpdate(filter, update, { ...options, upsert: false });
  }
  return res.json({ success: true, setting });
};
