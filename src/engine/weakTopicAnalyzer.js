import { daysBetween } from '../utils/dateUtils';

export function analyzeWeakTopics(subjects) {
  const analysis = [];

  for (const subject of subjects) {
    for (const topic of subject.topics) {
      const score = computeWeaknessScore(topic);
      if (score >= 40) {
        analysis.push({
          subjectId: subject.id,
          subjectName: subject.name,
          subjectColor: subject.color,
          topicId: topic.id,
          topicName: topic.name,
          confidence: topic.confidence,
          lastReviewed: topic.lastReviewed,
          weaknessScore: score,
          reason: getWeaknessReason(topic),
          suggestedAction: getSuggestedAction(topic, subject),
        });
      }
    }
  }

  return analysis.sort((a, b) => b.weaknessScore - a.weaknessScore);
}

function computeWeaknessScore(topic) {
  let score = 0;
  const confidenceScores = { 1: 50, 2: 35, 3: 15, 4: 5, 5: 0 };
  score += confidenceScores[topic.confidence] || 15;

  if (!topic.lastReviewed) {
    score += 30;
  } else {
    const daysSince = daysBetween(new Date(topic.lastReviewed), new Date());
    if (daysSince > 14) score += 25;
    else if (daysSince > 7) score += 15;
    else if (daysSince > 3) score += 8;
  }

  if (topic.reviewCount <= 1) score += 15;
  else if (topic.reviewCount <= 3) score += 8;

  return Math.min(score, 100);
}

function getWeaknessReason(topic) {
  if (topic.confidence <= 1) return 'Very low confidence — needs focused revision.';
  if (topic.confidence <= 2 && !topic.lastReviewed) return 'Low confidence and never reviewed.';
  if (topic.confidence <= 2) return 'Low confidence — needs more practice.';
  if (!topic.lastReviewed || daysBetween(new Date(topic.lastReviewed), new Date()) > 14) {
    return 'Not reviewed recently — knowledge may have faded.';
  }
  return 'Could benefit from additional review.';
}

function getSuggestedAction(topic, subject) {
  if (topic.confidence <= 1) {
    return `Schedule a focused ${subject.name} session on ${topic.name}. Start with fundamentals.`;
  }
  if (topic.confidence <= 2) {
    return `Review ${topic.name} with practice problems. Aim for at least 30 minutes.`;
  }
  return `Quick refresh on ${topic.name} — try a timed practice set.`;
}
