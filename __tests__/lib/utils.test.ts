/**
 * Utility Functions Unit Tests
 */

import { describe, it, expect } from '@jest/globals';
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
    const result = cn('px-2 py-1', 'px-4');
    // Ensure px-4 overrides px-2 and both px-4 and py-1 are present
    expect(result).toContain('px-4');
    expect(result).toContain('py-1');
    expect(result).not.toContain('px-2');
    // Final check for exact content regardless of order
    const sortedResult = result.split(' ').sort().join(' ');
    const expected = 'px-4 py-1'.split(' ').sort().join(' ');
    expect(sortedResult).toBe(expected);
  });
});





