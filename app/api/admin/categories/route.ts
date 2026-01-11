import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const categoriesFile = path.join(process.cwd(), 'content/config/categories.json');

const checkAuth = (req: Request) => {
  const authHeader = req.headers.get('authorization');
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  return authHeader === `Bearer ${password}`;
};

export async function GET(req: Request) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    if (!fs.existsSync(categoriesFile)) {
        return NextResponse.json([]);
    }
    const content = fs.readFileSync(categoriesFile, 'utf8');
    const categories = JSON.parse(content);
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, slug } = body;
    
    if (!name || !slug) {
        return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
    }

    const content = fs.existsSync(categoriesFile) ? fs.readFileSync(categoriesFile, 'utf8') : '[]';
    let categories = JSON.parse(content);

    const newCategory = {
        id: slug, // use slug as id for simplicity
        name,
        slug
    };

    // Check for duplicates
    if (categories.some((c: any) => c.slug === slug)) {
        return NextResponse.json({ error: 'Category with this slug already exists' }, { status: 400 });
    }

    categories.push(newCategory);
    fs.writeFileSync(categoriesFile, JSON.stringify(categories, null, 2));

    return NextResponse.json({ success: true, category: newCategory });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
    if (!checkAuth(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    try {
      const body = await req.json();
      const { id, name, slug } = body;
      
      if (!id || !name || !slug) {
          return NextResponse.json({ error: 'ID, Name and slug are required' }, { status: 400 });
      }
  
      const content = fs.readFileSync(categoriesFile, 'utf8');
      let categories = JSON.parse(content);
  
      const index = categories.findIndex((c: any) => c.id === id);
      if (index === -1) {
          return NextResponse.json({ error: 'Category not found' }, { status: 404 });
      }
  
      categories[index] = { id, name, slug };
      fs.writeFileSync(categoriesFile, JSON.stringify(categories, null, 2));
  
      return NextResponse.json({ success: true, category: categories[index] });
    } catch {
      return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    if (!checkAuth(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    try {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get('id');
  
      if (!id) {
        return NextResponse.json({ error: 'ID required' }, { status: 400 });
      }
  
      const content = fs.readFileSync(categoriesFile, 'utf8');
      let categories = JSON.parse(content);
  
      const newCategories = categories.filter((c: any) => c.id !== id);
      fs.writeFileSync(categoriesFile, JSON.stringify(newCategories, null, 2));
  
      return NextResponse.json({ success: true });
    } catch {
      return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
    }
  }
