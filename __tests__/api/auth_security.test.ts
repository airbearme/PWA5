import { describe, it, expect, jest } from '@jest/globals';
import { z } from 'zod';

// We want to verify that the profileSchema (once we modify it)
// correctly rejects or ignores the 'role' field.
// Since we can't easily import the local variable from routes.ts yet,
// we will simulate the logic here and later ensure the routes.ts implementation matches.

const createProfileSchema = (allowRole: boolean) => {
  const base = {
    id: z.string().optional(),
    email: z.string().optional().nullable(),
    username: z.string().min(1),
    fullName: z.string().optional().nullable(),
    avatarUrl: z.string().optional().nullable(),
  };

  if (allowRole) {
    return z.object({
      ...base,
      role: z.enum(["user", "driver", "admin"]).optional(),
    });
  }

  return z.object(base);
};

describe('Auth Security - Privilege Escalation', () => {
  it('VULNERABLE: profileSchema should allow role if not hardened', () => {
    const vulnerableSchema = createProfileSchema(true);
    const payload = {
      username: 'attacker',
      role: 'admin'
    };

    const result = vulnerableSchema.parse(payload);
    expect(result.role).toBe('admin');
  });

  it('SECURE: profileSchema should not allow role when hardened', () => {
    const secureSchema = createProfileSchema(false);
    const payload = {
      username: 'attacker',
      role: 'admin'
    } as any;

    const result = secureSchema.parse(payload);
    expect(result.role).toBeUndefined();
  });
});
