## 2025-02-18 - Consistent Feedback Pattern in Auth
**Learning:** Using the `Alert` component for error messages in forms provides a more consistent and accessible experience than generic `div` elements, especially in a dark-themed application like AirBear.
**Action:** Always prefer `Alert` with `variant="destructive"` for error states in new forms.

## 2025-02-18 - Spinner Component Reuse
**Learning:** The project has a dedicated `Spinner` component in `components/ui/spinner.tsx` which should be used for loading states instead of custom CSS animations or simple text.
**Action:** Use the `Spinner` component for all button loading states to maintain visual consistency.
