import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate, statusLabel, statusTone } from '../lib/labels';
import { postPath } from '../lib/routes';
import type { Post } from '../lib/types';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="post-card">
      <div className="post-card-meta">
        <span>
          <Calendar size={15} />
          {formatDate(post.date)}
        </span>
        <span>
          <Clock size={15} />
          {post.readingMinutes} 分钟
        </span>
        <span className={`status-pill ${statusTone[post.status]}`}>{statusLabel[post.status]}</span>
      </div>
      <h3>
        <Link to={postPath(post.slug)}>{post.title}</Link>
      </h3>
      <p>{post.summary}</p>
      <Link className="read-more" to={postPath(post.slug)}>
        阅读笔记
        <ArrowRight size={16} />
      </Link>
    </article>
  );
}
