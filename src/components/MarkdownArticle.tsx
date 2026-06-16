import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownArticleProps {
  content: string;
}

export function MarkdownArticle({ content }: MarkdownArticleProps) {
  return (
    <div className="article-content">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
