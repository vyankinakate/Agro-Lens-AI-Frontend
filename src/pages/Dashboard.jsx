import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, AlertCircle, CheckCircle, Clock, BarChart2, Leaf } from 'lucide-react';
import { HEALTH_HISTORY } from '../data/mockData';

const SEVERITY_COLORS = {
  healthy: { dot: 'bg-green-500', text: 'text-green-600 dark:text-green-400', badge: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' },
  mild: { dot: 'bg-amber-400', text: 'text-amber-600 dark:text-amber-400', badge: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' },
  moderate: { dot: 'bg-orange-500', text: 'text-orange-600 dark:text-orange-400', badge: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' },
  critical: { dot: 'bg-red-500', text: 'text-red-600 dark:text-red-400', badge: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' },
};

const STATS = [
  { label: 'Total Scans', value: '5', icon: '📸', sub: 'this month' },
  { label: 'Diseases Found', value: '4', icon: '🦠', sub: '80% detection rate' },
  { label: 'Avg Confidence', value: '91%', icon: '🎯', sub: 'AI accuracy' },
  { label: 'Crops Saved', value: '3', icon: '🌱', sub: 'with treatment' },
];

const INSIGHTS = [
  { icon: '📊', title: 'Pattern Detected', desc: 'Tomato Early Blight recurring — consider crop rotation next season', color: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' },
  { icon: '🌦️', title: 'Weather Warning', desc: 'Post-monsoon humidity increases fungal disease risk by 40%', color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' },
  { icon: '✅', title: 'Good News', desc: 'Your Rice crop fully recovered from Leaf Blast — treatment was effective!', color: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' },
];

export default function Dashboard() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const filters = ['all', 'critical', 'moderate', 'mild', 'healthy'];

  const filtered = selectedFilter === 'all' ? HEALTH_HISTORY : HEALTH_HISTORY.filter(h => h.severity === selectedFilter);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 page-enter">
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="mb-5">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">📊 Crop Health Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Your field history and insights</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {STATS.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-slate-700"
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-black text-gray-900 dark:text-white">{stat.value}</div>
              <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">{stat.label}</div>
              <div className="text-xs text-gray-400 dark:text-gray-500">{stat.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* AI Insights */}
        <div className="mb-6">
          <h2 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <TrendingUp size={18} className="text-green-500" /> AI Insights
          </h2>
          <div className="space-y-2">
            {INSIGHTS.map((insight, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
                className={`p-4 rounded-2xl border ${insight.color}`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">{insight.icon}</span>
                  <div>
                    <div className="font-semibold text-sm text-gray-900 dark:text-white">{insight.title}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{insight.desc}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar size={18} className="text-green-500" /> Scan History
            </h2>
          </div>

          {/* Filter Chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setSelectedFilter(f)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
                  selectedFilter === f
                    ? 'bg-green-500 text-white shadow-md'
                    : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-slate-700'
                }`}
              >
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-slate-700" />

            <div className="space-y-4">
              {filtered.map((entry, idx) => {
                const colors = SEVERITY_COLORS[entry.severity] || SEVERITY_COLORS.mild;
                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex gap-4 relative"
                  >
                    {/* Timeline dot */}
                    <div className={`w-10 h-10 rounded-full ${colors.dot} flex items-center justify-center flex-shrink-0 shadow-md z-10`}>
                      {entry.severity === 'healthy' ? <Leaf size={16} className="text-white" /> :
                       entry.severity === 'critical' ? <AlertCircle size={16} className="text-white" /> :
                       <Clock size={16} className="text-white" />}
                    </div>

                    {/* Card */}
                    <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-slate-700 mb-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white text-sm">{entry.disease}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Crop: {entry.crop}</div>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${colors.badge}`}>
                          {entry.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">{entry.date}</span>
                        <div className="flex items-center gap-1">
                          <div className="w-16 bg-gray-200 dark:bg-slate-700 rounded-full h-1.5">
                            <div
                              className="h-1.5 rounded-full bg-green-500"
                              style={{ width: `${entry.confidence}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">{entry.confidence}%</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
