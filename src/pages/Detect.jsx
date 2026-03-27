import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, X, Scan, CheckCircle, AlertTriangle, Info, Mic, Volume2, Leaf, ChevronDown, ChevronUp, Zap, RotateCcw, FlaskConical, Stethoscope, Shield, Pill, Download } from 'lucide-react';
import { mockAIAnalysis, SAMPLE_IMAGES } from '../services/mockAI';
import { predictDisease, downloadReport } from '../services/api';
import { getMockWeatherRisk } from '../services/mockWeather';
import { useLang } from '../contexts/AppContext';

const SEVERITY_CONFIG = {
  healthy: { color: 'green', label: 'Healthy', emoji: '✅', bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800', text: 'text-green-700 dark:text-green-400', badge: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400' },
  mild: { color: 'yellow', label: 'Mild', emoji: '🟡', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800', text: 'text-amber-700 dark:text-amber-400', badge: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400' },
  moderate: { color: 'orange', label: 'Moderate', emoji: '🟠', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-800', text: 'text-orange-700 dark:text-orange-400', badge: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400' },
  critical: { color: 'red', label: 'Critical', emoji: '🔴', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-300 dark:border-red-800', text: 'text-red-700 dark:text-red-400', badge: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400' },
};

function ScanAnimation({ progress }) {
  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <div className="relative w-32 h-32">
        {/* Outer rings */}
        <div className="absolute inset-0 rounded-full border-2 border-green-500/20 pulse-ring" />
        <div className="absolute inset-3 rounded-full border-2 border-green-500/30 pulse-ring" style={{ animationDelay: '0.5s' }} />
        {/* Inner circle */}
        <div className="absolute inset-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-xl">
          <Scan size={32} className="text-white" />
        </div>
        {/* Scanning line */}
        <div className="absolute inset-6 rounded-full overflow-hidden">
          <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-green-300 to-transparent scan-animation" />
        </div>
      </div>
      <div className="text-center">
        <p className="text-gray-800 dark:text-white font-semibold">AI Analyzing...</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Detecting diseases with EfficientNet</p>
      </div>
      <div className="w-48 bg-gray-200 dark:bg-slate-700 rounded-full h-2">
        <motion.div
          className="h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <p className="text-green-600 dark:text-green-400 font-bold text-lg">{progress}%</p>
    </div>
  );
}

