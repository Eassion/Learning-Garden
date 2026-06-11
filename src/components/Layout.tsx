import { BookOpen, FolderKanban, Home, Moon, Rocket, Sun } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { LearningPulseRail, TechStackRail } from './SiteRails';

interface LayoutProps {
  children: React.ReactNode;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const navItems = [
  { to: '/', label: '首页', icon: Home },
  { to: '/blog', label: '笔记', icon: BookOpen },
  { to: '/projects', label: '项目', icon: Rocket },
  { to: '/categories', label: '分类', icon: FolderKanban },
];

export function Layout({ children, theme, onToggleTheme }: LayoutProps) {
  const ThemeIcon = theme === 'light' ? Moon : Sun;

  return (
    <div className="app-shell">
      <header className="site-header">
        <NavLink to="/" className="brand" aria-label="回到首页">
          <span className="brand-mark">L</span>
          <span>
            <strong>Learning Garden</strong>
            <small>个人学习花园</small>
          </span>
        </NavLink>
        <nav className="site-nav" aria-label="主导航">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'active' : undefined)}>
              <item.icon size={17} />
              <span>{item.label}</span>
            </NavLink>
          ))}
          <NavLink to="/now">Now</NavLink>
        </nav>
        <button className="icon-button" type="button" onClick={onToggleTheme} aria-label="切换深色浅色主题" title="切换主题">
          <ThemeIcon size={19} />
        </button>
      </header>
      <div className="site-frame">
        <TechStackRail />
        <main className="site-main">{children}</main>
        <LearningPulseRail />
      </div>
    </div>
  );
}
