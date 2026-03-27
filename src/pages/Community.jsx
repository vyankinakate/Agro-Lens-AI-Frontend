import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, Share2, BadgeCheck, MessageCircle, Plus, X } from 'lucide-react';
import { COMMUNITY_POSTS } from '../data/mockData';

export default function Community() {
  const [posts, setPosts] = useState(COMMUNITY_POSTS);
  const [liked, setLiked] = useState({});
  const [showPost, setShowPost] = useState(false);
  const [newTip, setNewTip] = useState('');
  const [newCrop, setNewCrop] = useState('');

  const toggleLike = (id) => {
    setLiked(prev => ({ ...prev, [id]: !prev[id] }));
    setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: p.likes + (liked[id] ? -1 : 1) } : p));
  };

  const submitPost = () => {
    if (!newTip.trim()) return;
    const post = {
      id: Date.now(),
      farmer: 'You',
      location: 'Your Location',
      avatar: 'YO',
      avatarColor: 'bg-indigo-500',
      crop: newCrop || 'General',
      tip: newTip,
      likes: 0,
      verified: false,
      time: 'Just now',
    };
    setPosts(prev => [post, ...prev]);
    setNewTip('');
    setNewCrop('');
    setShowPost(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 page-enter">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">👨‍🌾 Farmer Community</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Share & learn from fellow farmers</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowPost(true)}
            className="w-11 h-11 rounded-2xl bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30"
          >
            <Plus size={22} className="text-white" />
          </motion.button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { v: '50K+', l: 'Farmers', e: '👨‍🌾' },
            { v: '2.1K', l: 'Tips Shared', e: '💡' },
            { v: '98%', l: 'Helpful Rate', e: '⭐' },
          ].map((s, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-3 text-center shadow-sm border border-gray-100 dark:border-slate-700">
              <div className="text-xl">{s.e}</div>
              <div className="font-bold text-gray-900 dark:text-white">{s.v}</div>
              <div className="text-xs text-gray-400">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Add Post Modal */}
        {showPost && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-3xl p-5 mb-4 shadow-xl border border-gray-100 dark:border-slate-700"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900 dark:text-white">Share Your Tip 💡</h3>
              <button onClick={() => setShowPost(false)}>
                <X size={18} className="text-gray-400" />
              </button>
            </div>
            <input
              className="w-full mb-3 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-700 text-sm text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-slate-600 outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Crop type (e.g. Tomato, Wheat)"
              value={newCrop}
              onChange={e => setNewCrop(e.target.value)}
            />
            <textarea
              className="w-full mb-3 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-700 text-sm text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-slate-600 outline-none focus:ring-2 focus:ring-green-400 resize-none"
              placeholder="Share your farming tip or solution..."
              rows={4}
              value={newTip}
              onChange={e => setNewTip(e.target.value)}
            />
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={submitPost}
              className="w-full py-3 rounded-xl bg-green-500 text-white font-bold"
            >
              Post Your Tip 🌱
            </motion.button>
          </motion.div>
        )}

        {/* Posts Feed */}
        <div className="space-y-4">
          {posts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-slate-700"
            >
              {/* Farmer Header */}
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-11 h-11 rounded-2xl ${post.avatarColor} flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0`}>
                  {post.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 dark:text-white text-sm">{post.farmer}</span>
                    {post.verified && (
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30">
                        <BadgeCheck size={12} className="text-blue-600" />
                        <span className="text-blue-600 text-xs font-semibold">Verified Tip</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>📍 {post.location}</span>
                    <span>•</span>
                    <span>🌱 {post.crop}</span>
                    <span>•</span>
                    <span>{post.time}</span>
                  </div>
                </div>
              </div>

              {/* Tip Text */}
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">
                {post.tip}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-slate-700">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                    liked[post.id]
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  <ThumbsUp size={14} />
                  {post.likes}
                </motion.button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300">
                  <MessageCircle size={14} />
                  Reply
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 ml-auto">
                  <Share2 size={14} />
                  Share
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
