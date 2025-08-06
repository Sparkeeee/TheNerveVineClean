import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    log: ['error', 'warn'],
    // Optimized for Vercel serverless
    transactionOptions: {
      timeout: 5000, // 5 seconds
    },
  });
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ['query', 'error', 'warn'],
    });
  }
  prisma = global.prisma;
}

// Simple cache with optimized TTL for maximum efficiency
const cache = new Map();
const CACHE_TTL = process.env.NODE_ENV === 'production' 
  ? 15 * 60 * 1000  // 15 minutes in production (herbs/supplements rarely change)
  : 2 * 60 * 1000;  // 2 minutes in development for testing

// Cache cleanup to prevent memory leaks
const CLEANUP_INTERVAL = 30 * 60 * 1000; // 30 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_TTL * 2) { // Clean expired + buffer
      cache.delete(key);
    }
  }
}, CLEANUP_INTERVAL);

// Simplified cached functions without complex connection management
export async function getCachedSupplement(slug: string) {
  // Production optimization: Remove debug logging for performance
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEBUG] getCachedSupplement called with slug: ${slug}`);
  }
  
  const cacheKey = `supplement:${slug}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG] Returning cached supplement for: ${slug}`);
    }
    return cached.data;
  }
  
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG] Fetching supplement from database: ${slug}`);
    }
    const data = await prisma.supplement.findFirst({
      where: { slug },
      select: { 
        id: true, 
        name: true, 
        slug: true, 
        description: true, 
        comprehensiveArticle: true,
        heroImageUrl: true, 
        galleryImages: true, 
        cautions: true,
        references: true,
        products: {
          select: {
            id: true,
            name: true,
            description: true,
            imageUrl: true,
            price: true,
            affiliateLink: true,
            qualityScore: true,
            affiliateRate: true
          }
        }
      }
    });
    
    console.log(`[DEBUG] Supplement query result:`, data ? 'Found' : 'Not found');
    
    if (data) {
      cache.set(cacheKey, { data, timestamp: Date.now() });
    }
    return data;
  } catch (error) {
    console.error('Error fetching supplement:', error);
    return null;
  }
}

export async function getCachedSymptom(slug: string) {
  try {
    // Temporarily bypass cache for debugging
    console.log(`[DEBUG] getCachedSymptom called with slug: ${slug}`);
    
    // Fetch from database
    const symptom = await prisma.symptom.findUnique({
      where: { slug },
      include: {
        products: {
          include: {
            merchant: true
          }
        },
        variants: {
          include: {
            herbs: true,
            supplements: true
          }
        }
      }
    });

    if (symptom) {
      // Debug: Log the raw variants data
      console.log(`[DEBUG] Raw variants data for ${slug}:`, {
        variantsCount: symptom.variants?.length || 0,
        variantNames: symptom.variants?.map(v => v.name) || [],
        isArray: Array.isArray(symptom.variants)
      });
      
      return symptom;
    }

    return null;
  } catch (error) {
    console.error('Error fetching symptom:', error);
    return null;
  }
}

export async function getCachedHerb(slug: string) {
  console.log(`[DEBUG] getCachedHerb called with slug: ${slug}`);
  const cacheKey = `herb:${slug}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`[DEBUG] Returning cached herb for: ${slug}`);
    return cached.data;
  }
  
  try {
    console.log(`[DEBUG] Fetching herb from database: ${slug}`);
    const data = await prisma.herb.findFirst({
      where: { slug },
      select: { 
        id: true, 
        name: true, 
        slug: true, 
        description: true, 
        comprehensiveArticle: true,
        heroImageUrl: true, 
        galleryImages: true,
        latinName: true,
        traditionalUses: true,
        cautions: true,
        references: true,
        products: {
          select: {
            id: true,
            name: true,
            description: true,
            imageUrl: true,
            price: true,
            affiliateLink: true,
            qualityScore: true,
            affiliateRate: true
          }
        }
      }
    });
    
    console.log(`[DEBUG] Herb query result:`, data ? 'Found' : 'Not found');
    
    if (data) {
      cache.set(cacheKey, { data, timestamp: Date.now() });
    }
    return data;
  } catch (error) {
    console.error('Error fetching herb:', error);
    return null;
  }
}

export async function getCachedHerbs() {
  const cacheKey = 'herbs:all';
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log('[DEBUG] Returning cached herbs');
    return cached.data;
  }
  
  try {
    console.log('[DEBUG] Fetching herbs from database...');
    
    // Test connection first
    await prisma.$connect();
    console.log('[DEBUG] Database connected for herbs query');
    
    const data = await prisma.herb.findMany({
      select: { 
        id: true, 
        name: true, 
        slug: true, 
        description: true,
        latinName: true,
        traditionalUses: true,
        cardImageUrl: true,
        references: true,
        indicationTags: {
          select: {
            name: true,
            slug: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });
    
    console.log(`[DEBUG] Found ${data.length} herbs`);
    
    cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  } catch (error) {
    console.error('Error fetching herbs:', error);
    console.error('Herbs error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      name: error instanceof Error ? error.name : 'Unknown name',
    });
    // Return empty array but don't cache the failure
    return [];
  }
}

export async function getCachedSymptoms() {
  const cacheKey = 'symptoms:all';
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log('[DEBUG] Returning cached symptoms');
    return cached.data;
  }
  
  try {
    console.log('[DEBUG] Fetching symptoms from database...');
    
    // Test connection first
    await prisma.$connect();
    console.log('[DEBUG] Database connected for symptoms query');
    
    const data = await prisma.symptom.findMany({
      select: { 
        id: true, 
        title: true, 
        slug: true, 
        description: true 
      },
      orderBy: { title: 'asc' }
    });
    
    console.log(`[DEBUG] Found ${data.length} symptoms`);
    
    cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  } catch (error) {
    console.error('Error fetching symptoms:', error);
    console.error('Symptoms error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      name: error instanceof Error ? error.name : 'Unknown name',
    });
    // Return empty array but don't cache the failure
    return [];
  }
}

export async function getCachedSupplements() {
  const cacheKey = 'supplements:all';
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  try {
    const data = await prisma.supplement.findMany({
      select: { 
        id: true, 
        name: true, 
        slug: true, 
        description: true,
        cardImageUrl: true,
        indicationTags: {
          select: {
            name: true,
            slug: true
          }
        }
      }
    });
    
    cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  } catch (error) {
    console.error('Error fetching supplements:', error);
    return [];
  }
}

// Clear cache function
export function clearCache() {
  cache.clear();
}

// Graceful shutdown for Vercel
export async function disconnect() {
  if (prisma) {
    await prisma.$disconnect();
  }
}

// Utility function for database operations with timeout
export async function withTimeout<T>(
  operation: () => Promise<T>,
  timeoutMs: number = 8000
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Database operation timeout')), timeoutMs);
  });

  try {
    await prisma.$connect(); // Ensure connection is established for the operation
    return await Promise.race([operation(), timeoutPromise]);
  } catch (error) {
    console.error('Database operation failed:', error);
    throw error;
  }
}

// Optimized query functions with selective field fetching
export async function getCachedHerbsOptimized(limit?: number, offset?: number) {
  const cacheKey = `herbs:all:${limit || 'all'}:${offset || 0}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  try {
    await prisma.$connect(); // Ensure connection is established for the operation
    
    const data = await prisma.herb.findMany({
      select: { 
        id: true, 
        name: true, 
        slug: true, 
        description: true,
        latinName: true
      },
      ...(limit && { take: limit }),
      ...(offset && { skip: offset }),
      orderBy: { name: 'asc' }
    });
    
    cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  } catch (error) {
    console.error('Error fetching herbs:', error);
    return [];
  }
}

