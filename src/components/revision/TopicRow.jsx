import { Trash2 } from 'lucide-react';
import { useFriday } from '../../context/FridayContext';
import { formatDate } from '../../utils/dateUtils';

export default function TopicRow({ topic, subjectId, subjectName }) {
  const { setConfidence, deleteTopic } = useFriday();

  const handleConfidenceClick = (level) => {
    setConfidence(topic.name, level);
  };

  const handleDelete = () => {
    deleteTopic(subjectId, topic.id);
  };

  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded border border-friday-border bg-friday-surface-light/50 hover:bg-friday-surface-light transition-all text-xs group">
      <div className="flex-1 min-w-0">
        <span className="text-friday-text">{topic.name}</span>
      </div>

      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(level => (
          <button
            key={level}
            onClick={() => handleConfidenceClick(level)}
            className={`w-6 h-6 rounded text-[10px] font-bold cursor-pointer transition-all border ${
              topic.confidence >= level
                ? level <= 2 ? 'bg-friday-danger/20 border-friday-danger/40 text-friday-danger'
                  : level <= 3 ? 'bg-friday-warning/20 border-friday-warning/40 text-friday-warning'
                  : 'bg-friday-success/20 border-friday-success/40 text-friday-success'
                : 'border-friday-border text-friday-text-dim hover:border-friday-cyan/50'
            }`}
          >
            {level}
          </button>
        ))}
      </div>

      <div className="text-friday-text-dim w-20 text-right shrink-0">
        {topic.lastReviewed ? formatDate(topic.lastReviewed) : 'Never'}
      </div>

      <button
        onClick={handleDelete}
        className="shrink-0 p-1 text-friday-text-dim/0 group-hover:text-friday-text-dim hover:!text-friday-danger transition-all cursor-pointer"
        title="Delete topic"
      >
        <Trash2 size={12} />
      </button>
    </div>
  );
}
