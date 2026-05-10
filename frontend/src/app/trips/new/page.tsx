"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Globe,
  Calendar,
  DollarSign,
  MapPin,
  Tag,
  Image as ImageIcon,
  Check,
  Plus,
  X,
  Plane,
} from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import { useTrips } from "@/lib/tripsContext";
import { Trip } from "@/lib/mockData";

const coverImages = [
  { url: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&q=80", label: "Paris" },
  { url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80", label: "Kyoto" },
  { url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80", label: "Bali" },
  { url: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80", label: "New York" },
  { url: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600&q=80", label: "Barcelona" },
  { url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80", label: "Mountains" },
];

const popularTags = ["Adventure", "Beach", "Culture", "Food", "Honeymoon", "Family", "Solo", "Backpacking", "Luxury", "Budget"];

const steps = [
  { id: 1, label: "Basics", icon: Globe },
  { id: 2, label: "Dates & Budget", icon: Calendar },
  { id: 3, label: "Cover & Tags", icon: ImageIcon },
];

export default function NewTripPage() {
  const router = useRouter();
  const { addTrip } = useTrips();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    destinations: [] as string[],
    startDate: "",
    endDate: "",
    budget: "",
    coverImage: coverImages[0].url,
    tags: [] as string[],
    isPublic: true,
  });
  const [destInput, setDestInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (field: string, value: unknown) => {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: "" }));
  };

  const addDestination = () => {
    if (!destInput.trim()) return;
    if (!form.destinations.includes(destInput.trim())) {
      update("destinations", [...form.destinations, destInput.trim()]);
    }
    setDestInput("");
  };

  const removeDestination = (dest: string) => {
    update("destinations", form.destinations.filter((d) => d !== dest));
  };

  const toggleTag = (tag: string) => {
    update(
      "tags",
      form.tags.includes(tag) ? form.tags.filter((t) => t !== tag) : [...form.tags, tag]
    );
  };

  const validateStep = (s: number) => {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (!form.name.trim()) e.name = "Trip name is required";
      if (form.destinations.length === 0) e.destinations = "Add at least one destination";
    }
    if (s === 2) {
      if (!form.startDate) e.startDate = "Start date is required";
      if (!form.endDate) e.endDate = "End date is required";
      if (form.startDate && form.endDate && form.startDate > form.endDate)
        e.endDate = "End date must be after start date";
      if (!form.budget || isNaN(Number(form.budget))) e.budget = "Enter a valid budget";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const newTrip: Trip = {
      id: `trip-${Date.now()}`,
      name: form.name,
      description: form.description,
      coverImage: form.coverImage,
      startDate: form.startDate,
      endDate: form.endDate,
      destinations: form.destinations,
      status: "upcoming",
      totalBudget: Number(form.budget) || 0,
      spentBudget: 0,
      stops: [],
      slug: form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      isPublic: form.isPublic,
      tags: form.tags,
    };
    addTrip(newTrip);
    setLoading(false);
    router.push("/trips");
  };

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/trips" className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Plan a New Trip</h1>
            <p className="text-gray-500 text-sm">Fill in the details to get started</p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2 flex-1">
              <div className="flex items-center gap-2">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                    step > s.id
                      ? "bg-green-500 text-white"
                      : step === s.id
                      ? "bg-orange-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {step > s.id ? <Check className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
                </div>
                <span
                  className={`text-sm font-medium hidden sm:block ${
                    step >= s.id ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${step > s.id ? "bg-green-400" : "bg-gray-100"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div className="bg-white rounded-2xl p-6 shadow-[var(--shadow-card)] border border-gray-50">
                <h2 className="font-bold text-gray-900 mb-5">Trip Details</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Trip Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      placeholder="e.g. European Summer Adventure"
                      className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${
                        errors.name
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200 bg-gray-50 focus:border-orange-400 focus:bg-white"
                      }`}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Description
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) => update("description", e.target.value)}
                      placeholder="Describe your trip..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-500/20 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Destinations <span className="text-red-400">*</span>
                    </label>
                    <div className="flex gap-2 mb-2">
                      <div className="relative flex-1">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          value={destInput}
                          onChange={(e) => setDestInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && addDestination()}
                          placeholder="Add a city (press Enter)"
                          className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-500/20"
                        />
                      </div>
                      <button
                        onClick={addDestination}
                        className="px-4 py-3 rounded-xl bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    {errors.destinations && (
                      <p className="text-red-500 text-xs mb-2">{errors.destinations}</p>
                    )}
                    {form.destinations.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {form.destinations.map((dest) => (
                          <span
                            key={dest}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 text-orange-600 text-sm font-medium"
                          >
                            <MapPin className="w-3 h-3" />
                            {dest}
                            <button
                              onClick={() => removeDestination(dest)}
                              className="hover:text-red-500 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div className="bg-white rounded-2xl p-6 shadow-[var(--shadow-card)] border border-gray-50">
                <h2 className="font-bold text-gray-900 mb-5">Dates & Budget</h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Start Date <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="date"
                          value={form.startDate}
                          onChange={(e) => update("startDate", e.target.value)}
                          className={`w-full pl-9 pr-3 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${
                            errors.startDate
                              ? "border-red-300 bg-red-50"
                              : "border-gray-200 bg-gray-50 focus:border-orange-400 focus:bg-white"
                          }`}
                        />
                      </div>
                      {errors.startDate && (
                        <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        End Date <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="date"
                          value={form.endDate}
                          onChange={(e) => update("endDate", e.target.value)}
                          className={`w-full pl-9 pr-3 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${
                            errors.endDate
                              ? "border-red-300 bg-red-50"
                              : "border-gray-200 bg-gray-50 focus:border-orange-400 focus:bg-white"
                          }`}
                        />
                      </div>
                      {errors.endDate && (
                        <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Total Budget (USD) <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        value={form.budget}
                        onChange={(e) => update("budget", e.target.value)}
                        placeholder="e.g. 3000"
                        className={`w-full pl-9 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${
                          errors.budget
                            ? "border-red-300 bg-red-50"
                            : "border-gray-200 bg-gray-50 focus:border-orange-400 focus:bg-white"
                        }`}
                      />
                    </div>
                    {errors.budget && <p className="text-red-500 text-xs mt-1">{errors.budget}</p>}
                  </div>

                  {/* Trip duration preview */}
                  {form.startDate && form.endDate && form.startDate <= form.endDate && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-orange-50 border border-orange-100">
                      <Plane className="w-5 h-5 text-orange-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-orange-700">
                          {Math.ceil(
                            (new Date(form.endDate).getTime() - new Date(form.startDate).getTime()) /
                              (1000 * 60 * 60 * 24)
                          )}{" "}
                          day trip
                        </p>
                        <p className="text-xs text-orange-600">
                          {new Date(form.startDate).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                          })}{" "}
                          —{" "}
                          {new Date(form.endDate).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              {/* Cover Image */}
              <div className="bg-white rounded-2xl p-6 shadow-[var(--shadow-card)] border border-gray-50">
                <h2 className="font-bold text-gray-900 mb-4">Cover Image</h2>
                <div className="grid grid-cols-3 gap-3">
                  {coverImages.map((img) => (
                    <button
                      key={img.url}
                      onClick={() => update("coverImage", img.url)}
                      className={`relative h-24 rounded-xl overflow-hidden transition-all ${
                        form.coverImage === img.url
                          ? "ring-2 ring-orange-500 ring-offset-2"
                          : "hover:ring-2 hover:ring-gray-300 hover:ring-offset-1"
                      }`}
                    >
                      <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <span className="absolute bottom-1.5 left-2 text-white text-xs font-medium">
                        {img.label}
                      </span>
                      {form.coverImage === img.url && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white rounded-2xl p-6 shadow-[var(--shadow-card)] border border-gray-50">
                <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-orange-500" /> Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        form.tags.includes(tag)
                          ? "bg-orange-500 text-white shadow-sm"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Visibility */}
              <div className="bg-white rounded-2xl p-6 shadow-[var(--shadow-card)] border border-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-gray-900">Public Trip</h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Allow others to view your shared itinerary
                    </p>
                  </div>
                  <button
                    onClick={() => update("isPublic", !form.isPublic)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      form.isPublic ? "bg-orange-500" : "bg-gray-200"
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                        form.isPublic ? "translate-x-7" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl p-5 border border-orange-100">
                <h3 className="font-bold text-gray-900 mb-3">Trip Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Name</span>
                    <span className="font-medium text-gray-900">{form.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Destinations</span>
                    <span className="font-medium text-gray-900">{form.destinations.join(", ")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Duration</span>
                    <span className="font-medium text-gray-900">
                      {form.startDate && form.endDate
                        ? `${Math.ceil(
                            (new Date(form.endDate).getTime() -
                              new Date(form.startDate).getTime()) /
                              (1000 * 60 * 60 * 24)
                          )} days`
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Budget</span>
                    <span className="font-medium text-gray-900">
                      {form.budget ? `$${Number(form.budget).toLocaleString()}` : "—"}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={handleNext}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-all shadow-md"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-all shadow-md disabled:opacity-70"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Plane className="w-4 h-4" /> Create Trip
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
