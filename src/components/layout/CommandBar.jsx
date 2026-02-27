import { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';
import { useFriday } from '../../context/FridayContext';

export default function CommandBar() {
  const { executeCommand, voice, fridayResponse } = useFriday();
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    executeCommand(input.trim());
    setInput('');
  };

  const handleVoice = () => {
    if (voice.isListening) {
      voice.stopListening();
    } else {
      voice.startListening((transcript) => {
        setInput(transcript);
        executeCommand(transcript);
        setInput('');
      });
    }
  };

  // Keyboard shortcut: Ctrl+Space for voice
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.code === 'Space') {
        e.preventDefault();
        handleVoice();
      }
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [voice.isListening]);

  return (
    <div className="shrink-0 border-t border-friday-border bg-friday-surface">
      {/* FRIDAY response display */}
      <div className="px-4 py-2 border-b border-friday-border/50">
        <pre className="text-xs text-friday-text-dim whitespace-pre-wrap font-sans leading-relaxed max-h-24 overflow-y-auto">
          {fridayResponse}
        </pre>
      </div>

      {/* Input bar */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-3">
        {voice.isSupported && (
          <button
            type="button"
            onClick={handleVoice}
            className={`relative p-2 rounded-full transition-all duration-200 cursor-pointer
              ${voice.isListening
                ? 'bg-friday-cyan/20 text-friday-cyan voice-pulse'
                : 'text-friday-text-dim hover:text-friday-cyan hover:bg-friday-surface-light'
              }`}
          >
            {voice.isListening ? <Mic size={18} /> : <MicOff size={18} />}
          </button>
        )}

        <input
          ref={inputRef}
          type="text"
          value={voice.isListening ? voice.transcript || input : input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={voice.isListening ? 'Listening...' : "Type a command... (press '/' to focus)"}
          className="flex-1 bg-friday-surface-light border border-friday-border rounded-lg px-4 py-2 text-sm text-friday-text placeholder-friday-text-dim/50 outline-none focus:border-friday-cyan/50 focus:ring-1 focus:ring-friday-cyan/25 transition-all"
        />

        <button
          type="submit"
          className="p-2 text-friday-text-dim hover:text-friday-cyan transition-colors cursor-pointer"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
