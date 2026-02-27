import { useState } from 'react';
import { Upload } from 'lucide-react';
import QuickStats from './QuickStats';
import TodaySchedule from './TodaySchedule';
import UpcomingDeadlines from './UpcomingDeadlines';
import WeakTopicAlert from './WeakTopicAlert';
import QuickImportModal from '../tasks/QuickImportModal';

export default function DashboardView() {
  const [showImport, setShowImport] = useState(false);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-friday-text">Dashboard</h2>
        <button
          onClick={() => setShowImport(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-friday-cyan/10 text-friday-cyan border border-friday-cyan/20 hover:bg-friday-cyan/20 hover:border-friday-cyan/40 transition-all cursor-pointer"
        >
          <Upload size={12} /> Quick Import
        </button>
      </div>
      <QuickStats />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TodaySchedule />
        <UpcomingDeadlines />
      </div>
      <WeakTopicAlert />
      {showImport && <QuickImportModal onClose={() => setShowImport(false)} />}
    </div>
  );
}
