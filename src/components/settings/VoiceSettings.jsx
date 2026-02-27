import { useState, useMemo } from 'react';
import { X, Volume2, Play, Square } from 'lucide-react';
import { useFriday } from '../../context/FridayContext';

export default function VoiceSettings({ onClose }) {
  const { voice } = useFriday();
  const { availableVoices, voicePrefs, updateVoicePrefs, previewVoice, stopSpeaking, getSelectedVoice } = voice;

  const selectedVoice = getSelectedVoice();
  const [selectedName, setSelectedName] = useState(selectedVoice?.name || '');
  const [rate, setRate] = useState(voicePrefs.rate ?? 1.0);
  const [pitch, setPitch] = useState(voicePrefs.pitch ?? 1.0);
  const [playing, setPlaying] = useState(false);

  // Group voices by language
  const groupedVoices = useMemo(() => {
    const groups = {};
    const englishVoices = availableVoices.filter(v => v.lang.startsWith('en'));
    const otherVoices = availableVoices.filter(v => !v.lang.startsWith('en'));

    if (englishVoices.length) groups['English'] = englishVoices;
    if (otherVoices.length) groups['Other Languages'] = otherVoices;
    return groups;
  }, [availableVoices]);

  const handlePreview = (voiceName) => {
    if (playing) {
      stopSpeaking();
      setPlaying(false);
      return;
    }
    setPlaying(true);
    previewVoice(voiceName || selectedName, rate, pitch);
    // Auto-reset playing state after approximate utterance duration
    setTimeout(() => setPlaying(false), 3000);
  };

  const handleSave = () => {
    updateVoicePrefs({ voiceName: selectedName, rate, pitch });
    onClose();
  };

  const handleReset = () => {
    setSelectedName('');
    setRate(1.0);
    setPitch(1.0);
    updateVoicePrefs({ voiceName: '', rate: 1.0, pitch: 1.0 });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        className="bg-friday-surface border border-friday-border rounded-2xl w-full max-w-lg mx-4 max-h-[85vh] flex flex-col card-glow animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-friday-border">
          <div className="flex items-center gap-3">
            <Volume2 size={20} className="text-friday-cyan" />
            <h2 className="text-lg font-semibold text-friday-text">Voice Settings</h2>
          </div>
          <button onClick={onClose} className="text-friday-text-dim hover:text-friday-text transition-colors p-1">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Voice Selection */}
          <div>
            <label className="block text-xs text-friday-text-dim uppercase tracking-wider mb-2">
              Voice
            </label>
            <div className="relative">
              <select
                value={selectedName}
                onChange={(e) => setSelectedName(e.target.value)}
                className="w-full bg-friday-bg/70 border border-friday-border rounded-lg px-4 py-3 text-friday-text text-sm appearance-none focus:outline-none focus:border-friday-cyan/50 focus:ring-1 focus:ring-friday-cyan/20 transition-all [color-scheme:dark]"
              >
                <option value="">Auto (Default Female English)</option>
                {Object.entries(groupedVoices).map(([group, voices]) => (
                  <optgroup key={group} label={group}>
                    {voices.map(v => (
                      <option key={v.name} value={v.name}>
                        {v.name} ({v.lang})
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-friday-text-dim">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                  <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" fill="none" />
                </svg>
              </div>
            </div>
            {selectedName && (
              <p className="text-xs text-friday-text-dim mt-1.5">
                {availableVoices.find(v => v.name === selectedName)?.lang || ''}
                {availableVoices.find(v => v.name === selectedName)?.localService ? ' · Local' : ' · Network'}
              </p>
            )}
          </div>

          {/* Speed */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-friday-text-dim uppercase tracking-wider">Speed</label>
              <span className="text-xs text-friday-cyan font-mono">{rate.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-friday-border rounded-full appearance-none cursor-pointer accent-friday-cyan
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-friday-cyan [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(6,182,212,0.4)]"
            />
            <div className="flex justify-between text-[10px] text-friday-text-dim/50 mt-1">
              <span>Slow</span>
              <span>Normal</span>
              <span>Fast</span>
            </div>
          </div>

          {/* Pitch */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-friday-text-dim uppercase tracking-wider">Pitch</label>
              <span className="text-xs text-friday-cyan font-mono">{pitch.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={pitch}
              onChange={(e) => setPitch(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-friday-border rounded-full appearance-none cursor-pointer accent-friday-cyan
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-friday-cyan [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(6,182,212,0.4)]"
            />
            <div className="flex justify-between text-[10px] text-friday-text-dim/50 mt-1">
              <span>Deep</span>
              <span>Normal</span>
              <span>High</span>
            </div>
          </div>

          {/* Preview */}
          <button
            onClick={() => handlePreview(selectedName)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium bg-friday-bg/70 border border-friday-border text-friday-text-dim hover:text-friday-cyan hover:border-friday-cyan/30 transition-all"
          >
            {playing ? <Square size={14} /> : <Play size={14} />}
            {playing ? 'Stop Preview' : 'Preview Voice'}
          </button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-5 border-t border-friday-border">
          <button
            onClick={handleReset}
            className="text-sm text-friday-text-dim hover:text-friday-text transition-colors"
          >
            Reset to Default
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm text-friday-text-dim hover:text-friday-text border border-friday-border hover:border-friday-text-dim/30 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-friday-cyan/10 text-friday-cyan border border-friday-cyan/30 hover:bg-friday-cyan/20 hover:border-friday-cyan/50 transition-all"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
