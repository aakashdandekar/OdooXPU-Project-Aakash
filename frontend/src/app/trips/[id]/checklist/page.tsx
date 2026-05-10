"use client";

import { use, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  Trash2,
  RotateCcw,
  CheckCircle2,
  Circle,
  AlertCircle,
  Package,
  FileText,
  Shirt,
  Cpu,
  Droplets,
  Heart,
  Search,
} from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import { mockTrips, mockChecklist, ChecklistItem } from "@/lib/mockData";

const categoryIcons: Record<string, React.ElementType> = {
  Documents: FileText,
  Clothing: Shirt,
  Electronics: Cpu,
  Toiletries: Droplets,
  Health: Heart,
};

const categoryColors: Record<string, string> = {
  Documents: "bg-blue-50 text-blue-500",
  Clothing: "bg-pink-50 text-pink-500",
  Electronics: "bg-purple-50 text-purple-500",
  Toiletries: "bg-cyan-50 text-cyan-500",
  Health: "bg-red-50 text-red-500",
};

export default function ChecklistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const trip = mockTrips.find((t) => t.id === id) || mockTrips[0];

  const [items, setItems] = useState<ChecklistItem[]>(mockChecklist);
  const [newItem, setNewItem] = useState({ name: "", category: "Documents", essential: false });
  const [addOpen, setAddOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(items.map((i) => i.category)))];

  const toggle = (id: string) => {
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, packed: !item.packed } : item));
  };

  const remove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const reset = () => {
    setItems((prev) => prev.map((item) => ({ ...item, packed: false })));
  };

  const addItem = () => {
    if (!newItem.name.trim()) return;
    const item: ChecklistItem = {
      id: `c-${Date.now()}`,
      category: newItem.category,
      name: newItem.name,
      packed: false,
      essential: newItem.essential,
    };
    setItems((prev) => [...prev, item]);
    setNewItem({ name: "", category: "Documents", essential: false });
    setAddOpen(false);
  };

  const filtered = items.filter((item) => {
    const matchCat = activeCategory === "All" || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const grouped = categories.filter((c) => c !== "All").reduce((acc, cat) => {
    const catItems = filtered.filter((i) => i.category === cat);
    if (catItems.length > 0) acc[cat] = catItems;
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  const totalPacked = items.filter((i) => i.packed).length;
  const totalItems = items.length;
  const progress = totalItems > 0 ? (totalPacked / totalItems) * 100 : 0;

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href={`/trips/${id}`} className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Packing Checklist</h1>
              <p className="text-gray-500 text-sm">{trip.name}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={reset} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition-colors">
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
            <button onClick={() => setAddOpen(!addOpen)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add Item
            </button>
          </div>
        </div>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-card border border-gray-50 mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-bold text-gray-900">Packing Progress</h2>
              <p className="text-sm text-gray-500">{totalPacked} of {totalItems} items packed</p>
            </div>
            <div className={`text-3xl font-bold ${progress === 100 ? "text-green-500" : "text-orange-500"}`}>
              {progress.toFixed(0)}%
            </div>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8 }}
              className={`h-full rounded-full transition-colors ${progress === 100 ? "bg-green-400" : "bg-orange-400"}`}
            />
          </div>
          {progress === 100 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 mt-3 text-green-600 text-sm font-medium"
            >
              <CheckCircle2 className="w-4 h-4" />
              All packed! You're ready to go! 🎉
            </motion.div>
          )}
        </motion.div>

        {/* Add Item Form */}
        <AnimatePresence>
          {addOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-orange-50 rounded-2xl p-5 border border-orange-100 mb-6"
            >
              <h3 className="font-bold text-gray-900 mb-4">Add New Item</h3>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input
                  value={newItem.name}
                  onChange={(e) => setNewItem((p) => ({ ...p, name: e.target.value }))}
                  onKeyDown={(e) => e.key === "Enter" && addItem()}
                  placeholder="Item name"
                  className="col-span-2 px-4 py-2.5 rounded-xl border border-orange-200 bg-white text-sm focus:outline-none focus:border-orange-400"
                />
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem((p) => ({ ...p, category: e.target.value }))}
                  className="px-4 py-2.5 rounded-xl border border-orange-200 bg-white text-sm focus:outline-none focus:border-orange-400"
                >
                  {categories.filter((c) => c !== "All").map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-orange-200 bg-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newItem.essential}
                    onChange={(e) => setNewItem((p) => ({ ...p, essential: e.target.checked }))}
                    className="accent-orange-500"
                  />
                  <span className="text-sm text-gray-700">Essential item</span>
                </label>
              </div>
              <div className="flex gap-2">
                <button onClick={addItem} className="flex-1 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors">
                  Add Item
                </button>
                <button onClick={() => setAddOpen(false)} className="px-4 py-2.5 rounded-xl bg-white text-gray-500 text-sm hover:bg-gray-50 transition-colors border border-orange-200">
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search items..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-orange-400"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeCategory === cat ? "bg-orange-500 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Checklist by Category */}
        <div className="space-y-5">
          {Object.entries(grouped).map(([category, catItems]) => {
            const Icon = categoryIcons[category] || Package;
            const color = categoryColors[category] || "bg-gray-50 text-gray-500";
            const packedCount = catItems.filter((i) => i.packed).length;

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-card border border-gray-50 overflow-hidden"
              >
                <div className="flex items-center gap-3 p-4 border-b border-gray-50">
                  <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-gray-900">{category}</h3>
                  <span className="ml-auto text-sm text-gray-500">{packedCount}/{catItems.length}</span>
                </div>
                <div className="divide-y divide-gray-50">
                  {catItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50/50 transition-colors group ${item.packed ? "opacity-60" : ""}`}
                    >
                      <button onClick={() => toggle(item.id)} className="flex-shrink-0">
                        {item.packed ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-300 hover:text-orange-400 transition-colors" />
                        )}
                      </button>
                      <span className={`flex-1 text-sm ${item.packed ? "line-through text-gray-400" : "text-gray-700"}`}>
                        {item.name}
                      </span>
                      {item.essential && !item.packed && (
                        <span className="flex items-center gap-1 text-xs text-orange-500 font-medium">
                          <AlertCircle className="w-3 h-3" /> Essential
                        </span>
                      )}
                      <button
                        onClick={() => remove(item.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500">No items found</p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}