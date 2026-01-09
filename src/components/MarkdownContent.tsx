import ReactMarkdown from "react-markdown";

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <article className="prose prose-slate max-w-none dark:prose-invert 
      prose-headings:font-bold prose-headings:tracking-tight
      prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
      prose-img:rounded-xl prose-img:shadow-md">
      <ReactMarkdown>{content}</ReactMarkdown>
    </article>
  );
}
