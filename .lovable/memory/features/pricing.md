Pricing tiers and plan limits for DocAlert

## Plans
- Gratuito: R$ 0, 1 documento, alertas por email, guia básico
- Individual: R$ 9,90/mês, documentos ilimitados, WhatsApp, guia completo + calculadora
- Familiar: R$ 19,90/mês, tudo do Individual + até 5 membros, painel compartilhado
- Empresarial: sob consulta (contato@docalert.com.br)

## Referral Program
- 1 mês grátis por amigo que criar conta
- Tables: referral_codes (auto-generated on signup via trigger), referrals (tracking)
- Edge function: process-referral (uses service role to insert referral)
- Signup page reads ?ref= param and processes after signup
- Settings > Indicação tab shows code, link, stats

## References
- Landing page pricing section: src/pages/LandingPage.tsx
- Settings plan tab: src/pages/SettingsPage.tsx
- Signup referral flow: src/pages/SignupPage.tsx
- Edge function: supabase/functions/process-referral/index.ts
