import { site } from '../../config/site';

const aiAgents = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'Google-Extended',
  'GoogleOther',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Applebot-Extended',
  'Amazonbot',
  'CCBot',
  'Meta-ExternalAgent',
  'cohere-ai',
];

export function renderRobots() {
  const explicit = aiAgents
    .map((agent) => `User-agent: ${agent}\nAllow: /\n`)
    .join('\n');

  return `# VectorCodex allows search and AI crawlers to read public pages.
User-agent: *
Allow: /

${explicit}
Sitemap: ${site.url}/sitemap-index.xml
`;
}
