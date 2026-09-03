import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["Completed", "Ongoing", "Upcoming"],
      default: "Completed",
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    published: {
      type: Boolean,
      default: true,
    },

    image: {
      url: {
        type: String,
        default: "",
      },

      publicId: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

projectSchema.index({
  published: 1,
  createdAt: -1,
});

export default mongoose.models.Project ||
  mongoose.model("Project", projectSchema);