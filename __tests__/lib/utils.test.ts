/**
 * Utility Functions Unit Tests
 */

import { describe, it, expect } from '@jest/globals';
import { cn } from '@/lib/utils';

describe('cn utility', () => {
  it('merges class names correctly', () => {
    const result = cn('foo', 'bar');
    expect(result).toContain('foo');
    expect(result).toContain('bar');
  });

  it('handles conditional classes', () => {
    const result = cn('foo', false && 'bar', 'baz');
    expect(result).toContain('foo');
    expect(result).toContain('baz');
    expect(result).not.toContain('bar');
  });

  it('handles undefined and null', () => {
    const result = cn('foo', undefined, null, 'bar');
    expect(result).toContain('foo');
    expect(result).toContain('bar');
  });

  it('merges Tailwind classes', () => {
    const result = cn('px-2 py-1', 'px-4');
    // tailwind-merge should favor the later px-4 over px-2
    expect(result).toContain('px-4');
    expect(result).toContain('py-1');
    expect(result).not.toContain('px-2');
  });
});
