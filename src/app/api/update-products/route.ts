import { NextRequest, NextResponse } from 'next/server';
import { handleProductUpdate } from '../../../lib/automated-product-updater';

export async function POST(request: NextRequest) {
  try {
    const { herbSlug } = await request.json();
    
    if (!herbSlug) {
      return NextResponse.json(
        { error: 'Herb slug is required' },
        { status: 400 }
      );
    }
    
    const result = await handleProductUpdate(herbSlug);
    
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error updating products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const herbSlug = searchParams.get('herb');
  
  if (!herbSlug) {
    return NextResponse.json(
      { error: 'Herb slug is required' },
      { status: 400 }
    );
  }
  
  try {
    const result = await handleProductUpdate(herbSlug);
    
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error updating products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 