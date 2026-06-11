export type PostStatus = 'learning' | 'done' | 'reviewing';

export interface Post {
  slug: string;
  title: string;
  date: string;
  summary: string;
  status: PostStatus;
  content: string;
  readingMinutes: number;
}

export interface ArchiveMonth {
  month: string;
  posts: Post[];
}

export interface HeatmapDay {
  date: string;
  count: number;
  level: number;
}

export interface HeatmapData {
  days: HeatmapDay[];
  maxCount: number;
}
