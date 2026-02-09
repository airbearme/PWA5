/**
 * Utility Functions Unit Tests
 */

import { describe, it } from '@jest/globals';
import { cn } from '@/lib/utils';

describe('cn utility', () => {
  it('merges class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
  });

  it('handles undefined and null', () => {
    expect(cn('foo', undefined, null, 'bar')).toBe('foo bar');
  });

  it('merges Tailwind classes', () => {
    // Note: order might vary based on tailwind-merge version
    const result = cn('px-2 py-1', 'px-4');
    expect(result).toContain('px-4');
    expect(result).toContain('py-1');
    expect(result).not.toContain('px-2');
  });
});





