"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Globe,
  ArrowRight,
  Star,
  MapPin,
  Users,
  Compass,
  ChevronRight,
  Play,
  Mail,
  Search,
  TrendingUp,
  Heart,
  BookOpen,
  CheckCircle,
  Share2,
  Rss,
  Video,
  AtSign,
} from "lucide-react";
import { mockCities, mockStories, recommendedDestinations } from "@/lib/mockData";

const navLinks = ["Destinations", "Travel Tips", "Experiences", "Blog"];

const stats = [
  { value: "50K+", label: "Happy Travelers" },
  { value: "120+", label: "Countries" },
  { value: "500+", label: "Destinations" },
  { value: "4.9★", label: "App Rating" },
];

const features = [
  {
    icon: MapPin,
    title: "Smart Itinerary Builder",
    desc: "Drag-and-drop trip planning with day-by-day scheduling for every city stop.",
    color: "bg-orange-50 text-orange-500",
  },
  {
    icon: TrendingUp,
    title: "Budget Tracker",
    desc: "Real-time budget breakdown by category with visual charts and alerts.",
    color: "bg-blue-50 text-blue-500",
  },
  {
    icon: CheckCircle,
    title: "Packing Checklist",
    desc: "Smart packing lists organized by category — never forget essentials again.",
    color: "bg-green-50 text-green-500",
  },
  {
    icon: BookOpen,
    title: "Trip Journal",
    desc: "Capture memories with notes, moods, and day-by-day travel stories.",
    color: "bg-purple-50 text-purple-500",
  },
  {
    icon: Users,
    title: "Share Your Trip",
    desc: "Generate a beautiful public itinerary page to share with friends and family.",
    color: "bg-pink-50 text-pink-500",
  },
  {
    icon: Compass,
    title: "Discover Destinations",
    desc: "Explore cities with cost index, popularity scores, and curated activities.",
    color: "bg-amber-50 text-amber-500",
  },
];

const testimonials = [
  {
    name: "Maria Angelica",
    role: "Travel Blogger",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    text: "Traveloop completely changed how I plan my trips. The itinerary builder is intuitive and the budget tracker saved me from overspending in Paris!",
    rating: 5,
    trip: "European Summer Adventure",
  },
  {
    name: "James Chen",
    role: "Digital Nomad",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    text: "I've tried every travel app out there. Traveloop is the only one that actually makes planning fun. The shared itinerary feature is a game-changer.",
    rating: 5,
    trip: "Southeast Asia Loop",
  },
  {
    name: "Sofia Reyes",
    role: "Adventure Traveler",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
    text: "The packing checklist and trip notes features are so well thought out. It's like having a personal travel assistant in your pocket.",
    rating: 5,
    trip: "Patagonia Trek",
  },
];

