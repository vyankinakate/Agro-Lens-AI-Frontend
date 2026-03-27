import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Camera, BarChart2, MessageCircle, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { path: '/detect', icon: Camera, label: 'Detect' },
  { path: '/dashboard', icon: BarChart2, label: 'History' },
  { path: '/', icon: Home, label: 'Home', special: true },
  { path: '/chat', icon: MessageCircle, label: 'Chat' },
  { path: '/resources', icon: MapPin, label: 'Shops' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-700 safe-area-pb">
      <div className="max-w-md mx-auto flex items-center justify-around px-2 h-16">
        {NAV_ITEMS.map(({ path, icon: Icon, label, special }) => {
          const isActive = location.pathname === path || (path === '/' && location.pathname === '/');
          return (
            <motion.button
              key={path}
              whileTap={{ scale: 0.85 }}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-2xl transition-all relative ${
                special
                  ? 'w-14 h-14 -mt-6 rounded-2xl shadow-lg shadow-green-500/30 ' + (isActive ? 'bg-green-600' : 'bg-green-500')
                  : isActive
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              <Icon size={special ? 24 : 20} className={special ? 'text-white' : ''} strokeWidth={isActive && !special ? 2.5 : 1.8} />
              {!special && (
                <span className={`text-xs font-medium ${isActive ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                  {label}
                </span>
              )}
              {isActive && !special && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-0.5 w-8 h-0.5 rounded-full bg-green-500"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
