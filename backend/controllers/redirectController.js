import mongoose from "mongoose";
import Redirect from "../models/Redirect.js";

const normalize = (value = "", source = false) => {
  const v = String(value).trim();
  if (source && (!v || v.includes("://"))) return v;
  if (!v.startsWith("/")) return source ? "/" + v : v;
  return v === "/" ? v : "/" + v.slice(1).replace(/\/+$/, "");
};
const validDestination = (v) => {
  if (v.startsWith("/")) return true;
  try { return ["http:", "https:"].includes(new URL(v).protocol); } catch { return false; }
};
const validate = (source, destination, code) => {
  if (!source) return "Source path is required.";
  if (!source.startsWith("/") || source.includes("://")) return "Source path must be an internal path beginning with /.";
  if (!destination || !validDestination(destination)) return "Destination must be an internal path or an http/https URL.";
  if (![301, 302].includes(Number(code))) return "Status code must be 301 or 302.";
  if (source === destination) return "A redirect cannot point to itself.";
  return "";
};
const badId = (id, res) => {
  if (mongoose.Types.ObjectId.isValid(id)) return false;
  res.status(400).json({ success: false, message: "Invalid redirect ID." });
  return true;
};
const duplicate = (res) => res.status(409).json({ success: false, message: "A redirect already exists for this source path." });
const loop = async (source, destination, id) => destination.startsWith("/") && Boolean(await Redirect.exists({ sourcePath: destination, destinationPath: source, ...(id ? { _id: { $ne: id } } : {}) }));

export const getRedirects = async (req, res) => {
  try {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 20, 1), 100);
    const filter = {};
    const search = String(req.query.search || "").trim();
    if (search) {
      const expression = new RegExp(search.replace(/[.*+?^()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [{ sourcePath: expression }, { destinationPath: expression }];
    }
    if (["true", "false"].includes(req.query.active)) filter.active = req.query.active === "true";
    if (["301", "302"].includes(String(req.query.statusCode))) filter.statusCode = Number(req.query.statusCode);
    const [redirects, total, active, inactive, permanent, temporary] = await Promise.all([
      Redirect.find(filter).sort({ updatedAt: -1, createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Redirect.countDocuments(filter), Redirect.countDocuments({ ...filter, active: true }),
      Redirect.countDocuments({ ...filter, active: false }), Redirect.countDocuments({ ...filter, statusCode: 301 }),
      Redirect.countDocuments({ ...filter, statusCode: 302 }),
    ]);
    return res.json({ success: true, redirects, stats: { total, active, inactive, permanent, temporary }, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) { console.error("Get redirects error:", error); return res.status(500).json({ success: false, message: "Unable to load redirects." }); }
};
export const getRedirectById = async (req, res) => {
  try { if (badId(req.params.id, res)) return; const redirect = await Redirect.findById(req.params.id); if (!redirect) return res.status(404).json({ success: false, message: "Redirect not found." }); return res.json({ success: true, redirect }); }
  catch { return res.status(404).json({ success: false, message: "Redirect not found." }); }
};
export const createRedirect = async (req, res) => {
  try {
    const sourcePath = normalize(req.body.sourcePath, true), destinationPath = normalize(req.body.destinationPath), statusCode = Number(req.body.statusCode || 301);
    const error = validate(sourcePath, destinationPath, statusCode); if (error) return res.status(400).json({ success: false, message: error });
    if (await Redirect.exists({ sourcePath })) return duplicate(res);
    if (await loop(sourcePath, destinationPath)) return res.status(400).json({ success: false, message: "This redirect would create a direct redirect loop." });
    const redirect = await Redirect.create({ sourcePath, destinationPath, statusCode, active: req.body.active === undefined || req.body.active === true || req.body.active === "true", createdBy: req.admin?._id, updatedBy: req.admin?._id });
    return res.status(201).json({ success: true, message: "Redirect created successfully.", redirect });
  } catch (error) { if (error.code === 11000) return duplicate(res); return res.status(400).json({ success: false, message: error.message || "Unable to create redirect." }); }
};
export const updateRedirect = async (req, res) => {
  try {
    if (badId(req.params.id, res)) return; const redirect = await Redirect.findById(req.params.id); if (!redirect) return res.status(404).json({ success: false, message: "Redirect not found." });
    const sourcePath = normalize(req.body.sourcePath ?? redirect.sourcePath, true), destinationPath = normalize(req.body.destinationPath ?? redirect.destinationPath), statusCode = Number(req.body.statusCode ?? redirect.statusCode);
    const error = validate(sourcePath, destinationPath, statusCode); if (error) return res.status(400).json({ success: false, message: error });
    if (await Redirect.exists({ sourcePath, _id: { $ne: redirect._id } })) return duplicate(res);
    if (await loop(sourcePath, destinationPath, redirect._id)) return res.status(400).json({ success: false, message: "This redirect would create a direct redirect loop." });
    Object.assign(redirect, { sourcePath, destinationPath, statusCode, updatedBy: req.admin?._id });
    if (req.body.active !== undefined) redirect.active = req.body.active === true || req.body.active === "true";
    await redirect.save(); return res.json({ success: true, message: "Redirect updated successfully.", redirect });
  } catch (error) { if (error.code === 11000) return duplicate(res); return res.status(400).json({ success: false, message: error.message || "Unable to update redirect." }); }
};
export const toggleRedirectStatus = async (req, res) => {
  try { if (badId(req.params.id, res)) return; const redirect = await Redirect.findById(req.params.id); if (!redirect) return res.status(404).json({ success: false, message: "Redirect not found." }); redirect.active = req.body.active === true || req.body.active === "true"; redirect.updatedBy = req.admin?._id; await redirect.save(); return res.json({ success: true, redirect }); }
  catch { return res.status(500).json({ success: false, message: "Unable to update redirect status." }); }
};
export const deleteRedirect = async (req, res) => {
  try { if (badId(req.params.id, res)) return; const redirect = await Redirect.findByIdAndDelete(req.params.id); if (!redirect) return res.status(404).json({ success: false, message: "Redirect not found." }); return res.json({ success: true, message: "Redirect deleted successfully." }); }
  catch { return res.status(500).json({ success: false, message: "Unable to delete redirect." }); }
};
export const resolveRedirect = async (req, res) => {
  const path = normalize(req.query.path, true); if (!path) return res.json({ success: true, found: false });
  const redirect = await Redirect.findOne({ sourcePath: path, active: true }).select("destinationPath statusCode -_id");
  return redirect ? res.json({ success: true, found: true, redirect }) : res.json({ success: true, found: false });
};
