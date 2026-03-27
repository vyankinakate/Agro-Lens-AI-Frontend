import React from 'react';
import { useTheme, useLang, useOnline } from '../contexts/AppContext';
import { Leaf, Moon, Sun, Wifi, WifiOff, Mic, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Header() {
  const { darkMode, setDarkMode } = useTheme();
  const { language, setLanguage } = useLang();
  const { isOnline } = useOnline();

  const langs = ['EN', 'HI', 'MR'];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-100 dark:border-slate-700">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
            <Leaf size={18} className="text-white" />
          </div>
          <div>
            <div className="font-bold text-sm text-gray-900 dark:text-white leading-tight">AgroLens AI</div>
            <div className="text-xs text-green-600 dark:text-green-400 leading-tight">Smart Crop Care</div>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Online indicator */}
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${isOnline
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}>
            {isOnline ? <Wifi size={10} /> : <WifiOff size={10} />}
            {isOnline ? 'Online' : 'Offline'}
          </div>

          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-xs px-2 py-1 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 border-0 cursor-pointer"
          >
            <option value="en">EN</option>
            <option value="hi">हिं</option>
            <option value="mr">मर</option>
          </select>

          {/* Dark Mode Toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setDarkMode(!darkMode)}
            className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </motion.button>
        </div>
      </div>
    </header>
  );
}
