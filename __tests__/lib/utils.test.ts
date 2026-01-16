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
    const expected = 'px-4 py-1'.split(' ').sort();
    const actual = cn('px-2 py-1', 'px-4').split(' ').sort();
    expect(actual).toEqual(expected);
  });
});





