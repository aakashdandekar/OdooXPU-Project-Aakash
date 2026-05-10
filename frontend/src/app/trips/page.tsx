"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  Plane,
  CheckCircle,
  Clock,
  Grid3X3,
  List,
  SlidersHorizontal,
} from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import TripCard from "@/components/TripCard";
import { Trip } from "@/lib/mockData";
import { useTrips } from "@/lib/tripsContext";

const statusFilters = ["All", "Upcoming", "Ongoing", "Completed"];

export default function TripsPage() {
  const { trips, removeTrip } = useTrips();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filtered = trips.filter((t) => {
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.destinations.some((d: string) => d.toLowerCase().includes(search.toLowerCase()));
    const matchStatus =
      statusFilter === "All" || t.status === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  const handleDelete = (id: string) => {
    removeTrip(id);
  };

  const stats = {
    total: trips.length,
    upcoming: trips.filter((t) => t.status === "upcoming").length,
    ongoing: trips.filter((t) => t.status === "ongoing").length,
    completed: trips.filter((t) => t.status === "completed").length,
  };

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Trips</h1>
            <p className="text-gray-500 mt-1">Plan, track, and relive your adventures</p>
          </div>
          <Link
            href="/trips/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-all shadow-md hover:shadow-orange-200 hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            New Trip
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Trips", value: stats.total, icon: Plane, color: "bg-orange-50 text-orange-500" },
            { label: "Upcoming", value: stats.upcoming, icon: Clock, color: "bg-blue-50 text-blue-500" },
            { label: "Ongoing", value: stats.ongoing, icon: SlidersHorizontal, color: "bg-green-50 text-green-500" },
            { label: "Completed", value: stats.completed, icon: CheckCircle, color: "bg-purple-50 text-purple-500" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl p-4 shadow-[var(--shadow-card)] border border-gray-50 flex items-center gap-3"
            >
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center flex-shrink-0`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search trips or destinations..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10"
            />
          </div>

          {/* Status filter tabs */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
            {statusFilters.map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  statusFilter === f
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* View toggle */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white shadow-sm text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-5">
          {filtered.length} {filtered.length === 1 ? "trip" : "trips"} found
        </p>

        {/* Trip Grid */}
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                  : "space-y-4"
              }
            >
              {filtered.map((trip, i) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <TripCard trip={trip} onDelete={handleDelete} />
                </motion.div>
              ))}

              {/* Create new trip card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: filtered.length * 0.08 }}
              >
                <Link href="/trips/new">
                  <div className="h-full min-h-[280px] rounded-2xl border-2 border-dashed border-orange-200 flex flex-col items-center justify-center gap-3 hover:border-orange-400 hover:bg-orange-50/50 transition-all group cursor-pointer">
                    <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                      <Plus className="w-7 h-7 text-orange-500" />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-gray-700 group-hover:text-orange-600 transition-colors">
                        Plan a New Trip
                      </p>
                      <p className="text-sm text-gray-400 mt-1">Start your next adventure</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Plane className="w-14 h-14 text-gray-200 mx-auto mb-4" />
              <h3 className="text-gray-700 font-semibold text-lg mb-2">No trips found</h3>
              <p className="text-gray-400 text-sm mb-6">
                {search ? `No trips match "${search}"` : "Start planning your first adventure!"}
              </p>
              <Link
                href="/trips/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors"
              >
                <Plus className="w-4 h-4" /> Create Your First Trip
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
}
