import { useState } from 'react';
import { BookOpen, Plus, X } from 'lucide-react';
import { useFriday } from '../../context/FridayContext';
import SubjectCard from './SubjectCard';

const SUBJECT_COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#f97316'];

export default function RevisionView() {
  const { subjects, addSubject } = useFriday();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newExamType, setNewExamType] = useState('alevel');
  const [newColor, setNewColor] = useState(SUBJECT_COLORS[0]);

  const satSubjects = subjects.filter(s => s.examType === 'sat');
  const alevelSubjects = subjects.filter(s => s.examType === 'alevel');
  const generalSubjects = subjects.filter(s => s.examType === 'general');

  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    addSubject({ subjectName: newName.trim(), examType: newExamType, color: newColor });
    setNewName('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-friday-text flex items-center gap-2">
          <BookOpen size={20} className="text-friday-cyan" />
          Revision Tracker
        </h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded border transition-all cursor-pointer ${
            showAddForm
              ? 'bg-friday-danger/10 text-friday-danger border-friday-danger/30 hover:bg-friday-danger/20'
              : 'bg-friday-cyan/20 text-friday-cyan border-friday-cyan/30 hover:bg-friday-cyan/30'
          }`}
        >
          {showAddForm ? <X size={12} /> : <Plus size={12} />}
          {showAddForm ? 'Cancel' : 'Add Subject'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddSubject} className="bg-friday-surface border border-friday-cyan/30 rounded-lg p-4 animate-fade-in space-y-3">
          <div className="text-xs font-semibold text-friday-cyan mb-1">New Subject</div>

          <div className="flex gap-3">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Subject name (e.g. Further Maths)"
              className="flex-1 bg-friday-surface-light border border-friday-border rounded px-3 py-2 text-sm text-friday-text placeholder-friday-text-dim/50 outline-none focus:border-friday-cyan/50"
              autoFocus
            />

            <select
              value={newExamType}
              onChange={(e) => setNewExamType(e.target.value)}
              className="bg-friday-surface-light border border-friday-border rounded px-3 py-2 text-sm text-friday-text outline-none focus:border-friday-cyan/50"
            >
              <option value="alevel">A-Level</option>
              <option value="sat">SAT</option>
              <option value="general">General</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-friday-text-dim">Color:</span>
            {SUBJECT_COLORS.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => setNewColor(color)}
                className={`w-6 h-6 rounded-full cursor-pointer transition-all border-2 ${
                  newColor === color ? 'border-white scale-110' : 'border-transparent hover:scale-110'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={!newName.trim()}
            className="px-4 py-2 text-xs bg-friday-cyan/20 text-friday-cyan border border-friday-cyan/30 rounded hover:bg-friday-cyan/30 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Create Subject
          </button>
        </form>
      )}

      {satSubjects.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-friday-blue uppercase tracking-wide mb-2">SAT</h3>
          <div className="space-y-2">
            {satSubjects.map(s => <SubjectCard key={s.id} subject={s} />)}
          </div>
        </div>
      )}

      {alevelSubjects.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-friday-cyan uppercase tracking-wide mb-2">A-Levels</h3>
          <div className="space-y-2">
            {alevelSubjects.map(s => <SubjectCard key={s.id} subject={s} />)}
          </div>
        </div>
      )}

      {generalSubjects.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-friday-text-dim uppercase tracking-wide mb-2">General</h3>
          <div className="space-y-2">
            {generalSubjects.map(s => <SubjectCard key={s.id} subject={s} />)}
          </div>
        </div>
      )}

      {subjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-friday-text-dim text-sm">No subjects tracked yet.</p>
          <p className="text-friday-text-dim/50 text-xs mt-1">Click "Add Subject" or type: "add subject: Physics for A-Level"</p>
        </div>
      )}
    </div>
  );
}
