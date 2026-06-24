import { describe, expect, it } from 'vitest';
import {
  buildArchive,
  buildCategoryStats,
  buildHeatmap,
  chooseReviewPost,
  parsePost,
  parsePostSummary,
} from './content';
import type { Post } from './types';

const makePost = (overrides: Partial<Post>): Post => ({
  slug: 'sample',
  title: '示例笔记',
  date: '2026-06-01',
  category: 'Java 后端',
  tags: ['Spring'],
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
    });
    expect(post.content).toContain('# 正文标题');
    expect(post.readingMinutes).toBe(1);
  });

  it('resolves local markdown image paths from post assets', () => {
    const post = parsePost(
      '../content/posts/spring-transaction.md',
      `---
title: Spring 事务学习
date: 2026-06-02
category: Java 后端
---

![流程图](./spring-transaction/transaction-flow.png)
![外链](https://example.com/image.png)`,
      {
        '../content/posts/spring-transaction/transaction-flow.png': '/assets/transaction-flow.abc123.png',
      },
    );

    expect(post.content).toContain('![流程图](/assets/transaction-flow.abc123.png)');
    expect(post.content).toContain('![外链](https://example.com/image.png)');
  });

  it('converts local html image tags into markdown images', () => {
    const post = parsePost(
      '../content/posts/marktext-note.md',
      `---
title: MarkText 图片
date: 2026-06-12
category: 工具
---

<img title="" src="file:///C:/Users/me/Pictures/demo.png" alt="" width="347">`,
      {
        'file:///C:/Users/me/Pictures/demo.png': '/note-assets/marktext-note/demo.png',
      },
    );

    expect(post.content).toContain('![](/note-assets/marktext-note/demo.png)');
    expect(post.content).not.toContain('<img');
  });

  it('throws a clear error when required frontmatter is missing', () => {
    expect(() =>
      parsePost(
        '/src/content/posts/missing-category.md',
        `---
title: 缺少分类
date: 2026-06-02
---

正文`,
      ),
    ).toThrow('missing required frontmatter: category');
  });
});

describe('content aggregations', () => {
  const posts = [
    makePost({ slug: 'old-review', date: '2026-05-01', category: 'Java 后端' }),
    makePost({ slug: 'new-learning', date: '2026-06-03', category: 'Java 后端' }),
    makePost({ slug: 'go-note', date: '2026-06-03', category: 'Golang 后端' }),
    makePost({ slug: 'agent-note', date: '2026-06-04', category: 'Agent 开发' }),
  ];

  it('groups posts by category with counts and latest date', () => {
    expect(buildCategoryStats(posts)).toEqual([
      {
        category: 'Java 后端',
        count: 2,
        latestDate: '2026-06-03',
      },
      {
        category: 'Golang 后端',
        count: 1,
        latestDate: '2026-06-03',
      },
      {
        category: 'Agent 开发',
        count: 1,
        latestDate: '2026-06-04',
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

  it('chooses a random post for review', () => {
    const chosen = chooseReviewPost(posts, () => 0);

    expect(chosen?.slug).toBe('agent-note');
  });
});

describe('parsePostSummary', () => {
  it('parses post metadata without carrying markdown content', () => {
    const post = parsePostSummary(
      '../content/posts/lazy-note.md',
      `---
title: Lazy Note
date: 2026-06-24
category: Build
tags: vite, docker
---

# Heavy body

This markdown should stay out of the listing bundle.`,
    );

    expect(post).toEqual({
      slug: 'lazy-note',
      title: 'Lazy Note',
      date: '2026-06-24',
      category: 'Build',
      tags: ['vite', 'docker'],
      readingMinutes: 1,
    });
    expect('content' in post).toBe(false);
  });
});
