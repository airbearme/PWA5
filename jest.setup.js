// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'node:util'

// Polyfill TextEncoder/TextDecoder for ESM compatibility in tests
if (typeof globalThis.TextEncoder === 'undefined') {
  globalThis.TextEncoder = TextEncoder;
  globalThis.TextDecoder = TextDecoder;
}

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    }
  },
  usePathname() {
    return '/'
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return []
  }
  unobserve() {}
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Polyfill fetch for Jest environment
if (!globalThis.fetch) {
  globalThis.fetch = jest.fn((url) => {
    if (url.includes('/api/stripe/webhook')) {
      return Promise.resolve({
        status: 400,
        json: () => Promise.resolve({ error: 'Invalid signature' }),
      });
    }
    if (url.includes('/api/auth/callback')) {
      return Promise.resolve({
        status: 302,
        json: () => Promise.resolve({}),
      });
    }
    if (url.includes('/api/health')) {
      return Promise.resolve({
        status: 200,
        json: () => Promise.resolve({ status: 'healthy', database: 'connected' }),
      });
    }
    return Promise.resolve({
      status: 200,
      json: () => Promise.resolve({}),
    });
  });
}






