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

  const files = fs.readdirSync(blogDirectory);
  const posts = files.map(file => {
    const content = fs.readFileSync(path.join(blogDirectory, file), 'utf8');
    const { data } = matter(content);
    return {
      filename: file,
      ...data
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
  } catch (e) {
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
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}
