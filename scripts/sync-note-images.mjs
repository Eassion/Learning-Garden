import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, copyFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, extname, isAbsolute, join, normalize, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = process.cwd();
const postsDir = resolve(root, 'src/content/posts');
const publicAssetDir = resolve(root, 'public/note-assets');
const generatedFile = resolve(root, 'src/lib/generatedNoteAssets.ts');
const imageExtensions = new Set(['.avif', '.gif', '.jpeg', '.jpg', '.png', '.svg', '.webp']);

mkdirSync(publicAssetDir, { recursive: true });

const existingMappings = readExistingMappings();
const mappings = {};

for (const fileName of readdirSync(postsDir)) {
  if (!fileName.endsWith('.md')) {
    continue;
  }

  const markdownPath = resolve(postsDir, fileName);
  const slug = fileName.replace(/\.md$/, '');
  const markdown = readFileSync(markdownPath, 'utf8');
  const urls = extractImageUrls(markdown);
  const modulePath = toModulePath(markdownPath);

  for (const url of urls) {
    const sourcePath = resolveSourcePath(url, markdownPath);

    if (!sourcePath || !existsSync(sourcePath) || !imageExtensions.has(extname(sourcePath).toLowerCase())) {
      if (existingMappings[modulePath]?.[url]) {
        mappings[modulePath] ??= {};
        mappings[modulePath][url] = existingMappings[modulePath][url];
      }
      continue;
    }

    const publicUrl = copyImage(sourcePath, slug);

    mappings[modulePath] ??= {};
    mappings[modulePath][url] = publicUrl;
  }
}

writeFileSync(
  generatedFile,
  `import type { PostAssetMap } from './types';\n\nexport const generatedNoteAssets: Record<string, PostAssetMap> = ${JSON.stringify(mappings, null, 2)};\n`,
);

function extractImageUrls(markdown) {
  const urls = new Set();
  const markdownImagePattern = /!\[[^\]]*]\(([^)]+)\)/g;
  const htmlImagePattern = /<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi;

  for (const match of markdown.matchAll(markdownImagePattern)) {
    const url = cleanMarkdownUrl(match[1]);

    if (url) {
      urls.add(url);
    }
  }

  for (const match of markdown.matchAll(htmlImagePattern)) {
    const url = match[1].trim();

    if (url) {
      urls.add(url);
    }
  }

  return urls;
}

function readExistingMappings() {
  if (!existsSync(generatedFile)) {
    return {};
  }

  const content = readFileSync(generatedFile, 'utf8');
  const match = /=\s*(\{[\s\S]*\})\s*;?\s*$/.exec(content);

  if (!match) {
    return {};
  }

  try {
    return JSON.parse(match[1]);
  } catch {
    return {};
  }
}

function cleanMarkdownUrl(value) {
  const trimmed = value.trim();

  if ((trimmed.startsWith('<') && trimmed.endsWith('>')) || (trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1).trim();
  }

  return trimmed;
}

function resolveSourcePath(url, markdownPath) {
  const path = stripUrlSuffix(url);

  if (path.startsWith('file://')) {
    return fileURLToPath(path);
  }

  if (isPublicOrRemoteUrl(path)) {
    return undefined;
  }

  if (isWindowsAbsolutePath(path) || isAbsolute(path)) {
    return normalize(path);
  }

  return resolve(dirname(markdownPath), path);
}

function stripUrlSuffix(url) {
  const index = url.search(/[?#]/);
  return index === -1 ? url : url.slice(0, index);
}

function isPublicOrRemoteUrl(url) {
  if (url.startsWith('/') || url.startsWith('#')) {
    return true;
  }

  if (isWindowsAbsolutePath(url)) {
    return false;
  }

  return /^[a-z][a-z\d+.-]*:/i.test(url);
}

function isWindowsAbsolutePath(path) {
  return /^[a-z]:[\\/]/i.test(path);
}

function copyImage(sourcePath, slug) {
  const hash = createHash('sha1').update(sourcePath).digest('hex').slice(0, 8);
  const extension = extname(sourcePath);
  const safeName = `${basename(sourcePath, extension).replace(/[^\w.-]+/g, '-')}-${hash}${extension}`;
  const targetDir = join(publicAssetDir, slug);
  const targetPath = join(targetDir, safeName);

  mkdirSync(targetDir, { recursive: true });
  copyFileSync(sourcePath, targetPath);

  return `/note-assets/${slug}/${safeName}`;
}

function toModulePath(markdownPath) {
  const relativePath = relative(resolve(root, 'src/lib'), markdownPath).split(sep).join('/');
  return relativePath.startsWith('.') ? relativePath : `./${relativePath}`;
}
