import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Validate the slug to prevent directory traversal
    if (!slug || slug.includes('..')) {
      return new NextResponse('Invalid slug', { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'public', 'articles', `${slug}.md`);

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return new NextResponse(content, {
        headers: { 'Content-Type': 'text/markdown' },
      });
    } catch (error: any) {
      // If the file doesn't exist, return a clear message
      if (error.code === 'ENOENT') {
        return new NextResponse('Content coming soon.', { status: 404 });
      }
      // For other errors, return a server error
      throw error;
    }
  } catch (error) {
    console.error(`[API ARTICLES] Error fetching article for slug:`, error);
    return new NextResponse('Failed to fetch article', { status: 500 });
  }
} 