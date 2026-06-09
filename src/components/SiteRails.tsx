import { Bot, Coffee, FileText, Server } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Heatmap } from './Heatmap';
import { heatmap, posts } from '../lib/posts';

const stacks = [
  {
    title: 'Java 后端',
    detail: 'Spring Boot / JVM / 微服务',
    icon: Coffee,
  },
  {
    title: 'Golang 后端',
    detail: 'Go / Gin / 并发编程',
    icon: Server,
  },
  {
    title: 'Agent 开发',
    detail: 'LLM / Tool Use / 工作流编排',
    icon: Bot,
  },
];

export function TechStackRail() {
  return (
    <aside className="site-rail site-rail-left" aria-label="个人技术栈">
      <section className="rail-panel tech-rail-panel">
        <div className="rail-heading">
          <span className="eyebrow">Technical stack</span>
          <h2>个人技术栈</h2>
          <p>正在建立的学习坐标。</p>
        </div>
        <div className="tech-stack-grid rail-tech-list">
          {stacks.map((stack) => (
            <div className="tech-stack-item" key={stack.title}>
              <stack.icon size={18} />
              <div>
                <strong>{stack.title}</strong>
                <span>{stack.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}

export function LearningPulseRail() {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthCount = posts.filter((post) => post.date.startsWith(currentMonth)).length;

  return (
    <aside className="site-rail site-rail-right" aria-label="学习热力图和知识沉淀统计">
      <section className="rail-panel stats-rail-panel">
        <div className="rail-heading">
          <span className="eyebrow">Knowledge base</span>
          <h2>学习沉淀</h2>
        </div>
        <div className="hero-metrics rail-metrics" aria-label="学习统计">
          <span>
            <strong>{posts.length}</strong>
            篇笔记
          </span>
          <span>
            <strong>{monthCount}</strong>
            本月新增
          </span>
        </div>
        <Link className="secondary-action" to="/blog">
          <FileText size={18} />
          查看笔记
        </Link>
      </section>
      <Heatmap data={heatmap} compact />
    </aside>
  );
}
