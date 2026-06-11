import { ArrowRight, BookOpen, CalendarDays, Rocket, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PostCard } from '../components/PostCard';
import { RandomReviewButton } from '../components/RandomReviewButton';
import { latestPosts } from '../lib/posts';

export function HomePage() {
  return (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">Learning Garden</span>
          <h1>把每一次学习，都沉淀成可以复习的笔记。</h1>
          <p>
            这里记录课程知识点、项目复盘和阶段目标。主页会自动汇总 Markdown 笔记，生成归档、热力图和回看入口。
          </p>
          <div className="hero-actions">
            <Link className="primary-action" to="/blog">
              <BookOpen size={18} />
              查看笔记
            </Link>
            <RandomReviewButton variant="secondary" />
          </div>
        </div>
      </section>

      <section className="section-block garden-index-section">
        <div className="hero-panel garden-index" aria-label="站点索引">
          <Link className="index-row featured" to="/now">
            <Sparkles size={20} />
            <span>
              <strong>Now</strong>
              <small>正在学习、近期目标和当前问题</small>
            </span>
            <ArrowRight size={18} />
          </Link>
          <Link className="index-row" to="/projects">
            <Rocket size={19} />
            <span>
              <strong>项目展示</strong>
              <small>放项目链接、介绍和相关学习记录</small>
            </span>
            <ArrowRight size={18} />
          </Link>
          <Link className="index-row" to="/archive">
            <CalendarDays size={19} />
            <span>
              <strong>时间归档</strong>
              <small>回看每天写下的学习轨迹</small>
            </span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading horizontal">
          <div>
            <span className="eyebrow">Latest notes</span>
            <h2>最新学习笔记</h2>
          </div>
          <Link className="text-link" to="/blog">
            全部笔记
            <ArrowRight size={16} />
          </Link>
        </div>
        <div className="post-stream">
          {latestPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

    </>
  );
}
