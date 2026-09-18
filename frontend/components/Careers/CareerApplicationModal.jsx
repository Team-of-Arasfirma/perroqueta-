'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  CheckCircle2,
  Loader2,
  Paperclip,
  Trash2,
  Upload,
  X,
} from 'lucide-react';

import { submitApplication } from '@/services/applicationService';
import {
  formatCareerDeadline,
  isCareerAcceptingApplications,
} from '@/lib/applicationUtils';

const allowedMimeTypes = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const allowedExtensions = new Set(['pdf', 'doc', 'docx']);
const maxFileSize = 5 * 1024 * 1024;

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  experience: '',
  currentCompany: '',
  currentLocation: '',
  message: '',
};

const clean = (value = '') => String(value).trim();

const isValidEmail = (value = '') =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean(value));

const isValidPhone = (value = '') => {
  const digits = String(value).replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
};

const getExtension = (value = '') => {
  const segments = String(value).split('.');
  return segments.length > 1 ? segments.pop().toLowerCase() : '';
};

const validateResume = (file) => {
  if (!file) {
    return 'Resume is required.';
  }

  if (file.size > maxFileSize) {
    return 'Resume size must be 5MB or less.';
  }

  if (!allowedMimeTypes.has(file.type)) {
    return 'Only PDF, DOC and DOCX resumes are allowed.';
  }

  if (!allowedExtensions.has(getExtension(file.name))) {
    return 'Only PDF, DOC and DOCX resumes are allowed.';
  }

  return '';
};

const Field = ({ label, error, children, className = '' }) => (
  <label className={`block ${className}`}>
    <span className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.08em] text-[#5D5671]">
      {label}
    </span>
    {children}
    {error ? <p className="mt-2 text-[12px] font-medium text-red-600">{error}</p> : null}
  </label>
);

