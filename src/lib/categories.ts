import fs from 'fs';
import path from 'path';
import { Category } from '@/types';

const categoriesFile = path.join(process.cwd(), 'content/config/categories.json');

export function getAllCategories(): Category[] {
  try {
    if (!fs.existsSync(categoriesFile)) {
      return [];
    }
    const content = fs.readFileSync(categoriesFile, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Failed to read categories:', error);
    return [];
  }
}
