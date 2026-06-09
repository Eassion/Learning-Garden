import { MarkdownArticle } from '../components/MarkdownArticle';
import { nowContent } from '../lib/posts';

export function NowPage() {
  return (
    <section className="page-section narrow">
      <div className="page-heading">
        <span className="eyebrow">Now</span>
        <h1>现在正在学什么</h1>
        <p>这个页面像阶段进展快照，后续只需要更新 Markdown。</p>
      </div>
      <MarkdownArticle content={nowContent} />
    </section>
  );
}
