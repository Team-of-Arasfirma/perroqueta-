import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    publicId: { type: String, default: '', trim: true },
    originalName: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
  {
    career: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Career',
      required: true,
      index: true,
    },

    careerTitle: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    experience: {
      type: String,
      trim: true,
      default: '',
    },

    currentCompany: {
      type: String,
      trim: true,
      default: '',
    },

    currentLocation: {
      type: String,
      trim: true,
      default: '',
    },

    message: {
      type: String,
      trim: true,
      default: '',
    },

    resume: {
      type: resumeSchema,
      required: true,
    },

    status: {
      type: String,
      enum: ['New', 'Reviewed', 'Shortlisted', 'Rejected', 'Hired'],
      default: 'New',
      index: true,
    },

    appliedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

applicationSchema.index({
  fullName: 'text',
  email: 'text',
  phone: 'text',
  careerTitle: 'text',
});

const Application = mongoose.model('Application', applicationSchema);


applicationSchema.index({ status: 1, createdAt: -1 });
applicationSchema.index({ career: 1, createdAt: -1 });

export default Application;
