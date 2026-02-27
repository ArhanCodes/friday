import * as chrono from 'chrono-node';
import { INTENTS } from './commandPatterns';

export function parseCommand(input) {
  const trimmed = input.trim();

  for (const intent of INTENTS) {
    for (const pattern of intent.patterns) {
      const match = trimmed.match(pattern);
      if (match) {
        const entities = extractEntities(intent.name, match, trimmed);
        return { intent: intent.name, raw: trimmed, match, entities, confidence: 1.0 };
      }
    }
  }

  const fuzzyResult = fuzzyMatch(trimmed);
  if (fuzzyResult) return fuzzyResult;

  return { intent: 'unknown', raw: trimmed, match: null, entities: {}, confidence: 0 };
}

function extractEntities(intentName, match, fullInput) {
  const entities = {};

  switch (intentName) {
    case 'add_task': {
      const taskContent = match[1];
      // Detect priority first
      if (/\b(urgent|asap|important|critical|high\s+priority)\b/i.test(taskContent)) {
        entities.priority = 'high';
      } else if (/\b(low\s+priority|whenever|no\s+rush)\b/i.test(taskContent)) {
        entities.priority = 'low';
      } else {
        entities.priority = 'medium';
      }
      entities.subject = detectSubject(taskContent);

      // Clean title: remove date, priority words, and trailing prepositions
      let title = taskContent;
      const dateInTask = chrono.parse(taskContent, new Date(), { forwardDate: true });
      if (dateInTask.length > 0) {
        entities.deadline = dateInTask[0].start.date();
        title = title.replace(dateInTask[0].text, '');
      }
      title = title
        .replace(/\b(urgent|asap|important|critical|high\s+priority|low\s+priority|whenever|no\s+rush)\b/gi, '')
        .replace(/\s+(by|on|at|for|due|before)\s*$/i, '')
        .replace(/\s+(by|on|at|for|due|before)\s+$/i, '')
        .replace(/^[:\s]+/, '')
        .replace(/\s{2,}/g, ' ')
        .trim();
      entities.title = title || taskContent.replace(/^[:\s]+/, '').trim();
      break;
    }

    case 'complete_task':
    case 'delete_task': {
      const taskRef = match[1];
      if (/^\d+$/.test(taskRef)) {
        entities.taskIndex = parseInt(taskRef, 10);
      } else {
        entities.taskName = taskRef.replace(/"/g, '');
      }
      break;
    }

    case 'schedule_session': {
      entities.sessionDescription = match[1]?.trim();
      entities.timeDescription = match[2]?.trim();
      const sessionDate = chrono.parse(match[2] || fullInput, new Date(), { forwardDate: true });
      if (sessionDate.length > 0) {
        entities.sessionStart = sessionDate[0].start.date();
        if (sessionDate[0].end) {
          entities.sessionEnd = sessionDate[0].end.date();
        }
      }
      entities.subject = detectSubject(fullInput);
      break;
    }

    case 'set_confidence': {
      const wordMap = { weak: 1, struggling: 1, okay: 2, good: 3, confident: 4, great: 5 };
      if (wordMap[match[1]?.toLowerCase()]) {
        entities.level = wordMap[match[1].toLowerCase()];
        entities.topicName = match[2]?.trim();
      } else {
        entities.topicName = match[1]?.trim();
        entities.level = parseInt(match[2], 10) || 3;
      }
      break;
    }

    case 'add_subject': {
      entities.subjectName = match[1]?.trim();
      if (/\bsat\b/i.test(fullInput)) entities.examType = 'sat';
      else if (/\ba[\s-]?level/i.test(fullInput)) entities.examType = 'alevel';
      else entities.examType = 'general';
      break;
    }

    case 'add_topic': {
      entities.topicName = match[1]?.trim();
      entities.subjectName = match[2]?.trim();
      break;
    }
  }

  return entities;
}

function fuzzyMatch(input) {
  const lower = input.toLowerCase();
  const fuzzyRules = [
    { keywords: ['add', 'task', 'todo'], intent: 'add_task', minMatch: 2 },
    { keywords: ['done', 'complete', 'finish', 'mark'], intent: 'complete_task', minMatch: 1 },
    { keywords: ['schedule', 'plan', 'book', 'session'], intent: 'schedule_session', minMatch: 1 },
    { keywords: ['weak', 'improve', 'struggling', 'focus'], intent: 'show_weak_topics', minMatch: 1 },
    { keywords: ['generate', 'auto schedule', 'plan study'], intent: 'generate_schedule', minMatch: 1 },
    { keywords: ['status', 'report', 'summary', 'overview'], intent: 'status_report', minMatch: 1 },
  ];

  for (const rule of fuzzyRules) {
    const matches = rule.keywords.filter(kw => lower.includes(kw));
    if (matches.length >= rule.minMatch) {
      return { intent: rule.intent, raw: input, match: null, entities: { rawContent: input }, confidence: 0.5 };
    }
  }
  return null;
}

export function detectSubject(text) {
  const subjectKeywords = {
    Mathematics: /\b(math|maths|calculus|algebra|geometry|trigonometry|statistics)\b/i,
    Physics: /\b(physics|mechanics|thermodynamics|optics|waves|kinematics)\b/i,
    Chemistry: /\b(chemistry|organic|inorganic|stoichiometry|periodic|moles)\b/i,
    Biology: /\b(biology|bio|genetics|ecology|evolution|anatomy|cells)\b/i,
    English: /\b(english|essay|literature|writing|grammar|reading comprehension)\b/i,
    History: /\b(history|historical|ww[12i]|revolution|civil\s+war)\b/i,
    'Computer Science': /\b(computer science|cs|programming|coding|algorithms)\b/i,
  };
  for (const [subject, pattern] of Object.entries(subjectKeywords)) {
    if (pattern.test(text)) return subject;
  }
  return null;
}
