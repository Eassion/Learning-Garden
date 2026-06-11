import { LearningMap } from '../components/LearningMap';
import { categoryStats } from '../lib/posts';

export function CategoriesPage() {
  return (
    <section className="page-section">
      <div className="page-heading">
        <span className="eyebrow">Categories</span>
        <h1>分类归档</h1>
        <p>每篇笔记只有一个主分类。这里既是归档入口，也是你的学习路线。</p>
      </div>
      <LearningMap categories={categoryStats} />
    </section>
  );
}
