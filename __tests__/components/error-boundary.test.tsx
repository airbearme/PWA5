import { describe, it, expect, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '@/components/error-boundary';
import React from 'react';

jest.mock('@/lib/error-logger', () => ({
  default: { logError: jest.fn() },
}));

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(<ErrorBoundary><div>Test Content</div></ErrorBoundary>);
    expect(screen.queryByText('Test Content')).not.toBeNull();
  });

  it('renders error UI when error occurs', () => {
    const ThrowError = () => { throw new Error('Test error'); };
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<ErrorBoundary><ThrowError /></ErrorBoundary>);
    expect(screen.queryByText(/Oops! Something went wrong/i)).not.toBeNull();
    consoleSpy.mockRestore();
  });
});
