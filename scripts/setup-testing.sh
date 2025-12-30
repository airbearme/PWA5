#!/bin/bash

# Comprehensive Testing Setup Script
# Installs all testing tools and dependencies

echo "🧪 Setting up comprehensive testing suite..."

# Install testing dependencies
echo "📦 Installing testing dependencies..."

npm install --save-dev \
  @testing-library/react @testing-library/jest-dom @testing-library/user-event \
  @testing-library/react-hooks \
  jest jest-environment-jsdom @jest/globals \
  @playwright/test \
  @axe-core/playwright \
  lighthouse \
  @lhci/cli \
  k6 \
  artillery \
  pa11y \
  pa11y-ci \
  web-vitals \
  @storybook/react @storybook/test-runner \
  msw \
  nock \
  supertest \
  @types/jest @types/supertest \
  ts-jest \
  jest-axe \
  @types/node

echo "✅ Testing dependencies installed!"

# Create test directories
mkdir -p tests/{unit,integration,e2e,performance,security,accessibility,visual}
mkdir -p __tests__/{components,lib,hooks,api}
mkdir -p tests/mocks
mkdir -p tests/fixtures

echo "📁 Test directories created!"

# Make scripts executable
chmod +x scripts/*.js
chmod +x scripts/*.sh

echo "✅ Testing setup complete!"
echo ""
echo "📋 Available test commands:"
echo "  npm run test              # Run unit tests"
echo "  npm run test:integration  # Run integration tests"
echo "  npm run test:e2e          # Run E2E tests"
echo "  npm run test:performance  # Run performance tests"
echo "  npm run test:security     # Run security tests"
echo "  npm run test:accessibility # Run accessibility tests"
echo "  npm run test:all          # Run all tests"
echo "  npm run test:validate     # Ultimate validation"




