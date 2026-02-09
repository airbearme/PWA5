/**
 * Error Boundary Component Tests
 */

import { describe, it, jest } from '@jest/globals';
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

    expect(screen.getByText('Test Content')).toBeTruthy();
  });

  it('renders error UI when error occurs', async () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    // Suppress console.error for this test as we expect an error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(await screen.findByText(/Oops! Something went wrong/i)).toBeTruthy();

    consoleSpy.mockRestore();
  });
});





