import { useState, useMemo } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { useFriday } from '../../context/FridayContext';
import { getCalendarGrid, getMonthLabel, DAY_LABELS } from '../../utils/calendarUtils';
import { formatDateKey, formatTime } from '../../utils/dateUtils';
import DayDetailPanel from './DayDetailPanel';

export default function CalendarView() {
  const { tasks, schedule } = useFriday();
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(null);

  const weeks = useMemo(() => getCalendarGrid(currentYear, currentMonth), [currentYear, currentMonth]);

  // Build lookup maps: dateKey -> items
  const tasksByDate = useMemo(() => {
    const map = {};
    tasks.forEach(t => {
      if (!t.deadline) return;
      const key = formatDateKey(new Date(t.deadline));
      if (!map[key]) map[key] = [];
      map[key].push(t);
    });
    return map;
  }, [tasks]);

  const blocksByDate = useMemo(() => {
    const map = {};
    schedule.forEach(b => {
      if (!map[b.day]) map[b.day] = [];
      map[b.day].push(b);
    });
    return map;
  }, [schedule]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
    setSelectedDay(null);
  };

  const handleToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setSelectedDay(formatDateKey(today));
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-friday-text flex items-center gap-2">
          <CalendarDays size={20} className="text-friday-cyan" />
          Calendar
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleToday}
            className="px-3 py-1 text-xs text-friday-text-dim hover:text-friday-cyan border border-friday-border rounded-lg hover:border-friday-cyan/30 transition-all cursor-pointer"
          >
            Today
          </button>
          <button onClick={handlePrevMonth} className="p-1.5 text-friday-text-dim hover:text-friday-cyan transition-colors cursor-pointer">
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-medium text-friday-text min-w-[160px] text-center">
            {getMonthLabel(currentYear, currentMonth)}
          </span>
          <button onClick={handleNextMonth} className="p-1.5 text-friday-text-dim hover:text-friday-cyan transition-colors cursor-pointer">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-friday-surface border border-friday-border rounded-lg overflow-hidden card-glow">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-friday-border">
          {DAY_LABELS.map(day => (
            <div key={day} className="py-2.5 text-center text-xs text-friday-text-dim font-semibold uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Week rows */}
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 border-b border-friday-border/40 last:border-b-0">
            {week.map(day => {
              const dayTasks = tasksByDate[day.dateKey] || [];
              const dayBlocks = blocksByDate[day.dateKey] || [];
              const pendingTasks = dayTasks.filter(t => t.status !== 'done');
              const isSelected = selectedDay === day.dateKey;
              const totalItems = pendingTasks.length + dayBlocks.length;

              return (
                <button
                  key={day.dateKey}
                  onClick={() => setSelectedDay(isSelected ? null : day.dateKey)}
                  className={`min-h-[80px] p-1.5 text-left border-r border-friday-border/20 last:border-r-0 transition-all cursor-pointer
                    ${!day.isCurrentMonth ? 'opacity-25' : ''}
                    ${day.isToday ? 'bg-friday-cyan/5' : ''}
                    ${isSelected ? 'bg-friday-cyan/10 ring-1 ring-inset ring-friday-cyan/30' : 'hover:bg-friday-surface-light/30'}
                  `}
                >
                  {/* Day number */}
                  <div className={`text-xs font-mono mb-1 px-0.5 ${
                    day.isToday
                      ? 'text-friday-bg font-bold bg-friday-cyan rounded-full w-5 h-5 flex items-center justify-center text-[10px]'
                      : day.isCurrentMonth ? 'text-friday-text' : 'text-friday-text-dim'
                  }`}>
                    {day.date.getDate()}
                  </div>

                  {/* Items */}
                  <div className="space-y-0.5">
                    {pendingTasks.slice(0, 2).map(task => (
                      <div key={task.id} className={`text-[9px] leading-tight truncate px-1 py-0.5 rounded ${
                        task.priority === 'high' ? 'bg-friday-danger/15 text-friday-danger' :
                        task.priority === 'medium' ? 'bg-friday-warning/15 text-friday-warning' :
                        'bg-friday-blue/15 text-friday-blue'
                      }`}>
                        {task.title}
                      </div>
                    ))}
                    {dayBlocks.slice(0, Math.max(0, 3 - pendingTasks.length)).map(block => (
                      <div key={block.id} className={`text-[9px] leading-tight truncate px-1 py-0.5 rounded ${
                        block.completed ? 'bg-friday-text-dim/10 text-friday-text-dim line-through' : 'bg-friday-cyan/10 text-friday-cyan'
                      }`}>
                        {formatTime(block.startTime)} {block.title}
                      </div>
                    ))}
                    {totalItems > 3 && (
                      <div className="text-[9px] text-friday-text-dim/60 px-1">
                        +{totalItems - 3} more
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Day Detail Panel */}
      {selectedDay && (
        <DayDetailPanel
          dateKey={selectedDay}
          tasks={tasksByDate[selectedDay] || []}
          blocks={(blocksByDate[selectedDay] || []).sort((a, b) => a.startTime.localeCompare(b.startTime))}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </div>
  );
}
