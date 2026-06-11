import nowMarkdown from '../content/now.md?raw';
import { buildArchive, buildCategoryStats, buildHeatmap, buildTagStats, parsePost, sortPostsByDate } from './content';

const markdownModules = import.meta.glob<string>('../content/posts/*.md', {
  eager: true,
  import: 'default',
  query: '?raw',
});

export const posts = sortPostsByDate(
  Object.entries(markdownModules).map(([path, raw]) => parsePost(path, raw)),
);

export const latestPosts = posts.slice(0, 4);
export const categoryStats = buildCategoryStats(posts);
export const tagStats = buildTagStats(posts);
export const archiveMonths = buildArchive(posts);
export const heatmap = buildHeatmap(posts);
export const nowContent = nowMarkdown;
