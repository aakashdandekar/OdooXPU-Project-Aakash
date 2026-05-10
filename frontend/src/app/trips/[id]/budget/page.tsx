"use client";

import { use, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  PieChart,
  BarChart2,
  Plus,
  Minus,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import PageWrapper from "@/components/PageWrapper";
import { mockBudgetBreakdown } from "@/lib/mockData";
import { useTrips } from "@/lib/tripsContext";

export default function BudgetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { trips } = useTrips();
  const trip = trips.find((t) => t.id === id) || trips[0];
  const budget = mockBudgetBreakdown;
  const [chartType, setChartType] = useState<"bar" | "pie" | "area">("bar");

  const remaining = budget.total - budget.spent;
  const percentSpent = (budget.spent / budget.total) * 100;
  const avgPerDay = budget.spent / budget.dailySpend.length;
  const isOverBudget = budget.spent > budget.total;

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-3">
          <p className="text-xs text-gray-500 mb-1">{label}</p>
          <p className="text-sm font-bold text-gray-900">${payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href={`/trips/${id}`} className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Budget Breakdown</h1>
            <p className="text-gray-500 text-sm">{trip.name}</p>
          </div>
        </div>

        {/* Over-budget warning */}
        {isOverBudget && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-100 mb-6"
          >
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-700 text-sm">Over Budget!</p>
              <p className="text-red-600 text-xs">You've exceeded your budget by ${(budget.spent - budget.total).toLocaleString()}. Consider adjusting your plans.</p>
            </div>
          </motion.div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Budget",
              value: `$${budget.total.toLocaleString()}`,
              icon: DollarSign,
              color: "bg-blue-50 text-blue-500",
              sub: "Set budget",
            },
            {
              label: "Amount Spent",
              value: `$${budget.spent.toLocaleString()}`,
              icon: TrendingUp,
              color: "bg-orange-50 text-orange-500",
              sub: `${percentSpent.toFixed(0)}% of budget`,
            },
            {
              label: "Remaining",
              value: `$${Math.abs(remaining).toLocaleString()}`,
              icon: remaining >= 0 ? TrendingDown : AlertTriangle,
              color: remaining >= 0 ? "bg-green-50 text-green-500" : "bg-red-50 text-red-500",
              sub: remaining >= 0 ? "Left to spend" : "Over budget",
            },
            {
              label: "Avg Per Day",
              value: `$${avgPerDay.toFixed(0)}`,
              icon: BarChart2,
              color: "bg-purple-50 text-purple-500",
              sub: `Over ${budget.dailySpend.length} days`,
            },
          ].map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-5 shadow-card border border-gray-50"
            >
              <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center mb-3`}>
                <card.icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-0.5">{card.value}</div>
              <div className="text-sm text-gray-500">{card.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{card.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* Overall progress */}
        <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-50 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900">Overall Budget Progress</h2>
            <span className={`text-sm font-bold ${isOverBudget ? "text-red-500" : "text-green-500"}`}>
              {percentSpent.toFixed(1)}%
            </span>
          </div>
          <div className="h-4 bg-gray-100 rounded-full overflow-hidden mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(percentSpent, 100)}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className={`h-full rounded-full ${isOverBudget ? "bg-red-400" : percentSpent > 80 ? "bg-orange-400" : "bg-green-400"}`}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>$0</span>
            <span>${budget.total.toLocaleString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Category Breakdown */}
          <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-50">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-gray-900">By Category</h2>
              <div className="flex gap-1">
                {(["bar", "pie"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setChartType(type)}
                    className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${chartType === type ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                  >
                    {type === "bar" ? <BarChart2 className="w-3.5 h-3.5" /> : <PieChart className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {chartType === "bar" ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={budget.categories} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="budget" fill="#e5e7eb" radius={[4, 4, 0, 0]} name="Budget" />
                  <Bar dataKey="spent" radius={[4, 4, 0, 0]} name="Spent">
                    {budget.categories.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <RechartsPie>
                  <Pie
                    data={budget.categories}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="spent"
                  >
                    {budget.categories.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend iconType="circle" iconSize={8} />
                  <Tooltip formatter={(value) => [`$${value}`, "Spent"]} />
                </RechartsPie>
              </ResponsiveContainer>
            )}
          </div>

          {/* Daily Spend */}
          <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-50">
            <h2 className="font-bold text-gray-900 mb-5">Daily Spending</h2>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={budget.dailySpend} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} interval={2} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="amount" stroke="#f97316" strokeWidth={2} fill="url(#spendGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Details */}
        <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-50">
          <h2 className="font-bold text-gray-900 mb-5">Category Details</h2>
          <div className="space-y-4">
            {budget.categories.map((cat) => {
              const pct = (cat.spent / cat.budget) * 100;
              const over = cat.spent > cat.budget;
              return (
                <div key={cat.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                      {over && <span className="text-xs text-red-500 font-medium bg-red-50 px-1.5 py-0.5 rounded-full">Over</span>}
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-gray-500">${cat.spent.toLocaleString()} / ${cat.budget.toLocaleString()}</span>
                      <span className={`font-semibold ${over ? "text-red-500" : "text-gray-700"}`}>{pct.toFixed(0)}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(pct, 100)}%` }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: over ? "#f87171" : cat.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}