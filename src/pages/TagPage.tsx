import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { PostCard } from '../components/PostCard';
import { groupPostsByTag } from '../lib/content';
import { posts } from '../lib/posts';
import { decodeRouteParam } from '../lib/routes';

export function TagPage() {
  const { tag } = useParams();
  const decoded = decodeRouteParam(tag);
  const tagPosts = groupPostsByTag(posts, decoded);

  return (
    <section className="page-section">
      <Link className="back-link" to="/tags">
        <ArrowLeft size={16} />
        返回标签
      </Link>
      <div className="page-heading">
        <span className="eyebrow">Tag</span>
        <h1>{decoded}</h1>
        <p>{tagPosts.length} 篇笔记包含这个标签。</p>
      </div>
      <div className="post-list">
        {tagPosts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
