// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'

// Essential polyfills for JSDOM environment
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

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

// React 19 compatibility for tests
global.IS_REACT_ACT_ENVIRONMENT = true

// Mock global fetch for API tests
global.fetch = jest.fn().mockImplementation((url) => {
  const urlString = url.toString();

  if (urlString.includes('/api/health')) {
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ status: 'healthy', database: 'connected' }),
    });
  }

  if (urlString.includes('/api/stripe/webhook')) {
    return Promise.resolve({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ error: 'Invalid signature' }),
    });
  }

  if (urlString.includes('/api/auth/callback')) {
    return Promise.resolve({
      ok: false,
      status: 302,
      json: () => Promise.resolve({}),
    });
  }

  return Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
  });
});
