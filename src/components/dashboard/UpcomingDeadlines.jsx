import { AlertCircle } from 'lucide-react';
import { useFriday } from '../../context/FridayContext';
import { calculateUrgency, getUrgencyBg } from '../../utils/urgencyCalculator';
import UrgencyBadge from '../shared/UrgencyBadge';
import CountdownTimer from '../shared/CountdownTimer';

export default function UpcomingDeadlines() {
  const { tasks } = useFriday();

  const upcoming = tasks
    .filter(t => t.status !== 'done' && t.deadline)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 5);

  return (
    <div className="bg-friday-surface border border-friday-border rounded-lg p-4 card-glow">
      <h3 className="text-sm font-semibold text-friday-cyan mb-3 flex items-center gap-2">
        <AlertCircle size={14} />
        Upcoming Deadlines
      </h3>
      {upcoming.length === 0 ? (
        <p className="text-xs text-friday-text-dim">No deadlines set. Add tasks with deadlines to see them here.</p>
      ) : (
        <div className="space-y-2">
          {upcoming.map(task => {
            const urgency = calculateUrgency(task.deadline);
            return (
              <div
                key={task.id}
                className={`flex items-center justify-between px-3 py-2 rounded border text-xs ${getUrgencyBg(urgency)}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-friday-text truncate">{task.title}</div>
                  <UrgencyBadge deadline={task.deadline} />
                </div>
                <CountdownTimer deadline={task.deadline} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
