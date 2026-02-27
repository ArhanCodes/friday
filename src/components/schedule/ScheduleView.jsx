import { useState } from 'react';
import { Calendar, RefreshCw, Trash2, Plus, X, Check } from 'lucide-react';
import { useFriday } from '../../context/FridayContext';
import { formatDateKey, formatDate, formatTime } from '../../utils/dateUtils';

export default function ScheduleView() {
  const { schedule, tasks, subjects, generateSchedule, completeBlock, removeBlock, addBlock, setSchedule } = useFriday();
  const [showAddForm, setShowAddForm] = useState(false);
  const [blockTitle, setBlockTitle] = useState('');
  const [blockDay, setBlockDay] = useState(formatDateKey(new Date()));
  const [blockStart, setBlockStart] = useState('09:00');
  const [blockEnd, setBlockEnd] = useState('09:45');
  const [blockType, setBlockType] = useState('study');

  const handleGenerate = () => {
    generateSchedule(tasks, subjects);
  };

  const handleClear = () => {
    setSchedule([]);
  };

  const handleAddBlock = (e) => {
    e.preventDefault();
    if (!blockTitle.trim() || !blockDay || !blockStart || !blockEnd) return;
    addBlock({
      title: blockTitle.trim(),
      type: blockType,
      day: blockDay,
      startTime: blockStart,
      endTime: blockEnd,
    });
    setBlockTitle('');
    setShowAddForm(false);
  };

  // Group schedule blocks by day
  const grouped = {};
  for (const block of schedule) {
    if (!grouped[block.day]) grouped[block.day] = [];
    grouped[block.day].push(block);
  }
  const sortedDays = Object.keys(grouped).sort();
  for (const day of sortedDays) {
    grouped[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-lg font-semibold text-friday-text flex items-center gap-2">
          <Calendar size={20} className="text-friday-cyan" />
          Study Schedule
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded border transition-all cursor-pointer ${
              showAddForm
                ? 'bg-friday-danger/10 text-friday-danger border-friday-danger/30'
                : 'bg-friday-surface text-friday-text-dim border-friday-border hover:text-friday-cyan hover:border-friday-cyan/30'
            }`}
          >
            {showAddForm ? <X size={12} /> : <Plus size={12} />}
            {showAddForm ? 'Cancel' : 'Add Block'}
          </button>
          <button
            onClick={handleClear}
            className="flex items-center gap-1 px-3 py-1.5 text-xs text-friday-text-dim hover:text-friday-danger border border-friday-border rounded transition-all cursor-pointer"
          >
            <Trash2 size={12} /> Clear
          </button>
          <button
            onClick={handleGenerate}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-friday-cyan/20 text-friday-cyan border border-friday-cyan/30 rounded hover:bg-friday-cyan/30 transition-all cursor-pointer"
          >
            <RefreshCw size={12} /> Generate Schedule
          </button>
        </div>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddBlock} className="bg-friday-surface border border-friday-cyan/30 rounded-lg p-4 animate-fade-in space-y-3">
          <div className="text-xs font-semibold text-friday-cyan mb-1">New Study Block</div>

          <input
            type="text"
            value={blockTitle}
            onChange={(e) => setBlockTitle(e.target.value)}
            placeholder="What are you studying? (e.g. Physics: Kinematics Review)"
            className="w-full bg-friday-surface-light border border-friday-border rounded px-3 py-2 text-sm text-friday-text placeholder-friday-text-dim/50 outline-none focus:border-friday-cyan/50"
            autoFocus
          />

          <div className="flex gap-3 flex-wrap">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-friday-text-dim uppercase tracking-wide">Date</label>
              <input
                type="date"
                value={blockDay}
                onChange={(e) => setBlockDay(e.target.value)}
                className="bg-friday-surface-light border border-friday-border rounded px-3 py-2 text-sm text-friday-text outline-none focus:border-friday-cyan/50 [color-scheme:dark]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-friday-text-dim uppercase tracking-wide">Start</label>
              <input
                type="time"
                value={blockStart}
                onChange={(e) => setBlockStart(e.target.value)}
                className="bg-friday-surface-light border border-friday-border rounded px-3 py-2 text-sm text-friday-text outline-none focus:border-friday-cyan/50 [color-scheme:dark]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-friday-text-dim uppercase tracking-wide">End</label>
              <input
                type="time"
                value={blockEnd}
                onChange={(e) => setBlockEnd(e.target.value)}
                className="bg-friday-surface-light border border-friday-border rounded px-3 py-2 text-sm text-friday-text outline-none focus:border-friday-cyan/50 [color-scheme:dark]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-friday-text-dim uppercase tracking-wide">Type</label>
              <select
                value={blockType}
                onChange={(e) => setBlockType(e.target.value)}
                className="bg-friday-surface-light border border-friday-border rounded px-3 py-2 text-sm text-friday-text outline-none focus:border-friday-cyan/50"
              >
                <option value="study">Study</option>
                <option value="revision">Revision</option>
                <option value="task">Task</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={!blockTitle.trim() || !blockDay || !blockStart || !blockEnd}
            className="px-4 py-2 text-xs bg-friday-cyan/20 text-friday-cyan border border-friday-cyan/30 rounded hover:bg-friday-cyan/30 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Add to Schedule
          </button>
        </form>
      )}

      {sortedDays.length === 0 && !showAddForm ? (
        <div className="text-center py-12">
          <p className="text-friday-text-dim text-sm">No schedule yet.</p>
          <p className="text-friday-text-dim/50 text-xs mt-1">Click "Add Block" to create your own or "Generate Schedule" to auto-fill from tasks & revision topics</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedDays.map(day => {
            const dayDate = new Date(day + 'T12:00:00');
            const isToday = formatDateKey(new Date()) === day;
            return (
              <div key={day} className="animate-fade-in">
                <div className={`text-xs font-semibold mb-2 ${isToday ? 'text-friday-cyan' : 'text-friday-text-dim'}`}>
                  {isToday ? 'TODAY — ' : ''}{formatDate(dayDate)}
                </div>
                <div className="space-y-1">
                  {grouped[day].map(block => (
                    <div
                      key={block.id}
                      className={`flex items-center gap-3 px-3 py-2 rounded border text-xs transition-all ${
                        block.completed
                          ? 'bg-friday-success/5 border-friday-success/20 opacity-60'
                          : block.isAutoGenerated
                            ? 'bg-friday-surface border-friday-border hover:border-friday-cyan/30'
                            : 'bg-friday-surface border-friday-cyan/20 hover:border-friday-cyan/40'
                      }`}
                    >
                      <button
                        onClick={() => completeBlock(block.id)}
                        className={`shrink-0 w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-all ${
                          block.completed
                            ? 'bg-friday-success border-friday-success text-white'
                            : 'border-friday-border hover:border-friday-cyan'
                        }`}
                      >
                        {block.completed && <Check size={10} />}
                      </button>
                      <span className="text-friday-text-dim font-mono shrink-0 w-24">
                        {formatTime(block.startTime)} - {formatTime(block.endTime)}
                      </span>
                      <span className={`flex-1 ${block.completed ? 'line-through text-friday-text-dim' : 'text-friday-text'}`}>
                        {block.title}
                      </span>
                      {!block.isAutoGenerated && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-friday-cyan/10 text-friday-cyan border border-friday-cyan/20">
                          custom
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        block.type === 'revision' ? 'bg-friday-warning/10 text-friday-warning' :
                        block.type === 'task' ? 'bg-friday-blue/10 text-friday-blue' :
                        'bg-friday-cyan/10 text-friday-cyan'
                      }`}>
                        {block.type}
                      </span>
                      <button
                        onClick={() => removeBlock(block.id)}
                        className="shrink-0 p-1 text-friday-text-dim hover:text-friday-danger transition-colors cursor-pointer"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
