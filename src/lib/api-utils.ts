import { NextRequest, NextResponse } from 'next/server';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export function createApiResponse<T>(
  data: T,
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    { success: true, data },
    { status }
  );
}

export function createErrorResponse(
  error: string | Error,
  status: number = 500
): NextResponse<ApiResponse> {
  const errorMessage = error instanceof Error ? error.message : error;
  console.error(`API Error (${status}):`, errorMessage);
  
  return NextResponse.json(
    { 
      success: false, 
      error: errorMessage 
    },
    { status }
  );
}

export function createNotFoundResponse(resource: string): NextResponse<ApiResponse> {
  return createErrorResponse(`${resource} not found`, 404);
}

export function createBadRequestResponse(message: string): NextResponse<ApiResponse> {
  return createErrorResponse(message, 400);
}

// Utility for handling database operations with timeout
export async function withDatabaseTimeout<T>(
  operation: () => Promise<T>,
  timeoutMs: number = 8000
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Database operation timeout')), timeoutMs);
  });

  return Promise.race([operation(), timeoutPromise]);
}

// Utility for validating required parameters
export function validateRequiredParams(
  params: Record<string, any>,
  required: string[]
): string | null {
  for (const param of required) {
    if (!params[param]) {
      return `Missing required parameter: ${param}`;
    }
  }
  return null;
}

// Utility for parsing and validating request data
export async function parseRequestData<T>(req: NextRequest): Promise<T> {
  try {
    const data = await req.json();
    return data as T;
  } catch {
    throw new Error('Invalid JSON in request body');
  }
}

// Utility for handling search parameters
export function getSearchParams(req: NextRequest): URLSearchParams {
  return new URL(req.url).searchParams;
}

// Utility for creating paginated responses
export function createPaginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): NextResponse<ApiResponse<{
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}>> {
  const pages = Math.ceil(total / limit);
  
  return createApiResponse({
    data,
    pagination: {
      page,
      limit,
      total,
      pages
    }
  });
}