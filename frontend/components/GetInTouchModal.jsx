"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { submitInquiry } from "@/services/inquiryService";

const products = [
  "UPVC Roofing Sheets",
  "Stone-Coated Roofing",
  "Ceramic Roofing Tiles",
  "WPC Interior Wall Panels",
  "PUF Panels",
  "Clay Ceiling Tiles",
  "Terracotta Clay Jali",
  "Solar Structures",
];

const initialFormData = {
  fullName: "",
  email: "",
  mobileNumber: "",
  location: "",
  productInterest: "",
  message: "",
};

export default function GetInTouchModal({ isOpen, onClose, source = "Get In Touch Popup", page = "", productName = "" }) {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose, isSubmitting]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));

    if (submitStatus) {
      setSubmitStatus("");
    }
  };

  const handleMobileChange = (event) => {
    const numericValue = event.target.value
      .replace(/\D/g, "")
      .slice(0, 10);

    setFormData((current) => ({
      ...current,
      mobileNumber: numericValue,
    }));

    setErrors((current) => ({
      ...current,
      mobileNumber: "",
    }));

    if (submitStatus) {
      setSubmitStatus("");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!/^[0-9]{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber =
        "Enter a valid 10-digit mobile number.";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required.";
    }
    if (!formData.productInterest) {
      newErrors.productInterest = "Select a product.";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      setSubmitStatus("");

      await submitInquiry({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),

        // Backend expects "phone", while the UI state uses "mobileNumber".
        phone: formData.mobileNumber,
        mobileNumber: formData.mobileNumber,
        location: formData.location.trim(),

        productInterest: formData.productInterest,
        productName,
        message: formData.message.trim(),
        source,
        page,
      });

      setSubmitStatus("success");
      setFormData(initialFormData);
      setErrors({});

      setTimeout(() => {
        setSubmitStatus("");
        onClose();
      }, 1800);
    } catch (error) {
      console.error("Inquiry submit error:", error);

      setSubmitStatus(
        error.message ||
          "Unable to submit enquiry. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;

    setErrors({});
    setSubmitStatus("");
    onClose();
  };

  if (!mounted || !isOpen) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center overflow-y-auto bg-black/65 px-4 py-6 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !isSubmitting
        ) {
          handleClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="get-in-touch-title"
        className="relative my-auto w-full max-w-[560px] rounded-[24px] bg-white p-6 shadow-2xl sm:p-8"
      >
        <button
          type="button"
          aria-label="Close enquiry form"
          disabled={isSubmitting}
          onClick={handleClose}
          className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#F2EEF9] text-[#6030C6] transition hover:bg-[#6030C6] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path d="M6 6L18 18M18 6L6 18" />
          </svg>
        </button>

        <div className="pr-12">
          <p className="mb-2 text-[14px] font-medium uppercase tracking-[0.14em] text-[#6A35D1]">
            Enquiry Form
          </p>

          <h2
            id="get-in-touch-title"
            className="text-[28px] font-bold leading-tight text-[#171717]"
          >
            Get In Touch
          </h2>

          <p className="mt-2 text-[16px] leading-6 text-[#666666]">
            Fill the form and our team will contact you shortly.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-7 space-y-4"
        >
          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="mb-2 block text-[16px] font-medium text-[#2D2D2D]"
            >
              Full Name
            </label>

            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              disabled={isSubmitting}
              autoComplete="name"
              className={`h-12 w-full rounded-xl border px-4 text-[16px] text-black placeholder:text-[#B5B5B5] outline-none transition disabled:bg-gray-50 ${
                errors.fullName
                  ? "border-red-500"
                  : "border-[#DDD6EA] focus:border-[#6535D0]"
              }`}
            />

            {errors.fullName && (
              <p className="mt-1 text-[14px] text-red-500">
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label htmlFor="inquiryEmail" className="mb-2 block text-[16px] font-medium text-[#2D2D2D]">Email Address</label>
            <input id="inquiryEmail" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" disabled={isSubmitting} autoComplete="email" className={errors.email ? "h-12 w-full rounded-xl border border-red-500 px-4 text-[16px] text-black outline-none" : "h-12 w-full rounded-xl border border-[#DDD6EA] px-4 text-[16px] text-black outline-none focus:border-[#6535D0]"} />
            {errors.email && <p className="mt-1 text-[14px] text-red-500">{errors.email}</p>}
          </div>

          {/* Mobile Number */}
          <div>
            <label
              htmlFor="mobileNumber"
              className="mb-2 block text-[16px] font-medium text-[#2D2D2D]"
            >
              Mobile Number
            </label>

            <input
              id="mobileNumber"
              name="mobileNumber"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={formData.mobileNumber}
              disabled={isSubmitting}
              onChange={handleMobileChange}
              placeholder="Enter 10-digit mobile number"
              autoComplete="tel"
              className={`h-12 w-full rounded-xl border px-4 text-[16px] text-black placeholder:text-[#B5B5B5] outline-none transition disabled:bg-gray-50 ${
                errors.mobileNumber
                  ? "border-red-500"
                  : "border-[#DDD6EA] focus:border-[#6535D0]"
              }`}
            />

            {errors.mobileNumber && (
              <p className="mt-1 text-[14px] text-red-500">
                {errors.mobileNumber}
              </p>
            )}
          </div>

          {/* Location */}
          <div>
            <label htmlFor="inquiryLocation" className="mb-2 block text-[16px] font-medium text-[#2D2D2D]">Your Location</label>
            <input id="inquiryLocation" name="location" type="text" value={formData.location} onChange={handleChange} placeholder="Enter your location" disabled={isSubmitting} autoComplete="address-level2" className={errors.location ? "h-12 w-full rounded-xl border border-red-500 px-4 text-[16px] text-black outline-none" : "h-12 w-full rounded-xl border border-[#DDD6EA] px-4 text-[16px] text-black outline-none focus:border-[#6535D0]"} />
            {errors.location && <p className="mt-1 text-[14px] text-red-500">{errors.location}</p>}
          </div>

          {/* Product Interest */}
          <div>
            <label
              htmlFor="productInterest"
              className="mb-2 block text-[16px] font-medium text-[#2D2D2D]"
            >
              Product Interest
            </label>

            <select
              id="productInterest"
              name="productInterest"
              value={formData.productInterest}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`h-12 w-full rounded-xl border bg-white px-4 text-[16px] text-black outline-none transition disabled:bg-gray-50 ${
                errors.productInterest
                  ? "border-red-500"
                  : "border-[#DDD6EA] focus:border-[#6535D0]"
              }`}
            >
              <option value="">
                Select a product
              </option>

              {products.map((product) => (
                <option
                  key={product}
                  value={product}
                >
                  {product}
                </option>
              ))}
            </select>

            {errors.productInterest && (
              <p className="mt-1 text-[14px] text-red-500">
                {errors.productInterest}
              </p>
            )}
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="message"
              className="mb-2 block text-[16px] font-medium text-[#2D2D2D]"
            >
              Message
            </label>

            <textarea
              id="message"
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="Tell us about your requirement"
              className={`w-full resize-none rounded-xl border px-4 py-3 text-[16px] text-black placeholder:text-[#B5B5B5] outline-none transition disabled:bg-gray-50 ${
                errors.message
                  ? "border-red-500"
                  : "border-[#DDD6EA] focus:border-[#6535D0]"
              }`}
            />

            {errors.message && (
              <p className="mt-1 text-[14px] text-red-500">
                {errors.message}
              </p>
            )}
          </div>

          {/* Success */}
          {submitStatus === "success" && (
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3">
              <p className="text-[14px] font-semibold text-green-700">
                Inquiry submitted successfully.
              </p>

              <p className="mt-1 text-[13px] text-green-600">
                Our team will contact you shortly.
              </p>
            </div>
          )}

          {/* Error */}
          {submitStatus &&
            submitStatus !== "success" && (
              <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-[14px] font-medium text-red-600">
                {submitStatus}
              </p>
            )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#FF8A22] to-[#BD4E7D] px-6 py-4 text-[16px] font-medium text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Submitting...
              </span>
            ) : (
              "Submit Enquiry"
            )}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}


