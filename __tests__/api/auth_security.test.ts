import { describe, it, expect } from '@jest/globals';
import { registerUserSchema, updateProfileSchema } from '../../shared/schema';

describe('Auth Security - Mass Assignment', () => {
  it('should strip role field from registerUserSchema', () => {
    const input = {
      email: 'attacker@example.com',
      username: 'attacker',
      role: 'admin',
      ecoPoints: 1000,
    };

    // @ts-ignore - testing runtime behavior with extra fields
    const parsed = registerUserSchema.parse(input);

    expect((parsed as any).role).toBeUndefined();
    expect((parsed as any).ecoPoints).toBeUndefined();
    expect(parsed.username).toBe('attacker');
  });

  it('should strip protected fields from updateProfileSchema', () => {
    const input = {
      email: 'user@example.com',
      username: 'user',
      role: 'admin',
      hasCeoTshirt: true,
    };

    // @ts-ignore
    const parsed = updateProfileSchema.parse(input);

    expect((parsed as any).role).toBeUndefined();
    expect((parsed as any).hasCeoTshirt).toBeUndefined();
    expect(parsed.username).toBe('user');
  });
});
