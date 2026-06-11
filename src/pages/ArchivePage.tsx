import { Link, useSearchParams } from 'react-router-dom';
import { PostCard } from '../components/PostCard';
import { postsOnDate } from '../lib/content';
import { formatMonth } from '../lib/labels';
import { archiveMonths, posts } from '../lib/posts';
import { postPath } from '../lib/routes';

export function ArchivePage() {
  const [params] = useSearchParams();
  const date = params.get('date');
  const datePosts = date ? postsOnDate(posts, date) : [];

  return (
    <section className="page-section">
      <div className="page-heading">
        <span className="eyebrow">Archive</span>
        <h1>时间归档</h1>
        <p>按月份回看学习节奏，也可以从热力图跳转到某一天的笔记。</p>
      </div>

      {date && (
        <section className="section-block subtle">
          <div className="section-heading compact">
            <h2>{date} 的笔记</h2>
            <p>{datePosts.length > 0 ? `这天写了 ${datePosts.length} 篇。` : '这天暂时没有笔记。'}</p>
          </div>
          <div className="post-list compact-list">
            {datePosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}

      <div className="archive-list">
        {archiveMonths.map((month) => (
          <section key={month.month} className="archive-month">
            <h2>{formatMonth(month.month)}</h2>
            <div>
              {month.posts.map((post) => (
                <Link key={post.slug} to={postPath(post.slug)}>
                  <time>{post.date.slice(5)}</time>
                  <span>{post.title}</span>
                  <small>{post.category}</small>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
