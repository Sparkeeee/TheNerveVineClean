// Performance monitoring for compute optimization
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTimer(operation: string): string {
    const id = `${operation}_${Date.now()}_${Math.random()}`;
    const startTime = performance.now();
    
    // Store start time
    this.metrics.set(id, [startTime]);
    
    return id;
  }

  endTimer(id: string): number {
    const startTime = this.metrics.get(id);
    if (!startTime) return 0;
    
    const endTime = performance.now();
    const duration = endTime - startTime[0];
    
    // Store duration for analysis
    const durations = this.metrics.get(`${id}_durations`) || [];
    durations.push(duration);
    this.metrics.set(`${id}_durations`, durations);
    
    // Clean up start time
    this.metrics.delete(id);
    
    return duration;
  }

  getAverageTime(operation: string): number {
    const durations = this.metrics.get(`${operation}_durations`);
    if (!durations || durations.length === 0) return 0;
    
    const sum = durations.reduce((a, b) => a + b, 0);
    return sum / durations.length;
  }

  logSlowOperations(threshold: number = 1000): void {
    console.log('🐌 Slow Operations (>', threshold, 'ms):');
    
    for (const [key] of this.metrics.entries()) {
      if (key.includes('_durations')) {
        const avg = this.getAverageTime(key.replace('_durations', ''));
        if (avg > threshold) {
          console.log(`  ${key.replace('_durations', '')}: ${avg.toFixed(2)}ms avg`);
        }
      }
    }
  }

  clearMetrics(): void {
    this.metrics.clear();
  }
}

// Database performance wrapper
export function withPerformanceMonitoring<T>(
  operation: string,
  fn: () => Promise<T>
): Promise<T> {
  const monitor = PerformanceMonitor.getInstance();
  const timerId = monitor.startTimer(operation);
  
  return fn().finally(() => {
    const duration = monitor.endTimer(timerId);
    if (duration > 1000) {
      console.warn(`⚠️ Slow operation: ${operation} took ${duration.toFixed(2)}ms`);
    }
  });
}

// Cache hit rate monitoring
export class CacheMonitor {
  private hits = 0;
  private misses = 0;

  hit(): void {
    this.hits++;
  }

  miss(): void {
    this.misses++;
  }

  getHitRate(): number {
    const total = this.hits + this.misses;
    return total > 0 ? (this.hits / total) * 100 : 0;
  }

  logStats(): void {
    console.log(`📊 Cache Hit Rate: ${this.getHitRate().toFixed(1)}% (${this.hits} hits, ${this.misses} misses)`);
  }
} 