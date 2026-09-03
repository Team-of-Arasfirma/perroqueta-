import mongoose from "mongoose";

const external = (value) => {
  try { return ["http:", "https:"].includes(new URL(value).protocol); } catch { return false; }
};

const schema = new mongoose.Schema({
  sourcePath: { type: String, required: true, unique: true, trim: true, validate: { validator: (v) => v.startsWith("/") && !external(v), message: "Source path must be an internal path beginning with /." } },
  destinationPath: { type: String, required: true, trim: true, validate: { validator: (v) => v.startsWith("/") || external(v), message: "Destination must be an internal path or an http/https URL." } },
  statusCode: { type: Number, enum: [301, 302], default: 301 },
  active: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
}, { timestamps: true });


schema.index({ active: 1, statusCode: 1 });

export default mongoose.models.Redirect || mongoose.model("Redirect", schema);
