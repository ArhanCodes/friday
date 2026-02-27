import { X, Clock, ListTodo, Check } from 'lucide-react';
import { useFriday } from '../../context/FridayContext';
import { formatDate, formatTime } from '../../utils/dateUtils';

export default function DayDetailPanel({ dateKey, tasks, blocks, onClose }) {
  const { completeTask, completeBlock } = useFriday();
  const dayDate = new Date(dateKey + 'T12:00:00');

  return (
    <div className="bg-friday-surface border border-friday-border rounded-lg p-4 card-glow animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-friday-cyan">
          {formatDate(dayDate)}
        </h3>
        <button onClick={onClose} className="text-friday-text-dim hover:text-friday-text transition-colors p-1 cursor-pointer">
          <X size={16} />
        </button>
      </div>

      {tasks.length === 0 && blocks.length === 0 ? (
        <p className="text-xs text-friday-text-dim/50 py-4 text-center">Nothing scheduled for this day.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Tasks due */}
          <div>
            <h4 className="text-xs font-semibold text-friday-text-dim uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <ListTodo size={12} /> Tasks Due ({tasks.length})
            </h4>
            {tasks.length === 0 ? (
              <p className="text-xs text-friday-text-dim/50">No tasks due</p>
            ) : (
              <div className="space-y-1.5">
                {tasks.map(task => (
                  <div key={task.id} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-friday-border bg-friday-bg/50 text-xs">
                    <button
                      onClick={() => completeTask(task.id)}
                      className={`shrink-0 w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-all ${
                        task.status === 'done'
                          ? 'bg-friday-success border-friday-success text-white'
                          : 'border-friday-border hover:border-friday-cyan'
                      }`}
                    >
                      {task.status === 'done' && <Check size={10} />}
                    </button>
                    <span className={`flex-1 truncate ${task.status === 'done' ? 'line-through text-friday-text-dim' : 'text-friday-text'}`}>
                      {task.title}
                    </span>
                    {task.subject && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-friday-blue/10 text-friday-blue shrink-0">
                        {task.subject}
                      </span>
                    )}
                    <span className={`px-1.5 py-0.5 rounded text-[10px] shrink-0 ${
                      task.priority === 'high' ? 'bg-friday-danger/10 text-friday-danger' :
                      task.priority === 'medium' ? 'bg-friday-warning/10 text-friday-warning' :
                      'bg-friday-text-dim/10 text-friday-text-dim'
                    }`}>{task.priority}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Schedule blocks */}
          <div>
            <h4 className="text-xs font-semibold text-friday-text-dim uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Clock size={12} /> Schedule ({blocks.length})
            </h4>
            {blocks.length === 0 ? (
              <p className="text-xs text-friday-text-dim/50">No blocks scheduled</p>
            ) : (
              <div className="space-y-1.5">
                {blocks.map(block => (
                  <div key={block.id} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs ${
                    block.completed ? 'bg-friday-success/5 border-friday-success/20 opacity-60' : 'bg-friday-bg/50 border-friday-border'
                  }`}>
                    <button
                      onClick={() => completeBlock(block.id)}
                      className={`shrink-0 w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-all ${
                        block.completed ? 'bg-friday-success border-friday-success text-white' : 'border-friday-border hover:border-friday-cyan'
                      }`}
                    >
                      {block.completed && <Check size={10} />}
                    </button>
                    <span className="text-friday-text-dim font-mono shrink-0">
                      {formatTime(block.startTime)}
                    </span>
                    <span className={`flex-1 truncate ${block.completed ? 'line-through text-friday-text-dim' : 'text-friday-text'}`}>
                      {block.title}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] shrink-0 ${
                      block.type === 'revision' ? 'bg-friday-warning/10 text-friday-warning' :
                      block.type === 'task' ? 'bg-friday-blue/10 text-friday-blue' :
                      'bg-friday-cyan/10 text-friday-cyan'
                    }`}>{block.type}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
