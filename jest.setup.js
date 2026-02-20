// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Polyfill fetch for Node environment
if (!globalThis.fetch) {
  globalThis.fetch = jest.fn().mockImplementation((url) => {
    if (url.includes('/api/health')) {
      return Promise.resolve({
        status: 200,
        ok: true,
        json: () => Promise.resolve({ status: 'healthy', database: 'connected' }),
      });
    }
    if (url.includes('/api/stripe/webhook')) {
      return Promise.resolve({ status: 400, ok: false });
    }
    if (url.includes('/api/auth/callback')) {
      return Promise.resolve({ status: 302, ok: true });
    }
    return Promise.reject(new Error(`Unhandled fetch: ${url}`));
  });
}

// Polyfill TextEncoder/Decoder for ESM compatibility
if (typeof TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
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

// Suppress console errors in tests (optional)
// global.console = {
//   ...console,
//   error: jest.fn(),
//   warn: jest.fn(),
// }