export default function CareerApplicationModal({ career, onClose, open = true }) {
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [resumeFile, setResumeFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [fileKey, setFileKey] = useState(0);

  const canApply = isCareerAcceptingApplications(career);
  const isVisible = open && !!career;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isVisible) {
      document.body.style.overflow = '';
      return undefined;
    }

    document.body.style.overflow = 'hidden';

    setForm(initialForm);
    setResumeFile(null);
    setErrors({});
    setSuccess('');
    setFileKey((value) => value + 1);

    return () => {
      document.body.style.overflow = '';
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape' && !submitting) {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isVisible, onClose, submitting]);

  useEffect(() => () => {
    document.body.style.overflow = '';
  }, []);

  if (!mounted || !isVisible) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: '',
      form: '',
    }));
  };

  const handleResumeChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const resumeError = validateResume(file);

    if (resumeError) {
      setResumeFile(null);
      setErrors((current) => ({
        ...current,
        resume: resumeError,
        form: '',
      }));
      setFileKey((value) => value + 1);
      return;
    }

    setResumeFile(file);
    setErrors((current) => ({
      ...current,
      resume: '',
      form: '',
    }));
  };

  const clearResume = () => {
    setResumeFile(null);
    setFileKey((value) => value + 1);
    setErrors((current) => ({
      ...current,
      resume: '',
    }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!clean(form.fullName)) {
      nextErrors.fullName = 'Full name is required.';
    }

    if (!clean(form.email)) {
      nextErrors.email = 'Email is required.';
    } else if (!isValidEmail(form.email)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!clean(form.phone)) {
      nextErrors.phone = 'Phone is required.';
    } else if (!isValidPhone(form.phone)) {
      nextErrors.phone = 'Enter a valid phone number.';
    }

    if (!resumeFile) {
      nextErrors.resume = 'Resume is required.';
    }

    if (!canApply) {
      nextErrors.form = 'This position is no longer accepting applications.';
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateForm();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      const payload = new FormData();

      payload.append('career', career._id);
      payload.append('careerId', career._id);
      payload.append('careerTitle', career.title || '');
      payload.append('jobTitle', career.title || '');
      payload.append('fullName', clean(form.fullName));
      payload.append('email', clean(form.email));
      payload.append('phone', clean(form.phone));
      payload.append('mobileNumber', clean(form.phone));
      payload.append('experience', clean(form.experience));
      payload.append('currentCompany', clean(form.currentCompany));
      payload.append('currentLocation', clean(form.currentLocation));
      payload.append('location', clean(form.currentLocation));
      payload.append('message', clean(form.message));
      payload.append('resume', resumeFile);

      await submitApplication(payload);

      setSuccess('Application submitted successfully. We will review your application and contact you if shortlisted.');
      setForm(initialForm);
      setResumeFile(null);
      setFileKey((value) => value + 1);
      setErrors({});
    } catch (error) {
      setErrors({
        form: error.message || 'Unable to submit application.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const closeButton = (
    <button
      type="button"
      onClick={onClose}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white hover:text-[#6030C6]"
      aria-label="Close application modal"
    >
      <X className="h-5 w-5" />
    </button>
  );

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#17112D]/60 px-3 py-3 backdrop-blur-[4px] sm:px-4 sm:py-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !submitting) {
          onClose();
        }
      }}
    >
      <div className="flex max-h-[90vh] w-full [overflow-wrap:anywhere] max-w-[720px] flex-col overflow-hidden rounded-[24px] border border-[#E8E1F3] bg-[#FFFDFC] shadow-[0_30px_80px_rgba(23,17,45,0.35)]">
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#EEE6FB] bg-[linear-gradient(135deg,#6030C6_0%,#6E3DE2_55%,#FF8626_130%)] px-5 py-5 text-white sm:px-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/80">
              Apply for Position
            </p>
            <h2 className="mt-2 text-[24px] font-bold leading-tight sm:text-[28px]">
              {career.title}
            </h2>
            <p className="mt-2 max-w-[520px] text-[13px] leading-6 text-white/80">
              {career.department ? `${career.department} · ` : ''}
              {career.location || 'Location not specified'}
              {' · '}
              Deadline: {formatCareerDeadline(career.applicationDeadline)}
            </p>
          </div>

          {closeButton}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto bg-[#FFFDFC] px-5 py-5 sm:px-6 sm:py-6">
          {!canApply ? (
            <div className="rounded-[20px] border border-amber-200 bg-amber-50 p-5 text-amber-900">
              <p className="text-[16px] font-bold">Applications are closed for this role.</p>
              <p className="mt-2 text-[13px] leading-6 text-amber-900/80">
                This position is no longer accepting new applications.
              </p>
            </div>
          ) : success ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center rounded-[20px] border border-emerald-200 bg-emerald-50 px-6 py-10 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="mt-5 text-[24px] font-bold text-[#241D32]">
                Application submitted successfully.
              </h3>
              <p className="mt-3 max-w-[460px] text-[14px] leading-6 text-[#5F5870]">
                We will review your application and contact you if shortlisted.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-7 inline-flex h-11 items-center justify-center rounded-xl bg-[#6030C6] px-6 text-[13px] font-bold text-white transition hover:bg-[#5127AE]"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {errors.form ? (
                <div className="rounded-[16px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-700">
                  {errors.form}
                </div>
              ) : null}

              <div className="rounded-[20px] border border-[#EEE6FB] bg-[#FBF8FF] p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#6030C6]">
                  Job Applied For
                </p>
                <input
                  readOnly
                  value={career.title || ''}
                  className="mt-2 h-12 w-full rounded-xl border border-[#DCCFF1] bg-white px-4 text-[14px] font-semibold text-[#2A2238] outline-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full Name *" error={errors.fullName}>
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="h-12 w-full rounded-xl border border-[#DDD7E8] bg-white px-4 text-[14px] text-[#292331] outline-none transition placeholder:text-[#B1ABB9] focus:border-[#6030C6] focus:ring-2 focus:ring-[#6030C6]/10"
                  />
                </Field>

                <Field label="Email *" error={errors.email}>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="h-12 w-full rounded-xl border border-[#DDD7E8] bg-white px-4 text-[14px] text-[#292331] outline-none transition placeholder:text-[#B1ABB9] focus:border-[#6030C6] focus:ring-2 focus:ring-[#6030C6]/10"
                  />
                </Field>

                <Field label="Phone *" error={errors.phone}>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className="h-12 w-full rounded-xl border border-[#DDD7E8] bg-white px-4 text-[14px] text-[#292331] outline-none transition placeholder:text-[#B1ABB9] focus:border-[#6030C6] focus:ring-2 focus:ring-[#6030C6]/10"
                  />
                </Field>

                <Field label="Experience" error={errors.experience}>
                  <input
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                    placeholder="e.g. 3+ years"
                    className="h-12 w-full rounded-xl border border-[#DDD7E8] bg-white px-4 text-[14px] text-[#292331] outline-none transition placeholder:text-[#B1ABB9] focus:border-[#6030C6] focus:ring-2 focus:ring-[#6030C6]/10"
                  />
                </Field>

                <Field label="Current Company">
                  <input
                    name="currentCompany"
                    value={form.currentCompany}
                    onChange={handleChange}
                    placeholder="Current company"
                    className="h-12 w-full rounded-xl border border-[#DDD7E8] bg-white px-4 text-[14px] text-[#292331] outline-none transition placeholder:text-[#B1ABB9] focus:border-[#6030C6] focus:ring-2 focus:ring-[#6030C6]/10"
                  />
                </Field>

                <Field label="Current Location" error={errors.currentLocation}>
                  <input
                    name="currentLocation"
                    value={form.currentLocation}
                    onChange={handleChange}
                    placeholder="City, state or country"
                    className="h-12 w-full rounded-xl border border-[#DDD7E8] bg-white px-4 text-[14px] text-[#292331] outline-none transition placeholder:text-[#B1ABB9] focus:border-[#6030C6] focus:ring-2 focus:ring-[#6030C6]/10"
                  />
                </Field>
              </div>

              <Field label="Message">
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell us a bit about your background and interest in this role."
                  className="min-h-[120px] w-full rounded-xl border border-[#DDD7E8] bg-white px-4 py-3 text-[14px] leading-6 text-[#292331] outline-none transition placeholder:text-[#B1ABB9] focus:border-[#6030C6] focus:ring-2 focus:ring-[#6030C6]/10"
                />
              </Field>

              <Field label="Resume *" error={errors.resume}>
                <div className="rounded-[20px] border border-dashed border-[#CDBBEA] bg-[#FBF8FF] p-4 sm:p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#6030C6] shadow-sm">
                        <Paperclip className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[14px] font-semibold text-[#2A2238]">
                          {resumeFile ? resumeFile.name : 'Choose your resume'}
                        </p>
                        <p className="mt-1 text-[11px] leading-5 text-[#7A718A]">
                          PDF, DOC or DOCX, up to 5MB.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {resumeFile ? (
                        <button
                          type="button"
                          onClick={clearResume}
                          className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#E7DBFB] bg-white px-4 text-[12px] font-semibold text-[#6030C6] transition hover:border-[#6030C6]"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </button>
                      ) : null}

                      <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-[#6030C6] px-4 text-[12px] font-semibold text-white transition hover:bg-[#5127AE]">
                        <Upload className="h-4 w-4" />
                        Upload Resume
                        <input
                          key={fileKey}
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleResumeChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </Field>

              <div className="flex flex-col-reverse gap-3 border-t border-[#F0EAFB] pt-1 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-[#DDD7E8] bg-white px-5 text-[13px] font-bold text-[#6A6079] transition hover:bg-[#F8F5FC] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#6030C6_0%,#7A45E5_55%,#FF8626_120%)] px-6 text-[13px] font-bold text-white shadow-[0_12px_25px_rgba(96,48,198,0.22)] transition hover:shadow-[0_16px_30px_rgba(96,48,198,0.26)] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {submitting ? 'Submitting...' : 'Apply Now'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
