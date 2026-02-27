/**
 * Returns an array of week arrays for a given month/year.
 * Each week has 7 day objects (Mon-Sun). Days outside the month are included to fill the grid.
 */
export function getCalendarGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Convert JS day (0=Sun) to Mon-based (Mon=0, Sun=6)
  let startDow = firstDay.getDay();
  startDow = startDow === 0 ? 6 : startDow - 1;

  const gridStart = new Date(firstDay);
  gridStart.setDate(gridStart.getDate() - startDow);

  const weeks = [];
  const current = new Date(gridStart);

  for (let w = 0; w < 6; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      week.push({
        date: new Date(current),
        dateKey: formatDateKeyLocal(current),
        isCurrentMonth: current.getMonth() === month,
        isToday: isSameDay(current, new Date()),
      });
      current.setDate(current.getDate() + 1);
    }
    if (week.some(d => d.isCurrentMonth)) {
      weeks.push(week);
    }
  }

  return weeks;
}

function formatDateKeyLocal(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

export function getMonthLabel(year, month) {
  return new Date(year, month, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
