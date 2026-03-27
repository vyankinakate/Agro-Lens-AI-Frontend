import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Star, MapPin, Clock, ChevronRight, Navigation, Tag } from 'lucide-react';
import { SHOPS } from '../data/mockData';

// Simple SVG map placeholder
function MapView({ shops }) {
  return (
    <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 mb-4">
      {/* Roads */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200">
        <rect width="400" height="200" fill="transparent" />
        {/* Grid roads */}
        <line x1="0" y1="100" x2="400" y2="100" stroke="#a3d9a5" strokeWidth="8" />
        <line x1="200" y1="0" x2="200" y2="200" stroke="#a3d9a5" strokeWidth="8" />
        <line x1="0" y1="50" x2="400" y2="50" stroke="#c8e6c9" strokeWidth="4" />
        <line x1="0" y1="150" x2="400" y2="150" stroke="#c8e6c9" strokeWidth="4" />
        <line x1="100" y1="0" x2="100" y2="200" stroke="#c8e6c9" strokeWidth="4" />
        <line x1="300" y1="0" x2="300" y2="200" stroke="#c8e6c9" strokeWidth="4" />
        
        {/* Your location */}
        <circle cx="200" cy="100" r="12" fill="#22c55e" stroke="white" strokeWidth="3" />
        <circle cx="200" cy="100" r="6" fill="white" />
        
        {/* Shop pins */}
        <circle cx="130" cy="70" r="8" fill={shops[0].best ? "#f59e0b" : "#6b7280"} stroke="white" strokeWidth="2" />
        <text x="130" y="74" fontSize="8" fill="white" textAnchor="middle">1</text>
        
        <circle cx="255" cy="75" r="8" fill="#6b7280" stroke="white" strokeWidth="2" />
        <text x="255" y="79" fontSize="8" fill="white" textAnchor="middle">2</text>
        
        <circle cx="310" cy="140" r="8" fill="#6b7280" stroke="white" strokeWidth="2" />
        <text x="310" y="144" fontSize="8" fill="white" textAnchor="middle">3</text>
        
        <circle cx="80" cy="148" r="8" fill="#6b7280" stroke="white" strokeWidth="2" />
        <text x="80" y="152" fontSize="8" fill="white" textAnchor="middle">4</text>
      </svg>
      
      {/* Map overlay text */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
        <span className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-xs font-medium text-gray-700 dark:text-gray-300 px-2 py-1 rounded-lg">
          📍 Near you — 4 shops found
        </span>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white/80 dark:bg-slate-800/80 px-2 py-1 rounded-lg">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-xs text-gray-600 dark:text-gray-400">You</span>
          </div>
          <div className="flex items-center gap-1 bg-white/80 dark:bg-slate-800/80 px-2 py-1 rounded-lg">
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Best</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Resources() {
  const [calling, setCalling] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 page-enter">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">🏪 Nearby Agri Shops</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Find fertilizers, pesticides & more near you</p>
        </div>

        {/* Map */}
        <MapView shops={SHOPS} />

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { v: '4', l: 'Shops Found', e: '🏪' },
            { v: '3', l: 'Open Now', e: '✅' },
            { v: '0.8km', l: 'Nearest', e: '📍' },
          ].map((s, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-3 text-center shadow-sm border border-gray-100 dark:border-slate-700">
              <div className="text-xl">{s.e}</div>
              <div className="font-bold text-gray-900 dark:text-white text-sm">{s.v}</div>
              <div className="text-xs text-gray-400">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Shop List */}
        <div className="space-y-3">
          {SHOPS.map((shop, idx) => (
            <motion.div
              key={shop.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-slate-700"
            >
              <div className="flex items-start gap-3">
                {/* Number */}
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-md ${
                  shop.best ? 'bg-amber-400 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
                }`}>
                  {idx + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm">{shop.name}</h3>
                        {shop.best && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1">
                            <Tag size={10} /> Best
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                        <MapPin size={10} /> {shop.address}
                      </div>
                    </div>
                    <div className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
                      shop.open
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    }`}>
                      {shop.open ? '🟢 Open' : '🔴 Closed'}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-1">
                      <Star size={11} className="text-amber-400 fill-amber-400" />
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{shop.rating}</span>
                    </div>
                    <span className="text-xs text-gray-400">•</span>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Navigation size={10} /> {shop.distance}
                    </div>
                    {shop.discount && (
                      <>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">{shop.discount}</span>
                      </>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">🛒 {shop.speciality}</p>

                  <div className="flex gap-2">
                    <a
                      href={`tel:${shop.phone}`}
                      className="flex-1 py-2 rounded-xl bg-green-500 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-mg"
                    >
                      <Phone size={12} /> Call Now
                    </a>
                    <button className="flex-1 py-2 rounded-xl bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 text-xs font-semibold flex items-center justify-center gap-1">
                      <Navigation size={12} /> Directions
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Government Helpline */}
        <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white">
          <h3 className="font-bold mb-1 flex items-center gap-2">📞 Kisan Call Centre</h3>
          <p className="text-sm text-green-100 mb-3">Free agricultural advice — Government of India</p>
          <a href="tel:18001801551">
            <button className="w-full py-2.5 rounded-xl bg-white text-green-700 font-bold text-sm">
              Call 1800-180-1551 (Toll Free)
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
