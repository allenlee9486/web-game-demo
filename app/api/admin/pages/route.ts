import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const pagesDir = path.join(process.cwd(), 'content/pages');

// Helper to check auth
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

  if (!fs.existsSync(pagesDir)) {
    fs.mkdirSync(pagesDir, { recursive: true });
  }

  if (filename) {
    const filePath = path.join(pagesDir, filename);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      return NextResponse.json({ content });
    }
    return NextResponse.json({ content: '' }); // Return empty if not exists yet
  }

  // List files
  const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.md'));
  return NextResponse.json({ files });
}

export async function POST(req: Request) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { filename, content } = body;

    if (!filename || typeof content !== 'string') {
        return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    if (!fs.existsSync(pagesDir)) {
      fs.mkdirSync(pagesDir, { recursive: true });
    }

    const filePath = path.join(pagesDir, filename);
    fs.writeFileSync(filePath, content);
    
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to save page' }, { status: 500 });
  }
}
