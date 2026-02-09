// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
import fetch from 'node-fetch'
import { TextEncoder, TextDecoder } from 'util'
import * as React from 'react'

// Fix for React 19 act
if (!React.act) {
  React.act = (cb) => {
    if (typeof cb === 'function') {
      const result = cb();
      if (result && typeof result.then === 'function') {
        return result;
      }
    }
    return Promise.resolve();
  };
}

global.IS_REACT_ACT_ENVIRONMENT = true;

if (!global.fetch) {
  global.fetch = fetch;
  global.Request = fetch.Request;
  global.Response = fetch.Response;
  global.Headers = fetch.Headers;
}

if (typeof global.TransformStream === 'undefined') {
  global.TransformStream = class {
    constructor() {
      this.readable = {};
      this.writable = {};
    }
  };
}

if (!global.TextEncoder) {
  global.TextEncoder = TextEncoder;
}

if (!global.TextDecoder) {
  global.TextDecoder = TextDecoder;
}

// React 19 act polyfill for testing library
if (typeof Promise !== 'undefined' && !global.IS_REACT_ACT_ENVIRONMENT) {
  global.IS_REACT_ACT_ENVIRONMENT = true;
}

// Mock react-dom/test-utils act to use React.act or a simple polyfill
jest.mock('react-dom/test-utils', () => {
  return {
    act: (cb) => {
      if (typeof React !== 'undefined' && React.act) {
        return React.act(cb);
      }
      const result = cb();
      if (result && typeof result.then === 'function') {
        return result;
      }
      return Promise.resolve();
    },
  };
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





