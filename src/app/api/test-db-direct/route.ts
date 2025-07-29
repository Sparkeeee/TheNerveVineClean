import { NextResponse } from 'next/server';
import { Pool } from 'pg';

export async function GET() {
  try {
    // Create a direct PostgreSQL connection
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });

    // Test basic connection
    const client = await pool.connect();
    
    // Test simple query
    const result = await client.query('SELECT COUNT(*) as count FROM "Supplement"');
    const supplementCount = result.rows[0].count;
    
    // Test specific supplement query
    const lTryptophanResult = await client.query(
      'SELECT id, name, slug FROM "Supplement" WHERE slug = $1',
      ['l-tryptophan']
    );
    
    client.release();
    await pool.end();

    return NextResponse.json({
      success: true,
      databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not Set',
      supplementCount: parseInt(supplementCount),
      lTryptophanFound: lTryptophanResult.rows.length > 0,
      lTryptophanData: lTryptophanResult.rows[0] || null
    });
    
  } catch (error) {
    console.error('Direct database test error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not Set'
      },
      { status: 500 }
    );
  }
}