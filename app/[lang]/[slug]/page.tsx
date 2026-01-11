import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import { MarkdownContent } from "@/components/MarkdownContent";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), 'content/pages', `${slug}.md`);
  
  if (!fs.existsSync(filePath)) {
    return { title: 'Page Not Found' };
  }
  
  // Basic title formatting
  const title = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');
  return {
    title: `${title} - GamePortal`,
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), 'content/pages', `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const content = fs.readFileSync(filePath, 'utf8');

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 md:p-12">
        <h1 className="text-3xl font-bold mb-8 capitalize text-gray-900 dark:text-white border-b pb-4 dark:border-gray-700">
          {slug.replace(/-/g, ' ')}
        </h1>
        <div className="prose dark:prose-invert max-w-none prose-lg">
          <MarkdownContent content={content} />
        </div>
      </div>
    </div>
  );
}
