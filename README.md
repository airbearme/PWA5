# AirBear PWA - Solar-Powered Rideshare & Mobile Bodega

Production-ready Next.js PWA for sustainable rideshare services with integrated mobile bodega functionality.

🌐 **Live at: https://airbear.me**

## 🎨 Beautiful UI/UX Foundation

**The beautiful UI/UX is permanently embedded in the codebase and loads by default.**

- ✨ **12+ Custom Animations** - Pulse glow, float, shimmer, particle effects, and more
- 🎨 **Special Effects** - Glass morphism, holographic text, plasma flows, solar rays
- 🌙 **Dark Mode** - Permanently enabled by default
- 🐻 **Animated Mascot** - AirBear mascot with floating animations
- 🎯 **Validated** - Run `pnpm run validate:ui` to verify all features

**See:** `CORE_UI_FOUNDATION.md` and `README_UI_FOUNDATION.md` for complete documentation.

## Features

- **Real-Time Map Tracking**: Live location updates for AirBears using Leaflet and Supabase Realtime
- **OAuth Authentication**: One-click sign-in with Google and Apple via Supabase Auth
- **Stripe Payments**: Secure payments with Apple Pay, Google Pay, Credit Card, and Cash options
- **Mobile Bodega**: Browse and purchase products during rides
- **Push Notifications**: Get notified when AirBears become available
- **PWA Support**: Installable progressive web app with offline capabilities
- **Real-Time Database**: Supabase with Row Level Security for data protection

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: Supabase (PostgreSQL with RLS)
- **Payments**: Stripe with Apple Pay/Google Pay
- **Maps**: Leaflet with real-time tracking
- **Auth**: Supabase Auth with OAuth providers
- **Styling**: Tailwind CSS with shadcn/ui
- **Deployment**: Vercel with GitHub Actions CI/CD

## Quick Start

### Prerequisites

- Node.js 20.x or higher
- npm or pnpm
- Supabase account
- Stripe account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/airbearme/pwapro.git
   cd pwapro
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Fill in your environment variables
   ```

4. **Validate environment variables**
   ```bash
   pnpm run validate:env
   ```

5. **Start development server**
   ```bash
   pnpm run dev
   ```

6. **Open http://localhost:3000**

## Environment Variables

Required environment variables (see `.env.example`):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_PWA4_URL=
NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY=
SUPABASE_PWA4_SERVICE_ROLE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Site
NEXT_PUBLIC_SITE_URL=https://airbear.me
NODE_ENV=production
```

See `docs/ENVIRONMENT_VARIABLES.md` for complete documentation.

## CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment:

- **Validate**: Type checking, linting, and build verification
- **Deploy**: Automatic deployment to Vercel on push to main branch

### GitHub Actions Secrets Required

Add these secrets in GitHub repository settings:

- `VERCEL_TOKEN` - Vercel deployment token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID
- All environment variables from `.env.local`

## Scripts

```bash
# Development
pnpm run dev              # Start development server
pnpm run build            # Build for production
pnpm run start            # Start production server

# Validation
pnpm run validate:env    # Validate environment variables
pnpm run type-check       # TypeScript type checking
pnpm run lint             # ESLint

# Testing (Comprehensive Suite)
pnpm run test             # Run all Jest tests
pnpm run test:unit        # Run unit tests only
pnpm run test:integration # Run integration tests
pnpm run test:e2e         # Run Playwright E2E tests
pnpm run test:performance # Run Lighthouse performance audit
pnpm run test:security    # Check security headers
pnpm run test:accessibility # Run accessibility audit
pnpm run test:database    # Test database connectivity
pnpm run test:stripe      # Validate Stripe configuration
pnpm run test:pwa         # Test PWA features
pnpm run test:all         # Run all automated tests
pnpm run test:validate    # 🚀 Ultimate validation (runs everything)

# Setup
pnpm run setup:testing    # Install all testing dependencies

# Deployment
pnpm run deploy           # Deploy to Vercel
pnpm run deploy:production  # Production deployment

# Auto-Deploy Setup (GitHub Actions)
pnpm run setup:secrets    # Guide for setting up GitHub secrets
# See: SETUP_GITHUB_SECRETS.md and AUTO_DEPLOY_SETUP.md
```

## Testing

This project includes a **comprehensive testing suite** covering all aspects:

- ✅ **Unit Tests** - Components, utilities, hooks (Jest)
- ✅ **Integration Tests** - API routes, database operations
- ✅ **E2E Tests** - User flows (Playwright)
- ✅ **Performance Tests** - Lighthouse audits
- ✅ **Security Tests** - Headers, vulnerabilities
- ✅ **Accessibility Tests** - WCAG compliance
- ✅ **Database Tests** - Connectivity, schema
- ✅ **Payment Tests** - Stripe validation
- ✅ **PWA Tests** - Manifest, service worker
- ✅ **Real-time Tests** - Supabase subscriptions

**Run ultimate validation:**
```bash
pnpm run test:validate
```

See `TESTING_COMPREHENSIVE.md` for complete testing documentation.

## Project Structure

```
├── app/                 # Next.js app router pages
│   ├── api/            # API routes
│   ├── auth/           # Authentication pages
│   ├── map/            # Map page
│   └── products/       # Products page
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   └── ...
├── lib/                # Utility libraries
│   ├── supabase/       # Supabase clients
│   ├── stripe/         # Stripe clients
│   └── hooks/          # Custom React hooks
├── scripts/            # Build and deployment scripts
└── .github/workflows/  # GitHub Actions workflows
```

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically via GitHub Actions or manually:

```bash
pnpm run deploy:vercel
```

### Manual Deployment

```bash
pnpm run build
pnpm run start
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- GitHub Issues: https://github.com/airbearme/pwapro/issues
- Documentation: See `docs/` directory

---

Built with ❤️ for sustainable transportation in Binghamton, NY
