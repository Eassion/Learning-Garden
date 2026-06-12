export interface Post {
  slug: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  content: string;
  readingMinutes: number;
}

export type PostAssetMap = Record<string, string>;

export interface CategoryStat {
  category: string;
  count: number;
  latestDate: string;
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
