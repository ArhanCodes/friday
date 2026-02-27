import { Target } from 'lucide-react';
import { useFriday } from '../../context/FridayContext';
import { analyzeWeakTopics } from '../../engine/weakTopicAnalyzer';
import ConfidenceBadge from '../shared/ConfidenceBadge';

export default function WeakTopicAlert() {
  const { subjects } = useFriday();
  const weakTopics = analyzeWeakTopics(subjects).slice(0, 5);

  return (
    <div className="bg-friday-surface border border-friday-border rounded-lg p-4 card-glow">
      <h3 className="text-sm font-semibold text-friday-warning mb-3 flex items-center gap-2">
        <Target size={14} />
        Weak Topics — Focus Areas
      </h3>
      {weakTopics.length === 0 ? (
        <p className="text-xs text-friday-text-dim">No weak topics detected. Keep up the good work.</p>
      ) : (
        <div className="space-y-2">
          {weakTopics.map(topic => (
            <div
              key={topic.topicId}
              className="px-3 py-2 rounded border border-friday-border bg-friday-surface-light text-xs"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-friday-text">{topic.topicName}</span>
                <ConfidenceBadge level={topic.confidence} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-friday-text-dim" style={{ color: topic.subjectColor }}>
                  {topic.subjectName}
                </span>
                <span className="text-friday-text-dim">{topic.reason}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
