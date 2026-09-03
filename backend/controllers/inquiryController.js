import mongoose from "mongoose";
import Inquiry from "../models/Inquiry.js";

export const createInquiry = async (req, res) => {
  try {
    const {
      fullName,
      name,
      email = "",
      phone,
      mobileNumber,
      location = "",
      productInterest = "",
      productName = "",
      message = "",
      source = "Website",
      page = "",
    } = req.body;

    const normalizedName = String(fullName || name || "").trim();
    const normalizedPhone = String(phone || mobileNumber || "").replace(/D/g, "");
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const normalizedSource = String(source || "Website").trim() || "Website";

    if (!normalizedName) {
      return res.status(400).json({ success: false, message: "Full name is required." });
    }

    if (!/^[^s@]+@[^s@]+.[^s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({ success: false, message: "A valid email address is required." });
    }

    if (!/^[0-9]{10}$/.test(normalizedPhone)) {
      return res.status(400).json({ success: false, message: "Enter a valid 10-digit mobile number." });
    }

    if (!String(location || "").trim()) {
      return res.status(400).json({ success: false, message: "Location is required." });
    }

    const inquiry = await Inquiry.create({
      fullName: normalizedName,
      email: normalizedEmail,
      phone: normalizedPhone,
      mobileNumber: normalizedPhone,
      location: String(location).trim(),
      productInterest: String(productInterest || "").trim(),
      productName: String(productName || "").trim(),
      message: String(message || "").trim(),
      source: normalizedSource,
      page: String(page || "").trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully.",
      inquiry,
    });
  } catch (error) {
    console.error("Create inquiry error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to submit inquiry.",
    });
  }
};
export const getInquiries = async (req, res) => {
  try {
    const {
      search = "",
      status = "",
      productInterest = "",
      page = 1,
      limit = 20,
    } = req.query;

    const filter = {};

    if (
      status &&
      status !== "all"
    ) {
      filter.status = status;
    }

    if (
      productInterest &&
      productInterest !== "all"
    ) {
      filter.productInterest =
        productInterest;
    }

    if (search.trim()) {
      filter.$or = [
        {
          fullName: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          email: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          phone: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          productInterest: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          message: {
            $regex: search.trim(),
            $options: "i",
          },
        },
      ];
    }

    const pageNumber = Math.max(
      Number(page) || 1,
      1
    );

    const limitNumber = Math.min(
      Math.max(
        Number(limit) || 20,
        1
      ),
      100
    );

    const skip =
      (pageNumber - 1) *
      limitNumber;

    const [
      inquiries,
      total,
      newCount,
      contactedCount,
      closedCount,
    ] = await Promise.all([
      Inquiry.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber).lean(),

      Inquiry.countDocuments(filter),

      Inquiry.countDocuments({
        status: "New",
      }),

      Inquiry.countDocuments({
        status: "Contacted",
      }),

      Inquiry.countDocuments({
        status: "Closed",
      }),
    ]);

    const pages = Math.max(
      Math.ceil(
        total / limitNumber
      ),
      1
    );

    return res.json({
      success: true,
      inquiries,
      total,
      page: pageNumber,
      pages,
      limit: limitNumber,
      stats: {
        total:
          await Inquiry.countDocuments(),
        new: newCount,
        contacted:
          contactedCount,
        closed:
          closedCount,
      },
    });
  } catch (error) {
    console.error("Get inquiries error:", error);

    return res.status(500).json({
      success: false,
      message:
        "Unable to load inquiries.",
    });
  }
};

export const getInquiryById = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(
        id
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid inquiry ID.",
      });
    }

    const inquiry =
      await Inquiry.findById(id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found.",
      });
    }

    return res.json({
      success: true,
      inquiry,
    });
  } catch (error) {
    console.error(
      "Get inquiry error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load inquiry.",
    });
  }
};

export const updateInquiryStatus =
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid inquiry ID.",
        });
      }

      const allowedStatuses = [
        "New",
        "Contacted",
        "Closed",
      ];

      if (
        !allowedStatuses.includes(
          status
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid inquiry status.",
        });
      }

      const inquiry =
        await Inquiry.findByIdAndUpdate(
          id,
          { status },
          {
            new: true,
            runValidators: true,
          }
        );

      if (!inquiry) {
        return res.status(404).json({
          success: false,
          message:
            "Inquiry not found.",
        });
      }

      return res.json({
        success: true,
        message:
          "Inquiry status updated.",
        inquiry,
      });
    } catch (error) {
      console.error(
        "Update inquiry status error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to update inquiry status.",
      });
    }
  };

export const deleteInquiry = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(
        id
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid inquiry ID.",
      });
    }

    const inquiry =
      await Inquiry.findByIdAndDelete(
        id
      );

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found.",
      });
    }

    return res.json({
      success: true,
      message:
        "Inquiry deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete inquiry error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to delete inquiry.",
    });
  }
};