export default function LandingPage() {
  const [activeFilter, setActiveFilter] = useState("Popular");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filters = ["Popular", "Europe", "Asia", "Americas", "Africa & Middle East", "Canada", "More"];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ── Navbar ── */}
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <span className={`text-xl font-bold transition-colors ${scrolled ? "text-gray-900" : "text-white"}`}>
              Travel<span className="text-orange-400">oop</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link}
                href="#"
                className={`text-sm font-medium transition-colors hover:text-orange-400 ${
                  scrolled ? "text-gray-600" : "text-white/90"
                }`}
              >
                {link}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className={`hidden md:block text-sm font-medium transition-colors hover:text-orange-400 ${
                scrolled ? "text-gray-600" : "text-white/90"
              }`}
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors shadow-md"
            >
              Get Started
            </Link>
          </div>
        </div>
      </motion.header>

      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=80"
            alt="Travel"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/30" />
        </div>

        {/* Floating image grid */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:grid grid-cols-2 gap-3 w-80">
          {[
            "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=300&q=80",
            "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=300&q=80",
            "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=300&q=80",
            "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=300&q=80",
          ].map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
              className={`rounded-2xl overflow-hidden shadow-2xl ${i === 0 ? "h-40" : i === 1 ? "h-32 mt-8" : i === 2 ? "h-32" : "h-40 -mt-8"}`}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/20 border border-orange-400/30 text-orange-300 text-sm font-medium mb-6">
              <Star className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
              Rated #1 Travel Planning App 2024
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Discover the{" "}
              <span className="text-orange-400">World's</span>
              <br />
              <span className="text-orange-400">Hidden</span> Wonders
            </h1>

            <p className="text-lg text-white/80 mb-8 max-w-xl leading-relaxed">
              Find the unique moments and hidden gems that truly unforgettable destinations. From rare encounters to extraordinary experiences, we help you uncover the spark that turns every trip into a cherished story.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5"
              >
                Plan Your Trip
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 backdrop-blur-sm text-white font-semibold border border-white/20 hover:bg-white/20 transition-all">
                <Play className="w-4 h-4 fill-white" />
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mt-12">
              {stats.map(({ value, label }) => (
                <div key={label}>
                  <div className="text-2xl font-bold text-white">{value}</div>
                  <div className="text-sm text-white/60">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Top Destinations ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Top Destinations</h2>
              <p className="text-gray-500">Handpicked places loved by our community</p>
            </div>
            <Link href="/discover/cities" className="hidden sm:flex items-center gap-1 text-orange-500 font-medium text-sm hover:gap-2 transition-all">
              Explore all destinations <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === f
                    ? "bg-orange-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* City grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mockCities.slice(0, 4).map((city, i) => (
              <motion.div
                key={city.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <div className={`relative rounded-2xl overflow-hidden ${i === 0 ? "h-64" : "h-48"}`}>
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <p className="text-white font-bold text-sm">{city.name}</p>
                    <p className="text-white/70 text-xs">{city.country}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/discover/cities"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-orange-200 text-orange-500 font-semibold hover:bg-orange-50 transition-colors"
            >
              Explore all destinations <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-orange-500 font-semibold text-sm uppercase tracking-wider">Everything you need</span>
              <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">Plan smarter, travel better</h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                Traveloop brings all your travel planning tools into one beautiful, easy-to-use app.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow group"
              >
                <div className={`w-12 h-12 rounded-2xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Latest Stories ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Latest Stories</h2>
              <p className="text-gray-500">Travel inspiration from our community</p>
            </div>
            <button className="hidden sm:flex items-center gap-1 text-orange-500 font-medium text-sm hover:gap-2 transition-all">
              See more stories <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockStories.map((story, i) => (
              <motion.article
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative h-48 rounded-2xl overflow-hidden mb-4">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/90 text-gray-700">
                      {story.category}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2 group-hover:text-orange-500 transition-colors">
                    {story.title}
                  </h3>
                  <p className="text-xs text-gray-400">{story.date} · {story.readTime}</p>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">{story.excerpt}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trekker's Highlights / Testimonials ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Trekker's Highlights</h2>
              <p className="text-gray-500">Real stories from real travelers</p>
            </div>
            <button className="hidden sm:flex items-center gap-1 text-orange-500 font-medium text-sm hover:gap-2 transition-all">
              See more highlights <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-white rounded-2xl p-6 shadow-card"
              >
                <div className="flex items-center gap-3 mb-4">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                  <div className="ml-auto flex">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">{t.text}</p>
                <div className="flex items-center gap-1.5 text-xs text-orange-500 font-medium">
                  <MapPin className="w-3 h-3" />
                  {t.trip}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter CTA ── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&q=80"
            alt="Travel"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/60" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Get Your Travel Inspiration<br />Straight to Your Inbox
            </h2>
            <p className="text-white/70 mb-8">
              Join 50,000+ travelers who get weekly destination guides, travel tips, and exclusive deals.
            </p>
            {subscribed ? (
              <div className="flex items-center justify-center gap-2 text-green-400 font-semibold">
                <CheckCircle className="w-5 h-5" />
                You're subscribed! Welcome to the community.
              </div>
            ) : (
              <div className="flex gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-orange-400 text-sm"
                />
                <button
                  onClick={() => { if (email) setSubscribed(true); }}
                  className="px-5 py-3 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors whitespace-nowrap"
                >
                  Subscribe
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center">
                  <Globe className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold">Travel<span className="text-orange-400">oop</span></span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Your ultimate travel planning companion. Plan, explore, and share your adventures.
              </p>
              <div className="flex gap-3">
                {[AtSign, Share2, Rss, Video].map((Icon, i) => (
                  <button key={i} className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-orange-500 hover:text-white transition-colors">
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>

            {/* Links */}
            {[
              { title: "Travel Interest", links: ["Adventure", "Honeymoon", "Family", "Solo Travel", "Backpacking"] },
              { title: "Top Destinations", links: ["Paris", "Tokyo", "Bali", "New York", "Barcelona"] },
              { title: "Quick Links", links: ["About Us", "Blog", "Careers", "Press", "Contact"] },
            ].map(({ title, links }) => (
              <div key={title}>
                <h4 className="font-semibold text-sm mb-4">{title}</h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-gray-400 text-sm hover:text-orange-400 transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Newsletter mini */}
            <div>
              <h4 className="font-semibold text-sm mb-4">Stay Updated</h4>
              <p className="text-gray-400 text-xs mb-3">Get the latest travel deals and tips.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-orange-400"
                />
                <button className="px-3 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors">
                  <Mail className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">© 2026 Traveloop. All rights reserved.</p>
            <div className="flex gap-6">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((link) => (
                <a key={link} href="#" className="text-gray-500 text-sm hover:text-orange-400 transition-colors">{link}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
