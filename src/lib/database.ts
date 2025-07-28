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

// Cached database functions
export async function getCachedSupplement(slug: string) {
  const cacheKey = `supplement:${slug}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  const data = await prisma.supplement.findFirst({
    where: { slug },
    include: { products: true }
  });
  
  cache.set(cacheKey, { data, timestamp: Date.now() });
  return data;
}

export async function getCachedHerbs() {
  const cacheKey = 'herbs:all';
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  const data = await prisma.herb.findMany({
    select: { id: true, name: true, slug: true, description: true }
  });
  
  cache.set(cacheKey, { data, timestamp: Date.now() });
  return data;
}

export async function getCachedSymptoms() {
  const cacheKey = 'symptoms:all';
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  const data = await prisma.symptom.findMany({
    select: { id: true, title: true, slug: true, description: true }
  });
  
  cache.set(cacheKey, { data, timestamp: Date.now() });
  return data;
}

export async function getCachedSupplements() {
  const cacheKey = 'supplements:all';
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  const data = await prisma.supplement.findMany({
    select: { id: true, name: true, slug: true, description: true }
  });
  
  cache.set(cacheKey, { data, timestamp: Date.now() });
  return data;
}

// Clear cache function
export function clearCache() {
  cache.clear();
}

export default prisma; 