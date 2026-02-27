import { Check, Trash2, Clock } from 'lucide-react';
import { useFriday } from '../../context/FridayContext';
import UrgencyBadge from '../shared/UrgencyBadge';
import { formatDate } from '../../utils/dateUtils';

const PRIORITY_STYLES = {
  high: 'border-l-friday-danger',
  medium: 'border-l-friday-warning',
  low: 'border-l-friday-text-dim',
};

export default function TaskCard({ task }) {
  const { completeTask, deleteTask } = useFriday();
  const isDone = task.status === 'done';

  return (
    <div className={`bg-friday-surface border border-friday-border rounded-lg p-4 card-glow border-l-2 ${PRIORITY_STYLES[task.priority]} transition-all animate-fade-in ${isDone ? 'opacity-50' : ''}`}>
      <div className="flex items-start gap-3">
        <button
          onClick={() => completeTask(task.id)}
          className={`shrink-0 w-5 h-5 mt-0.5 rounded border flex items-center justify-center cursor-pointer transition-all ${
            isDone
              ? 'bg-friday-success border-friday-success text-white'
              : 'border-friday-border hover:border-friday-cyan'
          }`}
        >
          {isDone && <Check size={12} />}
        </button>

        <div className="flex-1 min-w-0">
          <div className={`text-sm font-medium ${isDone ? 'line-through text-friday-text-dim' : 'text-friday-text'}`}>
            {task.title}
          </div>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            {task.subject && (
              <span className="text-xs px-2 py-0.5 bg-friday-blue/10 text-friday-blue rounded">{task.subject}</span>
            )}
            <span className={`text-xs px-2 py-0.5 rounded ${
              task.priority === 'high' ? 'bg-friday-danger/10 text-friday-danger' :
              task.priority === 'low' ? 'bg-friday-text-dim/10 text-friday-text-dim' :
              'bg-friday-warning/10 text-friday-warning'
            }`}>
              {task.priority}
            </span>
            {task.deadline && (
              <div className="flex items-center gap-1">
                <Clock size={10} className="text-friday-text-dim" />
                <UrgencyBadge deadline={task.deadline} />
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => deleteTask(task.id)}
          className="shrink-0 p-1 text-friday-text-dim hover:text-friday-danger transition-colors cursor-pointer"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
