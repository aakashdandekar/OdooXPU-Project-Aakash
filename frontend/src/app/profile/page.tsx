"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  MapPin,
  Edit2,
  Camera,
  Globe,
  Lock,
  Bell,
  Shield,
  Heart,
  Plane,
  Star,
  ChevronRight,
  Check,
  Save,
} from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import { useSession } from "next-auth/react";
import { useTrips } from "@/lib/tripsContext";

const settingsSections = [
  {
    title: "Account",
    items: [
      { icon: Mail, label: "Email Notifications", desc: "Trip reminders and updates", toggle: true, value: true },
      { icon: Bell, label: "Push Notifications", desc: "Real-time alerts", toggle: true, value: false },
      { icon: Globe, label: "Public Profile", desc: "Let others find your trips", toggle: true, value: true },
    ],
  },
  {
    title: "Privacy",
    items: [
      { icon: Lock, label: "Private Trips by Default", desc: "New trips start as private", toggle: true, value: false },
      { icon: Shield, label: "Two-Factor Auth", desc: "Extra security for your account", toggle: false, value: false, action: "Enable" },
    ],
  },
];

export default function ProfilePage() {
  const { data: session } = useSession();
  const { trips } = useTrips();
  const user = session?.user;

  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    location: "San Francisco, CA",
    bio: "Adventure seeker. Coffee lover. Collecting passport stamps.",
  });
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    "Email Notifications": true,
    "Push Notifications": false,
    "Public Profile": true,
    "Private Trips by Default": false,
  });

  const handleSave = () => {
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2000);
  };

  const completedTrips = trips.filter((t) => t.status === "completed").length;
  const upcomingTrips = trips.filter((t) => t.status === "upcoming").length;

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-card border border-gray-50 overflow-hidden"
            >
              {/* Cover */}
              <div className="h-24 bg-gradient-to-r from-orange-400 to-orange-600 relative">
                <button className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors">
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Avatar */}
              <div className="px-6 pb-6">
                <div className="relative -mt-10 mb-4">
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt={user.name ?? ""}
                      className="w-20 h-20 rounded-2xl border-4 border-white object-cover shadow-md"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl border-4 border-white bg-orange-500 flex items-center justify-center shadow-md">
                      <User className="w-8 h-8 text-white" />
                    </div>
                  )}
                  <button className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-md hover:bg-orange-600 transition-colors">
                    <Camera className="w-3 h-3" />
                  </button>
                </div>

                <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" /> {profile.location}
                </p>
                <p className="text-sm text-gray-600 mt-3 leading-relaxed">{profile.bio}</p>

                <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-gray-50">
                  {[
                    { value: trips.length, label: "Trips" },
                    { value: new Set(trips.flatMap((t) => t.destinations)).size, label: "Cities" },
                    { value: "4.9", label: "Rating" },
                  ].map(({ value, label }) => (
                    <div key={label} className="text-center">
                      <div className="text-xl font-bold text-gray-900">{value}</div>
                      <div className="text-xs text-gray-500">{label}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-xs text-gray-400">
                  Member since January 2023
                </div>
              </div>
            </motion.div>

            {/* Saved Destinations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-card border border-gray-50 p-5 mt-5"
            >
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Heart className="w-4 h-4 text-orange-500" /> Saved Destinations
              </h3>
              <div className="flex flex-wrap gap-2">
                {["Paris", "Kyoto", "Patagonia", "Iceland"].map((dest) => (
                  <span key={dest} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 text-orange-600 text-sm font-medium">
                    <MapPin className="w-3 h-3" /> {dest}
                  </span>
                ))}
                <button className="px-3 py-1.5 rounded-full border-2 border-dashed border-orange-200 text-orange-400 text-sm hover:border-orange-400 transition-colors">
                  + Add
                </button>
              </div>
            </motion.div>

            {/* Trip Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-card border border-gray-50 p-5 mt-5"
            >
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Plane className="w-4 h-4 text-orange-500" /> Trip Stats
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Upcoming Trips", value: upcomingTrips, color: "bg-blue-400" },
                  { label: "Completed Trips", value: completedTrips, color: "bg-green-400" },
                  { label: "Total Trips", value: trips.length, color: "bg-orange-400" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{label}</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${color}`} />
                      <span className="font-bold text-gray-900">{value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Edit Profile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-card border border-gray-50 p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-gray-900">Personal Information</h2>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => setEditing(false)} className="px-3 py-1.5 rounded-xl border border-gray-200 text-gray-500 text-sm hover:bg-gray-50 transition-colors">
                      Cancel
                    </button>
                    <button onClick={handleSave} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors">
                      <Save className="w-3.5 h-3.5" /> Save
                    </button>
                  </div>
                )}
              </div>

              {saved && (
                <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 px-3 py-2 rounded-xl mb-4">
                  <Check className="w-4 h-4" /> Profile updated successfully!
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Full Name", field: "name", icon: User },
                  { label: "Email", field: "email", icon: Mail },
                  { label: "Location", field: "location", icon: MapPin },
                ].map(({ label, field, icon: Icon }) => (
                  <div key={field}>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
                    <div className="relative">
                      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        value={profile[field as keyof typeof profile]}
                        onChange={(e) => setProfile((p) => ({ ...p, [field]: e.target.value }))}
                        disabled={!editing}
                        className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm transition-colors ${
                          editing
                            ? "border-gray-200 bg-white focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/10"
                            : "border-transparent bg-gray-50 text-gray-700 cursor-default"
                        }`}
                      />
                    </div>
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Bio</label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                    disabled={!editing}
                    rows={3}
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm transition-colors resize-none ${
                      editing
                        ? "border-gray-200 bg-white focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/10"
                        : "border-transparent bg-gray-50 text-gray-700 cursor-default"
                    }`}
                  />
                </div>
              </div>
            </motion.div>

            {/* Settings */}
            {settingsSections.map((section, si) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + si * 0.1 }}
                className="bg-white rounded-2xl shadow-card border border-gray-50 p-6"
              >
                <h2 className="font-bold text-gray-900 mb-4">{section.title}</h2>
                <div className="space-y-4">
                  {section.items.map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center">
                          <item.icon className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.label}</p>
                          <p className="text-xs text-gray-500">{item.desc}</p>
                        </div>
                      </div>
                      {item.toggle ? (
                        <button
                          onClick={() => setToggles((p) => ({ ...p, [item.label]: !p[item.label] }))}
                          className={`relative w-11 h-6 rounded-full transition-colors ${
                            toggles[item.label] ? "bg-orange-500" : "bg-gray-200"
                          }`}
                        >
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                            toggles[item.label] ? "translate-x-6" : "translate-x-1"
                          }`} />
                        </button>
                      ) : (
                        <button className="text-xs text-orange-500 font-medium hover:text-orange-600">
                          {item.action}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}

            {/* Danger Zone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-card border border-red-50 p-6"
            >
              <h2 className="font-bold text-red-600 mb-4">Danger Zone</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Delete Account</p>
                  <p className="text-xs text-gray-500">Permanently delete your account and all data</p>
                </div>
                <button className="px-4 py-2 rounded-xl border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition-colors">
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
