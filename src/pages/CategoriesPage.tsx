import { Link } from 'react-router-dom';
import { LearningMap } from '../components/LearningMap';
import { categoryStats } from '../lib/posts';
import { categoryPath } from '../lib/routes';

export function CategoriesPage() {
  return (
    <section className="page-section">
      <div className="page-heading">
        <span className="eyebrow">Categories</span>
        <h1>分类归档</h1>
        <p>每篇笔记只有一个主分类。这里既是归档入口，也是你的学习路线。</p>
      </div>
      <LearningMap categories={categoryStats} />
      <div className="category-chip-grid">
        {categoryStats.map((category) => (
          <Link key={category.category} to={categoryPath(category.category)}>
            <strong>{category.category}</strong>
            <span>{category.count} 篇笔记</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
