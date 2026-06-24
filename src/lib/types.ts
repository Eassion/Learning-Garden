export interface PostSummary {
  slug: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  readingMinutes: number;
}

export interface Post extends PostSummary {
  content: string;
}

export interface PostIndexEntry extends PostSummary {
  sourcePath: string;
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
  posts: PostSummary[];
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
