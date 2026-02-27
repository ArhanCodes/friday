import { getTimeOfDay } from '../utils/dateUtils';

const RESPONSES = {
  add_task: [
    "Task logged: '{title}'. {deadlineNote}I'll keep it on your radar.",
    "Got it. '{title}' has been added to your task list. {deadlineNote}Consider it tracked.",
    "'{title}' is now in the system. {deadlineNote}Anything else you need managed?",
  ],
  complete_task: [
    "Marked '{title}' as complete. One less thing on your plate.",
    "'{title}' is done. Good work. Moving on.",
    "Task complete. '{title}' has been checked off. Your efficiency is noted.",
  ],
  delete_task: [
    "Task '{title}' has been removed from the system.",
    "Deleted '{title}'. Consider it gone.",
  ],
  list_tasks: [
    "You have {count} pending tasks. {urgentNote}",
    "Here's your task list: {count} items pending. {urgentNote}",
  ],
  generate_schedule: [
    "I've generated a study schedule with {blockCount} blocks for the week. Your deadlines and weak areas have been prioritized.",
    "Schedule ready. {blockCount} study blocks mapped across your available time.",
    "Done. {blockCount} study sessions planned, with priority given to urgent deadlines and weak topics.",
  ],
  schedule_session: [
    "Study session scheduled: '{title}'. I'll make sure it's on your calendar.",
    "Locked in. '{title}' is set. Shall I adjust anything?",
  ],
  show_weak_topics: [
    "I've identified {count} areas that need attention. {topTopic}",
    "Here's where you should focus: {count} topics flagged. {topTopic}",
  ],
  set_confidence: [
    "Confidence for '{topic}' updated to {level}/5. {followUp}",
  ],
  add_subject: [
    "Subject '{name}' added to your tracking system. Ready to add topics.",
    "'{name}' is now being tracked. You can add topics with 'add topic: [name] to {name}'.",
  ],
  add_topic: [
    "Topic '{topicName}' added to {subjectName}. Default confidence set to 3/5.",
    "'{topicName}' is now tracked under {subjectName}.",
  ],
  status_report: [
    "Status report: {pendingCount} tasks pending, {doneToday} completed today. {urgentNote}",
    "Here's where things stand: {pendingCount} open tasks, {weakCount} weak topics flagged. {urgentNote}",
  ],
  clear_data: [
    "All data has been cleared. Fresh start. Systems ready.",
  ],
  unknown: [
    "I didn't quite catch that. Try 'add task: review notes by Friday' or say 'help' for a list of commands.",
    "That one's outside my protocols. Could you rephrase? Say 'help' for what I can do.",
    "I'm not sure what you're asking. Try being more specific, or type 'help'.",
  ],
  help: [
    "Here's what I can do:\n\n- Add tasks: 'add task: [description] by [date]'\n- Complete tasks: 'mark task [#] as done'\n- Delete tasks: 'delete task [#]'\n- List tasks: 'show tasks'\n- Generate schedule: 'generate study schedule'\n- Add subject: 'add subject: Physics'\n- Add topic: 'add topic: Kinematics to Physics'\n- Set confidence: 'set confidence for Kinematics to 2'\n- Weak areas: 'show weak topics'\n- Status: 'status report'\n- Clear: 'clear all data'",
  ],
  greeting: [
    `Good ${getTimeOfDay()}. F.R.I.D.A.Y. online. What do you need?`,
    `F.R.I.D.A.Y. here. Systems nominal. How can I assist?`,
    `Welcome back. All systems operational. What's the plan?`,
  ],
};

export function generateResponse(intent, data = {}) {
  const templates = RESPONSES[intent] || RESPONSES.unknown;
  const template = templates[Math.floor(Math.random() * templates.length)];

  return template.replace(/\{(\w+)\}/g, (_, key) => {
    if (key === 'deadlineNote' && data.deadline) {
      const d = new Date(data.deadline);
      return `Deadline set for ${d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}. `;
    }
    if (key === 'deadlineNote') return '';
    if (key === 'urgentNote' && data.urgentCount > 0) {
      return `${data.urgentCount} urgent item${data.urgentCount > 1 ? 's' : ''} need attention.`;
    }
    if (key === 'urgentNote') return 'Nothing urgent right now.';
    if (key === 'topTopic' && data.topTopic) {
      return `'${data.topTopic}' is your most pressing concern right now.`;
    }
    if (key === 'topTopic') return '';
    if (key === 'followUp' && data.level <= 2) return "I'll prioritize this in your schedule.";
    if (key === 'followUp') return '';
    return data[key] !== undefined ? data[key] : '';
  });
}

export function getGreeting() {
  const templates = RESPONSES.greeting;
  return templates[Math.floor(Math.random() * templates.length)];
}
