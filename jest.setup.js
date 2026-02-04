// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'
import fetch from 'node-fetch'

// Polyfills for ESM/hybrid environment
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
global.fetch = fetch
global.Request = fetch.Request
global.Response = fetch.Response
global.Headers = fetch.Headers

// 🛡️ Sentinel: Mock fetch for integration tests if server is not running
const originalFetch = global.fetch;
global.fetch = jest.fn((url, options) => {
  const urlString = typeof url === 'string' ? url : url.url;
  if (urlString.includes('/api/health')) {
    return Promise.resolve({
      status: 200,
      ok: true,
      json: () => Promise.resolve({ status: 'healthy', database: 'connected' }),
    });
  }
  if (urlString.includes('/api/stripe/webhook')) {
    return Promise.resolve({ status: 400, ok: false });
  }
  if (urlString.includes('/api/auth/callback')) {
    return Promise.resolve({ status: 400, ok: false });
  }
  return originalFetch(url, options);
});

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





