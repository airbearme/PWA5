## 2025-05-14 - Decoupling Network Fetching from URL State
**Learning:** Attaching network requests to highly dynamic URL parameters (like `searchParams`) causes redundant API calls and layout flashes even when the data doesn't need to change.
**Action:** Separate initial data synchronization from the main data fetching effect, and use memoization for derived state (fare/distance) to stabilize the component's render cycle.
