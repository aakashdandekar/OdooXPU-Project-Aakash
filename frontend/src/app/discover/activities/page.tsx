"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Clock,
  DollarSign,
  Star,
  Plus,
  Check,
  Utensils,
  Camera,
  Zap,
  Palette,
  ShoppingBag,
  Music,
  Filter,
} from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import { mockActivities, Activity } from "@/lib/mockData";

const typeConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  food: { icon: Utensils, color: "text-orange-500", bg: "bg-orange-50" },
  sightseeing: { icon: Camera, color: "text-blue-500", bg: "bg-blue-50" },
  adventure: { icon: Zap, color: "text-red-500", bg: "bg-red-50" },
  culture: { icon: Palette, color: "text-purple-500", bg: "bg-purple-50" },
  shopping: { icon: ShoppingBag, color: "text-pink-500", bg: "bg-pink-50" },
  nightlife: { icon: Music, color: "text-indigo-500", bg: "bg-indigo-50" },
};

const typeLabels: Record<string, string> = {
  food: "Food & Drink",
  sightseeing: "Sightseeing",
  adventure: "Adventure",
  culture: "Culture",
  shopping: "Shopping",
  nightlife: "Nightlife",
};

export default function ActivitiesPage() {
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState("all");
  const [maxCost, setMaxCost] = useState(200);
  const [maxDuration, setMaxDuration] = useState("any");
  const [addedActivities, setAddedActivities] = useState<string[]>([]);

  const types = ["all", ...Object.keys(typeConfig)];

  const filtered = mockActivities.filter((a) => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.description.toLowerCase().includes(search.toLowerCase());
    const matchType = activeType === "all" || a.type === activeType;
    const matchCost = a.cost <= maxCost;
    return matchSearch && matchType && matchCost;
  });

  const toggleAdd = (id: string) => {
    setAddedActivities((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Activities</h1>
          <p className="text-gray-500">Find and add activities to your itinerary</p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search activities..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10"
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="lg:w-56 flex-shrink-0">
            <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-50 sticky top-20">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4 text-orange-500" /> Filters
              </h3>

              {/* Type */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Type</p>
                <div className="space-y-1">
                  {types.map((type) => {
                    const config = typeConfig[type];
                    const Icon = config?.icon;
                    return (
                      <button
                        key={type}
                        onClick={() => setActiveType(type)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all ${
                          activeType === type
                            ? "bg-orange-50 text-orange-600 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {Icon && <Icon className={`w-4 h-4 ${activeType === type ? "text-orange-500" : "text-gray-400"}`} />}
                        {type === "all" ? "All Types" : typeLabels[type]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Max Cost */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Max Cost</p>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-500">$0</span>
                  <span className="font-semibold text-orange-500">${maxCost}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={200}
                  value={maxCost}
                  onChange={(e) => setMaxCost(Number(e.target.value))}
                  className="w-full accent-orange-500"
                />
              </div>

              {/* Duration */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Duration</p>
                <select
                  value={maxDuration}
                  onChange={(e) => setMaxDuration(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-orange-400"
                >
                  <option value="any">Any duration</option>
                  <option value="1">Under 1 hour</option>
                  <option value="2">Under 2 hours</option>
                  <option value="4">Under 4 hours</option>
                  <option value="8">Full day</option>
                </select>
              </div>
            </div>
          </div>

          {/* Activity Grid */}
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-4">{filtered.length} activities found</p>
            <div className="space-y-3">
              {filtered.map((activity, i) => {
                const config = typeConfig[activity.type];
                const Icon = config?.icon || Camera;
                const isAdded = addedActivities.includes(activity.id);

                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="bg-white rounded-2xl shadow-card border border-gray-50 overflow-hidden hover:shadow-card-hover transition-shadow"
                  >
                    <div className="flex gap-4 p-4">
                      {/* Image */}
                      <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={activity.image} alt={activity.name} className="w-full h-full object-cover" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${config?.bg} ${config?.color}`}>
                                <Icon className="w-3 h-3" />
                                {typeLabels[activity.type]}
                              </span>
                            </div>
                            <h3 className="font-bold text-gray-900">{activity.name}</h3>
                          </div>
                          <button
                            onClick={() => toggleAdd(activity.id)}
                            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                              isAdded
                                ? "bg-green-50 text-green-600 border border-green-200"
                                : "bg-orange-500 text-white hover:bg-orange-600"
                            }`}
                          >
                            {isAdded ? <><Check className="w-3.5 h-3.5" /> Added</> : <><Plus className="w-3.5 h-3.5" /> Add</>}
                          </button>
                        </div>

                        <p className="text-sm text-gray-500 line-clamp-2 mt-1 mb-2">{activity.description}</p>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {activity.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-blue-400" /> {activity.duration}
                          </span>
                          <span className="flex items-center gap-1 font-semibold text-green-600">
                            <DollarSign className="w-3 h-3" /> ${activity.cost}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-orange-400 text-orange-400" /> {activity.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16">
                <Camera className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500">No activities match your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
