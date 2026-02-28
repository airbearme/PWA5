/**
 * Utility Function Tests
 */

import { describe, it, expect } from '@jest/globals';
import { cn } from '@/lib/utils';

describe('cn utility', () => {
  it('merges class names', () => {
    expect(cn('class1', 'class2')).toContain('class1');
    expect(cn('class1', 'class2')).toContain('class2');
  });

  it('handles conditional classes', () => {
    expect(cn('class1', true && 'class2', false && 'class3')).toContain('class1');
    expect(cn('class1', true && 'class2', false && 'class3')).toContain('class2');
    expect(cn('class1', true && 'class2', false && 'class3')).not.toContain('class3');
  });

  it('merges Tailwind classes', () => {
    const result = cn('px-2 py-1', 'px-4');
    expect(result).toContain('px-4');
    expect(result).toContain('py-1');
    expect(result).not.toContain('px-2');
  });
});
