import { useState, useEffect } from 'react';
import { Activity, LogOut, User, Volume2 } from 'lucide-react';
import { useFriday } from '../../context/FridayContext';
import VoiceSettings from '../settings/VoiceSettings';

export default function TopBar() {
  const { fridayResponse, user, onLogout } = useFriday();
  const [time, setTime] = useState(new Date());
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div className="h-12 bg-friday-surface border-b border-friday-border flex items-center px-4 gap-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-friday-cyan animate-pulse" />
          <span className="text-friday-cyan font-semibold text-sm tracking-widest">F.R.I.D.A.Y.</span>
        </div>

        <div className="flex-1 flex items-center gap-2 px-4">
          <Activity size={14} className="text-friday-text-dim" />
          <span className="text-friday-text-dim text-xs truncate max-w-xl">
            {fridayResponse?.split('\n')[0]?.slice(0, 80)}
          </span>
        </div>

        {user && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-friday-text-dim">
              <User size={12} className="text-friday-cyan" />
              <span>{user.name}</span>
            </div>
            <button
              onClick={() => setShowVoiceSettings(true)}
              className="flex items-center gap-1 text-xs text-friday-text-dim hover:text-friday-cyan transition-colors px-2 py-1 rounded hover:bg-friday-cyan/10"
              title="Voice settings"
            >
              <Volume2 size={12} />
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-1 text-xs text-friday-text-dim hover:text-friday-danger transition-colors px-2 py-1 rounded hover:bg-friday-danger/10"
              title="Log out"
            >
              <LogOut size={12} />
            </button>
          </div>
        )}

        <div className="text-friday-text-dim text-xs font-mono">
          {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
      </div>

      {showVoiceSettings && (
        <VoiceSettings onClose={() => setShowVoiceSettings(false)} />
      )}
    </>
  );
}
