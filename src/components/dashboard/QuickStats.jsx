import { ListTodo, CheckCircle, AlertTriangle, BookOpen } from 'lucide-react';
import { useFriday } from '../../context/FridayContext';
import { calculateUrgency } from '../../utils/urgencyCalculator';
import { analyzeWeakTopics } from '../../engine/weakTopicAnalyzer';

export default function QuickStats() {
  const { tasks, completedToday, subjects, todayBlocks } = useFriday();
  const pending = tasks.filter(t => t.status !== 'done');
  const urgent = pending.filter(t => calculateUrgency(t.deadline) >= 75);
  const weakTopics = analyzeWeakTopics(subjects);

  const stats = [
    { label: 'Pending Tasks', value: pending.length, icon: ListTodo, color: 'text-friday-blue' },
    { label: 'Done Today', value: completedToday.length, icon: CheckCircle, color: 'text-friday-success' },
    { label: 'Urgent', value: urgent.length, icon: AlertTriangle, color: urgent.length > 0 ? 'text-friday-danger' : 'text-friday-text-dim' },
    { label: 'Study Blocks Today', value: todayBlocks.length, icon: BookOpen, color: 'text-friday-cyan' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map(stat => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="bg-friday-surface border border-friday-border rounded-lg p-4 card-glow animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <Icon size={16} className={stat.color} />
              <span className="text-xs text-friday-text-dim">{stat.label}</span>
            </div>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
          </div>
        );
      })}
    </div>
  );
}
