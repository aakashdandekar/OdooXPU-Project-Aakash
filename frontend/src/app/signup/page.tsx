"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    country: "",
    additionalInfo: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState(1);

  const update = (field: string, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: "" }));
  };

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.phone.trim()) e.phone = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!form.password || form.password.length < 6) e.password = "Min 6 characters";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords don't match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;
    setLoading(true);

    // Register on backend then sign in via NextAuth
    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      name: `${form.firstName} ${form.lastName}`.trim(),
      isRegister: "true",
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setErrors({ form: "Registration failed. This email may already be in use." });
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=1200&q=80"
          alt="Travel"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-br from-orange-600/80 to-black/60" />
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">
              Travel<span className="text-orange-300">oop</span>
            </span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
              Join 50,000+<br />adventurers today.
            </h2>
            <p className="text-white/70 text-lg mb-8">
              Create your free account and start planning your dream trip in minutes.
            </p>
            <div className="space-y-3">
              {[
                "Free forever — no credit card needed",
                "Plan unlimited trips",
                "Share with friends & family",
              ].map((f) => (
                <div key={f} className="flex items-center gap-3 text-white/90">
                  <CheckCircle className="w-5 h-5 text-orange-300 shrink-0" />
                  <span className="text-sm">{f}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-3 gap-3">
            {[
              "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=200&q=80",
              "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=200&q=80",
              "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=200&q=80",
            ].map((src, i) => (
              <div key={i} className="h-20 rounded-xl overflow-hidden">
                <img src={src} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Travel<span className="text-orange-500">oop</span>
            </span>
          </Link>

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
            <p className="text-gray-500">Start planning your dream adventures</p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-7">
            {[
              { id: 1, label: "Personal Info" },
              { id: 2, label: "Set Password" },
            ].map((s, i) => (
              <div key={s.id} className="flex items-center gap-2 flex-1">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      step > s.id
                        ? "bg-green-500 text-white"
                        : step === s.id
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {step > s.id ? <CheckCircle className="w-4 h-4" /> : s.id}
                  </div>
                  <span className={`text-sm font-medium hidden sm:block ${step >= s.id ? "text-gray-900" : "text-gray-400"}`}>
                    {s.label}
                  </span>
                </div>
                {i < 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${step > s.id ? "bg-green-400" : "bg-gray-100"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Form error */}
          {errors.form && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100 mb-4">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <p className="text-red-600 text-sm">{errors.form}</p>
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        value={form.firstName}
                        onChange={(e) => update("firstName", e.target.value)}
                        placeholder="John"
                        className={`w-full pl-9 pr-3 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${errors.firstName ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50 focus:border-orange-400 focus:bg-white"}`}
                      />
                    </div>
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                    <input
                      value={form.lastName}
                      onChange={(e) => update("lastName", e.target.value)}
                      placeholder="Doe"
                      className={`w-full px-3 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${errors.lastName ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50 focus:border-orange-400 focus:bg-white"}`}
                    />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="you@example.com"
                      className={`w-full pl-9 pr-3 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${errors.email ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50 focus:border-orange-400 focus:bg-white"}`}
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className={`w-full pl-9 pr-3 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${errors.phone ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50 focus:border-orange-400 focus:bg-white"}`}
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        value={form.city}
                        onChange={(e) => update("city", e.target.value)}
                        placeholder="San Francisco"
                        className="w-full pl-9 pr-3 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-500/20"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
                    <input
                      value={form.country}
                      onChange={(e) => update("country", e.target.value)}
                      placeholder="USA"
                      className="w-full px-3 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>
                </div>

                <button
                  onClick={handleNext}
                  className="w-full py-3.5 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>

                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-100" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 bg-white text-xs text-gray-400">or sign up with</span>
                  </div>
                </div>

                <button
                  onClick={handleGoogle}
                  disabled={googleLoading}
                  className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-70"
                >
                  {googleLoading ? (
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  )}
                  Continue with Google
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => update("password", e.target.value)}
                      placeholder="Min 6 characters"
                      className={`w-full pl-9 pr-10 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${errors.password ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50 focus:border-orange-400 focus:bg-white"}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      value={form.confirmPassword}
                      onChange={(e) => update("confirmPassword", e.target.value)}
                      placeholder="Repeat your password"
                      className={`w-full pl-9 pr-3 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${errors.confirmPassword ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50 focus:border-orange-400 focus:bg-white"}`}
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <input type="checkbox" id="terms" className="mt-0.5 accent-orange-500" defaultChecked />
                  <label htmlFor="terms" className="text-xs text-gray-500">
                    I agree to the{" "}
                    <a href="#" className="text-orange-500 hover:underline">Terms of Service</a>{" "}
                    and{" "}
                    <a href="#" className="text-orange-500 hover:underline">Privacy Policy</a>
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-5 py-3.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3.5 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-all disabled:opacity-70 flex items-center justify-center gap-2 shadow-md"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Create Account <ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-orange-500 font-semibold hover:text-orange-600">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
