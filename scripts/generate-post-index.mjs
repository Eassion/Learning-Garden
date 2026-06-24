import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const postsDir = path.join(root, 'src', 'content', 'posts');
const outputFile = path.join(root, 'src', 'lib', 'generatedPostIndex.ts');

const entries = [];

for (const fileName of await readdir(postsDir)) {
  if (!fileName.endsWith('.md')) {
    continue;
  }

  const absolutePath = path.join(postsDir, fileName);
  const raw = await readFile(absolutePath, 'utf8');
  const sourcePath = `../content/posts/${fileName}`;
  entries.push(parsePostSummary(sourcePath, raw));
}

entries.sort((a, b) => b.date.localeCompare(a.date));

await writeFile(
  outputFile,
  `import type { PostIndexEntry } from './types';\n\nexport const generatedPostIndex = ${JSON.stringify(entries, null, 2)} satisfies PostIndexEntry[];\n`,
  'utf8',
);

function parsePostSummary(sourcePath, raw) {
  const { frontmatter, content } = parseFrontmatter(raw, sourcePath);
  const missing = ['title', 'date', 'category'].filter((key) => !frontmatter[key]);

  if (missing.length > 0) {
    throw new Error(`${sourcePath} missing required frontmatter: ${missing.join(', ')}`);
  }

  return {
    sourcePath,
    slug: path.basename(sourcePath, '.md'),
    title: String(frontmatter.title),
    date: String(frontmatter.date).slice(0, 10),
    category: String(frontmatter.category),
    tags: parseTags(frontmatter.tags),
    readingMinutes: estimateReadingMinutes(content.trim()),
  };
}

function parseFrontmatter(raw, filePath) {
  if (!raw.startsWith('---')) {
    throw new Error(`${filePath} missing frontmatter block`);
  }

  const closingMarker = raw.indexOf('\n---', 3);
  if (closingMarker === -1) {
    throw new Error(`${filePath} has an unterminated frontmatter block`);
  }

  const block = raw.slice(3, closingMarker).trim();
  const content = raw.slice(closingMarker + 4);
  const frontmatter = {};
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

    const values = [];
    while (lines[index + 1]?.startsWith('  - ')) {
      index += 1;
      values.push(cleanScalar(lines[index].slice(4)));
    }
    frontmatter[key] = values;
  }

  return { frontmatter, content };
}

function parseTags(value) {
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

function cleanScalar(value) {
  const trimmed = value.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

function estimateReadingMinutes(content) {
  const words = content.replace(/[#_*`>\-[\]()]/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  const chineseCharacters = (content.match(/[\u4e00-\u9fff]/g) ?? []).length;
  const estimated = Math.ceil((words + chineseCharacters / 2) / 220);

  return Math.max(1, estimated);
}
