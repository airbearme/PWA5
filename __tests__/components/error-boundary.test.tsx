/**
 * Error Boundary Component Tests
 */

import { describe, it, expect, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '@/components/error-boundary';
import React from 'react';

// Mock the error logger
jest.mock('@/lib/error-logger', () => ({
  default: {
    logError: jest.fn(),
  },
}));

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div data-testid="test-child">Test Content</div>
      </ErrorBoundary>
    );

    expect(screen.getByTestId('test-child')).toBeTruthy();
  });

  it('renders error UI when error occurs', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Oops! Something went wrong/i)).toBeTruthy();

    consoleSpy.mockRestore();
  });
});
