# UI/UX Preservation Contract

## Protected Visual Assets

### Critical Animations (MUST PRESERVE)
1. **Pulse Glow** - `animate-pulse-glow` - Used for available AirBears
2. **Float Animation** - `animate-float` - Used for hero elements
3. **Shimmer** - `animate-shimmer` - Loading states
4. **Particle System** - `animate-particle` - Background effects
5. **Rickshaw Bounce** - `animate-rickshaw-bounce` - Interactive elements
6. **Wheel Spin** - `animate-wheel-spin` - Loading indicators
7. **Neon Glow** - `animate-neon-glow` - Brand elements
8. **Holographic Shift** - `animate-holographic` - Premium effects
9. **Plasma Flow** - `animate-plasma` - Background animations
10. **Solar Rays** - `animate-solar-rays` - Theme elements

### Protected Components
- **Map Markers**: Animated pulse for available AirBears
- **Buttons**: Hover lift effects (`hover-lift`)
- **Cards**: Glass morphism effects
- **Loading States**: AirBear wheel spinner
- **Particle System**: Background particle animations

### Color Scheme (MUST PRESERVE)
- Primary: Green gradient (hsl(158, 64%, 52%))
- Secondary: Orange gradient (hsl(43, 96%, 97%))
- Background: Gradient (135deg, hsl(120, 20%, 98%) → hsl(84, 81%, 97%) → hsl(43, 96%, 97%))

### Motion Preferences
- Respects `prefers-reduced-motion`
- Low power mode support
- High contrast mode support

## Visual QA Checklist

Before any deployment, verify:
- [ ] All animations render correctly
- [ ] Map markers pulse when AirBears are available
- [ ] Buttons have hover lift effect
- [ ] Loading spinners use AirBear wheel animation
- [ ] Particle system renders in background
- [ ] Glass morphism effects visible on cards
- [ ] Color gradients match design system
- [ ] Transitions are smooth (60fps)
- [ ] No layout shifts during animations
- [ ] Dark mode preserves all effects

## Performance Targets (WITH Effects)
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.5s
- Cumulative Layout Shift: < 0.1
- First Input Delay: < 100ms

**Note**: These targets must be met WITH all animations enabled.





