import { Link } from 'react-router-dom';
import { tagStats } from '../lib/posts';
import { tagPath } from '../lib/routes';

export function TagsPage() {
  return (
    <section className="page-section">
      <div className="page-heading">
        <span className="eyebrow">Tags</span>
        <h1>标签索引</h1>
        <p>标签用来连接不同分类里的相似知识点。</p>
      </div>
      <div className="tag-cloud">
        {tagStats.map((tag) => (
          <Link key={tag.tag} to={tagPath(tag.tag)}>
            {tag.tag}
            <span>{tag.count}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
