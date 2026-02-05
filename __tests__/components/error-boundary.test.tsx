/**
 * Error Boundary Component Tests
 */

/// <reference types="@testing-library/jest-dom" />
import { describe, it, expect, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ErrorBoundary } from '@/components/error-boundary';

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
        <div>Test Content</div>
      </ErrorBoundary>
    );

    (expect(screen.getByText('Test Content')) as any).toBeInTheDocument();
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

    (expect(screen.getByText(/Oops! Something went wrong/i)) as any).toBeInTheDocument();
  });
});





