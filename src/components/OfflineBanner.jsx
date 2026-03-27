import React from 'react';
import { useOnline } from '../contexts/AppContext';
import { WifiOff, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OfflineBanner() {
  const { isOnline } = useOnline();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed top-16 left-0 right-0 z-40"
        >
          <div className="max-w-md mx-auto mx-3 mt-2">
            <div className="bg-amber-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg">
              <WifiOff size={16} />
              <div className="flex-1">
                <div className="text-sm font-semibold">You're Offline</div>
                <div className="text-xs opacity-90">Images saved locally — results when back online</div>
              </div>
              <div className="text-xs bg-amber-600 px-2 py-0.5 rounded-full font-medium">3 queued</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
