import { GET } from '@/app/api/health/route';

// Mock Next.js
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, options: any) => ({
      json: () => Promise.resolve(data),
      status: options?.status || 200,
    })),
  },
}));

describe('Health API', () => {
  it('returns healthy status', async () => {
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      status: 'healthy',
      timestamp: expect.any(String)
    });
  });
});
