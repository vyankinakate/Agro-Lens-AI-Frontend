import { useState, useRef, useCallback } from 'react';

/**
 * Custom hook for Speech Recognition and Speech Synthesis.
 * Supports multilingual input/output (en, hi, mr).
 */

const LANG_CODES = {
  en: 'en-IN',
  hi: 'hi-IN',
  mr: 'mr-IN',
};

export default function useVoice() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceError, setVoiceError] = useState(null);
  const [voiceSupported, setVoiceSupported] = useState(
    typeof window !== 'undefined' &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
  );
  const recognitionRef = useRef(null);

  /**
   * Start listening for speech input.
   * @param {string} lang - Language code: 'en', 'hi', or 'mr'
   * @param {function} onResult - Callback with (transcript, lang)
   */
  const startListening = useCallback((lang = 'en', onResult) => {
    if (!voiceSupported) {
      setVoiceError('Speech recognition is not supported in this browser.');
      return;
    }

    // Stop any existing recognition
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = LANG_CODES[lang] || 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceError(null);
      setTranscript('');
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      const currentText = finalTranscript || interimTranscript;
      setTranscript(currentText);

      if (finalTranscript) {
        onResult?.(finalTranscript.trim(), lang);
      }
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      if (event.error === 'not-allowed') {
        setVoiceError('Microphone permission denied. Please allow microphone access.');
        setVoiceSupported(false);
      } else if (event.error === 'no-speech') {
        setVoiceError('No speech detected. Please try again.');
      } else if (event.error === 'network') {
        setVoiceError('Network error. Speech recognition requires internet.');
      } else {
        setVoiceError(`Voice error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [voiceSupported]);

  /**
   * Stop listening.
   */
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      setIsListening(false);
    }
  }, []);

  /**
   * Speak text aloud using Speech Synthesis.
   * @param {string} text - Text to speak
   * @param {string} lang - Language code: 'en', 'hi', or 'mr'
   */
  const speak = useCallback((text, lang = 'en') => {
    if (!('speechSynthesis' in window) || !text) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LANG_CODES[lang] || 'en-IN';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  /**
   * Stop speaking.
   */
  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    isListening,
    isSpeaking,
    transcript,
    voiceError,
    voiceSupported,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  };
}
