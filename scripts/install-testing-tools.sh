#!/bin/bash

# Install All Testing Tools
# This script installs comprehensive testing tools for the AirBear PWA

echo "🧪 Installing comprehensive testing tools...\n"

# Node.js testing frameworks
echo "📦 Installing Node.js testing frameworks..."
npm install --save-dev \
  @testing-library/react@latest \
  @testing-library/jest-dom@latest \
  @testing-library/user-event@latest \
  @testing-library/react-hooks@latest \
  jest@latest \
  @jest/globals@latest \
  jest-environment-jsdom@latest \
  ts-jest@latest \
  @types/jest@latest \
  @types/node@latest

# E2E testing
echo "\n🎭 Installing E2E testing tools..."
npm install --save-dev \
  @playwright/test@latest \
  @axe-core/playwright@latest

# Performance testing
echo "\n⚡ Installing performance testing tools..."
npm install -g lighthouse @lhci/cli || echo "Lighthouse installation skipped (may need sudo)"

# Accessibility testing
echo "\n♿ Installing accessibility testing tools..."
npm install -g pa11y pa11y-ci || echo "pa11y installation skipped (may need sudo)"

# Load testing (optional)
echo "\n📊 Installing load testing tools..."
npm install --save-dev k6 artillery || echo "Load testing tools skipped"

# API testing
echo "\n🌐 Installing API testing tools..."
npm install --save-dev \
  supertest@latest \
  @types/supertest@latest \
  nock@latest \
  msw@latest

# Visual testing (optional)
echo "\n🎨 Installing visual testing tools..."
npm install --save-dev \
  @storybook/react@latest \
  @storybook/test-runner@latest || echo "Storybook installation skipped"

# Security testing
echo "\n🔒 Installing security testing tools..."
npm install --save-dev \
  snyk@latest || echo "Snyk installation skipped"

# Web vitals
echo "\n📈 Installing web vitals..."
npm install --save-dev web-vitals@latest

echo "\n✅ Testing tools installation complete!"
echo "\n📋 Next steps:"
echo "   1. Run: npm run setup:testing"
echo "   2. Run: npm run test:validate"
echo "   3. Check: TESTING_COMPREHENSIVE.md"




