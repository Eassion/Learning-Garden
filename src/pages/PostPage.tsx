import { ArrowLeft, Calendar, Clock, Folder, Tags } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { MarkdownArticle } from '../components/MarkdownArticle';
import { formatDate, statusLabel, statusTone } from '../lib/labels';
import { posts } from '../lib/posts';
import { categoryPath, decodeRouteParam, tagPath } from '../lib/routes';

export function PostPage() {
  const { slug } = useParams();
  const post = posts.find((item) => item.slug === decodeRouteParam(slug));

  if (!post) {
    return (
      <section className="page-section narrow">
        <Link className="back-link" to="/blog">
          <ArrowLeft size={16} />
          返回笔记列表
        </Link>
        <h1>没有找到这篇笔记</h1>
      </section>
    );
  }

  const related = posts.filter((item) => item.slug !== post.slug && (item.category === post.category || item.tags.some((tag) => post.tags.includes(tag)))).slice(0, 3);

  return (
    <article className="page-section article-page">
      <Link className="back-link" to="/blog">
        <ArrowLeft size={16} />
        返回笔记列表
      </Link>
      <header className="article-header">
        <span className={`status-pill ${statusTone[post.status]}`}>{statusLabel[post.status]}</span>
        <h1>{post.title}</h1>
        <p>{post.summary}</p>
        <div className="article-meta">
          <span>
            <Calendar size={16} />
            {formatDate(post.date)}
          </span>
          <span>
            <Clock size={16} />
            {post.readingMinutes} 分钟
          </span>
          <Link to={categoryPath(post.category)}>
            <Folder size={16} />
            {post.category}
          </Link>
        </div>
        <div className="tag-row article-tags">
          <Tags size={16} />
          {post.tags.map((tag) => (
            <Link key={tag} to={tagPath(tag)}>
              {tag}
            </Link>
          ))}
        </div>
      </header>
      <MarkdownArticle content={post.content} />
      {related.length > 0 && (
        <section className="related-notes">
          <h2>相关笔记</h2>
          <div className="related-list">
            {related.map((item) => (
              <Link key={item.slug} to={`/blog/${item.slug}`}>
                <strong>{item.title}</strong>
                <span>{item.category}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
