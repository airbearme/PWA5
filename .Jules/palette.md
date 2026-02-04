## 2025-05-14 - [Accessible Selection Pattern]
**Learning:** Refactoring non-semantic interactive elements (like location selection cards) from `div` to `button` elements with focus-visible styles and dynamic ARIA labels (e.g., "Change pickup location, currently [Name]") significantly improves keyboard navigation and screen-reader context.
**Action:** Use the `button` element for all interactive tiles and cards in selection flows, ensuring they have visible focus states and contextual labels when actions are potentially ambiguous.
