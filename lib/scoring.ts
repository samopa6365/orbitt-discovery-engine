export type Category = 'Builder' | 'Engineer' | 'Founder' | 'Designer' | 'Artist' | 'Researcher' | 'Other';

export type Submission = {
  id: string;
  name: string;
  reply: string;
  link: string;
  valueAdd: string;
  category: Category;
};

export type Breakdown = {
  originality: number;
  builderSignal: number;
  executionProof: number;
  clarity: number;
  contribution: number;
};

export type ScoredSubmission = Submission & {
  total: number;
  breakdown: Breakdown;
  explanation: string;
};

const specificWords = ['shipped', 'built', 'launched', 'prototype', 'metrics', 'users', 'open-source', 'demo', 'repo'];
const vagueWords = ['pick me', 'i deserve', 'trust me', 'please choose', 'i am passionate'];

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

export function scoreSubmission(s: Submission): ScoredSubmission {
  const text = `${s.reply} ${s.valueAdd}`.toLowerCase();
  const hasLink = !!s.link.trim();
  const specificCount = specificWords.filter((w) => text.includes(w)).length;
  const vagueCount = vagueWords.filter((w) => text.includes(w)).length;
  const hasNumbers = /\d/.test(text);
  const hasProjectLanguage = /(project|product|tool|system|workflow|api)/.test(text);
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  const originality = clamp(48 + specificCount * 8 + (hasProjectLanguage ? 10 : 0) - vagueCount * 12);
  const builderSignal = clamp(45 + specificCount * 9 + (hasNumbers ? 8 : 0) + (hasProjectLanguage ? 8 : 0) - vagueCount * 8);
  const executionProof = clamp(35 + (hasLink ? 28 : 0) + (hasNumbers ? 10 : 0) + specificCount * 6 - vagueCount * 6);
  const clarity = clamp(40 + (wordCount > 18 && wordCount < 120 ? 25 : 8) + (hasNumbers ? 6 : 0) - vagueCount * 5);
  const contribution = clamp(42 + (/(team|community|room|collaborat|share|teach)/.test(text) ? 20 : 0) + specificCount * 4 - vagueCount * 7);

  const total = clamp(
    originality * 0.25 +
      builderSignal * 0.25 +
      executionProof * 0.2 +
      clarity * 0.15 +
      contribution * 0.15
  );

  const positives = [
    hasLink ? 'includes proof link' : '',
    specificCount > 1 ? 'uses concrete builder language' : '',
    hasNumbers ? 'adds measurable detail' : '',
    /(team|community|room|collaborat)/.test(text) ? 'shows contribution mindset' : ''
  ].filter(Boolean);
  const negatives = [vagueCount > 0 ? 'contains vague "pick me" phrasing' : '', !hasLink ? 'missing execution link' : ''].filter(Boolean);

  const explanation = `${positives.slice(0, 2).join(', ') || 'solid intent'}, ${negatives[0] || 'clear value framing'}.`;

  return { ...s, total, breakdown: { originality, builderSignal, executionProof, clarity, contribution }, explanation };
}

export const sampleSubmissions: Submission[] = [
  {
    id: '1',
    name: '@buildsbymaya',
    reply: 'I shipped a GPT ops tool last month with 3,200 users and open-sourced our eval harness for prompt regressions.',
    link: 'https://github.com/example/eval-harness',
    valueAdd: 'I can bring reproducible evaluation workflows and benchmark hygiene to the room.',
    category: 'Builder'
  },
  {
    id: '2',
    name: '@aetherdesign',
    reply: 'I prototype narrative AI interfaces for culture brands; built a concept where replies become living editorial objects.',
    link: 'https://demo.example.com/aether',
    valueAdd: 'I connect systems thinking with aesthetic clarity so ideas ship with taste.',
    category: 'Designer'
  },
  {
    id: '3',
    name: '@stacktraceleo',
    reply: 'Built an agentic QA workflow that cut bug triage from 2 days to 6 hours using strict eval loops and CI checks.',
    link: 'https://github.com/example/agent-qa',
    valueAdd: 'I can contribute execution discipline and infra realism.',
    category: 'Engineer'
  },
  {
    id: '4',
    name: '@curiousana',
    reply: 'Excited about GPT-5.5 and I think this event will be amazing. I have ideas and passion.',
    link: '',
    valueAdd: 'I bring energy and curiosity.',
    category: 'Other'
  },
  {
    id: '5',
    name: '@founderkevin',
    reply: 'Launched 2 copilots for niche e-commerce teams and documented retention lifts from 18% to 29%.',
    link: 'https://demo.example.com/copilot',
    valueAdd: 'I bring operator insight on distribution and adoption.',
    category: 'Founder'
  },
  {
    id: '6',
    name: '@pickmeplz',
    reply: 'Pick me please. I deserve to be there and trust me I will do great.',
    link: '',
    valueAdd: 'I am passionate.',
    category: 'Other'
  }
];
