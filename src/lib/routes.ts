export function categoryPath(category: string): string {
  return `/categories/${encodeURIComponent(category)}`;
}

export function tagPath(tag: string): string {
  return `/tags/${encodeURIComponent(tag)}`;
}

export function postPath(slug: string): string {
  return `/blog/${encodeURIComponent(slug)}`;
}

export function decodeRouteParam(value?: string): string {
  return decodeURIComponent(value ?? '');
}
