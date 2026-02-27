import { useState } from 'react';
import { ListTodo, Upload } from 'lucide-react';
import { useFriday } from '../../context/FridayContext';
import TaskCard from './TaskCard';
import QuickImportModal from './QuickImportModal';

export default function TaskListView() {
  const { tasks } = useFriday();
  const [filter, setFilter] = useState('pending');
  const [showImport, setShowImport] = useState(false);

  const filtered = tasks.filter(t => {
    if (filter === 'all') return true;
    if (filter === 'pending') return t.status !== 'done';
    if (filter === 'done') return t.status === 'done';
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (a.status === 'done' && b.status !== 'done') return 1;
    if (a.status !== 'done' && b.status === 'done') return -1;
    if (a.deadline && b.deadline) return new Date(a.deadline) - new Date(b.deadline);
    if (a.deadline) return -1;
    if (b.deadline) return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-friday-text flex items-center gap-2">
          <ListTodo size={20} className="text-friday-cyan" />
          Tasks
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowImport(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-friday-cyan/10 text-friday-cyan border border-friday-cyan/20 hover:bg-friday-cyan/20 hover:border-friday-cyan/40 transition-all cursor-pointer"
          >
            <Upload size={12} /> Quick Import
          </button>
          <div className="flex gap-1">
            {['pending', 'done', 'all'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 text-xs rounded transition-all cursor-pointer ${
                  filter === f
                    ? 'bg-friday-cyan/20 text-friday-cyan'
                    : 'text-friday-text-dim hover:text-friday-text'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-friday-text-dim text-sm">No tasks yet.</p>
          <p className="text-friday-text-dim/50 text-xs mt-1">Try: "add task: review physics by Friday"</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((task, i) => (
            <div key={task.id} className="flex items-center gap-2">
              <span className="text-xs text-friday-text-dim w-6 text-right shrink-0">{i + 1}</span>
              <div className="flex-1">
                <TaskCard task={task} />
              </div>
            </div>
          ))}
        </div>
      )}

      {showImport && <QuickImportModal onClose={() => setShowImport(false)} />}
    </div>
  );
}