function DiseaseResultCard({ result, onSpeak, onDownload }) {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('organic');
  const { language } = useLang();
  const config = SEVERITY_CONFIG[result.severity] || SEVERITY_CONFIG.mild;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-3xl border-2 ${config.border} ${config.bg} overflow-hidden mb-4`}
    >
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full ${config.badge}`}>
                {config.emoji} {config.label} Infection
              </span>
            </div>
            <h3 className={`text-xl font-black ${config.text}`}>{result.disease}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm italic">{result.scientific}</p>
            <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">Crop: {result.crop} {result.emoji}</p>
          </div>
          <div className="text-center ml-3">
            <div className={`text-3xl font-black ${config.text}`}>{result.confidence}%</div>
            <div className="text-xs text-gray-500">AI Confidence</div>
          </div>
        </div>

        {/* Confidence Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Detection Confidence</span>
            <span>{result.confidence}%</span>
          </div>
          <div className="h-2.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${result.confidence}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-full rounded-full ${
                result.severity === 'critical' ? 'bg-gradient-to-r from-red-400 to-red-600' :
                result.severity === 'moderate' ? 'bg-gradient-to-r from-orange-400 to-amber-500' :
                'bg-gradient-to-r from-green-400 to-emerald-500'
              }`}
            />
          </div>
        </div>

        {/* Explanation */}
        <div className="bg-white/60 dark:bg-slate-800/60 rounded-2xl p-4 mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide">🧑‍🌾 In Simple Words</span>
            <button
              onClick={() => onSpeak(language === 'hi' ? result.explanation_hi : result.explanation_en)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium"
            >
              <Volume2 size={12} /> Listen
            </button>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            {language === 'hi' ? result.explanation_hi : result.explanation_en}
          </p>
        </div>

        {/* Action Plan */}
        <div className="mb-3">
          <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Zap size={16} className="text-amber-500" /> Step-by-Step Action Plan
          </h4>
          <div className="space-y-2">
            {result.solution_steps.map((step, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    idx === 0 ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-300'
                  }`}>
                    {idx + 1}
                  </div>
                  {idx < result.solution_steps.length - 1 && (
                    <div className="w-px h-4 bg-gray-200 dark:bg-slate-600 mt-1" />
                  )}
                </div>
                <div className="pb-2">
                  <span className="text-xs font-bold text-green-600 dark:text-green-400">{step.day}: </span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{step.action}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onDownload(result)}
            className="flex-1 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold border border-blue-200 dark:border-blue-800/30 flex items-center justify-center gap-1 text-sm transition-colors hover:bg-blue-100 dark:hover:bg-blue-900/40"
          >
            <Download size={16} /> Download PDF
          </button>
          
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex-1 py-2 rounded-xl bg-gray-100 dark:bg-slate-700/50 flex items-center justify-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors hover:bg-gray-200 dark:hover:bg-slate-700"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {expanded ? 'Less Info' : 'More Solutions'}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-5 pb-5 overflow-hidden"
          >
            {/* Solution Tabs */}
            <div className="flex gap-2 mb-3">
              {['organic', 'chemical', 'prevention'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                    activeTab === tab
                      ? 'bg-green-500 text-white shadow-md'
                      : 'bg-white/50 dark:bg-slate-700/50 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {tab === 'organic' ? '🌿 Organic' : tab === 'chemical' ? '⚗️ Chemical' : '🛡️ Prevention'}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {(activeTab === 'prevention' ? result.prevention : result[activeTab]).map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2.5 bg-white/50 dark:bg-slate-700/40 rounded-xl">
                  <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const INSIGHT_TABS = [
  { key: 'causes', label: 'Causes', emoji: '🔬', icon: FlaskConical, color: 'purple' },
  { key: 'symptoms', label: 'Symptoms', emoji: '🩺', icon: Stethoscope, color: 'blue' },
  { key: 'prevention', label: 'Prevention', emoji: '🛡️', icon: Shield, color: 'green' },
  { key: 'treatment', label: 'Treatment', emoji: '💊', icon: Pill, color: 'red' },
];

const INSIGHT_COLORS = {
  purple: {
    active: 'bg-purple-500 text-white shadow-md shadow-purple-500/30',
    inactive: 'bg-white/50 dark:bg-slate-700/50 text-gray-600 dark:text-gray-300',
    item: 'bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800/30',
    icon: 'text-purple-500',
    header: 'from-purple-500 to-violet-600',
  },
  blue: {
    active: 'bg-blue-500 text-white shadow-md shadow-blue-500/30',
    inactive: 'bg-white/50 dark:bg-slate-700/50 text-gray-600 dark:text-gray-300',
    item: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/30',
    icon: 'text-blue-500',
    header: 'from-blue-500 to-cyan-600',
  },
  green: {
    active: 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30',
    inactive: 'bg-white/50 dark:bg-slate-700/50 text-gray-600 dark:text-gray-300',
    item: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/30',
    icon: 'text-emerald-500',
    header: 'from-emerald-500 to-green-600',
  },
  red: {
    active: 'bg-red-500 text-white shadow-md shadow-red-500/30',
    inactive: 'bg-white/50 dark:bg-slate-700/50 text-gray-600 dark:text-gray-300',
    item: 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800/30',
    icon: 'text-red-500',
    header: 'from-red-500 to-rose-600',
  },
};

function AIInsightsSection({ recommendations }) {
  const [activeTab, setActiveTab] = useState('causes');
  const [isOpen, setIsOpen] = useState(true);

  if (!recommendations || (!recommendations.causes && !recommendations.symptoms && !recommendations.prevention && !recommendations.treatment)) {
    return null;
  }

  const currentTab = INSIGHT_TABS.find(t => t.key === activeTab);
  const colors = INSIGHT_COLORS[currentTab?.color || 'purple'];
  const items = recommendations[activeTab] || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mb-4 rounded-3xl border border-gray-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-800 shadow-lg"
    >
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-5 py-4 flex items-center justify-between bg-gradient-to-r ${colors.header} text-white`}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">🤖</span>
          <span className="font-bold text-sm uppercase tracking-wide">AI-Powered Insights</span>
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">by Grok</span>
        </div>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4">
              {/* Tab Buttons */}
              <div className="grid grid-cols-4 gap-1.5 mb-4">
                {INSIGHT_TABS.map((tab) => {
                  const tabColors = INSIGHT_COLORS[tab.color];
                  const isActive = activeTab === tab.key;
                  const hasItems = recommendations[tab.key]?.length > 0;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      disabled={!hasItems}
                      className={`py-2.5 px-1 rounded-xl text-xs font-semibold transition-all flex flex-col items-center gap-1 ${
                        isActive ? tabColors.active : tabColors.inactive
                      } ${!hasItems ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                      <tab.icon size={16} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2"
                >
                  {items.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      className={`flex items-start gap-3 p-3 rounded-xl border ${colors.item}`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${colors.active} text-white text-xs font-bold`}>
                        {idx + 1}
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{item}</span>
                    </motion.div>
                  ))}
                  {items.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-4">No data available for this category.</p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Detect() {
  const { language } = useLang();
  const [images, setImages] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [results, setResults] = useState([]);
  const [weatherRisk, setWeatherRisk] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 3) {
      alert('Maximum 3 images allowed');
      return;
    }
    const newImages = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      result: null,
    }));
    setImages(prev => [...prev, ...newImages]);
    setResults([]);
  };

  const loadSampleImages = () => {
    const samples = SAMPLE_IMAGES.map(s => ({
      id: s.id,
      file: null,
      url: s.url,
      name: s.name,
      isSample: true,
      preloadedResult: s.disease,
      result: null,
    }));
    setImages(samples);
    setResults([]);
  };

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
    setResults([]);
  };

  const runAnalysis = async () => {
    if (images.length === 0) return;
    setScanning(true);
    setScanProgress(0);
    setResults([]);

    // Progress simulation
    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 90) { clearInterval(progressInterval); return 90; }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 500);

    try {
      const analysisPromises = images.map(img =>
        img.isSample && img.preloadedResult
          ? new Promise(resolve => setTimeout(() => resolve({ ...img.preloadedResult, timestamp: new Date().toISOString() }), 3500))
          : img.file
            ? predictDisease(img.file, language)
            : mockAIAnalysis(img.file)
      );
      const analysisResults = await Promise.all(analysisPromises);
      clearInterval(progressInterval);
      setScanProgress(100);
      setTimeout(() => {
        setResults(analysisResults);
        setScanning(false);
        setScanProgress(0);
      }, 800);
    } catch (err) {
      clearInterval(progressInterval);
      setScanning(false);
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const detectLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const risk = getMockWeatherRisk(pos.coords.latitude, pos.coords.longitude);
          setWeatherRisk(risk);
          setLocationLoading(false);
        },
        () => {
          // Use fallback mock data
          setWeatherRisk(getMockWeatherRisk(18.52, 73.85));
          setLocationLoading(false);
        }
      );
    } else {
      setWeatherRisk(getMockWeatherRisk(18.52, 73.85));
      setLocationLoading(false);
    }
  };

  const handleDownloadReport = async (result) => {
    try {
      const blob = await downloadReport(result);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `AgroLens_${result.disease.replace(/ /g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download report: ' + err.message);
    }
  };

  // Final diagnosis
  const getFinalDiagnosis = () => {
    if (results.length === 0) return null;
    const critical = results.find(r => r.severity === 'critical');
    if (critical) return { ...critical, multiImage: results.length > 1 };
    const moderate = results.find(r => r.severity === 'moderate');
    return { ...(moderate || results[0]), multiImage: results.length > 1 };
  };

  const finalDiagnosis = getFinalDiagnosis();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 page-enter">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Weather Risk Banner */}
        {!weatherRisk && (
          <motion.button
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={detectLocation}
            disabled={locationLoading}
            className="w-full mb-4 py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center gap-3 shadow-lg"
          >
            <span className="text-xl">{locationLoading ? '🔄' : '📍'}</span>
            <div className="flex-1 text-left">
              <div className="font-semibold text-sm">{locationLoading ? 'Detecting location...' : 'Check Disease Risk in Your Area'}</div>
              <div className="text-xs text-blue-100">Based on today's weather forecast</div>
            </div>
          </motion.button>
        )}

        {weatherRisk && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`mb-4 p-4 rounded-2xl border ${
              weatherRisk.risk === 'high' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' :
              weatherRisk.risk === 'medium' ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' :
              'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{weatherRisk.risk === 'high' ? '🔴' : weatherRisk.risk === 'medium' ? '🟡' : '🟢'}</span>
              <div className="flex-1">
                <p className={`font-bold text-sm ${
                  weatherRisk.risk === 'high' ? 'text-red-700 dark:text-red-400' :
                  weatherRisk.risk === 'medium' ? 'text-amber-700 dark:text-amber-400' :
                  'text-green-700 dark:text-green-400'
                }`}>{weatherRisk.alert}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{weatherRisk.reason}</p>
                <div className="flex gap-3 mt-2">
                  <span className="text-xs text-gray-500">🌡️ {weatherRisk.temp}</span>
                  <span className="text-xs text-gray-500">💧 {weatherRisk.humidity}</span>
                  <span className="text-xs text-gray-500">🌧️ {weatherRisk.rainfall}</span>
                </div>
              </div>
              <button onClick={() => setWeatherRisk(null)} className="text-gray-400">
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {/* Page Title */}
        <div className="mb-5">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">🔍 Crop Disease Detector</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Upload up to 3 photos for accurate AI diagnosis</p>
        </div>

        {/* Image Upload Area */}
        {!scanning && results.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Upload Zone */}
            <div
              onClick={() => !images.length && fileInputRef.current?.click()}
              className="relative border-2 border-dashed border-green-300 dark:border-green-700 rounded-3xl p-6 mb-4 text-center bg-green-50/50 dark:bg-green-900/10 cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />

              {images.length === 0 ? (
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center mx-auto mb-3">
                    <Upload size={28} className="text-green-600 dark:text-green-400" />
                  </div>
                  <p className="font-semibold text-gray-800 dark:text-white mb-1">Upload or Capture Photos</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Leaf, fruit, stem — up to 3 images</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {images.map((img) => (
                    <div key={img.id} className="relative">
                      <img src={img.url} alt={img.name} className="w-full h-24 object-cover rounded-2xl" />
                      <button
                        onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md"
                      >
                        <X size={12} />
                      </button>
                      {img.isSample && (
                        <div className="absolute bottom-1 left-1 right-1 bg-black/60 rounded-lg px-1 py-0.5">
                          <p className="text-white text-xs truncate text-center">{img.name}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  {images.length < 3 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                      className="h-24 rounded-2xl border-2 border-dashed border-green-300 dark:border-green-700 flex items-center justify-center bg-green-50 dark:bg-green-900/10"
                    >
                      <Upload size={20} className="text-green-500" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => fileInputRef.current?.click()}
                className="py-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300 font-semibold shadow-sm"
              >
                <Camera size={18} className="text-green-600" />
                Camera
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={loadSampleImages}
                className="py-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300 font-semibold shadow-sm"
              >
                <Zap size={18} className="text-amber-500" />
                Try Demo
              </motion.button>
            </div>

            {images.length > 0 && (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={runAnalysis}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black text-lg flex items-center justify-center gap-2 shadow-xl shadow-green-500/30 glow-green"
              >
                <Scan size={22} />
                Analyze {images.length} Image{images.length > 1 ? 's' : ''} with AI
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Scanning State */}
        <AnimatePresence>
          {scanning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg p-4"
            >
              <ScanAnimation progress={scanProgress} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {results.length > 0 && !scanning && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Final Diagnosis Banner (multi-image) */}
              {results.length > 1 && finalDiagnosis && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-4 p-4 rounded-3xl bg-gradient-to-r from-gray-900 to-slate-800 text-white shadow-xl"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Leaf size={18} className="text-green-400" />
                    <span className="text-green-400 font-bold text-sm uppercase tracking-wide">Final Diagnosis ({results.length} images combined)</span>
                  </div>
                  <h3 className="text-2xl font-black">{finalDiagnosis.disease}</h3>
                  <p className="text-gray-400 text-sm">Severity: <span className={
                    finalDiagnosis.severity === 'critical' ? 'text-red-400' :
                    finalDiagnosis.severity === 'moderate' ? 'text-amber-400' : 'text-green-400'
                  }>{finalDiagnosis.severity?.toUpperCase()}</span></p>
                  <p className="text-xs text-gray-400 mt-2">Combined confidence: {Math.round(results.reduce((acc, r) => acc + r.confidence, 0) / results.length)}% average</p>
                </motion.div>
              )}

              {/* Individual Results */}
              <div className="mb-4">
                <h2 className="font-bold text-gray-900 dark:text-white mb-3">
                  {results.length > 1 ? `${results.length} Image Analysis Results` : 'Analysis Result'}
                </h2>
                {results.map((result, idx) => (
                  <React.Fragment key={idx}>
                    <DiseaseResultCard result={result} onSpeak={speakText} onDownload={handleDownloadReport} />
                    <AIInsightsSection recommendations={result.recommendations} />
                  </React.Fragment>
                ))}
              </div>

              {/* Scan Again */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => { setImages([]); setResults([]); }}
                className="w-full py-4 rounded-2xl bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-semibold flex items-center justify-center gap-2 border border-gray-200 dark:border-slate-700"
              >
                <RotateCcw size={18} />
                Scan New Images
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
