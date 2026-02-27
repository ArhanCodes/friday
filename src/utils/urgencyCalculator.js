export function calculateUrgency(deadlineStr) {
  if (!deadlineStr) return 0;
  const now = new Date();
  const deadline = new Date(deadlineStr);
  const hoursUntil = (deadline - now) / (1000 * 60 * 60);
  if (hoursUntil <= 0) return 100;
  if (hoursUntil <= 24) return 90;
  if (hoursUntil <= 48) return 75;
  if (hoursUntil <= 72) return 60;
  if (hoursUntil <= 168) return 40;
  return 20;
}

export function getUrgencyLevel(urgency) {
  if (urgency >= 75) return 'critical';
  if (urgency >= 50) return 'high';
  if (urgency >= 30) return 'medium';
  return 'low';
}

export function getUrgencyColor(urgency) {
  if (urgency >= 75) return 'text-friday-danger';
  if (urgency >= 50) return 'text-friday-warning';
  if (urgency >= 30) return 'text-friday-cyan';
  return 'text-friday-text-dim';
}

export function getUrgencyBg(urgency) {
  if (urgency >= 75) return 'bg-friday-danger/10 border-friday-danger/30';
  if (urgency >= 50) return 'bg-friday-warning/10 border-friday-warning/30';
  if (urgency >= 30) return 'bg-friday-cyan/10 border-friday-cyan/30';
  return 'bg-friday-surface-light border-friday-border';
}
