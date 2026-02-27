export function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function formatTime(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
}

export function formatDateKey(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function daysBetween(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return Math.floor(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24));
}

export function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

export function getRelativeTime(date) {
  if (!date) return '';
  const now = new Date();
  const target = new Date(date);
  const diffMs = target - now;
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffMs < 0) {
    const absDays = Math.abs(Math.floor(diffDays));
    if (absDays === 0) return 'Overdue today';
    if (absDays === 1) return 'Overdue by 1 day';
    return `Overdue by ${absDays} days`;
  }
  if (diffHours < 1) return 'Due in less than an hour';
  if (diffHours < 24) return `Due in ${Math.floor(diffHours)} hours`;
  if (diffDays < 2) return 'Due tomorrow';
  if (diffDays < 7) return `Due in ${Math.floor(diffDays)} days`;
  return `Due ${formatDate(date)}`;
}

export function getTodayKey() {
  return formatDateKey(new Date());
}
