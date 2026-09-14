import mongoose from "mongoose";
import Inquiry from "../models/Inquiry.js";

/* =========================================================
   CREATE INQUIRY
========================================================= */
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

    const normalizedName = String(
      fullName || name || ""
    ).trim();

    const normalizedPhone = String(
      phone || mobileNumber || ""
    ).replace(/\D/g, "");

    const normalizedEmail = String(
      email || ""
    )
      .trim()
      .toLowerCase();

    const normalizedSource =
      String(
        source || "Website"
      ).trim() || "Website";

    if (!normalizedName) {
      return res.status(400).json({
        success: false,
        message:
          "Full name is required.",
      });
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        normalizedEmail
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "A valid email address is required.",
      });
    }

    if (
      !/^[0-9]{10}$/.test(
        normalizedPhone
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Enter a valid 10-digit mobile number.",
      });
    }

    if (
      !String(
        location || ""
      ).trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Location is required.",
      });
    }

    const inquiry =
      await Inquiry.create({
        fullName:
          normalizedName,

        email:
          normalizedEmail,

        phone:
          normalizedPhone,

        mobileNumber:
          normalizedPhone,

        location:
          String(
            location
          ).trim(),

        productInterest:
          String(
            productInterest || ""
          ).trim(),

        productName:
          String(
            productName || ""
          ).trim(),

        message:
          String(
            message || ""
          ).trim(),

        source:
          normalizedSource,

        page:
          String(
            page || ""
          ).trim(),

        status:
          "Unread",
      });

    return res.status(201).json({
      success: true,
      message:
        "Inquiry submitted successfully.",
      inquiry,
    });
  } catch (error) {
    console.error(
      "Create inquiry error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to submit inquiry.",
    });
  }
};

/* =========================================================
   GET ALL INQUIRIES
========================================================= */
export const getInquiries = async (
  req,
  res
) => {
  try {
    const {
      search = "",
      status = "",
      productInterest = "",
      page = 1,
      limit = 20,
    } = req.query;

    const filter = {};

    /* Status Filter */
    if (
      status &&
      status !== "all"
    ) {
      if (
        [
          "Unread",
          "Read",
        ].includes(
          status
        )
      ) {
        filter.status =
          status;
      }
    }

    /* Product Filter */
    if (
      productInterest &&
      productInterest !==
        "all"
    ) {
      filter.productInterest =
        productInterest;
    }

    /* Search */
    if (
      search.trim()
    ) {
      const searchValue =
        search.trim();

      filter.$or = [
        {
          fullName: {
            $regex:
              searchValue,
            $options: "i",
          },
        },

        {
          email: {
            $regex:
              searchValue,
            $options: "i",
          },
        },

        {
          phone: {
            $regex:
              searchValue,
            $options: "i",
          },
        },

        {
          mobileNumber: {
            $regex:
              searchValue,
            $options: "i",
          },
        },

        {
          productInterest: {
            $regex:
              searchValue,
            $options: "i",
          },
        },

        {
          productName: {
            $regex:
              searchValue,
            $options: "i",
          },
        },

        {
          message: {
            $regex:
              searchValue,
            $options: "i",
          },
        },

        {
          source: {
            $regex:
              searchValue,
            $options: "i",
          },
        },

        {
          location: {
            $regex:
              searchValue,
            $options: "i",
          },
        },
      ];
    }

    const pageNumber =
      Math.max(
        Number(page) || 1,
        1
      );

    const limitNumber =
      Math.min(
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
      totalCount,
      unreadCount,
      readCount,
    ] =
      await Promise.all([
        Inquiry.find(
          filter
        )
          .sort({
            createdAt: -1,
          })
          .skip(skip)
          .limit(
            limitNumber
          )
          .lean(),

        Inquiry.countDocuments(
          filter
        ),

        Inquiry.countDocuments(),

        Inquiry.countDocuments({
          status:
            "Unread",
        }),

        Inquiry.countDocuments({
          status:
            "Read",
        }),
      ]);

    const pages =
      Math.max(
        Math.ceil(
          total /
            limitNumber
        ),
        1
      );

    return res.json({
      success: true,

      inquiries,

      total,

      page:
        pageNumber,

      pages,

      limit:
        limitNumber,

      stats: {
        total:
          totalCount,

        unread:
          unreadCount,

        read:
          readCount,
      },
    });
  } catch (error) {
    console.error(
      "Get inquiries error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load inquiries.",
    });
  }
};

/* =========================================================
   GET SINGLE INQUIRY
   IMPORTANT:
   Opening the inquiry DOES NOT change status.
========================================================= */
export const getInquiryById = async (
  req,
  res
) => {
  try {
    const {
      id,
    } = req.params;

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

    const inquiry =
      await Inquiry.findById(
        id
      );

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message:
          "Inquiry not found.",
      });
    }

    /*
      IMPORTANT:
      No automatic status update here.

      If status is Unread,
      it stays Unread even when admin opens it.

      Admin must manually change it
      from the frontend dropdown.
    */

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

/* =========================================================
   UPDATE INQUIRY STATUS
   Manual Read / Unread only
========================================================= */
export const updateInquiryStatus =
  async (
    req,
    res
  ) => {
    try {
      const {
        id,
      } = req.params;

      const {
        status,
      } = req.body;

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
        "Unread",
        "Read",
      ];

      if (
        !allowedStatuses.includes(
          status
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid inquiry status. Only Read or Unread is allowed.",
        });
      }

      const inquiry =
        await Inquiry.findByIdAndUpdate(
          id,
          {
            status,
          },
          {
            new: true,
            runValidators:
              true,
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
          "Inquiry status updated successfully.",
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

/* =========================================================
   DELETE INQUIRY
========================================================= */
export const deleteInquiry = async (
  req,
  res
) => {
  try {
    const {
      id,
    } = req.params;

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

    const inquiry =
      await Inquiry.findByIdAndDelete(
        id
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