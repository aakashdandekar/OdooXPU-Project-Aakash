"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, MapPin, DollarSign, Eye, Edit, Trash2, Share2 } from "lucide-react";
import { Trip } from "@/lib/mockData";

interface TripCardProps {
  trip: Trip;
  onDelete?: (id: string) => void;
  variant?: "default" | "compact";
}

const statusColors = {
  upcoming: "bg-blue-50 text-blue-600 border-blue-100",
  ongoing: "bg-green-50 text-green-600 border-green-100",
  completed: "bg-gray-50 text-gray-500 border-gray-100",
};

const statusLabels = {
  upcoming: "Upcoming",
  ongoing: "Ongoing",
  completed: "Completed",
};

export default function TripCard({ trip, onDelete, variant = "default" }: TripCardProps) {
  const budgetPercent = Math.min((trip.spentBudget / trip.totalBudget) * 100, 100);
  const isOverBudget = trip.spentBudget > trip.totalBudget;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow border border-gray-100 group"
    >
      {/* Cover Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={trip.coverImage}
          alt={trip.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusColors[trip.status]} bg-white/90 backdrop-blur-sm`}>
            {statusLabels[trip.status]}
          </span>
        </div>

        {/* Share button */}
        {trip.isPublic && (
          <div className="absolute top-3 right-3">
            <Link
              href={`/shared/${trip.slug}`}
              className="p-1.5 rounded-lg bg-white/90 backdrop-blur-sm text-gray-600 hover:text-orange-500 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Destination tags */}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
          {trip.destinations.slice(0, 3).map((dest) => (
            <span key={dest} className="text-xs text-white bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
              {dest}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-base mb-1 line-clamp-1">{trip.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{trip.description}</p>

        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(trip.startDate)}
          </span>
          <span className="text-gray-300">•</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {trip.destinations.length} {trip.destinations.length === 1 ? "city" : "cities"}
          </span>
        </div>

        {/* Budget bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-gray-500 flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              Budget
            </span>
            <span className={`font-semibold ${isOverBudget ? "text-red-500" : "text-gray-700"}`}>
              ${trip.spentBudget.toLocaleString()} / ${trip.totalBudget.toLocaleString()}
            </span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${budgetPercent}%` }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={`h-full rounded-full ${isOverBudget ? "bg-red-400" : "bg-orange-400"}`}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            href={`/trips/${trip.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            View
          </Link>
          <Link
            href={`/trips/${trip.id}/builder`}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gray-50 text-gray-600 text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            <Edit className="w-3.5 h-3.5" />
          </Link>
          {onDelete && (
            <button
              onClick={() => onDelete(trip.id)}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gray-50 text-gray-400 text-sm font-medium hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}