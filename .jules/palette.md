## 2025-02-11 - Semantic Button Nesting
**Learning:** When refactoring interactive `div` elements to semantic `button` tags for accessibility, nested content should use `<span>` tags (with `block` class for layout) instead of `<p>` tags to maintain valid HTML nesting compliance.
**Action:** Use `<span>` for block-level elements inside buttons to avoid "phrasing content" violations.
