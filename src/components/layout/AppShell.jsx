import TopBar from './TopBar';
import Sidebar from './Sidebar';
import CommandBar from './CommandBar';
import { useFriday } from '../../context/FridayContext';
import { VIEWS } from '../../utils/constants';
import DashboardView from '../dashboard/DashboardView';
import TaskListView from '../tasks/TaskListView';
import ScheduleView from '../schedule/ScheduleView';
import RevisionView from '../revision/RevisionView';
import CalendarView from '../calendar/CalendarView';

const VIEW_MAP = {
  [VIEWS.DASHBOARD]: DashboardView,
  [VIEWS.TASKS]: TaskListView,
  [VIEWS.SCHEDULE]: ScheduleView,
  [VIEWS.REVISION]: RevisionView,
  [VIEWS.CALENDAR]: CalendarView,
};

export default function AppShell() {
  const { activeView } = useFriday();
  const ActiveComponent = VIEW_MAP[activeView] || DashboardView;

  return (
    <div className="h-screen flex flex-col bg-friday-bg scanlines relative">
      <TopBar />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6 grid-bg">
          <ActiveComponent />
        </main>
      </div>
      <CommandBar />
    </div>
  );
}
