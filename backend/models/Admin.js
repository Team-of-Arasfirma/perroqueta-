import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["super_admin", "admin", "editor"],
      default: "admin",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    permissions: {
      dashboard: {
        view: {
          type: Boolean,
          default: false,
        },
      },

      projects: {
        view: {
          type: Boolean,
          default: false,
        },
        create: {
          type: Boolean,
          default: false,
        },
        edit: {
          type: Boolean,
          default: false,
        },
        delete: {
          type: Boolean,
          default: false,
        },
      },

      blogs: {
        view: {
          type: Boolean,
          default: false,
        },
        create: {
          type: Boolean,
          default: false,
        },
        edit: {
          type: Boolean,
          default: false,
        },
        delete: {
          type: Boolean,
          default: false,
        },
      },

      careers: {
        view: {
          type: Boolean,
          default: false,
        },
        create: {
          type: Boolean,
          default: false,
        },
        edit: {
          type: Boolean,
          default: false,
        },
        delete: {
          type: Boolean,
          default: false,
        },
      },

      applications: {
        view: {
          type: Boolean,
          default: false,
        },
        edit: {
          type: Boolean,
          default: false,
        },
        delete: {
          type: Boolean,
          default: false,
        },
      },

      inquiries: {
        view: {
          type: Boolean,
          default: false,
        },
        edit: {
          type: Boolean,
          default: false,
        },
        delete: {
          type: Boolean,
          default: false,
        },
      },

      redirects: {
        view: {
          type: Boolean,
          default: false,
        },
        create: {
          type: Boolean,
          default: false,
        },
        edit: {
          type: Boolean,
          default: false,
        },
        delete: {
          type: Boolean,
          default: false,
        },
      },
    },
  },
  {
    timestamps: true,
  }
);


adminSchema.index({ role: 1, isActive: 1 });

export default mongoose.models.Admin || mongoose.model("Admin", adminSchema);