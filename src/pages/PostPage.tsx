import { lazy, Suspense, useEffect, useState } from 'react';
import { ArrowLeft, Calendar, Clock, Folder, Tags } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { formatDate } from '../lib/labels';
import { loadPost, posts } from '../lib/posts';
import { categoryPath, decodeRouteParam, tagPath } from '../lib/routes';
import type { Post } from '../lib/types';

const MarkdownArticle = lazy(() => import('../components/MarkdownArticle').then((module) => ({ default: module.MarkdownArticle })));

export function PostPage() {
  const { slug } = useParams();
  const decodedSlug = decodeRouteParam(slug);
  const summary = posts.find((item) => item.slug === decodedSlug);
  const [post, setPost] = useState<Post>();

  useEffect(() => {
    let isCurrent = true;
    setPost(undefined);

    if (!summary) {
      return () => {
        isCurrent = false;
      };
    }

    loadPost(summary.slug).then((loadedPost) => {
      if (isCurrent) {
        setPost(loadedPost);
      }
    });

    return () => {
      isCurrent = false;
    };
  }, [summary]);

  if (!summary) {
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

  const related = posts.filter((item) => item.slug !== summary.slug && (item.category === summary.category || item.tags.some((tag) => summary.tags.includes(tag)))).slice(0, 3);

  return (
    <article className="page-section article-page">
      <Link className="back-link" to="/blog">
        <ArrowLeft size={16} />
        返回笔记列表
      </Link>
      <header className="article-header">
        <h1>{summary.title}</h1>
        <div className="article-meta">
          <span>
            <Calendar size={16} />
            {formatDate(summary.date)}
          </span>
          <span>
            <Clock size={16} />
            {summary.readingMinutes} 分钟
          </span>
          <Link to={categoryPath(summary.category)}>
            <Folder size={16} />
            {summary.category}
          </Link>
        </div>
        <div className="tag-row article-tags">
          <Tags size={16} />
          {summary.tags.map((tag) => (
            <Link key={tag} to={tagPath(tag)}>
              {tag}
            </Link>
          ))}
        </div>
      </header>
      {post ? (
        <Suspense fallback={<p>正在加载笔记...</p>}>
          <MarkdownArticle content={post.content} />
        </Suspense>
      ) : (
        <p>正在加载笔记...</p>
      )}
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
