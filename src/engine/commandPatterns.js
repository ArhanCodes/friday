export const INTENTS = [
  {
    name: 'add_task',
    patterns: [
      /^add\s+task[:\s]+(.+)/i,
      /^create\s+task[:\s]+(.+)/i,
      /^new\s+task[:\s]+(.+)/i,
      /^remind\s+me\s+to\s+(.+)/i,
      /^i\s+need\s+to\s+(.+)/i,
      /^todo[:\s]+(.+)/i,
    ],
  },
  {
    name: 'complete_task',
    patterns: [
      /^(?:mark|set)\s+task\s+(\d+|".+")\s+(?:as\s+)?(?:done|complete|finished)/i,
      /^(?:complete|finish|done\s+with)\s+(?:task\s+)?(\d+|".+")/i,
      /^(?:check\s+off|tick\s+off)\s+(?:task\s+)?(\d+|".+")/i,
    ],
  },
  {
    name: 'delete_task',
    patterns: [
      /^(?:delete|remove|cancel)\s+task\s+(\d+|".+")/i,
    ],
  },
  {
    name: 'list_tasks',
    patterns: [
      /^(?:show|list|display|what\s+are)\s+(?:my\s+)?(?:all\s+)?tasks/i,
      /^what\s+(?:do\s+i\s+have|is)\s+(?:to\s+do|pending|left)/i,
      /^tasks/i,
    ],
  },
  {
    name: 'schedule_session',
    patterns: [
      /^schedule\s+(.+?\s+(?:session|block|time))\s+(?:for\s+)?(.+)/i,
      /^schedule\s+(.+)\s+(?:for|on|at)\s+(.+)/i,
      /^book\s+(.+)\s+(?:for|on|at)\s+(.+)/i,
    ],
  },
  {
    name: 'generate_schedule',
    patterns: [
      /^generate\s+(?:a\s+)?(?:study\s+)?schedule/i,
      /^create\s+(?:a\s+)?(?:study\s+)?(?:plan|schedule)/i,
      /^plan\s+my\s+(?:study|week|revision)/i,
      /^auto[\s-]?schedule/i,
    ],
  },
  {
    name: 'add_subject',
    patterns: [
      /^add\s+subject[:\s]+(.+)/i,
      /^(?:create|new)\s+subject[:\s]+(.+)/i,
      /^track\s+(.+?)(?:\s+(?:for\s+)?(sat|a[\s-]?levels?|alevel))?$/i,
    ],
  },
  {
    name: 'add_topic',
    patterns: [
      /^add\s+topic[:\s]+(.+?)\s+(?:to|under|in)\s+(.+)/i,
      /^(?:create|new)\s+topic[:\s]+(.+?)\s+(?:to|under|in)\s+(.+)/i,
    ],
  },
  {
    name: 'set_confidence',
    patterns: [
      /^(?:set|mark|rate)\s+(?:confidence\s+(?:for|on|in)\s+)?(.+?)\s+(?:to|as|at)\s+(\d)/i,
      /^i(?:'m|\s+am)\s+(confident|weak|struggling|good|great|okay)\s+(?:in|at|with)\s+(.+)/i,
    ],
  },
  {
    name: 'show_weak_topics',
    patterns: [
      /^(?:show|list|what\s+are)\s+(?:my\s+)?weak\s+(?:topics|areas|subjects)/i,
      /^where\s+(?:do\s+i|should\s+i)\s+(?:need\s+to\s+)?(?:improve|focus|study)/i,
      /^suggest\s+(?:revision|study|topics)/i,
      /^weak\s+(?:topics|areas)/i,
    ],
  },
  {
    name: 'status_report',
    patterns: [
      /^(?:status|report|summary|overview|how\s+am\s+i\s+doing)/i,
      /^(?:give\s+me\s+a\s+)?(?:status\s+)?(?:update|report|summary)/i,
      /^dashboard/i,
    ],
  },
  {
    name: 'help',
    patterns: [
      /^help$/i,
      /^what\s+can\s+you\s+do/i,
      /^commands$/i,
    ],
  },
  {
    name: 'clear_data',
    patterns: [
      /^(?:clear|reset)\s+(?:all\s+)?(?:data|everything)/i,
    ],
  },
];
