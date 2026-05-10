"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  TrendingUp,
  DollarSign,
  Star,
  Plus,
  Filter,
  SlidersHorizontal,
  Check,
  Globe,
} from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import { mockCities, City } from "@/lib/mockData";

const regions = ["All", "Europe", "Asia", "Americas", "Oceania", "Middle East"];
const sortOptions = ["Popularity", "Cost: Low to High", "Cost: High to Low", "Name"];

export default function CitiesPage() {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("All");
  const [sortBy, setSortBy] = useState("Popularity");
  const [addedCities, setAddedCities] = useState<string[]>([]);

  const regionMap: Record<string, string[]> = {
    Europe: ["France", "Italy", "Spain", "Greece", "Germany", "Portugal"],
    Asia: ["Japan", "Indonesia", "Thailand", "India", "China"],
    Americas: ["USA", "Brazil", "Mexico", "Canada"],
    Oceania: ["Australia", "New Zealand"],
    "Middle East": ["UAE", "Turkey"],
  };

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

  const toggleAdd = (cityId: string) => {
    setAddedCities((prev) =>
      prev.includes(cityId) ? prev.filter((id) => id !== cityId) : [...prev, cityId]
    );
  };

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
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
          {regions.map((r) => (
            <button
              key={r}
              onClick={() => setRegion(r)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                region === r
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-5">{filtered.length} destinations found</p>

        {/* City Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((city, i) => {
            const isAdded = addedCities.includes(city.id);
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                  {/* Popularity badge */}
                  <div className="absolute top-3 left-3">
                    <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm text-gray-700">
                      <TrendingUp className="w-3 h-3 text-orange-500" />
                      {city.popularity}% popular
                    </span>
                  </div>

                  {/* Add button */}
                  <button
                    onClick={() => toggleAdd(city.id)}
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
                    onClick={() => toggleAdd(city.id)}
                    className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isAdded
                        ? "bg-green-50 text-green-600 border border-green-200"
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
    </PageWrapper>
  );
}
