export function postPath(slug: string): string {
  return `/blog/${encodeURIComponent(slug)}`;
}

export function decodeRouteParam(value?: string): string {
  return decodeURIComponent(value ?? '');
}
