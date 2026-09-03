import mongoose from "mongoose";

const blogImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      default: "",
    },

    publicId: {
      type: String,
      default: "",
    },

    altText: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    categorySlug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    subCategory: {
      type: String,
      default: "",
      trim: true,
    },

    subCategorySlug: {
      type: String,
      default: "",
      lowercase: true,
      trim: true,
    },

    date: {
      type: Date,
      required: true,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["Published", "Draft"],
      default: "Published",
    },

    published: {
      type: Boolean,
      default: true,
    },

    publishedAt: {
      type: Date,
      default: null,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    coverImage: {
      type: String,
      default: "",
    },

    coverImagePublicId: {
      type: String,
      default: "",
    },

    featuredImage: {
      type: blogImageSchema,
      default: () => ({
        url: "",
        publicId: "",
        altText: "",
      }),
    },

    excerpt: {
      type: String,
      default: "",
      trim: true,
    },

    author: {
      type: String,
      default: "",
      trim: true,
    },

    metaTitle: {
      type: String,
      default: "",
      trim: true,
    },

    metaDescription: {
      type: String,
      default: "",
      trim: true,
    },

    metaKeywords: {
      type: String,
      default: "",
      trim: true,
    },

    canonicalUrl: {
      type: String,
      default: "",
      trim: true,
    },

    ogTitle: {
      type: String,
      default: "",
      trim: true,
    },

    ogDescription: {
      type: String,
      default: "",
      trim: true,
    },

    ogImage: {
      type: blogImageSchema,
      default: () => ({
        url: "",
        publicId: "",
        altText: "",
      }),
    },

    robotsIndex: {
      type: Boolean,
      default: true,
    },

    robotsFollow: {
      type: Boolean,
      default: true,
    },

    readingTime: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Additional indexes
blogSchema.index({ categorySlug: 1 });
blogSchema.index({ subCategorySlug: 1 });
blogSchema.index({ status: 1 });
blogSchema.index({
  published: 1,
  publishedAt: -1,
});

export default mongoose.models.Blog ||
  mongoose.model("Blog", blogSchema);