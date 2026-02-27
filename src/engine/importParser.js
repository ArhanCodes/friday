import * as chrono from 'chrono-node';
import { detectSubject } from './commandParser';

function detectPriority(text) {
  if (/\b(urgent|asap|important|critical|high\s+priority|exam|test|final)\b/i.test(text)) return 'high';
  if (/\b(low\s+priority|whenever|no\s+rush|optional)\b/i.test(text)) return 'low';
  return 'medium';
}

/**
 * Parses multi-line pasted text into an array of task objects.
 * Each non-empty line becomes a task. Dates, subjects, and priority are auto-detected.
 */
export function parseImportText(rawText) {
  const lines = rawText
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0);

  return lines.map((line, index) => {
    // Parse date with chrono-node (forward-looking)
    const dateResults = chrono.parse(line, new Date(), { forwardDate: true });
    const deadline = dateResults.length > 0 ? dateResults[0].start.date() : null;

    // Build clean title: strip date text, bullets, numbers, trailing prepositions
    let title = line;
    if (dateResults.length > 0) {
      title = title.replace(dateResults[0].text, '');
    }
    title = title
      .replace(/^[\s\-\*\u2022\u2023\u25E6\d.)]+/, '')   // leading bullets, numbers, dashes
      .replace(/\s+(by|on|at|for|due|before|until)\s*$/i, '')
      .replace(/\s{2,}/g, ' ')
      .trim();

    const subject = detectSubject(line);
    const priority = detectPriority(line);

    return {
      _tempId: `import-${index}-${Date.now()}`,
      title: title || line.replace(/^[\s\-\*\u2022\d.)]+/, '').trim(),
      subject,
      deadline: deadline ? deadline.toISOString() : null,
      priority,
      _original: line,
    };
  });
}
