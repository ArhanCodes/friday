export default function ConfidenceBadge({ level }) {
  const colors = {
    1: 'bg-friday-danger',
    2: 'bg-friday-danger/70',
    3: 'bg-friday-warning',
    4: 'bg-friday-cyan',
    5: 'bg-friday-success',
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full transition-all ${
            i <= level ? colors[level] : 'bg-friday-surface-light'
          }`}
        />
      ))}
      <span className="text-xs text-friday-text-dim ml-1">{level}/5</span>
    </div>
  );
}
