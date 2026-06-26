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
    title: 'go-pilot',
    period: '2026.04',
    status: '开发中',
    summary: '参考 Claude Code 的工作方式实现的 Go 语言编码智能体，围绕工具调用、技能加载、上下文压缩、任务系统、后台任务和多智能体协作持续迭代。',
    stack: ['Go', 'Agent', 'Tool Use', 'Workflow'],
    links: [
      { label: 'GitHub', href: 'https://github.com/Eassion/go-pilot' },
      { label: '我的 GitHub', href: 'https://github.com/Eassion' },
    ],
  },
  {
    title: 'Pico',
    period: '2026.05',
    status: '开发中',
    summary: '运行在终端里的本地编码助手，聚焦会话持久化、多模型后端、上下文压缩、记忆沉淀和基准评测，强调本地使用体验和可扩展性。',
    stack: ['Python', 'CLI', 'LLM', 'Memory'],
    links: [
      { label: 'GitHub', href: 'https://github.com/Eassion/Pico' },
      { label: '我的 GitHub', href: 'https://github.com/Eassion' },
    ],
  },
  {
    title: 'feed',
    period: '2026.04',
    status: '已完成',
    summary: '一个 Go 单体 FEED 后端脚手架，保留 Handler -> Service -> Repository 分层，同时预埋 JWT、MySQL、Redis、Kafka 和推荐流接口，适合作为后端服务起点。',
    stack: ['Go', 'MySQL', 'Redis', 'Kafka'],
    links: [
      { label: 'GitHub', href: 'https://github.com/Eassion/feed' },
      { label: '我的 GitHub', href: 'https://github.com/Eassion' },
    ],
  },
  {
    title: 'File-Management-System',
    period: '2025.11',
    status: '已完成',
    summary: '一个基于 C++ 实现的命令行文件管理系统，聚焦文件操作流程、终端交互体验和基础系统编程能力，作为更底层工程训练的代表项目。',
    stack: ['C++', 'CLI', 'Data Structure', 'System Practice'],
    links: [
      { label: 'GitHub', href: 'https://github.com/Eassion/File-Management-System' },
      { label: '我的 GitHub', href: 'https://github.com/Eassion' },
    ],
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
