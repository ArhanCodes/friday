import { useState } from 'react';
import { X, Upload, Trash2 } from 'lucide-react';
import { parseImportText } from '../../engine/importParser';
import { useFriday } from '../../context/FridayContext';

const SUBJECT_OPTIONS = [
  '', 'Mathematics', 'Physics', 'Chemistry', 'Biology',
  'Economics', 'English', 'History', 'Computer Science',
];

export default function QuickImportModal({ onClose }) {
  const { addTask } = useFriday();
  const [rawText, setRawText] = useState('');
  const [parsedTasks, setParsedTasks] = useState([]);
  const [phase, setPhase] = useState('input'); // 'input' | 'preview'
  const [importedCount, setImportedCount] = useState(0);

  const handleParse = () => {
    const results = parseImportText(rawText);
    if (results.length === 0) return;
    setParsedTasks(results);
    setPhase('preview');
  };

  const handleRemoveTask = (tempId) => {
    setParsedTasks(prev => prev.filter(t => t._tempId !== tempId));
  };

  const handleEditField = (tempId, field, value) => {
    setParsedTasks(prev => prev.map(t =>
      t._tempId === tempId ? { ...t, [field]: value } : t
    ));
  };

  const handleImportAll = () => {
    let count = 0;
    for (const task of parsedTasks) {
      addTask({
        title: task.title,
        subject: task.subject,
        deadline: task.deadline,
        priority: task.priority,
      });
      count++;
    }
    setImportedCount(count);
    setPhase('done');
  };

  const handleBack = () => {
    setPhase('input');
  };

  const handleClose = () => {
    setRawText('');
    setParsedTasks([]);
    setPhase('input');
    setImportedCount(0);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={handleClose}>
      <div
        className="bg-friday-surface border border-friday-border rounded-2xl w-full max-w-2xl mx-4 max-h-[85vh] flex flex-col card-glow animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-friday-border">
          <div className="flex items-center gap-3">
            <Upload size={20} className="text-friday-cyan" />
            <h2 className="text-lg font-semibold text-friday-text">Quick Import</h2>
          </div>
          <button onClick={handleClose} className="text-friday-text-dim hover:text-friday-text transition-colors p-1 cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {phase === 'input' && (
            <>
              <p className="text-xs text-friday-text-dim">
                Paste assignment text from Teams, Google Classroom, or any portal.
                Each line becomes a task. Dates and subjects are auto-detected.
              </p>
              <textarea
                value={rawText}
                onChange={e => setRawText(e.target.value)}
                placeholder={"Complete physics worksheet by Friday\nMath homework Chapter 5 due March 3\nEssay on Romeo and Juliet - urgent\nCS project: implement sorting algorithm\nRevise chemistry organic reactions by next Monday"}
                rows={10}
                className="w-full bg-friday-bg/70 border border-friday-border rounded-lg px-4 py-3 text-sm text-friday-text placeholder:text-friday-text-dim/40 focus:outline-none focus:border-friday-cyan/50 focus:ring-1 focus:ring-friday-cyan/20 transition-all resize-none font-mono"
                autoFocus
              />
            </>
          )}

          {phase === 'preview' && (
            <>
              <p className="text-xs text-friday-text-dim">
                <span className="text-friday-cyan font-semibold">{parsedTasks.length}</span> task{parsedTasks.length !== 1 ? 's' : ''} detected. Review and edit before importing.
              </p>
              <div className="space-y-2">
                {parsedTasks.map(task => (
                  <div key={task._tempId} className="bg-friday-bg/50 border border-friday-border rounded-lg p-3 flex items-start gap-3 animate-fade-in">
                    <div className="flex-1 space-y-2">
                      {/* Title */}
                      <input
                        type="text"
                        value={task.title}
                        onChange={e => handleEditField(task._tempId, 'title', e.target.value)}
                        className="w-full bg-transparent border-b border-friday-border/50 text-sm text-friday-text focus:outline-none focus:border-friday-cyan/50 pb-1"
                      />
                      {/* Controls row */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <select
                          value={task.subject || ''}
                          onChange={e => handleEditField(task._tempId, 'subject', e.target.value || null)}
                          className="text-xs bg-friday-surface border border-friday-border rounded px-2 py-1 text-friday-text focus:outline-none [color-scheme:dark]"
                        >
                          <option value="">No Subject</option>
                          {SUBJECT_OPTIONS.filter(Boolean).map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <select
                          value={task.priority}
                          onChange={e => handleEditField(task._tempId, 'priority', e.target.value)}
                          className="text-xs bg-friday-surface border border-friday-border rounded px-2 py-1 text-friday-text focus:outline-none [color-scheme:dark]"
                        >
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                        </select>
                        <input
                          type="date"
                          value={task.deadline ? task.deadline.split('T')[0] : ''}
                          onChange={e => handleEditField(task._tempId, 'deadline', e.target.value ? new Date(e.target.value + 'T23:59:00').toISOString() : null)}
                          className="text-xs bg-friday-surface border border-friday-border rounded px-2 py-1 text-friday-text focus:outline-none [color-scheme:dark]"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveTask(task._tempId)}
                      className="shrink-0 p-1.5 text-friday-text-dim hover:text-friday-danger transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {phase === 'done' && (
            <div className="text-center py-8 animate-fade-in">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-friday-cyan/10 border border-friday-cyan/30 flex items-center justify-center">
                <Upload size={28} className="text-friday-cyan" />
              </div>
              <h3 className="text-friday-text font-semibold mb-1">Import Complete</h3>
              <p className="text-sm text-friday-text-dim">
                <span className="text-friday-cyan font-semibold">{importedCount}</span> task{importedCount !== 1 ? 's' : ''} imported successfully.
              </p>
              <p className="text-xs text-friday-text-dim/50 mt-1">Check the Tasks view to see them.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-5 border-t border-friday-border">
          {phase === 'preview' && (
            <button onClick={handleBack} className="text-sm text-friday-text-dim hover:text-friday-text transition-colors cursor-pointer">
              Back to Edit
            </button>
          )}
          {phase !== 'preview' && <div />}
          <div className="flex gap-2 ml-auto">
            <button
              onClick={handleClose}
              className="px-4 py-2 rounded-lg text-sm text-friday-text-dim hover:text-friday-text border border-friday-border hover:border-friday-text-dim/30 transition-all cursor-pointer"
            >
              {phase === 'done' ? 'Close' : 'Cancel'}
            </button>
            {phase === 'input' && (
              <button
                onClick={handleParse}
                disabled={!rawText.trim()}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-friday-cyan/10 text-friday-cyan border border-friday-cyan/30 hover:bg-friday-cyan/20 hover:border-friday-cyan/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                Parse Tasks
              </button>
            )}
            {phase === 'preview' && (
              <button
                onClick={handleImportAll}
                disabled={parsedTasks.length === 0}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-friday-cyan/10 text-friday-cyan border border-friday-cyan/30 hover:bg-friday-cyan/20 hover:border-friday-cyan/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                Import {parsedTasks.length} Task{parsedTasks.length !== 1 ? 's' : ''}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
