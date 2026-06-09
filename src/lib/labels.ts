import type { PostStatus } from './types';

export const statusLabel: Record<PostStatus, string> = {
  learning: '学习中',
  done: '已完成',
  reviewing: '回看中',
};

export const statusTone: Record<PostStatus, string> = {
  learning: 'tone-learning',
  done: 'tone-done',
  reviewing: 'tone-reviewing',
};

export function formatMonth(month: string): string {
  const [year, value] = month.split('-');
  return `${year} 年 ${Number(value)} 月`;
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(`${date}T00:00:00`));
}
