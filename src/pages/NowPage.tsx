import { lazy, Suspense } from 'react';
import { nowContent } from '../lib/posts';

const MarkdownArticle = lazy(() => import('../components/MarkdownArticle').then((module) => ({ default: module.MarkdownArticle })));

export function NowPage() {
  return (
    <section className="page-section narrow">
      <div className="page-heading">
        <span className="eyebrow">Now</span>
        <h1>现在正在学什么</h1>
        <p>这个页面像阶段进展快照，后续只需要更新 Markdown。</p>
      </div>
      <Suspense fallback={<p>正在加载内容...</p>}>
        <MarkdownArticle content={nowContent} />
      </Suspense>
    </section>
  );
}
