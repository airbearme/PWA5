/**
 * API Health Endpoint Tests
 */

import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Mock Next.js
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data: any, options: any): any => {
      const res: any = {
        json: () => Promise.resolve(data),
        status: 200
      };
      if (options && (options as any).status) {
        res.status = (options as any).status;
      }
      return res;
    }),
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
    const data: any = await response.json();

    expect(data.status).toBe('healthy');
    expect(data.services.database).toBe('healthy');
  });
});





