import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
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
  });
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ['query', 'error', 'warn'],
    });
  }
  prisma = global.prisma;
}

// Cache for frequently accessed data
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Helper function to ensure database connection
async function ensureConnection() {
  try {
    await prisma.$connect();
  } catch (error) {
    console.error('Database connection error:', error);
    throw new Error('Database connection failed');
  }
}

// Cached database functions
export async function getCachedSupplement(slug: string) {
  const cacheKey = `supplement:${slug}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  try {
    await ensureConnection();
    
    const data = await prisma.supplement.findFirst({
      where: { slug },
      select: { 
        id: true, 
        name: true, 
        slug: true, 
        description: true, 
        heroImageUrl: true, 
        galleryImages: true, 
        cautions: true,
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
    
    cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  } catch (error) {
    console.error('Error fetching supplement:', error);
    return null;
  }
}

export async function getCachedSymptom(slug: string) {
  const cacheKey = `symptom:${slug}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  try {
    await ensureConnection();
    
    const data = await prisma.symptom.findUnique({
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
    
    cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  } catch (error) {
    console.error('Error fetching symptom:', error);
    return null;
  }
}

export async function getCachedHerb(slug: string) {
  const cacheKey = `herb:${slug}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  try {
    await ensureConnection();
    
    const data = await prisma.herb.findFirst({
      where: { slug },
      select: { 
        id: true, 
        name: true, 
        slug: true, 
        description: true, 
        heroImageUrl: true, 
        latinName: true,
        indications: true,
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
    
    cache.set(cacheKey, { data, timestamp: Date.now() });
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
    return cached.data;
  }
  
  try {
    await ensureConnection();
    
    const data = await prisma.herb.findMany({
      select: { id: true, name: true, slug: true, description: true }
    });
    
    cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  } catch (error) {
    console.error('Error fetching herbs:', error);
    return [];
  }
}

export async function getCachedSymptoms() {
  const cacheKey = 'symptoms:all';
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  try {
    await ensureConnection();
    
    const data = await prisma.symptom.findMany({
      select: { id: true, title: true, slug: true, description: true }
    });
    
    cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  } catch (error) {
    console.error('Error fetching symptoms:', error);
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
    await ensureConnection();
    
    const data = await prisma.supplement.findMany({
      select: { id: true, name: true, slug: true, description: true }
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

export default prisma; 