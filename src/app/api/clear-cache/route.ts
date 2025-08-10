import { NextResponse } from 'next/server';
import { clearCache } from '@/lib/database';

export async function POST() {
  try {
    clearCache();
    return NextResponse.json({ message: 'Cache cleared successfully' });
  } catch (error) {
    console.error('Error clearing cache:', error);
    return NextResponse.json({ error: 'Failed to clear cache' }, { status: 500 });
  }
}
