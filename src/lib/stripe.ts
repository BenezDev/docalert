/** Stripe plan configuration — maps internal plan names to Stripe IDs */

export const STRIPE_PLANS = {
  individual: {
    name: "Individual",
    price_id: "price_1TCpiLINfs7nNkzeOdNsWZRy",
    product_id: "prod_UBC6FXZnoVTEZ9",
    amount: 990, // centavos
  },
  familiar: {
    name: "Familiar",
    price_id: "price_1TCpikINfs7nNkzekpEGWnyx",
    product_id: "prod_UBC61TM0JVVz8g",
    amount: 1990,
  },
} as const;

export type PlanKey = keyof typeof STRIPE_PLANS;
