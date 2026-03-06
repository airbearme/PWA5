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

// Suppress console.error for expected error boundary test output
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (args[0]?.toString().includes('ErrorBoundary caught an error') ||
        args[0]?.toString().includes('The above error occurred in the <ThrowError> component')) {
      return;
    }
    originalError(...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test Content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders error UI when error occurs', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Oops! Something went wrong/i)).toBeInTheDocument();
  });
});
