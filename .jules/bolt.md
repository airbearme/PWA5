## 2025-05-15 - [Initial Profile]
**Learning:** The real-time map component (map-view-beautiful.tsx) re-creates all spot markers whenever any airbear's location updates, leading to O(S*A) calculations and heavy DOM manipulation on every real-time event.
**Action:** Implement marker reuse and pre-calculate availability counts to reduce complexity to O(S+A) and minimize Leaflet setIcon/DOM updates.
