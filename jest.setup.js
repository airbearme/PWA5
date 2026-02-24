// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

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

// Polyfill TextEncoder/TextDecoder for ESM compatibility
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Polyfill fetch for tests
global.fetch = jest.fn((url) => {
  if (typeof url !== 'string') return Promise.reject(new Error('Invalid URL'));

  if (url.includes('/api/health')) {
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ status: 'healthy', database: 'connected' }),
    });
  }
  if (url.includes('/api/stripe/webhook')) {
    return Promise.resolve({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ error: 'Missing signature' }),
    });
  }
  if (url.includes('/api/auth/callback')) {
    return Promise.resolve({
      ok: true,
      status: 302,
      json: () => Promise.resolve({ status: 'redirecting' }),
    });
  }
  return Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
  });
});





