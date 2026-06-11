import { BookOpen } from 'lucide-react';
import { PostCard } from '../components/PostCard';
import { RandomReviewButton } from '../components/RandomReviewButton';
import { posts } from '../lib/posts';

export function BlogPage() {
  return (
    <section className="page-section">
      <div className="page-heading">
        <span className="eyebrow">All notes</span>
        <h1>全部学习笔记</h1>
        <p>按时间倒序排列。分类负责主线归档，标签负责交叉主题。</p>
        <RandomReviewButton />
      </div>
      <div className="post-list">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
      {posts.length === 0 && (
        <div className="empty-state">
          <BookOpen size={28} />
          <p>还没有笔记。向 `src/content/posts/` 添加 Markdown 后会自动出现在这里。</p>
        </div>
      )}
    </section>
  );
}
