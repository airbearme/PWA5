## 2025-05-15 - Glass-morphism Contrast in Dark Mode
**Learning:** Standard glass-morphism (thin borders, high transparency) often fails accessibility contrast checks against vibrant, dynamic backgrounds. To maintain the aesthetic while ensuring readability in dark-mode-only apps, using a dark semi-transparent overlay (e.g., `bg-black/40`) inside the glass container is a highly effective micro-enhancement.
**Action:** Always verify glass-morphism components against the most vibrant parts of the background and use dark overlays to ground the text.
