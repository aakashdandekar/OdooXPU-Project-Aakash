"use client";

import { use, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  GripVertical,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Trash2,
  ChevronDown,
  ChevronUp,
  Star,
  Edit2,
  Check,
  X,
  Utensils,
  Camera,
  Zap,
  Palette,
  ShoppingBag,
  Music,
} from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import { mockTrips, CityStop, Activity } from "@/lib/mockData";

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

const newCityOptions = [
  { city: "Amsterdam", country: "Netherlands", image: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=200&q=80" },
  { city: "Prague", country: "Czech Republic", image: "https://images.unsplash.com/photo-1541849546-216549ae216d?w=200&q=80" },
  { city: "Vienna", country: "Austria", image: "https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=200&q=80" },
  { city: "Lisbon", country: "Portugal", image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=200&q=80" },
];

export default function ItineraryBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const trip = mockTrips.find((t) => t.id === id) || mockTrips[0];

  const [stops, setStops] = useState<CityStop[]>(trip.stops);
  const [expandedStop, setExpandedStop] = useState<string | null>(stops[0]?.id || null);
  const [addCityOpen, setAddCityOpen] = useState(false);
  const [addActivityOpen, setAddActivityOpen] = useState<string | null>(null);
  const [newActivity, setNewActivity] = useState({ name: "", time: "", cost: "", duration: "", type: "sightseeing" });
  const [saved, setSaved] = useState(false);

  const toggleStop = (id: string) => setExpandedStop(expandedStop === id ? null : id);

  const removeStop = (stopId: string) => setStops((prev) => prev.filter((s) => s.id !== stopId));

  const removeActivity = (stopId: string, actId: string) => {
    setStops((prev) =>
      prev.map((s) =>
        s.id === stopId ? { ...s, activities: s.activities.filter((a) => a.id !== actId) } : s
      )
    );
  };

  const addActivity = (stopId: string) => {
    if (!newActivity.name) return;
    const act: Activity = {
      id: `act-${Date.now()}`,
      name: newActivity.name,
      type: newActivity.type as Activity["type"],
      time: newActivity.time || "TBD",
      duration: newActivity.duration || "1 hour",
      cost: parseFloat(newActivity.cost) || 0,
      image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=80",
      description: "",
      rating: 4.5,
    };
    setStops((prev) =>
      prev.map((s) => (s.id === stopId ? { ...s, activities: [...s.activities, act] } : s))
    );
    setNewActivity({ name: "", time: "", cost: "", duration: "", type: "sightseeing" });
    setAddActivityOpen(null);
  };

  const addCity = (city: typeof newCityOptions[0]) => {
    const newStop: CityStop = {
      id: `stop-${Date.now()}`,
      city: city.city,
      country: city.country,
      image: city.image,
      startDate: trip.startDate,
      endDate: trip.endDate,
      activities: [],
      accommodation: "",
      accommodationCost: 0,
      transportCost: 0,
    };
    setStops((prev) => [...prev, newStop]);
    setAddCityOpen(false);
    setExpandedStop(newStop.id);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href={`/trips/${id}`} className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Itinerary Builder</h1>
              <p className="text-gray-500 text-sm">{trip.name}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                saved ? "bg-green-500 text-white" : "bg-orange-500 text-white hover:bg-orange-600"
              }`}
            >
              {saved ? <><Check className="w-4 h-4" /> Saved!</> : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Trip overview bar */}
        <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-50 mb-6 flex flex-wrap gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-orange-500" />
            <span className="font-medium">{stops.length} cities</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Star className="w-4 h-4 text-orange-500" />
            <span className="font-medium">{stops.reduce((a, s) => a + s.activities.length, 0)} activities</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-orange-500" />
            <span className="font-medium">
              {new Date(trip.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} —{" "}
              {new Date(trip.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <DollarSign className="w-4 h-4 text-orange-500" />
            <span className="font-medium">
              ${stops.reduce((a, s) => a + s.activities.reduce((b, act) => b + act.cost, 0) + s.accommodationCost + s.transportCost, 0).toLocaleString()} estimated
            </span>
          </div>
        </div>

        {/* Stops */}
        <Reorder.Group axis="y" values={stops} onReorder={setStops} className="space-y-4">
          {stops.map((stop, stopIndex) => {
            const isExpanded = expandedStop === stop.id;
            const stopTotal = stop.activities.reduce((a, act) => a + act.cost, 0) + stop.accommodationCost + stop.transportCost;

            return (
              <Reorder.Item key={stop.id} value={stop}>
                <motion.div
                  layout
                  className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden"
                >
                  {/* Stop Header */}
                  <div
                    className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                    onClick={() => toggleStop(stop.id)}
                  >
                    <div className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500" onClick={(e) => e.stopPropagation()}>
                      <GripVertical className="w-5 h-5" />
                    </div>

                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl overflow-hidden">
                        <img src={stop.image} alt={stop.city} className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center font-bold">
                        {stopIndex + 1}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900">{stop.city}</h3>
                        <span className="text-xs text-gray-400">{stop.country}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(stop.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} — {new Date(stop.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {stop.activities.length} activities
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          ${stopTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); removeStop(stop.id); }}
                        className="p-1.5 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                    </div>
                  </div>

                  {/* Stop Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 border-t border-gray-50">
                          {/* Dates & Accommodation */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 mb-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">Start Date</label>
                              <input
                                type="date"
                                defaultValue={stop.startDate}
                                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-orange-400"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">End Date</label>
                              <input
                                type="date"
                                defaultValue={stop.endDate}
                                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-orange-400"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">Accommodation</label>
                              <input
                                defaultValue={stop.accommodation}
                                placeholder="Hotel name"
                                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-orange-400"
                              />
                            </div>
                          </div>

                          {/* Activities */}
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-semibold text-gray-800 text-sm">Activities</h4>
                              <button
                                onClick={() => setAddActivityOpen(addActivityOpen === stop.id ? null : stop.id)}
                                className="flex items-center gap-1.5 text-xs text-orange-500 font-medium hover:text-orange-600"
                              >
                                <Plus className="w-3.5 h-3.5" /> Add Activity
                              </button>
                            </div>

                            {/* Add Activity Form */}
                            <AnimatePresence>
                              {addActivityOpen === stop.id && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="bg-orange-50 rounded-xl p-4 mb-3 border border-orange-100"
                                >
                                  <div className="grid grid-cols-2 gap-2 mb-2">
                                    <input
                                      value={newActivity.name}
                                      onChange={(e) => setNewActivity((p) => ({ ...p, name: e.target.value }))}
                                      placeholder="Activity name *"
                                      className="col-span-2 px-3 py-2 rounded-lg border border-orange-200 bg-white text-sm focus:outline-none focus:border-orange-400"
                                    />
                                    <input
                                      value={newActivity.time}
                                      onChange={(e) => setNewActivity((p) => ({ ...p, time: e.target.value }))}
                                      placeholder="Time (e.g. 10:00 AM)"
                                      className="px-3 py-2 rounded-lg border border-orange-200 bg-white text-sm focus:outline-none focus:border-orange-400"
                                    />
                                    <input
                                      value={newActivity.duration}
                                      onChange={(e) => setNewActivity((p) => ({ ...p, duration: e.target.value }))}
                                      placeholder="Duration (e.g. 2 hours)"
                                      className="px-3 py-2 rounded-lg border border-orange-200 bg-white text-sm focus:outline-none focus:border-orange-400"
                                    />
                                    <input
                                      type="number"
                                      value={newActivity.cost}
                                      onChange={(e) => setNewActivity((p) => ({ ...p, cost: e.target.value }))}
                                      placeholder="Cost ($)"
                                      className="px-3 py-2 rounded-lg border border-orange-200 bg-white text-sm focus:outline-none focus:border-orange-400"
                                    />
                                    <select
                                      value={newActivity.type}
                                      onChange={(e) => setNewActivity((p) => ({ ...p, type: e.target.value }))}
                                      className="px-3 py-2 rounded-lg border border-orange-200 bg-white text-sm focus:outline-none focus:border-orange-400"
                                    >
                                      {Object.keys(activityTypeIcons).map((t) => (
                                        <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                                      ))}
                                    </select>
                                  </div>
                                  <div className="flex gap-2">
                                    <button onClick={() => addActivity(stop.id)} className="flex-1 py-2 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors">
                                      Add Activity
                                    </button>
                                    <button onClick={() => setAddActivityOpen(null)} className="px-3 py-2 rounded-lg bg-white text-gray-500 text-sm hover:bg-gray-50 transition-colors">
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {/* Activity List */}
                            {stop.activities.length > 0 ? (
                              <div className="space-y-2">
                                {stop.activities.map((act) => {
                                  const TypeIcon = activityTypeIcons[act.type] || Camera;
                                  const typeColor = activityTypeColors[act.type] || "bg-gray-50 text-gray-500";
                                  return (
                                    <div key={act.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group">
                                      <div className={`w-8 h-8 rounded-lg ${typeColor} flex items-center justify-center flex-shrink-0`}>
                                        <TypeIcon className="w-4 h-4" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{act.name}</p>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                          <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" /> {act.time}</span>
                                          <span>·</span>
                                          <span>{act.duration}</span>
                                          <span>·</span>
                                          <span className="text-green-600 font-medium">${act.cost}</span>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors">
                                          <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          onClick={() => removeActivity(stop.id, act.id)}
                                          className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="text-center py-6 text-gray-400 text-sm">
                                No activities yet — add your first one above
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>

        {/* Add City */}
        <div className="mt-4">
          <button
            onClick={() => setAddCityOpen(!addCityOpen)}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed border-orange-200 text-orange-500 font-medium hover:border-orange-400 hover:bg-orange-50/50 transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Another City Stop
          </button>

          <AnimatePresence>
            {addCityOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 bg-white rounded-2xl p-5 shadow-card border border-gray-100"
              >
                <h3 className="font-bold text-gray-900 mb-4">Choose a City</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {newCityOptions.map((city) => (
                    <button
                      key={city.city}
                      onClick={() => addCity(city)}
                      className="group relative rounded-xl overflow-hidden h-24 hover:ring-2 hover:ring-orange-400 transition-all"
                    >
                      <img src={city.image} alt={city.city} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-2 left-2">
                        <p className="text-white text-xs font-bold">{city.city}</p>
                        <p className="text-white/70 text-xs">{city.country}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Actions */}
        <div className="flex gap-3 mt-6">
          <Link href={`/trips/${id}`} className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors">
            Back to Trip
          </Link>
          <button
            onClick={handleSave}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              saved ? "bg-green-500 text-white" : "bg-orange-500 text-white hover:bg-orange-600"
            }`}
          >
            {saved ? <><Check className="w-4 h-4" /> Saved!</> : "Save Itinerary"}
          </button>
          <Link href={`/trips/${id}/budget`} className="px-5 py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors">
            View Budget →
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
}