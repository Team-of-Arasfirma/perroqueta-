"use client";

import Image from "next/image";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/components/Admin/AdminAuthProvider";

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const router = useRouter();
  const { user, status, signIn } = useAdminAuth();

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setServerError("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (status === "ready" && user) router.replace("/admin");
  }, [router, status, user]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setServerError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      await signIn(formData, rememberMe);
      router.replace("/admin");
    } catch (error) {
      setServerError(error.message || "Unable to login. Please try again.");    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F7F4FC]">
      <div className="grid min-h-screen lg:grid-cols-[1fr_0.9fr]">
        {/* Left Brand Section */}
        <section className="relative hidden overflow-hidden bg-[#171717] lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -left-24 -top-24 h-[340px] w-[340px] rounded-full bg-[#6030C6]/30 blur-3xl" />

          <div className="absolute -bottom-24 -right-20 h-[320px] w-[320px] rounded-full bg-[#FF8626]/20 blur-3xl" />

          <div className="relative z-10 p-12 xl:p-16">
            <div className="relative h-[52px] w-[210px]">
              <Image
                src="/assets/logo/Perroqueta-white.png"
                alt="Perroqueta"
                fill
                priority
                loading="eager"
                sizes="210px"
                className="object-contain object-left"
              />
            </div>
          </div>

          <div className="relative z-10 max-w-[680px] p-12 xl:p-16">
            <p className="text-[13px] font-bold uppercase tracking-[0.1em] text-[#FF8626]">
              Admin Portal
            </p>

            <h1 className="mt-4 text-[42px] font-bold leading-[1.08] text-white xl:text-[52px]">
              Manage Perroqueta
              <br />
              from one place.
            </h1>

            <p className="mt-6 max-w-[560px] text-[15px] leading-7 text-white/65">
              Securely manage products, projects, blogs, careers, inquiries
              and other website content from the Perroqueta admin dashboard.
            </p>
          </div>
        </section>

        {/* Right Login Section */}
        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-[460px]">
            {/* Mobile Logo */}
            <div className="mb-10 lg:hidden">
              <div className="relative h-[50px] w-[200px]">
                <Image
                  src="/assets/logo/Perroqueta-block.png"
                  alt="Perroqueta"
                  fill
                  priority
                  sizes="200px"
                  className="object-contain object-left"
                />
              </div>
            </div>

            <div className="rounded-[24px] border border-[#E6E0F0] bg-white p-6 shadow-[0_18px_60px_rgba(49,29,91,0.08)] sm:p-8 lg:p-10">
              <div>
                <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#6030C6]">
                  Admin Login
                </p>

                <h2 className="mt-3 text-[30px] font-bold text-[#171717] sm:text-[34px]">
                  Welcome Back
                </h2>

                <p className="mt-3 text-[14px] leading-6 text-[#777777]">
                  Sign in with your administrator account to continue.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-8">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="text-[13px] font-semibold text-[#333333]"
                  >
                    Email Address
                  </label>

                  <div
                    className={`mt-2 flex h-[52px] items-center rounded-[11px] border bg-white px-4 transition ${
                      errors.email
                        ? "border-red-400"
                        : "border-[#DDD7E8] focus-within:border-[#6030C6]"
                    }`}
                  >
                    <Mail
                      className="h-5 w-5 shrink-0 text-[#8B8B8B]"
                      strokeWidth={1.8}
                    />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                      placeholder="admin@perroqueta.com"
                      className="h-full w-full bg-transparent px-3 text-[14px] text-[#171717] outline-none placeholder:text-[#AAAAAA]"
                    />
                  </div>

                  {errors.email && (
                    <p className="mt-2 text-[12px] font-medium text-red-500">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="mt-5">
                  <label
                    htmlFor="password"
                    className="text-[13px] font-semibold text-[#333333]"
                  >
                    Password
                  </label>

                  <div
                    className={`mt-2 flex h-[52px] items-center rounded-[11px] border bg-white px-4 transition ${
                      errors.password
                        ? "border-red-400"
                        : "border-[#DDD7E8] focus-within:border-[#6030C6]"
                    }`}
                  >
                    <LockKeyhole
                      className="h-5 w-5 shrink-0 text-[#8B8B8B]"
                      strokeWidth={1.8}
                    />

                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      className="h-full w-full bg-transparent px-3 text-[14px] text-[#171717] outline-none placeholder:text-[#AAAAAA]"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#777777] transition hover:bg-[#F4F0FA] hover:text-[#6030C6]"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" strokeWidth={1.8} />
                      ) : (
                        <Eye className="h-5 w-5" strokeWidth={1.8} />
                      )}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="mt-2 text-[12px] font-medium text-red-500">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Remember Me */}
                <label className="mt-5 flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) =>
                      setRememberMe(event.target.checked)
                    }
                    className="h-4 w-4 accent-[#6030C6]"
                  />

                  <span className="text-[13px] text-[#666666]">
                    Remember me
                  </span>
                </label>

                {/* Server Error */}
                {serverError && (
                  <div className="mt-5 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3">
                    <p className="text-[13px] font-medium text-red-600">
                      {serverError}
                    </p>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-7 flex h-[52px] w-full items-center justify-center rounded-[11px] bg-[#6030C6] text-[15px] font-semibold text-white shadow-md transition hover:bg-[#5127AE] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <span className="flex items-center gap-3">
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Signing In...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>
            </div>

            <p className="mt-6 text-center text-[12px] text-[#999999]">
              Perroqueta Materials Science India Private Limited
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}


