import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const articlePath = path.join(process.cwd(), 'public', 'articles', `${slug}-article.md`);
    
    // Check if file exists
    if (!fs.existsSync(articlePath)) {
      return new NextResponse('Article not found', { status: 404 });
    }
    
    // Read the markdown file
    const content = await fs.promises.readFile(articlePath, 'utf-8');
    
    // Return the content as plain text
    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    console.error('Error reading article:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
} 