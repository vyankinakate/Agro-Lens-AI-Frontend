import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Phone, Droplets, Scissors, Shield, ChevronRight } from 'lucide-react';

const QUICK_ACTIONS = [
  { icon: '💧', title: 'Stop Irrigation', desc: 'Immediately halt watering', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' },
  { icon: '✂️', title: 'Remove Infected Parts', desc: 'Cut and burn diseased leaves', color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' },
  { icon: '🧪', title: 'Apply Fungicide', desc: 'Spray copper-based solution now', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' },
  { icon: '📱', title: 'Call Agriculture Helpline', desc: '1800-180-1551 (Free)', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' },
];

export default function EmergencyButton() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* Floating Emergency Button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowModal(true)}
        className="fixed bottom-20 right-4 z-50 w-14 h-14 rounded-full bg-red-500 shadow-2xl flex items-center justify-center emergency-pulse"
        title="Emergency Mode"
      >
        <AlertTriangle size={24} className="text-white" />
      </motion.button>

      {/* Emergency Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed bottom-0 left-0 right-0 z-70 bg-white dark:bg-slate-900 rounded-t-3xl max-h-[85vh] overflow-y-auto"
            >
              <div className="max-w-md mx-auto p-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                      <AlertTriangle size={24} className="text-red-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">🚨 Crop Emergency!</h2>
                      <p className="text-sm text-red-500">Act immediately — every hour matters</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-slate-700 flex items-center justify-center"
                  >
                    <X size={18} className="text-gray-600 dark:text-gray-300" />
                  </button>
                </div>

                {/* Alert Banner */}
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 mb-5">
                  <p className="text-red-700 dark:text-red-400 text-sm font-medium">
                    ⚠️ Do NOT wait. Follow these steps RIGHT NOW to save your crop:
                  </p>
                </div>

                {/* Quick Actions */}
                <h3 className="font-bold text-gray-900 dark:text-white mb-3">Immediate Action Steps</h3>
                <div className="space-y-3 mb-5">
                  {QUICK_ACTIONS.map((action, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-slate-800"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${action.color}`}>
                        {action.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 dark:text-white text-sm">{action.title}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{action.desc}</div>
                      </div>
                      <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-slate-600 flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-300">
                        {idx + 1}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Call Button */}
                <a href="tel:18001801551">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-4 rounded-2xl bg-red-500 text-white font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-red-500/30"
                  >
                    <Phone size={20} />
                    Call Kisan Helpline: 1800-180-1551
                  </motion.button>
                </a>

                <p className="text-center text-xs text-gray-400 mt-3">Free 24/7 agricultural helpline by Government of India</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
