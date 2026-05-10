"use client";

import { use, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Globe,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Star,
  Share2,
  Copy,
  Check,
  ArrowRight,
  Utensils,
  Camera,
  Zap,
  Palette,
  ShoppingBag,
  Music,
  ChevronDown,
  ChevronUp,
  AtSign,
  Rss,
  MessageCircle,
} from "lucide-react";
import { mockTrips } from "@/lib/mockData";

const activityTypeIcons: Record<string, React.ElementType> = {
  food: Utensils,
  sightseeing: Camera,
  adventure: Zap,
  culture: Palette,
  shopping: ShoppingBag,
  nightlife: Music,
};

const activityTypeColors: Record<string, string> = {
  food: "bg-orange-50 text-orange-500",
  sightseeing: "bg-blue-50 text-blue-500",
  adventure: "bg-red-50 text-red-500",
  culture: "bg-purple-50 text-purple-500",
  shopping: "bg-pink-50 text-pink-500",
  nightlife: "bg-indigo-50 text-indigo-500",
};

export default function SharedTripPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const trip = mockTrips.find((t) => t.slug === slug) || mockTrips[0];
  const [copied, setCopied] = useState(false);
  const [expandedStop, setExpandedStop] = useState<string | null>(trip.stops[0]?.id || null);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const tripDays = Math.ceil(
    (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  const totalActivities = trip.stops.reduce((acc, s) => acc + s.activities.length, 0);
  const totalCost = trip.stops.reduce(
    (acc, s) => acc + s.activities.reduce((a, act) => a + act.cost, 0) + s.accommodationCost + s.transportCost,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Minimal Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center">
              <Globe className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-sm">Travel<span className="text-orange-500">oop</span></span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 hidden sm:block">Shared itinerary</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500 text-white text-xs font-medium hover:bg-orange-600 transition-colors"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
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
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{trip.name}</h1>
            <p className="text-white/70 text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
              <span className="text-white/40">•</span>
              {tripDays} days
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Destinations", value: trip.destinations.length, icon: MapPin, color: "text-orange-500" },
            { label: "Days", value: tripDays, icon: Calendar, color: "text-blue-500" },
            { label: "Activities", value: totalActivities, icon: Star, color: "text-purple-500" },
            { label: "Est. Cost", value: `$${totalCost.toLocaleString()}`, icon: DollarSign, color: "text-green-500" },
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
          <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-50 mb-6">
            <h2 className="font-bold text-gray-900 mb-3">About This Trip</h2>
            <p className="text-gray-600 leading-relaxed">{trip.description}</p>
          </div>
        )}

        {/* Itinerary */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Itinerary</h2>
          <div className="space-y-4">
            {trip.stops.map((stop, stopIndex) => {
              const isExpanded = expandedStop === stop.id;
              return (
                <motion.div
                  key={stop.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: stopIndex * 0.1 }}
                  className="bg-white rounded-2xl shadow-card border border-gray-50 overflow-hidden"
                >
                  {/* Stop Header */}
                  <button
                    onClick={() => setExpandedStop(isExpanded ? null : stop.id)}
                    className="w-full flex items-center gap-4 p-5 hover:bg-gray-50/50 transition-colors text-left"
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-14 h-14 rounded-xl overflow-hidden">
                        <img src={stop.image} alt={stop.city} className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute -top-1 -left-1 w-6 h-6 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center font-bold">
                        {stopIndex + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg">{stop.city}</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {stop.country}
                        <span className="mx-1">·</span>
                        <Calendar className="w-3 h-3" />
                        {new Date(stop.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} — {new Date(stop.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-orange-500 font-medium">{stop.activities.length} activities</span>
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                    </div>
                  </button>

                  {/* Activities */}
                  {isExpanded && stop.activities.length > 0 && (
                    <div className="px-5 pb-5 border-t border-gray-50">
                      <div className="space-y-3 mt-4">
                        {stop.activities.map((act, actIndex) => {
                          const TypeIcon = activityTypeIcons[act.type] || Camera;
                          const typeColor = activityTypeColors[act.type] || "bg-gray-50 text-gray-500";
                          return (
                            <div key={act.id} className="flex gap-4 p-3 rounded-xl bg-gray-50">
                              <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                                <img src={act.image} alt={act.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${typeColor} mb-1`}>
                                      <TypeIcon className="w-3 h-3" />
                                      {act.type}
                                    </span>
                                    <h4 className="font-semibold text-gray-900 text-sm">{act.name}</h4>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm font-bold text-green-600">${act.cost}</p>
                                    <div className="flex items-center gap-0.5 justify-end">
                                      <Star className="w-3 h-3 fill-orange-400 text-orange-400" />
                                      <span className="text-xs text-gray-500">{act.rating}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {act.time}</span>
                                  <span>{act.duration}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Share CTA */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-8 text-center text-white mb-8">
          <h2 className="text-2xl font-bold mb-2">Love this itinerary?</h2>
          <p className="text-white/80 mb-6">Create your own trip on Traveloop — it's free!</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-orange-500 font-semibold hover:bg-orange-50 transition-colors"
            >
              Start Planning Free <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={handleCopy}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/20 text-white font-semibold border border-white/30 hover:bg-white/30 transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Link Copied!" : "Copy Trip Link"}
            </button>
          </div>
        </div>

        {/* Social Share */}
        <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-50 text-center">
          <h3 className="font-bold text-gray-900 mb-2">Share this trip</h3>
          <p className="text-gray-500 text-sm mb-4">Inspire others with this amazing itinerary</p>
          <div className="flex justify-center gap-3">
            {[
              { icon: MessageCircle, label: "Twitter", color: "bg-sky-50 text-sky-500 hover:bg-sky-100" },
              { icon: Rss, label: "Facebook", color: "bg-blue-50 text-blue-600 hover:bg-blue-100" },
              { icon: AtSign, label: "Instagram", color: "bg-pink-50 text-pink-500 hover:bg-pink-100" },
              { icon: Share2, label: "More", color: "bg-gray-50 text-gray-500 hover:bg-gray-100" },
            ].map(({ icon: Icon, label, color }) => (
              <button
                key={label}
                className={`flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl ${color} transition-colors`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
