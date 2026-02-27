import { calculateUrgency, getUrgencyColor } from '../../utils/urgencyCalculator';
import { getRelativeTime } from '../../utils/dateUtils';

export default function UrgencyBadge({ deadline }) {
  if (!deadline) return null;
  const urgency = calculateUrgency(deadline);
  const color = getUrgencyColor(urgency);
  const text = getRelativeTime(deadline);

  return (
    <span className={`text-xs font-medium ${color} ${urgency >= 75 ? 'animate-pulse' : ''}`}>
      {text}
    </span>
  );
}
