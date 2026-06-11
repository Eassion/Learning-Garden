export type PostStatus = 'learning' | 'done' | 'reviewing';

export interface Post {
  slug: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  summary: string;
  status: PostStatus;
  content: string;
  readingMinutes: number;
}

export interface CategoryStat {
  category: string;
  count: number;
  latestDate: string;
  statusCounts: Record<PostStatus, number>;
}

export interface TagStat {
  tag: string;
  count: number;
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
