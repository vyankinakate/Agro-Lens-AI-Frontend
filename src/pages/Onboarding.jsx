import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Leaf, Shield, TrendingUp, Users, Star, ChevronRight, PlayCircle, Zap } from 'lucide-react';

const STATS = [
  { value: '1,200+', label: 'Diseases Detected', icon: '🦠' },
  { value: '95%', label: 'AI Accuracy', icon: '🎯' },
  { value: '50K+', label: 'Farmers Helped', icon: '👨‍🌾' },
  { value: '12', label: 'Crop Types', icon: '🌱' },
];

const FEATURES = [
  { icon: '📸', title: 'Snap Photo', desc: 'Take or upload a photo of your crop' },
  { icon: '🤖', title: 'AI Analyzes', desc: 'Our AI identifies disease in seconds' },
  { icon: '💊', title: 'Get Solution', desc: 'Receive a step-by-step treatment plan' },
];

export default function Onboarding({ onStart }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-green-500/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-teal-500/5 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen max-w-md mx-auto px-5 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-2xl float-animation">
            <Leaf size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-xl leading-tight">AgroLens AI</h1>
            <p className="text-green-400 text-sm">Smart Crop Care Platform</p>
          </div>
        </motion.div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          {/* Hero Image Mockup */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-green-700/40 to-emerald-800/40 border border-white/10 p-6 mb-6">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-green-400/20 to-emerald-500/20 border-2 border-green-400/30 flex items-center justify-center">
                  <span className="text-6xl float-animation">🌿</span>
                </div>
                {/* Scanning animation */}
                <div className="absolute inset-0 rounded-3xl border-2 border-green-400 opacity-60">
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent scan-animation" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-green-400 flex items-center justify-center shadow-lg">
                  <Zap size={14} className="text-green-900" />
                </div>
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-white text-3xl font-black mb-2">Click Photo</h2>
              <div className="flex items-center justify-center gap-2 my-2">
                <div className="h-px w-12 bg-green-500/50" />
                <ChevronRight size={20} className="text-green-400" />
                <div className="h-px w-12 bg-green-500/50" />
              </div>
              <h2 className="text-green-400 text-3xl font-black">Get Solution</h2>
            </div>
          </div>

          <p className="text-white/70 text-center text-base leading-relaxed">
            AI-powered disease detection for your crops. Get instant diagnosis and treatment plans — in your language.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-4 gap-2 mb-8"
        >
          {STATS.map((stat, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 text-center border border-white/10">
              <div className="text-xl mb-1">{stat.icon}</div>
              <div className="text-white font-bold text-sm">{stat.value}</div>
              <div className="text-white/60 text-xs leading-tight">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-3">How It Works</h3>
          <div className="flex items-center gap-2">
            {FEATURES.map((f, idx) => (
              <React.Fragment key={idx}>
                <div className="flex-1 bg-white/10 rounded-2xl p-3 text-center border border-white/10">
                  <div className="text-2xl mb-1">{f.icon}</div>
                  <div className="text-white font-semibold text-xs">{f.title}</div>
                  <div className="text-white/50 text-xs mt-0.5 leading-tight">{f.desc}</div>
                </div>
                {idx < FEATURES.length - 1 && (
                  <ChevronRight size={16} className="text-green-400 flex-shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-auto space-y-3"
        >
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onStart}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500 text-green-900 font-black text-lg shadow-2xl shadow-green-500/30 flex items-center justify-center gap-2 glow-green"
          >
            <Camera size={22} />
            Get Started — It's Free
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onStart}
            className="w-full py-3.5 rounded-2xl bg-white/10 text-white font-semibold border border-white/20 flex items-center justify-center gap-2 backdrop-blur-sm"
          >
            <PlayCircle size={18} />
            Try Demo — See It In Action
          </motion.button>

          <p className="text-center text-white/40 text-xs">
            Supports English, Hindi & Marathi • No sign-up required
          </p>
        </motion.div>
      </div>
    </div>
  );
}
