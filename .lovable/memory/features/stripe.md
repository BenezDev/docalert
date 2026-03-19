Stripe integration config — product IDs, price IDs, and edge functions

## Stripe Products
- Individual: prod_UBC6FXZnoVTEZ9, price_1TCpiLINfs7nNkzeOdNsWZRy (R$ 9,90/mês)
- Familiar: prod_UBC61TM0JVVz8g, price_1TCpikINfs7nNkzekpEGWnyx (R$ 19,90/mês)

## Edge Functions
- create-checkout: Creates Stripe checkout session for subscription
- check-subscription: Verifies active subscription, syncs plan_type to profiles table
- customer-portal: Opens Stripe billing portal for subscription management

## Frontend
- src/lib/stripe.ts: STRIPE_PLANS constant with price/product IDs
- src/hooks/useSubscription.tsx: Hook that checks subscription status, auto-refreshes every 60s
- PricingPage: Buttons wired to create-checkout
- SettingsPage > Plano tab: Shows current plan, manage subscription button, or upgrade cards

## Plan Types in profiles.plan_type
- FREE (default)
- INDIVIDUAL
- FAMILIAR
