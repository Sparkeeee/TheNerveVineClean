interface QueryMetrics {
  query: string;
  duration: number;
  timestamp: number;
  table: string;
  operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'COUNT';
}

class DatabaseMonitor {
  private metrics: QueryMetrics[] = [];
  private isEnabled = process.env.NODE_ENV === 'development';

  logQuery(query: string, duration: number, table: string, operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'COUNT') {
    if (!this.isEnabled) return;

    const metric: QueryMetrics = {
      query,
      duration,
      timestamp: Date.now(),
      table,
      operation
    };

    this.metrics.push(metric);

    // Keep only last 1000 metrics
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }

    // Log slow queries (>100ms)
    if (duration > 100) {
      console.warn(`Slow query detected: ${duration}ms - ${operation} on ${table}`);
    }
  }

  getMetrics() {
    const now = Date.now();
    const lastHour = this.metrics.filter(m => now - m.timestamp < 3600000);
    const lastDay = this.metrics.filter(m => now - m.timestamp < 86400000);

    return {
      total: this.metrics.length,
      lastHour: lastHour.length,
      lastDay: lastDay.length,
      averageDuration: this.metrics.length > 0 
        ? this.metrics.reduce((sum, m) => sum + m.duration, 0) / this.metrics.length 
        : 0,
      slowQueries: this.metrics.filter(m => m.duration > 100).length,
      byTable: this.groupByTable(),
      byOperation: this.groupByOperation()
    };
  }

  private groupByTable() {
    const groups: Record<string, number> = {};
    this.metrics.forEach(m => {
      groups[m.table] = (groups[m.table] || 0) + 1;
    });
    return groups;
  }

  private groupByOperation() {
    const groups: Record<string, number> = {};
    this.metrics.forEach(m => {
      groups[m.operation] = (groups[m.operation] || 0) + 1;
    });
    return groups;
  }

  clearMetrics() {
    this.metrics = [];
  }

  getOptimizationSuggestions() {
    const metrics = this.getMetrics();
    const suggestions: string[] = [];

    if (metrics.averageDuration > 50) {
      suggestions.push('Consider adding database indexes for frequently queried fields');
    }

    if (metrics.slowQueries > 10) {
      suggestions.push('Review slow queries and optimize with selective field fetching');
    }

    const tableUsage = metrics.byTable;
    const mostUsedTable = Object.entries(tableUsage).sort((a, b) => b[1] - a[1])[0];
    if (mostUsedTable && mostUsedTable[1] > 100) {
      suggestions.push(`High usage on ${mostUsedTable[0]} table - consider caching strategies`);
    }

    return suggestions;
  }
}

export const dbMonitor = new DatabaseMonitor();

// Wrapper function for monitoring database operations
export async function monitorQuery<T>(
  operation: () => Promise<T>,
  table: string,
  operationType: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'COUNT'
): Promise<T> {
  const start = Date.now();
  try {
    const result = await operation();
    const duration = Date.now() - start;
    dbMonitor.logQuery('query', duration, table, operationType);
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    dbMonitor.logQuery('error', duration, table, operationType);
    throw error;
  }
}