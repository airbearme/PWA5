import { describe, it } from '@jest/globals';
import { registerUserSchema } from '../../shared/schema';
import { z } from 'zod';

describe('Auth Security - Mass Assignment', () => {
  it('should strip role field from registerUserSchema', () => {
    const input = {
      email: 'attacker@example.com',
      username: 'attacker',
      role: 'admin',
      ecoPoints: 1000,
    };

    // @ts-ignore - testing runtime behavior with extra fields
    const parsed = registerUserSchema.parse(input) as any;

    expect(parsed.role).toBeUndefined();
    expect(parsed.ecoPoints).toBeUndefined();
    expect(parsed.username).toBe('attacker');
  });

  it('should strip protected fields from updateProfileSchema', () => {
    const { updateProfileSchema } = require('../../shared/schema');
    const input = {
      email: 'user@example.com',
      username: 'user',
      role: 'admin',
      hasCeoTshirt: true,
    };

    // @ts-ignore
    const parsed = updateProfileSchema.parse(input) as any;

    expect(parsed.role).toBeUndefined();
    expect(parsed.hasCeoTshirt).toBeUndefined();
    expect(parsed.username).toBe('user');
  });
});
