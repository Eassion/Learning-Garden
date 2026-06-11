import type { ArchiveMonth, CategoryStat, HeatmapData, HeatmapDay, Post, PostStatus, TagStat } from './types';

const REQUIRED_FRONTMATTER = ['title', 'date', 'category', 'summary'] as const;
const STATUS_VALUES: PostStatus[] = ['learning', 'done', 'reviewing'];
const CATEGORY_ROADMAP = ['Java 后端', 'Golang 后端', 'Agent 开发'];

type Frontmatter = {
  title?: unknown;
  date?: unknown;
  category?: unknown;
  tags?: unknown;
  summary?: unknown;
  status?: unknown;
};

export function parsePost(filePath: string, raw: string): Post {
  const { frontmatter, content } = parseFrontmatter(raw, filePath);
  const missing = REQUIRED_FRONTMATTER.filter((key) => !frontmatter[key]);

  if (missing.length > 0) {
    throw new Error(`${filePath} missing required frontmatter: ${missing.join(', ')}`);
  }

  const status = parseStatus(frontmatter.status);

  return {
    slug: slugFromPath(filePath),
    title: String(frontmatter.title),
    date: normalizeDate(frontmatter.date),
    category: String(frontmatter.category),
    tags: parseTags(frontmatter.tags),
    summary: String(frontmatter.summary),
    status,
    content: content.trim(),
    readingMinutes: estimateReadingMinutes(content),
  };
}

function parseFrontmatter(raw: string, filePath: string): { frontmatter: Frontmatter; content: string } {
  if (!raw.startsWith('---')) {
    throw new Error(`${filePath} missing frontmatter block`);
  }

  const closingMarker = raw.indexOf('\n---', 3);
  if (closingMarker === -1) {
    throw new Error(`${filePath} has an unterminated frontmatter block`);
  }

  const block = raw.slice(3, closingMarker).trim();
  const content = raw.slice(closingMarker + 4);
  const frontmatter: Record<string, unknown> = {};
  const lines = block.split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const match = /^([A-Za-z][\w-]*):\s*(.*)$/.exec(line);

    if (!match) {
      continue;
    }

    const [, key, rawValue] = match;
    if (rawValue) {
      frontmatter[key] = cleanScalar(rawValue);
      continue;
    }

    const values: string[] = [];
    while (lines[index + 1]?.startsWith('  - ')) {
      index += 1;
      values.push(cleanScalar(lines[index].slice(4)));
    }
    frontmatter[key] = values;
  }

  return { frontmatter, content };
}

export function sortPostsByDate(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date));
}

export function buildCategoryStats(posts: Post[]): CategoryStat[] {
  const map = new Map<string, CategoryStat>();

  for (const post of posts) {
    const current =
      map.get(post.category) ??
      ({
        category: post.category,
        count: 0,
        latestDate: post.date,
        statusCounts: { learning: 0, done: 0, reviewing: 0 },
      } satisfies CategoryStat);

    current.count += 1;
    current.latestDate = current.latestDate > post.date ? current.latestDate : post.date;
    current.statusCounts[post.status] += 1;
    map.set(post.category, current);
  }

  return Array.from(map.values()).sort((a, b) => categoryRank(a.category) - categoryRank(b.category) || b.count - a.count || a.category.localeCompare(b.category, 'zh-CN'));
}

export function buildTagStats(posts: Post[]): TagStat[] {
  const map = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.tags) {
      map.set(tag, (map.get(tag) ?? 0) + 1);
    }
  }

  return Array.from(map, ([tag, count]) => ({ tag, count })).sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'zh-CN'));
}

export function buildArchive(posts: Post[]): ArchiveMonth[] {
  const map = new Map<string, Post[]>();

  for (const post of sortPostsByDate(posts)) {
    const month = post.date.slice(0, 7);
    map.set(month, [...(map.get(month) ?? []), post]);
  }

  return Array.from(map, ([month, monthPosts]) => ({ month, posts: monthPosts })).sort((a, b) => b.month.localeCompare(a.month));
}

export function buildHeatmap(posts: Post[], today = new Date()): HeatmapData {
  const end = startOfDay(today);
  const start = addDays(end, -364);
  const counts = new Map<string, number>();

  for (const post of posts) {
    counts.set(post.date, (counts.get(post.date) ?? 0) + 1);
  }

  const days: HeatmapDay[] = [];
  let maxCount = 0;

  for (let current = start; current <= end; current = addDays(current, 1)) {
    const date = formatDate(current);
    const count = counts.get(date) ?? 0;
    maxCount = Math.max(maxCount, count);
    days.push({ date, count, level: heatLevel(count) });
  }

  return { days, maxCount };
}

export function chooseReviewPost(posts: Post[], random = Math.random): Post | undefined {
  const weighted = sortPostsByDate(posts)
    .reverse()
    .flatMap((post) => {
      const weight = post.status === 'reviewing' ? 4 : post.status === 'learning' ? 2 : 1;
      return Array.from({ length: weight }, () => post);
    });

  if (weighted.length === 0) {
    return undefined;
  }

  return weighted[Math.floor(random() * weighted.length)];
}

export function groupPostsByCategory(posts: Post[], category: string): Post[] {
  return sortPostsByDate(posts).filter((post) => post.category === category);
}

export function groupPostsByTag(posts: Post[], tag: string): Post[] {
  return sortPostsByDate(posts).filter((post) => post.tags.includes(tag));
}

export function postsOnDate(posts: Post[], date: string): Post[] {
  return sortPostsByDate(posts).filter((post) => post.date === date);
}

function parseStatus(value: unknown): PostStatus {
  if (typeof value === 'string' && STATUS_VALUES.includes(value as PostStatus)) {
    return value as PostStatus;
  }

  return 'learning';
}

function parseTags(value: unknown): string[] {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map(String).filter(Boolean);
  }

  return String(value)
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function cleanScalar(value: string): string {
  const trimmed = value.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

function normalizeDate(value: unknown): string {
  if (value instanceof Date) {
    return formatDate(value);
  }

  return String(value).slice(0, 10);
}

function slugFromPath(filePath: string): string {
  return filePath.split('/').at(-1)?.replace(/\.md$/, '') ?? filePath;
}

function estimateReadingMinutes(content: string): number {
  const words = content.replace(/[#_*`>\-[\]()]/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  const chineseCharacters = (content.match(/[\u4e00-\u9fff]/g) ?? []).length;
  const estimated = Math.ceil((words + chineseCharacters / 2) / 220);

  return Math.max(1, estimated);
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function heatLevel(count: number): number {
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count === 3) return 3;
  return 4;
}

function categoryRank(category: string): number {
  const index = CATEGORY_ROADMAP.indexOf(category);
  return index === -1 ? CATEGORY_ROADMAP.length : index;
}
