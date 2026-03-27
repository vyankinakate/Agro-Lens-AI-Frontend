import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Mic, MicOff, Volume2, VolumeX, RotateCcw, Globe, Languages } from 'lucide-react';
import { chatWithBotMultilingual } from '../services/api';
import { useLang } from '../contexts/AppContext';
import useVoice from '../hooks/useVoice';

const LANG_LABELS = {
  en: { name: 'English', flag: '🇬🇧', greeting: "Namaste! 🌾 I'm your AI farming assistant. Ask me anything about crop diseases, pest control, fertilizers, or soil health. I'm here to help!" },
  hi: { name: 'हिंदी', flag: '🇮🇳', greeting: 'नमस्ते! 🌾 मैं आपका AI खेती सहायक हूँ। फसल की बीमारियों, कीट नियंत्रण, उर्वरक या मिट्टी के स्वास्थ्य के बारे में कुछ भी पूछें!' },
  mr: { name: 'मराठी', flag: '🇮🇳', greeting: 'नमस्कार! 🌾 मी तुमचा AI शेती सहाय्यक आहे। पिकांचे रोग, कीड नियंत्रण, खते किंवा मातीच्या आरोग्याबद्दल काहीही विचारा!' },
};

const QUICK_QUESTIONS = {
  en: [
    { emoji: '🍅', text: 'How to prevent tomato blight?' },
    { emoji: '🌾', text: 'Best fertilizer for wheat?' },
    { emoji: '🐛', text: 'Organic pest control tips' },
    { emoji: '💧', text: 'How much water do crops need?' },
    { emoji: '🌱', text: 'Soil health improvement tips' },
  ],
  hi: [
    { emoji: '🍅', text: 'टमाटर के ब्लाइट को कैसे रोकें?' },
    { emoji: '🌾', text: 'गेहूं के लिए सबसे अच्छा खाद?' },
    { emoji: '🐛', text: 'जैविक कीट नियंत्रण के उपाय' },
    { emoji: '💧', text: 'फसल को कितना पानी चाहिए?' },
    { emoji: '🌱', text: 'मिट्टी की सेहत कैसे सुधारें?' },
  ],
  mr: [
    { emoji: '🍅', text: 'टोमॅटोच्या ब्लाइटला कसे रोखावे?' },
    { emoji: '🌾', text: 'गव्हासाठी सर्वोत्तम खत?' },
    { emoji: '🐛', text: 'सेंद्रिय कीड नियंत्रण टिप्स' },
    { emoji: '💧', text: 'पिकाला किती पाणी लागते?' },
    { emoji: '🌱', text: 'मातीचे आरोग्य कसे सुधारावे?' },
  ],
};

