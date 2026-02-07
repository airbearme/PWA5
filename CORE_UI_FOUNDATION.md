# 🎨 Core UI/UX Foundation - Permanent & Protected

## ⚠️ CRITICAL: DO NOT REMOVE

This document defines the **permanent, core UI/UX foundation** of AirBear. These features are **NOT OPTIONAL** and must **ALWAYS** be present.

## 🎯 Core Visual Features (Permanent)

### 1. **CSS Animations** (`app/globals.css`)
**Location:** `app/globals.css` - Lines 94-442

**Required Keyframes:**
- `@keyframes pulse-glow` - Core brand animation
- `@keyframes float` - Hero element animation
- `@keyframes shimmer` - Loading states
- `@keyframes particle` - Background effects
- `@keyframes rickshaw-bounce` - Interactive elements
- `@keyframes wheel-spin` - Loading indicators
- `@keyframes neon-glow` - Brand elements
- `@keyframes holographic-shift` - Premium effects
- `@keyframes plasma-flow` - Background animations
- `@keyframes solar-rays` - Theme elements
- `@keyframes eco-breeze` - Eco theme
- `@keyframes god-rays` - Atmospheric effects

**Required Utility Classes:**
- `.animate-pulse-glow`
- `.animate-float`
- `.animate-shimmer`
- `.animate-particle`
- `.animate-rickshaw-bounce`
- `.animate-wheel-spin`
- `.animate-neon-glow`
- `.animate-holographic`
- `.animate-plasma`
- `.animate-solar-rays`
- `.animate-eco-breeze`
- `.animate-god-rays`

**Required Component Classes:**
- `.hover-lift` - Button hover effects
- `.glass-morphism` - Card effects
- `.ripple-effect` - Button interactions
- `.airbear-holographic` - Brand text effects
- `.airbear-plasma` - Background effects
- `.airbear-solar-rays` - Theme elements
- `.airbear-eco-breeze` - Eco animations
- `.airbear-god-rays` - Atmospheric effects
- `.eco-gradient` - Brand gradients

### 2. **Tailwind Configuration** (`tailwind.config.ts`)
**Location:** `tailwind.config.ts` - Lines 12-21

**Required Safelist:**
All animation classes MUST be in the `safelist` array to prevent purging:
```typescript
safelist: [
  "airbear-holographic", "airbear-plasma", "airbear-solar-rays", 
  "airbear-marker", "airbear-eco-breeze", "airbear-god-rays",
  "glass-morphism", "neumorphism", "eco-gradient", "particle-system", 
  "airbear-wheel", "hover-lift", "ripple-effect",
  "animate-spin-slow", "animate-pulse-glow", "animate-float", 
  "animate-shimmer", "animate-particle", "animate-rickshaw-bounce",
  "animate-wheel-spin", "animate-neon-glow", "animate-vortex-zoom", 
  "animate-confetti-burst", "animate-liquid-fill", "animate-ripple-wave",
  "animate-holographic", "animate-plasma", "animate-solar-rays", 
  "animate-eco-breeze", "animate-airbear-bounce", "animate-god-rays",
  // ... color patterns
]
```

**Required Theme Extensions:**
- `animation` object with all keyframe mappings
- `keyframes` object with all animation definitions

### 3. **Default Dark Mode** (`app/layout.tsx`)
**Location:** `app/layout.tsx` - Lines 115-120

**Required Configuration:**
```typescript
<ThemeProvider
  attribute="class"
  defaultTheme="dark"
  enableSystem={false}
  disableTransitionOnChange
>
```

**Why:** Dark mode is the default brand experience. DO NOT change `defaultTheme` or `enableSystem`.

### 4. **Core Component Usage**

**Homepage** (`app/page.tsx`):
- MUST use `animate-float` on mascot
- MUST use `animate-pulse-glow` on brand name
- MUST use `hover-lift` on buttons
- MUST use `airbear-holographic` on main heading
- MUST include particle effects

**Map Page** (`app/map/page.tsx`):
- MUST use `animate-float` on mascot
- MUST use `animate-pulse-glow` on title
- MUST use beautiful map styling

**All Pages:**
- MUST use dark gradient backgrounds: `from-emerald-950 via-lime-950 to-amber-950`
- MUST include mascot with animations
- MUST use glass morphism on cards

## 🛡️ Protection Mechanisms

### 1. **Validation Script**
Run `pnpm run validate:ui` to check all core UI features are present.

### 2. **GitHub Actions**
The `.github/workflows/validate-ui-ux.yml` workflow validates UI on every commit.

### 3. **Documentation**
This file serves as the canonical reference for core UI features.

## ⚠️ Breaking Changes Policy

**DO NOT:**
- Remove any animation keyframes
- Remove any utility classes
- Change default theme from "dark"
- Remove classes from Tailwind safelist
- Remove mascot animations
- Remove special effects

**DO:**
- Add new animations (add to safelist)
- Enhance existing animations
- Improve performance while keeping effects
- Document new features here

## 📋 Validation Checklist

Before any deployment, verify:
- [ ] All keyframes present in `globals.css`
- [ ] All utility classes present in `globals.css`
- [ ] All classes in Tailwind safelist
- [ ] Dark mode default enabled
- [ ] Mascot animations working
- [ ] Particle effects rendering
- [ ] Hover effects working
- [ ] Glass morphism visible
- [ ] All pages use dark gradients

## 🎨 Visual Identity

**Colors:**
- Primary: Emerald green (`#10b981`)
- Secondary: Lime (`#84cc16`)
- Accent: Amber (`#f59e0b`)
- Background: Dark gradients (`emerald-950`, `lime-950`, `amber-950`)

**Animations:**
- Smooth, 60fps transitions
- Respect `prefers-reduced-motion`
- Performance optimized
- Always enabled by default

---

**This UI/UX foundation is CORE to AirBear's identity. Protect it.**




