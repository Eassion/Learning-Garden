import nowMarkdown from '../content/now.md?raw';
import { buildArchive, buildCategoryStats, buildHeatmap, buildTagStats, parsePost, sortPostsByDate } from './content';
import { generatedNoteAssets } from './generatedNoteAssets';
import { generatedPostIndex } from './generatedPostIndex';
import type { Post, PostAssetMap, PostSummary } from './types';

const imageModules = import.meta.glob<string>('../content/posts/**/*.{avif,gif,jpeg,jpg,png,svg,webp}', {
  import: 'default',
  query: '?url',
});

const markdownModules = import.meta.glob<string>('../content/posts/*.md', {
  import: 'default',
  query: '?raw',
});

const postIndexBySlug = new Map(generatedPostIndex.map((post) => [post.slug, post]));

export const posts: PostSummary[] = sortPostsByDate(
  generatedPostIndex.map(({ sourcePath: _sourcePath, ...post }) => post),
);

export const latestPosts = posts.slice(0, 4);
export const categoryStats = buildCategoryStats(posts);
export const tagStats = buildTagStats(posts);
export const archiveMonths = buildArchive(posts);
export const heatmap = buildHeatmap(posts);
export const nowContent = nowMarkdown;

export async function loadPost(slug: string): Promise<Post | undefined> {
  const indexedPost = postIndexBySlug.get(slug);

  if (!indexedPost) {
    return undefined;
  }

  const loadMarkdown = markdownModules[indexedPost.sourcePath];

  if (!loadMarkdown) {
    return undefined;
  }

  const raw = await loadMarkdown();
  const assets = await loadAssetsForPost(indexedPost.sourcePath);

  return parsePost(indexedPost.sourcePath, raw, assets);
}

async function loadAssetsForPost(sourcePath: string): Promise<PostAssetMap> {
  const postAssets: PostAssetMap = { ...(generatedNoteAssets[sourcePath] ?? {}) };
  const assetPrefix = sourcePath.replace(/\.md$/, '/');
  const assetEntries = Object.entries(imageModules).filter(([assetPath]) => assetPath.startsWith(assetPrefix));

  await Promise.all(
    assetEntries.map(async ([assetPath, loadAsset]) => {
      postAssets[assetPath] = await loadAsset();
    }),
  );

  return postAssets;
}
