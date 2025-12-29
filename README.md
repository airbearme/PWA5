# AirBear - Solar-Powered Rideshare & Mobile Bodega

Production-ready Next.js PWA for sustainable rideshare services with integrated mobile bodega functionality.

## Features

- **Real-Time Map Tracking**: Live location updates for drivers using Leaflet and Supabase Realtime
- **OAuth Authentication**: One-click sign-in with Google and Apple via Supabase Auth
- **Stripe Payments**: Secure payments with Apple Pay and Google Pay integration
- **Mobile Bodega**: Browse and purchase products during rides
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
```

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/airbearme/pwa4.git
   cd pwa4
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Fill in your environment variables
   ```

4. **Run database migrations**
   ```bash
   # Run the SQL script in Supabase SQL Editor
   # File: scripts/01-setup-database.sql
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open http://localhost:3000**

## Deployment

### Automatic Deployment (Recommended)

Push to `main` branch triggers automatic deployment via GitHub Actions:

```bash
git add .
git commit -m "Deploy to production"
git push origin main
```

### Manual Deployment

```bash
npm run deploy:vercel
```

## Database Setup

1. Go to Supabase Dashboard
2. Navigate to SQL Editor
3. Run `scripts/01-setup-database.sql`
4. Verify tables and RLS policies are created

## OAuth Configuration

### Google Sign-In
1. Go to Google Cloud Console
2. Create OAuth 2.0 credentials
3. Add redirect URL: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
4. Add client ID to Supabase Dashboard > Authentication > Providers

### Apple Sign-In
1. Go to Apple Developer Portal
2. Create Service ID and configure domains
3. Add redirect URL in Supabase Dashboard
4. Enable Apple provider in Supabase

## Stripe Configuration

1. Get API keys from Stripe Dashboard
2. Add environment variables
3. Set up webhook endpoint: `https://airbear.me/api/stripe/webhook`
4. Add webhook secret to environment variables
5. Enable Apple Pay and Google Pay in Stripe Dashboard

## Project Structure

```
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   ├── auth/                 # Authentication pages
│   ├── map/                  # Real-time map view
│   ├── products/             # Mobile bodega
│   └── page.tsx              # Homepage
├── components/               # React components
│   ├── ui/                   # shadcn/ui components
│   ├── auth-provider.tsx     # Auth context
│   ├── checkout-button.tsx   # Stripe checkout
│   └── map-view.tsx          # Leaflet map
├── lib/                      # Utilities
│   ├── supabase/             # Supabase clients
│   ├── stripe/               # Stripe helpers
│   └── types/                # TypeScript types
├── scripts/                  # Database scripts
└── public/                   # Static assets
```

## Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# E2E tests
npm run test:e2e
```

## Security Features

- Row Level Security (RLS) on all tables
- HTTP-only cookies for sessions
- HTTPS enforced with HSTS headers
- Content Security Policy headers
- Secure webhook signature verification
- Input validation with Zod

## Performance Optimizations

- Image optimization with Next.js Image
- PWA caching strategies
- Code splitting and lazy loading
- CDN distribution via Vercel Edge Network
- Optimized bundle sizes

## Support

For issues or questions, open an issue on GitHub or contact support@airbear.me

## License

MIT License - see LICENSE file for details
