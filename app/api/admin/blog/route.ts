import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const blogDirectory = path.join(process.cwd(), 'content/blog');

const checkAuth = (req: Request) => {
  const authHeader = req.headers.get('authorization');
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  return authHeader === `Bearer ${password}`;
};

export async function GET(req: Request) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const filename = searchParams.get('filename');

  if (filename) {
    const fullPath = path.join(blogDirectory, filename);
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
    const content = fs.readFileSync(fullPath, 'utf8');
    const { data, content: markdownContent } = matter(content);
    return NextResponse.json({
      filename,
      ...data,
      content: markdownContent
    });
  }

  const files = fs.readdirSync(blogDirectory);
  const posts = files.map(file => {
    const content = fs.readFileSync(path.join(blogDirectory, file), 'utf8');
    const { data, content: markdownContent } = matter(content);
    
    // Logic to extract image from content
    let coverImage = data.coverImage;
    
    if (!coverImage || coverImage.includes('placeholder.jpg')) {
      const markdownImageRegex = /!\[.*?\]\((.*?)\)/;
      const htmlImageRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/;
      
      const mdMatch = markdownContent.match(markdownImageRegex);
      const htmlMatch = markdownContent.match(htmlImageRegex);
      
      if (mdMatch && htmlMatch) {
        if ((mdMatch.index || 0) < (htmlMatch.index || 0)) {
          coverImage = mdMatch[1];
        } else {
          coverImage = htmlMatch[1];
        }
      } else if (mdMatch) {
        coverImage = mdMatch[1];
      } else if (htmlMatch) {
        coverImage = htmlMatch[1];
      }
    }

    return {
      filename: file,
      ...data,
      coverImage // Override or set coverImage
    };
  });

  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { filename, content, ...data } = body;
    
    const safeFilename = filename.endsWith('.md') ? filename : `${filename}.md`;
    const fullPath = path.join(blogDirectory, safeFilename);

    const fileContent = matter.stringify(content || '', data);
    fs.writeFileSync(fullPath, fileContent);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to save file' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      return NextResponse.json({ error: 'Filename required' }, { status: 400 });
    }

    const fullPath = path.join(blogDirectory, filename);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}
