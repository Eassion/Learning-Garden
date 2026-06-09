import { ArrowRight, CheckCircle2, CircleDot, RefreshCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { statusLabel } from '../lib/labels';
import { categoryPath } from '../lib/routes';
import type { CategoryStat } from '../lib/types';

interface LearningMapProps {
  categories: CategoryStat[];
}

export function LearningMap({ categories }: LearningMapProps) {
  return (
    <section className="section-block">
      <div className="section-heading">
        <span className="eyebrow">Learning map</span>
        <h2>分类学习地图</h2>
        <p>每个分类都会自动统计文章数量、最近更新和进度分布，写 Markdown 就能更新地图。</p>
      </div>
      <div className="learning-map timeline-map">
        {categories.map((category, index) => (
          <Link key={category.category} className="learning-step" to={categoryPath(category.category)}>
            <span className="step-index">{String(index + 1).padStart(2, '0')}</span>
            <div>
              <h3>{category.category}</h3>
              <p>{category.count} 篇笔记 · 最近更新 {category.latestDate}</p>
              <div className="status-grid">
                <span>
                  <CircleDot size={14} />
                  {statusLabel.learning} {category.statusCounts.learning}
                </span>
                <span>
                  <CheckCircle2 size={14} />
                  {statusLabel.done} {category.statusCounts.done}
                </span>
                <span>
                  <RefreshCcw size={14} />
                  {statusLabel.reviewing} {category.statusCounts.reviewing}
                </span>
              </div>
            </div>
            <ArrowRight className="step-arrow" size={18} />
          </Link>
        ))}
      </div>
    </section>
  );
}
