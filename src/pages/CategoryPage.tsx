import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { PostCard } from '../components/PostCard';
import { groupPostsByCategory } from '../lib/content';
import { posts } from '../lib/posts';
import { decodeRouteParam } from '../lib/routes';

export function CategoryPage() {
  const { category } = useParams();
  const decoded = decodeRouteParam(category);
  const categoryPosts = groupPostsByCategory(posts, decoded);

  return (
    <section className="page-section">
      <Link className="back-link" to="/categories">
        <ArrowLeft size={16} />
        返回分类
      </Link>
      <div className="page-heading">
        <span className="eyebrow">Category</span>
        <h1>{decoded}</h1>
        <p>{categoryPosts.length} 篇笔记归档在这个分类下。</p>
      </div>
      <div className="post-list">
        {categoryPosts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
