import { Clock, Check } from 'lucide-react';
import { useFriday } from '../../context/FridayContext';
import { formatTime } from '../../utils/dateUtils';

export default function TodaySchedule() {
  const { todayBlocks, completeBlock } = useFriday();

  return (
    <div className="bg-friday-surface border border-friday-border rounded-lg p-4 card-glow">
      <h3 className="text-sm font-semibold text-friday-cyan mb-3 flex items-center gap-2">
        <Clock size={14} />
        Today's Schedule
      </h3>
      {todayBlocks.length === 0 ? (
        <p className="text-xs text-friday-text-dim">No study blocks scheduled for today. Try 'generate schedule'.</p>
      ) : (
        <div className="space-y-2">
          {todayBlocks.map(block => (
            <div
              key={block.id}
              className={`flex items-center gap-3 px-3 py-2 rounded border text-xs transition-all ${
                block.completed
                  ? 'bg-friday-success/5 border-friday-success/20 opacity-60'
                  : 'bg-friday-surface-light border-friday-border hover:border-friday-cyan/30'
              }`}
            >
              <button
                onClick={() => completeBlock(block.id)}
                className={`shrink-0 w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-all ${
                  block.completed
                    ? 'bg-friday-success border-friday-success text-white'
                    : 'border-friday-border hover:border-friday-cyan'
                }`}
              >
                {block.completed && <Check size={12} />}
              </button>
              <span className="text-friday-text-dim font-mono shrink-0">
                {formatTime(block.startTime)}
              </span>
              <span className={`flex-1 ${block.completed ? 'line-through text-friday-text-dim' : 'text-friday-text'}`}>
                {block.title}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] ${
                block.type === 'revision' ? 'bg-friday-warning/10 text-friday-warning' :
                block.type === 'task' ? 'bg-friday-blue/10 text-friday-blue' :
                'bg-friday-cyan/10 text-friday-cyan'
              }`}>
                {block.type}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
