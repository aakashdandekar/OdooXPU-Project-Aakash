"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  TrendingUp,
  DollarSign,
  Star,
  Plus,
  Check,
  Globe,
  X,
  Briefcase,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import { mockCities, City } from "@/lib/mockData";
import { useTrips } from "@/lib/tripsContext";

const regions = ["All", "Europe", "Asia", "Americas", "Oceania", "Middle East"];
const sortOptions = ["Popularity", "Cost: Low to High", "Cost: High to Low", "Name"];

const regionMap: Record<string, string[]> = {
  Europe: ["France", "Italy", "Spain", "Greece", "Germany", "Portugal"],
  Asia: ["Japan", "Indonesia", "Thailand", "India", "China"],
  Americas: ["USA", "Brazil", "Mexico", "Canada"],
  Oceania: ["Australia", "New Zealand"],
  "Middle East": ["UAE", "Turkey"],
};

// ─── Add-to-Trip Modal ────────────────────────────────────────────────────────

function AddToTripModal({
  city,
  onClose,
}: {
  city: City;
  onClose: () => void;
}) {
  const { trips, addCityToTrip, isCityInAnyTrip, getTripForCity } = useTrips();
  const [added, setAdded] = useState<string | null>(null);

  const upcomingTrips = trips.filter((t) => t.status !== "completed");
  const alreadyInTrip = getTripForCity(city.id);

  const handleAdd = (tripId: string) => {
    addCityToTrip(tripId, city);
    setAdded(tripId);
    setTimeout(onClose, 900);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="relative h-28 overflow-hidden">
          <img src={city.image} alt={city.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-3 left-4">
            <p className="text-white font-bold text-lg">{city.name}</p>
            <p className="text-white/70 text-xs flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {city.country}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          {alreadyInTrip ? (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-green-50 border border-green-100 mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-green-700">Already added!</p>
                <p className="text-xs text-green-600">
                  {city.name} is in <span className="font-medium">{alreadyInTrip.name}</span>
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm font-semibold text-gray-900 mb-4">
              Add <span className="text-orange-500">{city.name}</span> to a trip
            </p>
          )}

          {upcomingTrips.length === 0 ? (
            <div className="text-center py-6">
              <Briefcase className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 text-sm mb-4">No active trips yet</p>
              <Link
                href="/trips/new"
                onClick={onClose}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors"
              >
                <Plus className="w-4 h-4" /> Create a Trip
              </Link>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {upcomingTrips.map((trip) => {
                const alreadyHasCity = trip.destinations.includes(city.name);
                const isJustAdded = added === trip.id;

                return (
                  <button
                    key={trip.id}
                    onClick={() => !alreadyHasCity && handleAdd(trip.id)}
                    disabled={alreadyHasCity}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl border transition-all text-left ${
                      alreadyHasCity
                        ? "border-green-200 bg-green-50 cursor-default"
                        : isJustAdded
                        ? "border-green-400 bg-green-50"
                        : "border-gray-100 hover:border-orange-300 hover:bg-orange-50/50 cursor-pointer"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                      <img
                        src={trip.coverImage}
                        alt={trip.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{trip.name}</p>
                      <p className="text-xs text-gray-500">
                        {trip.destinations.length} {trip.destinations.length === 1 ? "city" : "cities"} ·{" "}
                        <span
                          className={
                            trip.status === "upcoming"
                              ? "text-blue-500"
                              : "text-green-500"
                          }
                        >
                          {trip.status}
                        </span>
                      </p>
                    </div>
                    <div className="shrink-0">
                      {alreadyHasCity || isJustAdded ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
            <Link
              href="/trips/new"
              onClick={onClose}
              className="flex items-center gap-1.5 text-sm text-orange-500 font-medium hover:text-orange-600 transition-colors"
            >
              <Plus className="w-4 h-4" /> New trip
            </Link>
            <Link
              href="/trips"
              onClick={onClose}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              View all trips <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CitiesPage() {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("All");
  const [sortBy, setSortBy] = useState("Popularity");
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const { isCityInAnyTrip } = useTrips();

  const filtered = mockCities
    .filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.country.toLowerCase().includes(search.toLowerCase());
      const matchRegion =
        region === "All" ||
        (regionMap[region] && regionMap[region].includes(c.country));
      return matchSearch && matchRegion;
    })
    .sort((a, b) => {
      if (sortBy === "Popularity") return b.popularity - a.popularity;
      if (sortBy === "Cost: Low to High") return a.avgDailyCost - b.avgDailyCost;
      if (sortBy === "Cost: High to Low") return b.avgDailyCost - a.avgDailyCost;
      if (sortBy === "Name") return a.name.localeCompare(b.name);
      return 0;
    });

  const getCostLabel = (cost: number) => {
    if (cost < 80) return { label: "Budget", color: "text-green-600 bg-green-50" };
    if (cost < 150) return { label: "Moderate", color: "text-orange-600 bg-orange-50" };
    return { label: "Luxury", color: "text-purple-600 bg-purple-50" };
  };

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Cities</h1>
          <p className="text-gray-500">Explore destinations and add them to your trips</p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search cities or countries..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 focus:outline-none focus:border-orange-400 cursor-pointer"
          >
            {sortOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* Region Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {regions.map((r) => (
            <button
              key={r}
              onClick={() => setRegion(r)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                region === r
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <p className="text-sm text-gray-500 mb-5">{filtered.length} destinations found</p>

        {/* City Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((city, i) => {
            const isAdded = isCityInAnyTrip(city.id);
            const costInfo = getCostLabel(city.avgDailyCost);

            return (
              <motion.div
                key={city.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow border border-gray-50 group"
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

                  <div className="absolute top-3 left-3">
                    <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm text-gray-700">
                      <TrendingUp className="w-3 h-3 text-orange-500" />
                      {city.popularity}% popular
                    </span>
                  </div>

                  {/* Quick-add icon button */}
                  <button
                    onClick={() => setSelectedCity(city)}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isAdded
                        ? "bg-green-500 text-white"
                        : "bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-orange-500 hover:text-white"
                    }`}
                  >
                    {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </button>

                  <div className="absolute bottom-3 left-3">
                    <h3 className="text-white font-bold text-lg">{city.name}</h3>
                    <p className="text-white/80 text-xs flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {city.country}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">{city.description}</p>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-sm">
                      <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                      <span className="font-semibold text-gray-900">${city.avgDailyCost}</span>
                      <span className="text-gray-400 text-xs">/day</span>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${costInfo.color}`}>
                      {costInfo.label}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {city.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>Best time: {city.bestTime}</span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-orange-400 text-orange-400" />
                      {(city.popularity / 20).toFixed(1)}
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedCity(city)}
                    className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isAdded
                        ? "bg-green-50 text-green-600 border border-green-200 hover:bg-green-100"
                        : "bg-orange-500 text-white hover:bg-orange-600"
                    }`}
                  >
                    {isAdded ? (
                      <span className="flex items-center justify-center gap-1.5">
                        <Check className="w-3.5 h-3.5" /> Added to Trip
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-1.5">
                        <Plus className="w-3.5 h-3.5" /> Add to Trip
                      </span>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Globe className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <h3 className="text-gray-700 font-semibold mb-1">No cities found</h3>
            <p className="text-gray-400 text-sm">Try a different search or region</p>
          </div>
        )}
      </div>

      {/* Add to Trip Modal */}
      <AnimatePresence>
        {selectedCity && (
          <AddToTripModal
            city={selectedCity}
            onClose={() => setSelectedCity(null)}
          />
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
