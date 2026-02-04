// Learn more: https://github.com/testing-library/jest-dom
require('@testing-library/jest-dom')

// Polyfill for fetch
if (!global.fetch) {
  const nodeFetch = require('node-fetch')
  global.fetch = jest.fn().mockImplementation((url, options) => {
    if (url.includes('/api/health')) {
      return Promise.resolve({
        status: 200,
        ok: true,
        json: () => Promise.resolve({ status: 'healthy', database: 'connected' }),
      })
    }
    if (url.includes('/api/stripe/webhook')) {
      return Promise.resolve({
        status: 400,
        ok: false,
      })
    }
    if (url.includes('/api/auth/callback')) {
      return Promise.resolve({
        status: 302,
        ok: true,
      })
    }
    return nodeFetch(url, options)
  })
  global.Response = nodeFetch.Response
  global.Headers = nodeFetch.Headers
  global.Request = nodeFetch.Request
}

// Polyfill for TextEncoder/TextDecoder
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util')
  global.TextEncoder = TextEncoder
  global.TextDecoder = TextDecoder
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
