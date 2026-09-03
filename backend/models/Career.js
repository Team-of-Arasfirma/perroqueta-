import mongoose from 'mongoose';

const careerSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  department: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  jobType: { type: String, enum: ['Full Time', 'Part Time', 'Contract', 'Internship'], default: 'Full Time' },
  workMode: { type: String, enum: ['On Site', 'Hybrid', 'Remote'], default: 'On Site' },
  experience: { type: String, trim: true, default: '' },
  salary: { type: String, trim: true, default: '' },
  openings: { type: Number, min: 1, default: 1 },
  shortDescription: { type: String, trim: true, default: '' },
  description: { type: String, required: true, trim: true },
  responsibilities: { type: [String], default: [] },
  requirements: { type: [String], default: [] },
  skills: { type: [String], default: [] },
  status: { type: String, enum: ['Open', 'Closed'], default: 'Open' },
  published: { type: Boolean, default: false },
  publishedAt: { type: Date, default: null },
  applicationDeadline: { type: Date, default: null },
  metaTitle: { type: String, trim: true, default: '' },
  metaDescription: { type: String, trim: true, default: '' },
}, { timestamps: true });


careerSchema.index({ status: 1, published: 1, createdAt: -1 });

export default mongoose.model('Career', careerSchema);
