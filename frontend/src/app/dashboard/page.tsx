"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Plus,
  TrendingUp,
  MapPin,
  Calendar,
  DollarSign,
  Compass,
  ArrowRight,
  Star,
  Clock,
  ChevronRight,
  Plane,
  Sparkles,
} from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import TripCard from "@/components/TripCard";
import { mockTrips, mockUser, recommendedDestinations, mockCities } from "@/lib/mockData";

const quickStats = [
  { label: "Total Trips", value: "12", icon: Plane, color: "bg-orange-50 text-orange-500", change: "+2 this year" },
  { label: "Countries Visited", value: "24", icon: MapPin, color: "bg-blue-50 text-blue-500", change: "6 continents" },
  { label: "Total Spent", value: "$18.4K", icon: DollarSign, color: "bg-green-50 text-green-500", change: "Avg $1.5K/trip" },
  { label: "Days Traveled", value: "186", icon: Calendar, color: "bg-purple-50 text-purple-500", change: "This year" },
];

export default function DashboardPage() {
  const upcomingTrips = mockTrips.filter((t) => t.status === "upcoming");
  const recentTrips = mockTrips.slice(0, 3);

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Welcome Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden mb-8"
        >
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1400&q=80"
              alt="Travel"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          </div>
          <div className="relative z-10 p-8 md:p-10">
            <div className="flex items-center gap-3 mb-4">
              <img src={mockUser.avatar} alt={mockUser.name} className="w-12 h-12 rounded-full border-2 border-white/50 object-cover" />
              <div>
                <p className="text-white/70 text-sm">Good morning,</p>
                <p className="text-white font-bold text-lg">{mockUser.name} ✈️</p>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Where to next?
            </h1>
            <p className="text-white/70 mb-6 max-w-md">
              You have {upcomingTrips.length} upcoming {upcomingTrips.length === 1 ? "trip" : "trips"}. Keep the momentum going!
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/trips/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-all shadow-lg"
              >
                <Plus className="w-4 h-4" />
                Plan New Trip
              </Link>
              <Link
                href="/discover/cities"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/15 backdrop-blur-sm text-white font-medium border border-white/20 hover:bg-white/25 transition-all"
              >
                <Compass className="w-4 h-4" />
                Discover Places
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ── Quick Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-5 shadow-card border border-gray-50"
            >
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-0.5">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
              <div className="text-xs text-gray-400 mt-1">{stat.change}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Left Column ── */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Trips */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-gray-900">My Trips</h2>
                <Link href="/trips" className="flex items-center gap-1 text-orange-500 text-sm font-medium hover:gap-2 transition-all">
                  View all <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recentTrips.map((trip, i) => (
                  <motion.div
                    key={trip.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                  >
                    <TripCard trip={trip} />
                  </motion.div>
                ))}
                {/* Create new trip card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Link href="/trips/new">
                    <div className="h-full min-h-[280px] rounded-2xl border-2 border-dashed border-orange-200 flex flex-col items-center justify-center gap-3 hover:border-orange-400 hover:bg-orange-50/50 transition-all group cursor-pointer">
                      <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                        <Plus className="w-6 h-6 text-orange-500" />
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-gray-700 group-hover:text-orange-600 transition-colors">Plan a New Trip</p>
                        <p className="text-sm text-gray-400 mt-1">Start your next adventure</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </div>
            </section>

            {/* Upcoming Trip Highlight */}
            {upcomingTrips[0] && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-5">Next Adventure</h2>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="relative rounded-2xl overflow-hidden"
                >
                  <img
                    src={upcomingTrips[0].coverImage}
                    alt={upcomingTrips[0].name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="flex gap-2 mb-2">
                          {upcomingTrips[0].destinations.map((d) => (
                            <span key={d} className="text-xs text-white/80 bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">{d}</span>
                          ))}
                        </div>
                        <h3 className="text-white font-bold text-lg">{upcomingTrips[0].name}</h3>
                        <p className="text-white/70 text-sm flex items-center gap-1 mt-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(upcomingTrips[0].startDate).toLocaleDateString("en-US", { month: "long", day: "numeric" })} — {new Date(upcomingTrips[0].endDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                      <Link
                        href={`/trips/${upcomingTrips[0].id}`}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors"
                      >
                        Open <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </section>
            )}
          </div>

          {/* ── Right Column ── */}
          <div className="space-y-6">
            {/* Budget Overview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-5 shadow-card border border-gray-50"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Budget Overview</h3>
                <TrendingUp className="w-4 h-4 text-orange-500" />
              </div>
              <div className="space-y-3">
                {[
                  { label: "European Summer", spent: 1200, total: 5000, color: "bg-orange-400" },
                  { label: "Japan Cherry Blossom", spent: 4500, total: 4500, color: "bg-blue-400" },
                  { label: "Bali Retreat", spent: 2650, total: 2800, color: "bg-green-400" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600 font-medium">{item.label}</span>
                      <span className="text-gray-500">${item.spent.toLocaleString()} / ${item.total.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.color}`}
                        style={{ width: `${(item.spent / item.total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/trips/trip-1/budget" className="flex items-center gap-1 text-orange-500 text-sm font-medium mt-4 hover:gap-2 transition-all">
                View full breakdown <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Recommended Destinations */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-5 shadow-card border border-gray-50"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Recommended</h3>
                <Sparkles className="w-4 h-4 text-orange-500" />
              </div>
              <div className="space-y-3">
                {recommendedDestinations.map((dest) => (
                  <div key={dest.id} className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{dest.name}</p>
                      <p className="text-xs text-gray-500">{dest.country}</p>
                    </div>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-orange-50 text-orange-500 flex-shrink-0">
                      {dest.tag}
                    </span>
                  </div>
                ))}
              </div>
              <Link href="/discover/cities" className="flex items-center gap-1 text-orange-500 text-sm font-medium mt-4 hover:gap-2 transition-all">
                Explore all <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl p-5 shadow-card border border-gray-50"
            >
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "New Trip", href: "/trips/new", icon: Plus, color: "bg-orange-50 text-orange-500" },
                  { label: "Discover", href: "/discover/cities", icon: Compass, color: "bg-blue-50 text-blue-500" },
                  { label: "Checklist", href: "/trips/trip-1/checklist", icon: Star, color: "bg-green-50 text-green-500" },
                  { label: "Notes", href: "/trips/trip-1/notes", icon: Clock, color: "bg-purple-50 text-purple-500" },
                ].map(({ label, href, icon: Icon, color }) => (
                  <Link
                    key={label}
                    href={href}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium text-gray-600">{label}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