/* ── Sub-components ─────────────────────────────────────────────────────── */

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 px-4 py-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0 shadow-md">
        <Bot size={14} className="text-white" />
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="flex items-center gap-1.5">
          {[0, 0.2, 0.4].map((delay, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-green-400"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status, lang }) {
  const listeningLabels = { en: '🎤 Listening...', hi: '🎤 सुन रहा है...', mr: '🎤 ऐकत आहे...' };
  const speakingLabels = { en: '🔊 Speaking...', hi: '🔊 बोल रहा है...', mr: '🔊 बोलत आहे...' };
  const configs = {
    listening: { bg: 'bg-red-500', text: listeningLabels[lang] || listeningLabels.en, pulse: true },
    speaking: { bg: 'bg-purple-500', text: speakingLabels[lang] || speakingLabels.en, pulse: false },
  };
  const config = configs[status];
  if (!config) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`mx-4 mb-2 px-4 py-2 rounded-2xl ${config.bg} text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-lg`}
    >
      {config.pulse && (
        <motion.div
          className="w-2.5 h-2.5 rounded-full bg-white"
          animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
      {config.text}
    </motion.div>
  );
}

function ChatBubble({ message, isUser, onSpeak, isSpeaking }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex items-end gap-2 px-4 py-1 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${
          isUser
            ? 'bg-gradient-to-br from-blue-400 to-indigo-500'
            : 'bg-gradient-to-br from-green-400 to-emerald-500'
        }`}
      >
        {isUser ? <User size={14} className="text-white" /> : <Bot size={14} className="text-white" />}
      </div>

      <div className="flex flex-col max-w-[75%]">
        <div
          className={`px-4 py-3 shadow-sm border ${
            isUser
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl rounded-br-md border-transparent'
              : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-2xl rounded-bl-md border-gray-100 dark:border-slate-700'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
        </div>
        <div className={`flex items-center gap-2 mt-1 ${isUser ? 'justify-end' : ''}`}>
          <span className={`text-xs ${isUser ? 'text-gray-400' : 'text-gray-400 dark:text-gray-500'}`}>
            {message.time}
          </span>
          {!isUser && onSpeak && (
            <button
              onClick={() => onSpeak(message.text, message.lang)}
              className={`text-xs flex items-center gap-1 px-2 py-0.5 rounded-full transition-all ${
                isSpeaking
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-500 hover:text-green-600'
              }`}
            >
              <Volume2 size={10} /> {isSpeaking ? 'Speaking' : 'Listen'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main Component ─────────────────────────────────────────────────────── */

export default function Chatbot() {
  const { language } = useLang();
  const langInfo = LANG_LABELS[language] || LANG_LABELS.en;
  const questions = QUICK_QUESTIONS[language] || QUICK_QUESTIONS.en;

  const {
    isListening, isSpeaking, transcript, voiceError, voiceSupported,
    startListening, stopListening, speak, stopSpeaking,
  } = useVoice();

  const [messages, setMessages] = useState([
    { id: 1, text: langInfo.greeting, isUser: false, time: formatTime() },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [activeStatus, setActiveStatus] = useState(null); // 'listening' | 'speaking' | null
  const [detectedLang, setDetectedLang] = useState(language);
  const messagesEndRef = useRef(null);

  function formatTime() {
    return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  // Update greeting when language changes
  useEffect(() => {
    const info = LANG_LABELS[language] || LANG_LABELS.en;
    setMessages([{ id: Date.now(), text: info.greeting, isUser: false, time: formatTime() }]);
    setDetectedLang(language);
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Update input with live transcript
  useEffect(() => {
    if (isListening && transcript) {
      setInput(transcript);
    }
  }, [transcript, isListening]);

  // Set active status
  useEffect(() => {
    if (isListening) setActiveStatus('listening');
    else if (isSpeaking) setActiveStatus('speaking');
    else setActiveStatus(null);
  }, [isListening, isSpeaking]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      text: text.trim(),
      isUser: true,
      time: formatTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Send with user's selected language — backend responds natively
      const { response, detectedLanguage } = await chatWithBotMultilingual(
        text.trim(),
        language
      );

      // Update detected language
      const responseLang = detectedLanguage || language;
      setDetectedLang(responseLang);

      const botMsg = {
        id: Date.now() + 1,
        text: response,
        isUser: false,
        time: formatTime(),
        lang: responseLang,
      };
      setMessages((prev) => [...prev, botMsg]);

      // Auto-speak response in the correct language
      if (voiceEnabled) {
        setTimeout(() => speak(response, responseLang), 300);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: language === 'hi'
            ? 'माफ कीजिए, कुछ गलत हो गया। कृपया फिर से कोशिश करें।'
            : language === 'mr'
            ? 'माफ करा, काहीतरी चुकले. कृपया पुन्हा प्रयत्न करा.'
            : "Sorry, I couldn't process that. Please try again.",
          isUser: false,
          time: formatTime(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
      // Send the captured text
      if (transcript.trim()) {
        setTimeout(() => sendMessage(transcript.trim()), 200);
      }
    } else {
      startListening(language, (finalText) => {
        // Auto-send after recognition completes
        sendMessage(finalText);
      });
    }
  };

  const handleSpeak = (text, msgLang) => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(text, msgLang || language);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 page-enter flex flex-col">
      <div className="max-w-md mx-auto w-full flex flex-col flex-1">
        {/* Header */}
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Sparkles size={22} className="text-green-500" />
                AI Farm Assistant
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1">
                <Globe size={12} />
                {langInfo.flag} {langInfo.name}
                {detectedLang !== language && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold">
                    Detected: {(LANG_LABELS[detectedLang] || LANG_LABELS.en).name}
                  </span>
                )}
                <span className="ml-0.5">{voiceEnabled ? '🔊' : '🔇'}</span>
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              {/* Voice toggle */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setVoiceEnabled(!voiceEnabled);
                  if (isSpeaking) stopSpeaking();
                }}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  voiceEnabled
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-400'
                }`}
                title={voiceEnabled ? 'Disable voice output' : 'Enable voice output'}
              >
                {voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </motion.button>
              {/* Reset */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  const info = LANG_LABELS[language] || LANG_LABELS.en;
                  setMessages([{ id: Date.now(), text: info.greeting, isUser: false, time: formatTime() }]);
                  stopSpeaking();
                }}
                className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                title="New chat"
              >
                <RotateCcw size={18} />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Active Status Banner */}
        <AnimatePresence>
          {activeStatus && <StatusBadge status={activeStatus} lang={language} />}
        </AnimatePresence>

        {/* Voice Error */}
        <AnimatePresence>
          {voiceError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mx-4 mb-2 px-4 py-2 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-xs"
            >
              ⚠️ {voiceError}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Questions */}
        {messages.length <= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 pb-3"
          >
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              {language === 'hi' ? 'त्वरित प्रश्न' : language === 'mr' ? 'जलद प्रश्न' : 'Quick Questions'}
            </p>
            <div className="flex flex-wrap gap-2">
              {questions.map((q, idx) => (
                <motion.button
                  key={idx}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => sendMessage(q.text)}
                  className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-xs font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:shadow-md hover:border-green-300 dark:hover:border-green-700 transition-all"
                >
                  {q.emoji} {q.text}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto py-2 space-y-2" style={{ minHeight: '300px' }}>
          {messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              message={msg}
              isUser={msg.isUser}
              onSpeak={!msg.isUser ? handleSpeak : null}
              isSpeaking={isSpeaking}
            />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="sticky bottom-16 px-4 py-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            {/* Mic button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleMicClick}
              disabled={isTyping}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all flex-shrink-0 ${
                isListening
                  ? 'bg-red-500 shadow-red-500/30 animate-pulse'
                  : voiceSupported
                  ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/20'
                  : 'bg-gray-200 dark:bg-slate-700 shadow-none cursor-not-allowed'
              }`}
              title={isListening ? 'Stop listening' : `Speak in ${langInfo.name}`}
            >
              {isListening ? (
                <MicOff size={18} className="text-white" />
              ) : (
                <Mic size={18} className={voiceSupported ? 'text-white' : 'text-gray-400'} />
              )}
            </motion.button>

            {/* Text input */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  isListening
                    ? language === 'hi' ? '🎤 सुन रहा हूँ...' : language === 'mr' ? '🎤 ऐकत आहे...' : '🎤 Listening...'
                    : language === 'hi' ? 'फसल, बीमारी, मिट्टी के बारे में पूछें...' : language === 'mr' ? 'पीक, रोग, माती बद्दल विचारा...' : 'Ask about crops, diseases, soil...'
                }
                className="w-full px-4 py-3 rounded-2xl bg-gray-100 dark:bg-slate-800 text-sm text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all placeholder:text-gray-400"
                disabled={isTyping || isListening}
              />
            </div>

            {/* Send button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all flex-shrink-0 ${
                input.trim() && !isTyping
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-green-500/30'
                  : 'bg-gray-200 dark:bg-slate-700 shadow-none'
              }`}
            >
              <Send
                size={18}
                className={input.trim() && !isTyping ? 'text-white' : 'text-gray-400 dark:text-gray-500'}
              />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
