# 🧪 Comprehensive Testing Suite

## Overview

This document describes the complete testing infrastructure for the AirBear PWA. Every aspect of the application is tested to ensure production readiness.

## Test Categories

### 1. **Unit Tests** (`npm run test:unit`)
- Component rendering
- Utility functions
- Custom hooks
- Business logic
- **Framework**: Jest + React Testing Library
- **Location**: `__tests__/`, `*.test.ts`, `*.test.tsx`

### 2. **Integration Tests** (`npm run test:integration`)
- API route handlers
- Database operations
- Authentication flows
- Payment processing
- **Framework**: Jest + Supertest
- **Location**: `tests/integration.test.ts`

### 3. **End-to-End Tests** (`npm run test:e2e`)
- User flows
- Booking process
- Payment flows
- Authentication
- **Framework**: Playwright
- **Location**: `tests/*.spec.ts`

### 4. **Performance Tests** (`npm run test:performance`)
- Lighthouse audits
- Bundle size analysis
- Load time metrics
- Core Web Vitals
- **Tool**: Lighthouse CLI
- **Script**: `scripts/test-performance.js`

### 5. **Security Tests** (`npm run test:security`)
- Security headers validation
- npm audit
- Dependency vulnerabilities
- API security
- **Script**: `scripts/test-security-headers.js`

### 6. **Accessibility Tests** (`npm run test:accessibility`)
- WCAG compliance
- Screen reader compatibility
- Keyboard navigation
- **Tool**: pa11y
- **Script**: `scripts/test-accessibility.js`

### 7. **Database Tests** (`npm run test:database`)
- Connection validation
- Schema verification
- Query performance
- **Script**: `scripts/test-database.js`

### 8. **Payment Tests** (`npm run test:stripe`)
- Stripe API connectivity
- Key validation
- Payment intent creation
- **Script**: `scripts/test-stripe.js`

### 9. **PWA Tests** (`npm run test:pwa`)
- Manifest validation
- Service worker functionality
- Offline capabilities
- **Scripts**: 
  - `scripts/test-pwa-manifest.js`
  - `scripts/test-service-worker.js`

### 10. **Component Tests** (`npm run test:components`)
- Component structure
- Import validation
- Critical components check
- **Script**: `scripts/test-components.js`

### 11. **Real-time Tests** (`npm run test:realtime`)
- Supabase real-time subscriptions
- WebSocket connectivity
- Live updates
- **Script**: `scripts/test-realtime.js`

### 12. **Error Logger Tests** (`npm run test:error-logger`)
- Error logging system
- Consent management
- Database integration
- **Script**: `scripts/test-error-logger.js`

### 13. **Bundle Size Tests** (`npm run test:bundle`)
- JavaScript bundle analysis
- Asset size validation
- Code splitting verification
- **Script**: `scripts/check-bundle-size.js`

## Ultimate Validation

### Run All Tests
```bash
npm run test:validate
```

This runs the **Ultimate Validation Script** (`scripts/ultimate-validation.js`) which executes:

1. ✅ Environment validation
2. ✅ TypeScript type checking
3. ✅ ESLint
4. ✅ Build verification
5. ✅ Unit tests
6. ✅ Integration tests
7. ✅ API tests
8. ✅ E2E tests
9. ✅ Performance tests
10. ✅ Security tests
11. ✅ Accessibility tests
12. ✅ Database tests
13. ✅ Payment tests
14. ✅ Real-time tests
15. ✅ PWA tests
16. ✅ Component tests
17. ✅ Error handling tests

## Setup

### Initial Setup
```bash
npm run setup:testing
```

This installs all testing dependencies and creates necessary directories.

### Manual Setup
```bash
npm install --save-dev \
  @testing-library/react @testing-library/jest-dom \
  @playwright/test \
  lighthouse @lhci/cli \
  pa11y \
  jest @jest/globals
```

## Test Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run test` | Run all Jest tests |
| `npm run test:unit` | Run unit tests only |
| `npm run test:integration` | Run integration tests |
| `npm run test:api` | Run API tests |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run test:performance` | Run Lighthouse performance audit |
| `npm run test:security` | Check security headers |
| `npm run test:accessibility` | Run accessibility audit |
| `npm run test:database` | Test database connectivity |
| `npm run test:stripe` | Validate Stripe configuration |
| `npm run test:pwa` | Test PWA features |
| `npm run test:components` | Validate component structure |
| `npm run test:realtime` | Test real-time features |
| `npm run test:error-logger` | Test error logging system |
| `npm run test:bundle` | Check bundle sizes |
| `npm run test:all` | Run all automated tests |
| `npm run test:validate` | **Ultimate validation (runs everything)** |

## Continuous Integration

All tests are automatically run in GitHub Actions:

- **On Push**: Runs lint, type-check, build, and unit tests
- **On PR**: Full test suite
- **Scheduled**: Performance and security audits (every 6 hours)

See `.github/workflows/ci-cd.yml` for details.

## Test Coverage Goals

- **Unit Tests**: 70%+ coverage
- **Integration Tests**: All critical paths
- **E2E Tests**: All user flows
- **Performance**: Lighthouse score 80+
- **Accessibility**: WCAG 2.1 AA compliance

## Writing Tests

### Unit Test Example
```typescript
// __tests__/components/button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

### E2E Test Example
```typescript
// tests/booking.spec.ts
import { test, expect } from '@playwright/test';

test('user can book a ride', async ({ page }) => {
  await page.goto('/map');
  await page.click('[data-testid="book-ride"]');
  await expect(page).toHaveURL(/.*booking/);
});
```

## Test Data

- **Fixtures**: `tests/fixtures/`
- **Mocks**: `tests/mocks/`
- **Test utilities**: `tests/utils/`

## Troubleshooting

### Tests failing?
1. Check environment variables are set
2. Ensure database is accessible
3. Verify all dependencies are installed
4. Check test logs for specific errors

### Performance tests failing?
- Ensure dev server is running: `npm run dev`
- Check site is accessible at configured URL

### Database tests failing?
- Verify Supabase credentials
- Check database migrations are applied
- Ensure RLS policies allow test access

## Best Practices

1. **Write tests first** (TDD) for new features
2. **Keep tests isolated** - each test should be independent
3. **Use descriptive names** - test names should explain what they test
4. **Mock external services** - don't hit real APIs in unit tests
5. **Test edge cases** - happy path + error scenarios
6. **Maintain test coverage** - aim for 70%+ coverage
7. **Run tests locally** before pushing
8. **Fix flaky tests** immediately

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Playwright Documentation](https://playwright.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

---

**Status**: ✅ Comprehensive testing suite implemented
**Last Updated**: 2025-01-28

