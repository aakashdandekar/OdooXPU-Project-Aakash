"use client";

import { use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  DollarSign,
  Edit,
  Share2,
  CheckSquare,
  BookOpen,
  BarChart3,
  Map,
  Clock,
  Star,
  ChevronRight,
  Globe,
  Lock,
  Copy,
  Check,
} from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import { mockTrips } from "@/lib/mockData";
import { useState } from "react";

export default function TripDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const trip = mockTrips.find((t) => t.id === id) || mockTrips[0];
  const [copied, setCopied] = useState(false);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const tripDays = Math.ceil(
    (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  const totalActivities = trip.stops.reduce((acc, s) => acc + s.activities.length, 0);
  const budgetPercent = Math.min((trip.spentBudget / trip.totalBudget) * 100, 100);

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://traveloop.app/shared/${trip.slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const quickLinks = [
    { label: "Itinerary Builder", href: `/trips/${id}/builder`, icon: Map, color: "bg-orange-50 text-orange-500", desc: "Add cities & activities" },
    { label: "Budget", href: `/trips/${id}/budget`, icon: BarChart3, color: "bg-blue-50 text-blue-500", desc: "Track spending" },
    { label: "Checklist", href: `/trips/${id}/checklist`, icon: CheckSquare, color: "bg-green-50 text-green-500", desc: "Packing list" },
    { label: "Notes", href: `/trips/${id}/notes`, icon: BookOpen, color: "bg-purple-50 text-purple-500", desc: "Trip journal" },
  ];

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back */}
        <Link href="/trips" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Trips
        </Link>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden mb-8 h-72"
        >
          <img src={trip.coverImage} alt={trip.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex flex-wrap gap-2 mb-3">
              {trip.tags.map((tag) => (
                <span key={tag} className="text-xs text-white bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full">{tag}</span>
              ))}
              <span className={`text-xs px-2.5 py-1 rounded-full backdrop-blur-sm ${
                trip.status === "upcoming" ? "bg-blue-500/80 text-white" :
                trip.status === "ongoing" ? "bg-green-500/80 text-white" :
                "bg-gray-500/80 text-white"
              }`}>
                {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{trip.name}</h1>
            <p className="text-white/70 flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4" />
              {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
              <span className="text-white/40">•</span>
              <span>{tripDays} days</span>
            </p>
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <Link href={`/trips/${id}/builder`} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/90 backdrop-blur-sm text-gray-700 text-sm font-medium hover:bg-white transition-colors">
              <Edit className="w-3.5 h-3.5" /> Edit
            </Link>
            <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors">
              {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Share"}
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Destinations", value: trip.destinations.length, icon: MapPin, color: "text-orange-500" },
                { label: "Days", value: tripDays, icon: Calendar, color: "text-blue-500" },
                { label: "Activities", value: totalActivities, icon: Star, color: "text-purple-500" },
                { label: "Budget", value: `$${trip.totalBudget.toLocaleString()}`, icon: DollarSign, color: "text-green-500" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-card border border-gray-50 text-center">
                  <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-2`} />
                  <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            {trip.description && (
              <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-50">
                <h2 className="font-bold text-gray-900 mb-3">About This Trip</h2>
                <p className="text-gray-600 leading-relaxed">{trip.description}</p>
              </div>
            )}

            {/* City Stops */}
            <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-50">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-gray-900">City Stops</h2>
                <Link href={`/trips/${id}/builder`} className="text-orange-500 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
                  Edit <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              {trip.stops.length > 0 ? (
                <div className="space-y-4">
                  {trip.stops.map((stop, i) => (
                    <motion.div
                      key={stop.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex gap-4 p-4 rounded-xl bg-gray-50 hover:bg-orange-50/50 transition-colors group"
                    >
                      <div className="relative flex-shrink-0">
                        <div className="w-14 h-14 rounded-xl overflow-hidden">
                          <img src={stop.image} alt={stop.city} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center font-bold">
                          {i + 1}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-gray-900">{stop.city}</h3>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {stop.country}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">
                              {new Date(stop.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} —{" "}
                              {new Date(stop.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </p>
                            <p className="text-xs text-orange-500 font-medium mt-0.5">{stop.activities.length} activities</p>
                          </div>
                        </div>
                        <div className="flex gap-3 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {stop.accommodation}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm mb-3">No city stops added yet</p>
                  <Link href={`/trips/${id}/builder`} className="text-orange-500 text-sm font-medium hover:underline">
                    Add your first stop →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Quick Links */}
            <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-50">
              <h3 className="font-bold text-gray-900 mb-4">Trip Tools</h3>
              <div className="space-y-2">
                {quickLinks.map(({ label, href, icon: Icon, color, desc }) => (
                  <Link
                    key={label}
                    href={href}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{label}</p>
                      <p className="text-xs text-gray-500">{desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-orange-400 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Budget Card */}
            <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Budget</h3>
                <Link href={`/trips/${id}/budget`} className="text-orange-500 text-xs font-medium">View details</Link>
              </div>
              <div className="flex items-end justify-between mb-2">
                <div>
                  <p className="text-2xl font-bold text-gray-900">${trip.spentBudget.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">of ${trip.totalBudget.toLocaleString()} budget</p>
                </div>
                <p className={`text-sm font-semibold ${budgetPercent > 90 ? "text-red-500" : "text-green-500"}`}>
                  {budgetPercent.toFixed(0)}%
                </p>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${budgetPercent}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className={`h-full rounded-full ${budgetPercent > 90 ? "bg-red-400" : "bg-orange-400"}`}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                ${(trip.totalBudget - trip.spentBudget).toLocaleString()} remaining
              </p>
            </div>

            {/* Share Card */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-3">
                {trip.isPublic ? <Globe className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                <h3 className="font-bold">{trip.isPublic ? "Public Trip" : "Private Trip"}</h3>
              </div>
              {trip.isPublic ? (
                <>
                  <p className="text-white/80 text-sm mb-4">Share your itinerary with friends and family.</p>
                  <div className="flex gap-2">
                    <button onClick={handleCopy} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/20 text-white text-sm font-medium hover:bg-white/30 transition-colors">
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? "Copied!" : "Copy Link"}
                    </button>
                    <Link href={`/shared/${trip.slug}`} className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white text-orange-500 text-sm font-medium hover:bg-orange-50 transition-colors">
                      <Globe className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </>
              ) : (
                <p className="text-white/80 text-sm">Make this trip public to share with others.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}