import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Set env vars at the very top
process.env.STRIPE_SECRET_KEY = 'sk_test_123';
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';

// Mock storage
jest.mock('../../server/storage', () => ({
  storage: {
    getUser: jest.fn(),
    getUserByEmail: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    getAllSpots: jest.fn(),
    getAllRickshaws: jest.fn(),
    getAvailableRickshaws: jest.fn(),
  },
}));

// Mock Supabase
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      admin: {
        createUser: jest.fn(() => Promise.resolve({
          data: { user: { id: 'new-user-id', user_metadata: { role: 'user' } } },
          error: null
        })),
      },
      signInWithPassword: jest.fn(),
    },
  })),
}));

describe('Auth Security', () => {
  let app: any;
  let registerRoutes: any;
  let storage: any;

  beforeEach(async () => {
    // Re-import to ensure env vars and mocks are used
    const routesModule: any = await import('../../server/routes');
    registerRoutes = routesModule.registerRoutes;
    const storageModule: any = await import('../../server/storage');
    storage = storageModule.storage;

    const express = (await import('express')).default;
    app = express();
    app.use(express.json());
    await registerRoutes(app);
    jest.clearAllMocks();

    // Default mock implementations
    storage.createUser.mockImplementation((u: any) => Promise.resolve({ ...u, id: u.id || 'new-user-id' }));
    storage.updateUser.mockImplementation((id: string, u: any) => Promise.resolve({ id, ...u }));
    storage.getUser.mockResolvedValue(undefined);
    storage.getUserByEmail.mockResolvedValue(undefined);
    storage.getAllSpots.mockResolvedValue([]);
    storage.getAllRickshaws.mockResolvedValue([]);
    storage.getAvailableRickshaws.mockResolvedValue([]);
  });

  it('should not allow privilege escalation via role field during registration', async () => {
    const request = (await import('supertest')).default;
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'attacker@example.com',
        username: 'attacker',
        password: 'password123',
        role: 'admin', // Attempted privilege escalation
      });

    expect(response.status).toBe(200);
    expect(response.body.user.role).toBe('user'); // Should be 'user', not 'admin'

    // Verify storage.createUser was called with role: 'user'
    expect(storage.createUser).toHaveBeenCalledWith(expect.objectContaining({
      role: 'user'
    }));
  });

  it('should not allow privilege escalation via role field during profile sync', async () => {
    const request = (await import('supertest')).default;
    // Mock existing user
    storage.getUser.mockResolvedValue({
      id: 'user-id',
      email: 'user@example.com',
      username: 'user',
      role: 'user',
    });

    const response = await request(app)
      .post('/api/auth/sync-profile')
      .send({
        id: 'user-id',
        username: 'updated-username',
        role: 'admin', // Attempted privilege escalation
      });

    expect(response.status).toBe(200);

    // storage.updateUser should have been called for username change, but NOT for role
    expect(storage.updateUser).toHaveBeenCalled();
    const updateCall = storage.updateUser.mock.calls[0][1];
    expect(updateCall.role).toBeUndefined(); // Should be undefined in update payload to preserve existing
  });
});
