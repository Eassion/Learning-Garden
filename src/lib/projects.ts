export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  title: string;
  period: string;
  status: '构思中' | '开发中' | '已完成';
  summary: string;
  stack: string[];
  links: ProjectLink[];
}

export const projects: Project[] = [
  {
    title: 'Learning Garden',
    period: '2026',
    status: '开发中',
    summary: '用 Markdown、分类归档、学习热力图和 Docker 部署，把 Java 后端、Golang 后端和 Agent 开发笔记整理成长期维护的个人学习花园。',
    stack: ['React', 'TypeScript', 'Vite', 'Docker', 'nginx'],
    links: [
      { label: '线上预览', href: '/' },
      { label: '全部笔记', href: '/blog' },
    ],
  },
  {
    title: 'Java 后端学习路径',
    period: '2026',
    status: '构思中',
    summary: '围绕 Spring Boot、JVM、数据库事务和服务治理整理后端知识，把概念、案例和项目实践连接起来。',
    stack: ['Java', 'Spring Boot', 'JVM', 'MySQL'],
    links: [{ label: '相关笔记', href: '/categories/Java%20%E5%90%8E%E7%AB%AF' }],
  },
  {
    title: 'Agent 开发实验',
    period: '2026',
    status: '构思中',
    summary: '记录 LLM 工具调用、任务编排、记忆管理和评估方法，把 Agent 能力拆成可复用的实验记录。',
    stack: ['LLM', 'Tool Use', 'Workflow', 'Evaluation'],
    links: [{ label: '相关笔记', href: '/categories/Agent%20%E5%BC%80%E5%8F%91' }],
  },
];

export function validateProjects(entries: Project[]) {
  for (const project of entries) {
    const missing = [
      !project.title && 'title',
      !project.summary && 'summary',
      project.stack.length === 0 && 'stack',
      project.links.length === 0 && 'links',
    ].filter(Boolean);

    if (missing.length > 0) {
      throw new Error(`${project.title || 'Untitled project'} missing required fields: ${missing.join(', ')}`);
    }
  }
}
