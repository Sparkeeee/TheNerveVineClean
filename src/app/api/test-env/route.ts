import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const databaseUrl = process.env.DATABASE_URL;
    
    // Check if DATABASE_URL is set
    const hasDatabaseUrl = !!databaseUrl;
    
    // Extract parts of the URL to check format
    let urlParts = {};
    if (databaseUrl) {
      try {
        const url = new URL(databaseUrl);
        urlParts = {
          protocol: url.protocol,
          hostname: url.hostname,
          port: url.port,
          pathname: url.pathname,
          search: url.search
        };
      } catch (e) {
        urlParts = { error: 'Invalid URL format' };
      }
    }
    
    return NextResponse.json({
      success: true,
      hasDatabaseUrl,
      databaseUrl: hasDatabaseUrl ? 'Set (hidden for security)' : 'Not Set',
      urlParts,
      nodeEnv: process.env.NODE_ENV,
      otherEnvVars: {
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        hasNextAuthUrl: !!process.env.NEXTAUTH_URL
      }
    });
    
  } catch (error) {
    console.error('Environment test error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}