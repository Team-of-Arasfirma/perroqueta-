import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    mobileNumber: {
      type: String,
      trim: true,
      default: "",
    },

    location: {
      type: String,
      trim: true,
      default: "",
    },

    productInterest: {
      type: String,
      trim: true,
      default: "",
    },

    message: {
      type: String,
      trim: true,
      default: "",
    },

    source: {
      type: String,
      trim: true,
      default: "Website",
    },

    page: {
      type: String,
      trim: true,
      default: "",
    },

    productName: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["Unread", "Read"],
      default: "Unread",
    },
  },
  {
    timestamps: true,
  }
);

inquirySchema.index({
  createdAt: -1,
  status: 1,
});

const Inquiry =
  mongoose.models.Inquiry ||
  mongoose.model("Inquiry", inquirySchema);

export default Inquiry;