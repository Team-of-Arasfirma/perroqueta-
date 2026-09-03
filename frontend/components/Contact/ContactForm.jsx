"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { submitInquiry } from "@/services/inquiryService";

const categories = [
  "Roofing",
  "Wall Panels",
  "PUF Panels",
  "Clay Products",
  "Solar Structures",
];

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    location: "",
    category: "",
    subject: "",
    message: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    let nextValue = value;

    if (name === "mobileNumber") {
      nextValue = value.replace(/\D/g, "").slice(0, 10);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: nextValue,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setSubmitStatus("");

      await submitInquiry({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.mobileNumber,
        mobileNumber: formData.mobileNumber,
        location: formData.location.trim(),
        productInterest: formData.category,
        message: [formData.subject.trim(), formData.message.trim()]
          .filter(Boolean)
          .join(" "),
        source: "Contact Page",
        page: "Contact Page",
      });

      setSubmitStatus("success");

      setFormData({
        fullName: "",
        email: "",
        mobileNumber: "",
        location: "",
        category: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Contact inquiry submit error:", error);
      setSubmitStatus(
        error.message || "Unable to submit inquiry. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-[18px] border border-[#EEEAF5] bg-white p-6 shadow-sm sm:p-7">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[28px] font-bold leading-tight text-[#17152F] sm:text-[32px]">
            Send Us a Message
          </h2>

          <p className="mt-2 text-[13px] leading-5 text-[#666666]">
            Fill in the details and our team will get back to you.
          </p>
        </div>

        <Send
          className="h-7 w-7 text-[#6030C6]"
          strokeWidth={1.7}
        />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-7 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Full Name */}
          <div>
            <label className="mb-2 block text-[13px] font-medium text-[#333333]">
              Full Name <span className="text-[#FF5C35]">*</span>
            </label>

            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              className="w-full rounded-[8px] border border-[#DCDCDC] px-4 py-3 text-[14px] outline-none transition focus:border-[#6030C6]"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-[13px] font-medium text-[#333333]">
              Email Address <span className="text-[#FF5C35]">*</span>
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full rounded-[8px] border border-[#DCDCDC] px-4 py-3 text-[14px] outline-none transition focus:border-[#6030C6]"
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="mb-2 block text-[13px] font-medium text-[#333333]">
              Mobile Number <span className="text-[#FF5C35]">*</span>
            </label>

            <input
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              placeholder="Enter your mobile number"
              required
              inputMode="numeric"
              maxLength={10}
              className="w-full rounded-[8px] border border-[#DCDCDC] px-4 py-3 text-[14px] outline-none transition focus:border-[#6030C6]"
            />
          </div>

          {/* Location */}
          <div>
            <label className="mb-2 block text-[13px] font-medium text-[#333333]">
              Your Location <span className="text-[#FF5C35]">*</span>
            </label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter your location"
              required
              className="w-full rounded-[8px] border border-[#DCDCDC] px-4 py-3 text-[14px] outline-none transition focus:border-[#6030C6]"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="mb-2 block text-[13px] font-medium text-[#333333]">
            Product Category <span className="text-[#FF5C35]">*</span>
          </label>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full rounded-[8px] border border-[#DCDCDC] bg-white px-4 py-3 text-[14px] text-[#555555] outline-none transition focus:border-[#6030C6]"
          >
            <option value="">Select category</option>

            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Subject */}
        <div>
          <label className="mb-2 block text-[13px] font-medium text-[#333333]">
            Subject
          </label>

          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="How can we help you?"
            className="w-full rounded-[8px] border border-[#DCDCDC] px-4 py-3 text-[14px] outline-none transition focus:border-[#6030C6]"
          />
        </div>

        {/* Message */}
        <div>
          <label className="mb-2 block text-[13px] font-medium text-[#333333]">
            Message
          </label>

          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            placeholder="Type your message here..."
            className="w-full resize-none rounded-[8px] border border-[#DCDCDC] px-4 py-3 text-[14px] outline-none transition focus:border-[#6030C6]"
          />
        </div>

        {submitStatus === "success" && (
          <p className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            Inquiry submitted successfully. Our team will contact you shortly.
          </p>
        )}

        {submitStatus && submitStatus !== "success" && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {submitStatus}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Real WhatsApp Brand Button */}
          <a
            href="https://wa.me/917449277787"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-[8px] border border-[#25D366] px-5 py-[13px] text-[13px] font-medium text-[#25D366] transition duration-300 hover:bg-[#25D366] hover:text-white"
          >
            <FaWhatsapp className="h-5 w-5" />
            Chat on WhatsApp
          </a>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-w-[200px] items-center justify-center gap-3 rounded-[8px] bg-gradient-to-r from-[#FF8626] to-[#FF4F2E] px-6 py-[13px] text-[13px] font-medium text-white transition duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? "Sending..." : "Send Message"}

            {!isSubmitting && (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}