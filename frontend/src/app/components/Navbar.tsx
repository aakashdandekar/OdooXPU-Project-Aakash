"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Map,
  Compass,
  LayoutDashboard,
  Briefcase,
  User,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  Globe,
} from "lucide-react";
import { mockUser } from "@/lib/mockData";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/trips", label: "My Trips", icon: Briefcase },
  { href: "/discover/cities", label: "Discover", icon: Compass },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
          : "bg-white/90 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md group-hover:shadow-orange-200 transition-shadow">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Travel<span className="text-orange-500">oop</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(href)
                    ? "bg-orange-50 text-orange-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            <button className="p-2 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full"></span>
            </button>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <img
                  src={mockUser.avatar}
                  alt={mockUser.name}
                  className="w-8 h-8 rounded-lg object-cover"
                />
                <span className="text-sm font-medium text-gray-700">{mockUser.name.split(" ")[0]}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                  >
                    <div className="p-3 border-b border-gray-50">
                      <p className="text-sm font-semibold text-gray-900">{mockUser.name}</p>
                      <p className="text-xs text-gray-500">{mockUser.email}</p>
                    </div>
                    <div className="p-2">
                      <Link href="/profile" className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors" onClick={() => setProfileOpen(false)}>
                        <User className="w-4 h-4" /> Profile & Settings
                      </Link>
                      <Link href="/trips" className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors" onClick={() => setProfileOpen(false)}>
                        <Map className="w-4 h-4" /> My Trips
                      </Link>
                    </div>
                    <div className="p-2 border-t border-gray-50">
                      <Link href="/login" className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors">
                        Sign Out
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-50"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive(href)
                      ? "bg-orange-50 text-orange-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
              <Link href="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
                <User className="w-4 h-4" /> Profile
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}