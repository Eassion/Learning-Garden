import nowMarkdown from '../content/now.md?raw';
import { buildArchive, buildCategoryStats, buildHeatmap, buildTagStats, parsePost, sortPostsByDate } from './content';
import { generatedNoteAssets } from './generatedNoteAssets';

const imageModules = import.meta.glob<string>('../content/posts/**/*.{avif,gif,jpeg,jpg,png,svg,webp}', {
  eager: true,
  import: 'default',
  query: '?url',
});

const markdownModules = import.meta.glob<string>('../content/posts/*.md', {
  eager: true,
  import: 'default',
  query: '?raw',
});

export const posts = sortPostsByDate(
  Object.entries(markdownModules).map(([path, raw]) => parsePost(path, raw, { ...imageModules, ...generatedNoteAssets[path] })),
);

export const latestPosts = posts.slice(0, 4);
export const categoryStats = buildCategoryStats(posts);
export const tagStats = buildTagStats(posts);
export const archiveMonths = buildArchive(posts);
export const heatmap = buildHeatmap(posts);
export const nowContent = nowMarkdown;
