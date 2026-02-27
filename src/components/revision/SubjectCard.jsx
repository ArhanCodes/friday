import { useState } from 'react';
import { ChevronDown, ChevronRight, Trash2, Plus, X } from 'lucide-react';
import { useFriday } from '../../context/FridayContext';
import TopicRow from './TopicRow';

export default function SubjectCard({ subject }) {
  const { deleteSubject, addTopicById } = useFriday();
  const [expanded, setExpanded] = useState(false);
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');

  const avgConfidence = subject.topics.length > 0
    ? (subject.topics.reduce((sum, t) => sum + t.confidence, 0) / subject.topics.length).toFixed(1)
    : 0;

  const weakCount = subject.topics.filter(t => t.confidence <= 2).length;

  const handleDeleteSubject = (e) => {
    e.stopPropagation();
    deleteSubject(subject.id);
  };

  const handleAddTopic = (e) => {
    e.preventDefault();
    if (!newTopicName.trim()) return;
    addTopicById(subject.id, newTopicName.trim());
    setNewTopicName('');
    setShowAddTopic(false);
  };

  return (
    <div className="bg-friday-surface border border-friday-border rounded-lg card-glow animate-fade-in overflow-hidden">
      <div className="flex items-center">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex-1 flex items-center gap-3 p-4 cursor-pointer hover:bg-friday-surface-light/50 transition-all"
        >
          <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: subject.color }} />
          {expanded ? <ChevronDown size={14} className="text-friday-text-dim" /> : <ChevronRight size={14} className="text-friday-text-dim" />}

          <div className="flex-1 text-left">
            <div className="text-sm font-medium text-friday-text">{subject.name}</div>
            <div className="text-xs text-friday-text-dim">
              {subject.topics.length} topics | Avg: {avgConfidence}/5
              {weakCount > 0 && (
                <span className="text-friday-danger ml-2">{weakCount} weak</span>
              )}
            </div>
          </div>

          <span className={`text-xs px-2 py-0.5 rounded ${
            subject.examType === 'sat' ? 'bg-friday-blue/10 text-friday-blue' :
            subject.examType === 'alevel' ? 'bg-friday-cyan/10 text-friday-cyan' :
            'bg-friday-surface-light text-friday-text-dim'
          }`}>
            {subject.examType === 'sat' ? 'SAT' : subject.examType === 'alevel' ? 'A-Level' : 'General'}
          </span>
        </button>

        <button
          onClick={handleDeleteSubject}
          className="p-3 mr-2 text-friday-text-dim hover:text-friday-danger transition-colors cursor-pointer"
          title="Delete subject"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-1 animate-fade-in">
          <div className="flex items-center gap-3 px-3 py-1 text-[10px] text-friday-text-dim uppercase tracking-wide">
            <div className="flex-1">Topic</div>
            <div className="w-[140px] text-center">Confidence</div>
            <div className="w-20 text-right">Reviewed</div>
            <div className="w-6"></div>
          </div>
          {subject.topics.map(topic => (
            <TopicRow key={topic.id} topic={topic} subjectId={subject.id} subjectName={subject.name} />
          ))}

          {/* Add Topic */}
          {showAddTopic ? (
            <form onSubmit={handleAddTopic} className="flex items-center gap-2 px-3 py-2 mt-1">
              <input
                type="text"
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
                placeholder="New topic name..."
                className="flex-1 bg-friday-surface-light border border-friday-border rounded px-3 py-1.5 text-xs text-friday-text placeholder-friday-text-dim/50 outline-none focus:border-friday-cyan/50"
                autoFocus
              />
              <button
                type="submit"
                disabled={!newTopicName.trim()}
                className="px-3 py-1.5 text-xs bg-friday-cyan/20 text-friday-cyan rounded hover:bg-friday-cyan/30 transition-all cursor-pointer disabled:opacity-30"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => { setShowAddTopic(false); setNewTopicName(''); }}
                className="px-2 py-1.5 text-xs text-friday-text-dim hover:text-friday-danger transition-colors cursor-pointer"
              >
                <X size={12} />
              </button>
            </form>
          ) : (
            <button
              onClick={() => setShowAddTopic(true)}
              className="flex items-center gap-1 px-3 py-2 mt-1 text-xs text-friday-text-dim hover:text-friday-cyan transition-colors cursor-pointer w-full"
            >
              <Plus size={12} /> Add Topic
            </button>
          )}
        </div>
      )}
    </div>
  );
}
