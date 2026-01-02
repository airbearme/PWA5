# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - img "AirBear Mascot" [ref=e7]
      - generic [ref=e8]: Welcome to AirBear
      - generic [ref=e9]: Sign in to book your solar-powered ride
    - generic [ref=e10]:
      - button "Continue with Google" [ref=e12]:
        - img [ref=e13]
        - text: Continue with Google
      - generic [ref=e19]: Or continue with email
      - generic [ref=e20]:
        - generic [ref=e21]:
          - text: Email
          - textbox "Email" [ref=e22]:
            - /placeholder: you@example.com
        - generic [ref=e23]:
          - text: Password
          - textbox "Password" [ref=e24]:
            - /placeholder: ••••••••
        - button "Sign In" [ref=e25]
      - generic [ref=e26]:
        - text: Don't have an account?
        - link "Sign up" [ref=e27] [cursor=pointer]:
          - /url: /auth/signup
  - link "🐻 AirBear Mascot Go Home 🏠" [ref=e28] [cursor=pointer]:
    - /url: /
    - generic [ref=e30]:
      - generic [ref=e38]: 🐻
      - img "AirBear Mascot" [ref=e39]
      - generic [ref=e40]: Go Home 🏠
  - region "Notifications (F8)":
    - list
```