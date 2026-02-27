import { LayoutDashboard, ListTodo, Calendar, BookOpen, CalendarDays } from 'lucide-react';
import { useFriday } from '../../context/FridayContext';
import { VIEWS } from '../../utils/constants';

const NAV_ITEMS = [
  { id: VIEWS.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { id: VIEWS.TASKS, label: 'Tasks', icon: ListTodo },
  { id: VIEWS.SCHEDULE, label: 'Schedule', icon: Calendar },
  { id: VIEWS.CALENDAR, label: 'Calendar', icon: CalendarDays },
  { id: VIEWS.REVISION, label: 'Revision', icon: BookOpen },
];

export default function Sidebar() {
  const { activeView, setActiveView } = useFriday();

  return (
    <div className="w-16 hover:w-48 transition-all duration-300 bg-friday-surface border-r border-friday-border flex flex-col py-4 group shrink-0 overflow-hidden">
      {NAV_ITEMS.map(item => {
        const Icon = item.icon;
        const isActive = activeView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`flex items-center gap-3 px-5 py-3 text-sm transition-all duration-200 cursor-pointer
              ${isActive
                ? 'text-friday-cyan bg-friday-cyan/10 border-l-2 border-friday-cyan'
                : 'text-friday-text-dim hover:text-friday-text hover:bg-friday-surface-light border-l-2 border-transparent'
              }`}
          >
            <Icon size={20} className="shrink-0" />
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
