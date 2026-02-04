// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'
import fetch from 'node-fetch'
import { TransformStream } from 'node:stream/web'

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
global.TransformStream = TransformStream

// Enhanced fetch mock for local API endpoints
const nodeFetch = fetch
global.fetch = async (url, options) => {
  const urlString = url.toString()
  if (urlString.includes('localhost:3000')) {
    if (urlString.endsWith('/api/health')) {
      return {
        status: 200,
        ok: true,
        json: async () => ({ status: 'healthy', database: 'connected' }),
      }
    }
    if (urlString.endsWith('/api/stripe/webhook')) {
      return {
        status: 400,
        ok: false,
        json: async () => ({ error: 'Invalid signature' }),
      }
    }
    if (urlString.endsWith('/api/auth/callback')) {
      return {
        status: 302,
        ok: true,
      }
    }
  }
  return nodeFetch(url, options)
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