export async function getCachedSymptomsOptimized(limit?: number, offset?: number) {
  const cacheKey = `symptoms:all:${limit || 'all'}:${offset || 0}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  try {
    await prisma.$connect(); // Ensure connection is established for the operation
    
    const data = await prisma.symptom.findMany({
      select: { 
        id: true, 
        title: true, 
        slug: true, 
        description: true 
      },
      ...(limit && { take: limit }),
      ...(offset && { skip: offset }),
      orderBy: { title: 'asc' }
    });
    
    cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  } catch (error) {
    console.error('Error fetching symptoms:', error);
    return [];
  }
}

export async function getCachedSupplementsOptimized(limit?: number, offset?: number) {
  const cacheKey = `supplements:all:${limit || 'all'}:${offset || 0}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  try {
    await prisma.$connect(); // Ensure connection is established for the operation
    
    const data = await prisma.supplement.findMany({
      select: { 
        id: true, 
        name: true, 
        slug: true, 
        description: true 
      },
      ...(limit && { take: limit }),
      ...(offset && { skip: offset }),
      orderBy: { name: 'asc' }
    });
    
    cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  } catch (error) {
    console.error('Error fetching supplements:', error);
    return [];
  }
}

// Optimized single item fetch with minimal fields
export async function getCachedHerbMinimal(slug: string) {
  const cacheKey = `herb:minimal:${slug}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  try {
    await prisma.$connect(); // Ensure connection is established for the operation
    
    const data = await prisma.herb.findFirst({
      where: { slug },
      select: { 
        id: true, 
        name: true, 
        slug: true, 
        description: true,
        latinName: true
      }
    });
    
    if (data) {
      cache.set(cacheKey, { data, timestamp: Date.now() });
    }
    return data;
  } catch (error) {
    console.error('Error fetching herb minimal:', error);
    return null;
  }
}

export async function getCachedSymptomMinimal(slug: string) {
  const cacheKey = `symptom:minimal:${slug}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  try {
    await prisma.$connect(); // Ensure connection is established for the operation
    
    const data = await prisma.symptom.findUnique({
      where: { slug },
      select: { 
        id: true, 
        title: true, 
        slug: true, 
        description: true 
      }
    });
    
    if (data) {
      cache.set(cacheKey, { data, timestamp: Date.now() });
    }
    return data;
  } catch (error) {
    console.error('Error fetching symptom minimal:', error);
    return null;
  }
}

// Batch operations to reduce connection overhead
export async function getCachedItemsBatch(slugs: string[], type: 'herb' | 'symptom' | 'supplement') {
  const cacheKey = `${type}:batch:${slugs.sort().join(',')}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  try {
    await prisma.$connect(); // Ensure connection is established for the operation
    
    let data;
    switch (type) {
      case 'herb':
        data = await prisma.herb.findMany({
          where: { slug: { in: slugs } },
          select: { id: true, name: true, slug: true, description: true }
        });
        break;
      case 'symptom':
        data = await prisma.symptom.findMany({
          where: { slug: { in: slugs } },
          select: { id: true, title: true, slug: true, description: true }
        });
        break;
      case 'supplement':
        data = await prisma.supplement.findMany({
          where: { slug: { in: slugs } },
          select: { id: true, name: true, slug: true, description: true }
        });
        break;
    }
    
    cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  } catch (error) {
    console.error(`Error fetching ${type} batch:`, error);
    return [];
  }
}

export default prisma; 