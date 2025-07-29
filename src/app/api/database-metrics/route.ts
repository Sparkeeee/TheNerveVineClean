import { createApiResponse, createErrorResponse } from '@/lib/api-utils';
import { dbMonitor } from '@/lib/database-monitor';

export async function GET() {
  try {
    const metrics = dbMonitor.getMetrics();
    const suggestions = dbMonitor.getOptimizationSuggestions();

    return createApiResponse({
      metrics,
      suggestions,
      summary: {
        totalQueries: metrics.total,
        averageDuration: Math.round(metrics.averageDuration),
        slowQueries: metrics.slowQueries,
        mostUsedTable: Object.entries(metrics.byTable).sort((a, b) => b[1] - a[1])[0]?.[0] || 'none',
        mostUsedOperation: Object.entries(metrics.byOperation).sort((a, b) => b[1] - a[1])[0]?.[0] || 'none'
      }
    });
  } catch (error) {
    console.error('Error fetching database metrics:', error);
    return createErrorResponse('Failed to fetch database metrics');
  }
}

export async function DELETE() {
  try {
    dbMonitor.clearMetrics();
    return createApiResponse({ message: 'Database metrics cleared' });
  } catch (error) {
    console.error('Error clearing database metrics:', error);
    return createErrorResponse('Failed to clear database metrics');
  }
}