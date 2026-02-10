/**
 * API Health Endpoint Tests
 */

import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Mock Next.js
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data: any, options?: { status?: number }) => ({
      json: () => Promise.resolve(data),
      status: options?.status || 200,
    })),
  },
}));

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        limit: jest.fn(() => ({
          data: [{ id: 'test' }],
          error: null,
        })),
      })),
    })),
  })),
}));

describe('Health API', () => {
  it('should return healthy status when database is accessible', async () => {
    const { GET } = await import('@/app/api/health/route');
    const response = await GET();
    const data = (await response.json()) as { status: string; services: { database: string } };

    expect(data.status).toBe('healthy');
    expect(data.services.database).toBe('healthy');
  });
});





