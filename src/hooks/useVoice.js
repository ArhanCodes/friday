import { useState, useCallback, useRef, useEffect } from 'react';

const VOICE_PREFS_KEY = 'friday_voice_prefs';

function loadVoicePrefs() {
  try {
    return JSON.parse(localStorage.getItem(VOICE_PREFS_KEY)) || {};
  } catch {
    return {};
  }
}

function saveVoicePrefs(prefs) {
  localStorage.setItem(VOICE_PREFS_KEY, JSON.stringify(prefs));
}

export function useVoice() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [voicePrefs, setVoicePrefs] = useState(loadVoicePrefs);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  // Load voices (they load async in some browsers)
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const supported = !!SpeechRecognition && !!window.speechSynthesis;
    setIsSupported(supported);

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const current = event.results[event.results.length - 1];
        const text = current[0].transcript;
        setTranscript(text);
        if (current.isFinal && recognitionRef.current?._onFinal) {
          recognitionRef.current._onFinal(text);
        }
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
    }

    if (window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;

      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          setAvailableVoices(voices);
        }
      };

      loadVoices();
      window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
      return () => window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    }
  }, []);

  const updateVoicePrefs = useCallback((newPrefs) => {
    setVoicePrefs(prev => {
      const merged = { ...prev, ...newPrefs };
      saveVoicePrefs(merged);
      return merged;
    });
  }, []);

  const getSelectedVoice = useCallback(() => {
    if (!synthRef.current) return null;
    const voices = synthRef.current.getVoices();
    if (!voices.length) return null;

    // If user has a saved preference, use it
    if (voicePrefs.voiceName) {
      const saved = voices.find(v => v.name === voicePrefs.voiceName);
      if (saved) return saved;
    }

    // Default: try to find a nice female English voice (FRIDAY-like)
    const preferred = voices.find(v =>
      v.name.includes('Samantha') ||
      v.name.includes('Google UK English Female') ||
      v.name.includes('Microsoft Zira') ||
      (v.lang.startsWith('en') && v.name.toLowerCase().includes('female'))
    );
    return preferred || null;
  }, [voicePrefs.voiceName]);

  const startListening = useCallback((onFinalTranscript) => {
    if (!recognitionRef.current) return;
    recognitionRef.current._onFinal = onFinalTranscript;
    try {
      recognitionRef.current.start();
      setIsListening(true);
      setTranscript('');
    } catch {
      // Already started
    }
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    setIsListening(false);
  }, []);

  const speak = useCallback((text) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = voicePrefs.rate ?? 1.0;
    utterance.pitch = voicePrefs.pitch ?? 1.0;

    const voice = getSelectedVoice();
    if (voice) utterance.voice = voice;

    synthRef.current.speak(utterance);
  }, [voicePrefs.rate, voicePrefs.pitch, getSelectedVoice]);

  const previewVoice = useCallback((voiceName, rate, pitch) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance('F.R.I.D.A.Y. online. All systems operational.');
    utterance.rate = rate ?? voicePrefs.rate ?? 1.0;
    utterance.pitch = pitch ?? voicePrefs.pitch ?? 1.0;

    const voices = synthRef.current.getVoices();
    const voice = voices.find(v => v.name === voiceName);
    if (voice) utterance.voice = voice;

    synthRef.current.speak(utterance);
  }, [voicePrefs.rate, voicePrefs.pitch]);

  const stopSpeaking = useCallback(() => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
  }, []);

  return {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    speak,
    previewVoice,
    stopSpeaking,
    availableVoices,
    voicePrefs,
    updateVoicePrefs,
    getSelectedVoice,
  };
}
