import { jest, describe, it, expect } from '@jest/globals';

// Mock Next.js BEFORE importing the route
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data: any, options?: any) => ({
      json: () => Promise.resolve(data),
      status: options?.status || 200,
    })),
  },
}));

describe('Health API', () => {
  it('returns healthy status', async () => {
    // Dynamically import the route to ensure mock is active
    const { GET } = await import('@/app/api/health/route');
    const response = (await GET()) as any;
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      status: 'healthy',
      timestamp: expect.any(String)
    });
  });
});
