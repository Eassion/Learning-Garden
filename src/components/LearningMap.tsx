import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
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
        <p>每个分类都会自动统计文章数量和最近更新，写 Markdown 就能更新地图。</p>
      </div>
      <div className="learning-map timeline-map">
        {categories.map((category, index) => (
          <Link key={category.category} className="learning-step" to={categoryPath(category.category)}>
            <span className="step-index">{String(index + 1).padStart(2, '0')}</span>
            <div>
              <h3>{category.category}</h3>
              <p>{category.count} 篇笔记 · 最近更新 {category.latestDate}</p>
            </div>
            <ArrowRight className="step-arrow" size={18} />
          </Link>
        ))}
      </div>
    </section>
  );
}
