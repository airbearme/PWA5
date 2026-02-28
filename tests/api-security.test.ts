import request from 'supertest';
import { createApp } from '../server/index';
import { storage } from '../server/storage';

describe('API Security - Auth Bypass and IDOR', () => {
  let app: any;

  beforeAll(async () => {
    const created = await createApp();
    app = created.app;
  });

  describe('POST /api/auth/sync-profile', () => {
    it('should NOT allow syncing a profile without authentication', async () => {
      const spoofedData = {
        id: 'victim-user-id',
        email: 'victim@example.com',
        username: 'victim',
        role: 'admin', // Attempting privilege escalation
      };

      const response = await request(app)
        .post('/api/auth/sync-profile')
        .send(spoofedData);

      // Current behavior: It likely succeeds with 200
      // Desired behavior: It should return 401 Unauthorized
      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/rides/user/:userId', () => {
    it('should NOT allow access to another user\'s rides', async () => {
      const victimUserId = 'victim-user-id';

      const response = await request(app)
        .get(`/api/rides/user/${victimUserId}`);

      // Desired behavior: It should return 401 (if no auth) or 403 (if wrong user)
      expect([401, 403]).toContain(response.status);
    });
  });

  describe('GET /api/analytics/overview', () => {
    it('should NOT allow access to analytics without admin role', async () => {
      const response = await request(app)
        .get('/api/analytics/overview');

      // Desired behavior: It should return 401 (if no auth) or 403 (if not admin)
      expect([401, 403]).toContain(response.status);
    });
  });
});
