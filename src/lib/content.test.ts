import { describe, expect, it } from 'vitest';
import {
  buildArchive,
  buildCategoryStats,
  buildHeatmap,
  chooseReviewPost,
  parsePost,
} from './content';
import type { Post } from './types';

const makePost = (overrides: Partial<Post>): Post => ({
  slug: 'sample',
  title: '示例笔记',
  date: '2026-06-01',
  category: 'Java 后端',
  tags: ['Spring'],
  summary: '一篇示例笔记',
  status: 'learning',
  content: '正文',
  readingMinutes: 1,
  ...overrides,
});

describe('parsePost', () => {
  it('parses frontmatter and markdown content into a post', () => {
    const post = parsePost(
      '/src/content/posts/spring-transaction.md',
      `---
title: Spring 事务学习
date: 2026-06-02
category: Java 后端
tags:
  - Spring
  - 事务
summary: 事务传播机制和失效场景记录
status: reviewing
---

# 正文标题

这里是正文。`,
    );

    expect(post).toMatchObject({
      slug: 'spring-transaction',
      title: 'Spring 事务学习',
      date: '2026-06-02',
      category: 'Java 后端',
      tags: ['Spring', '事务'],
      summary: '事务传播机制和失效场景记录',
      status: 'reviewing',
    });
    expect(post.content).toContain('# 正文标题');
    expect(post.readingMinutes).toBe(1);
  });

  it('throws a clear error when required frontmatter is missing', () => {
    expect(() =>
      parsePost(
        '/src/content/posts/missing-category.md',
        `---
title: 缺少分类
date: 2026-06-02
summary: 没有 category
---

正文`,
      ),
    ).toThrow('missing required frontmatter: category');
  });
});

describe('content aggregations', () => {
  const posts = [
    makePost({ slug: 'old-review', date: '2026-05-01', category: 'Java 后端', status: 'reviewing' }),
    makePost({ slug: 'new-learning', date: '2026-06-03', category: 'Java 后端', status: 'learning' }),
    makePost({ slug: 'go-note', date: '2026-06-03', category: 'Golang 后端', status: 'done' }),
    makePost({ slug: 'agent-note', date: '2026-06-04', category: 'Agent 开发', status: 'done' }),
  ];

  it('groups posts by category with counts, latest date, and status counts', () => {
    expect(buildCategoryStats(posts)).toEqual([
      {
        category: 'Java 后端',
        count: 2,
        latestDate: '2026-06-03',
        statusCounts: { learning: 1, done: 0, reviewing: 1 },
      },
      {
        category: 'Golang 后端',
        count: 1,
        latestDate: '2026-06-03',
        statusCounts: { learning: 0, done: 1, reviewing: 0 },
      },
      {
        category: 'Agent 开发',
        count: 1,
        latestDate: '2026-06-04',
        statusCounts: { learning: 0, done: 1, reviewing: 0 },
      },
    ]);
  });

  it('builds daily heatmap counts from post dates', () => {
    const heatmap = buildHeatmap(posts, new Date('2026-06-08T00:00:00'));
    const juneThird = heatmap.days.find((day) => day.date === '2026-06-03');
    const juneFourth = heatmap.days.find((day) => day.date === '2026-06-04');

    expect(juneThird).toMatchObject({ count: 2, level: 2 });
    expect(juneFourth).toMatchObject({ count: 1, level: 1 });
    expect(heatmap.maxCount).toBe(2);
  });

  it('builds a descending month archive', () => {
    expect(buildArchive(posts).map((month) => `${month.month}:${month.posts.length}`)).toEqual([
      '2026-06:3',
      '2026-05:1',
    ]);
  });

  it('chooses reviewing and older posts first for random review', () => {
    const chosen = chooseReviewPost(posts, () => 0);

    expect(chosen?.slug).toBe('old-review');
  });
});
