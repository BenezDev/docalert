import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, ArrowRight, Shield, Zap, Users, Crown, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { STRIPE_PLANS, type PlanKey } from "@/lib/stripe";
import { toast } from "sonner";

const plans = [
  {
    name: "Gratuito",
    price: "R$ 0",
    period: "",
    description: "Para experimentar",
    icon: Shield,
    cta: "Começar grátis",
    variant: "outline" as const,
    popular: false,
    stripePlan: null as PlanKey | null,
    features: [
      { label: "1 documento", included: true },
      { label: "Alertas por email", included: true },
      { label: "Guia de renovação", included: true },
      { label: "Calculadora de multas", included: true },
      { label: "WhatsApp", included: false },
      { label: "Documentos ilimitados", included: false },
      { label: "Painel familiar", included: false },
      { label: "Suporte prioritário", included: false },
    ],
  },
  {
    name: "Individual",
    price: "R$ 9,90",
    period: "/mês",
    description: "Para quem quer ficar em dia",
    icon: Zap,
    cta: "Assinar agora",
    variant: "hero" as const,
    popular: true,
    stripePlan: "individual" as PlanKey,
    features: [
      { label: "Documentos ilimitados", included: true },
      { label: "Alertas por email", included: true },
      { label: "Alertas por WhatsApp", included: true },
      { label: "Guia de renovação", included: true },
      { label: "Calculadora de multas", included: true },
      { label: "Histórico de renovações", included: true },
      { label: "Painel familiar", included: false },
      { label: "Suporte prioritário", included: false },
    ],
  },
  {
    name: "Familiar",
    price: "R$ 19,90",
    period: "/mês",
    description: "Para proteger toda a família",
    icon: Users,
    cta: "Assinar agora",
    variant: "outline" as const,
    popular: false,
    stripePlan: "familiar" as PlanKey,
    features: [
      { label: "Documentos ilimitados", included: true },
      { label: "Alertas por email", included: true },
      { label: "Alertas por WhatsApp", included: true },
      { label: "Guia de renovação", included: true },
      { label: "Calculadora de multas", included: true },
      { label: "Histórico de renovações", included: true },
      { label: "Até 5 membros da família", included: true },
      { label: "Suporte prioritário", included: true },
    ],
  },
];

const comparison = [
  { feature: "Documentos", free: "1", individual: "Ilimitados", familiar: "Ilimitados" },
  { feature: "Alertas por email", free: "✓", individual: "✓", familiar: "✓" },
  { feature: "Alertas por WhatsApp", free: "—", individual: "✓", familiar: "✓" },
  { feature: "Guia de renovação", free: "✓", individual: "✓", familiar: "✓" },
  { feature: "Calculadora de multas", free: "✓", individual: "✓", familiar: "✓" },
  { feature: "Histórico de renovações", free: "—", individual: "✓", familiar: "✓" },
  { feature: "Membros da família", free: "—", individual: "—", familiar: "Até 5" },
  { feature: "Suporte prioritário", free: "—", individual: "—", familiar: "✓" },
];

export default function PricingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleCheckout = async (planKey: PlanKey) => {
    if (!user) {
      navigate(`/login?redirect=/precos&plan=${planKey}`);
      return;
    }
    setLoadingPlan(planKey);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId: STRIPE_PLANS[planKey].price_id },
      });
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (err: any) {
      toast.error(err.message || "Erro ao iniciar checkout");
    } finally {
      setLoadingPlan(null);
    }
  };

  const handlePlanClick = (plan: typeof plans[number]) => {
    if (plan.stripePlan) {
      handleCheckout(plan.stripePlan);
    } else {
      navigate("/cadastro");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container flex h-14 items-center justify-between px-4">
          <Logo size="sm" />
          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeToggle />
            {user ? (
              <Link to="/dashboard">
                <Button variant="hero" size="sm">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="font-body text-muted-foreground">Entrar</Button>
                </Link>
                <Link to="/cadastro">
                  <Button variant="hero" size="sm" className="hidden sm:inline-flex">Começar grátis</Button>
                  <Button variant="hero" size="sm" className="sm:hidden text-xs px-3">Começar</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="py-16 md:py-24">
        <div className="container max-w-5xl">
          <div className="text-center mb-14">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Preço justo, sem surpresas
            </h1>
            <p className="text-muted-foreground font-body max-w-md mx-auto">
              Comece de graça. Faça upgrade quando precisar de mais.
            </p>
          </div>

          {/* Plan Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-card rounded-lg p-7 shadow-card relative ${
                  plan.popular ? "border-2 border-secondary" : "border border-border/50"
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-secondary-foreground font-body">
                    <Crown className="h-3 w-3 mr-1" /> Mais popular
                  </Badge>
                )}
                <plan.icon className="h-6 w-6 text-secondary mb-4" />
                <h3 className="font-display font-bold text-lg mb-1">{plan.name}</h3>
                <p className="text-muted-foreground font-body text-sm mb-5">{plan.description}</p>
                <p className="text-3xl font-display font-bold mb-6">
                  {plan.price}
                  {plan.period && <span className="text-sm text-muted-foreground font-body">{plan.period}</span>}
                </p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f.label} className="flex items-center gap-2.5 text-sm font-body">
                      {f.included ? (
                        <Check className="h-4 w-4 text-success shrink-0" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                      )}
                      <span className={f.included ? "" : "text-muted-foreground/60"}>
                        {f.label}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.variant as any}
                  className="w-full font-body"
                  disabled={loadingPlan === plan.stripePlan}
                  onClick={() => handlePlanClick(plan)}
                >
                  {loadingPlan === plan.stripePlan ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      {plan.cta} <ArrowRight className="h-4 w-4 ml-1" />
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          <div>
            <h2 className="text-xl font-bold text-center mb-8">Comparação detalhada</h2>
            <div className="bg-card rounded-lg shadow-card overflow-hidden">
              <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="text-left p-4 text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider">Funcionalidade</th>
                      <th className="text-center p-4 text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider">Gratuito</th>
                      <th className="text-center p-4 text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider">Individual</th>
                      <th className="text-center p-4 text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider">Familiar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparison.map((row) => (
                      <tr key={row.feature} className="border-b last:border-0">
                        <td className="p-4 text-sm font-body font-medium">{row.feature}</td>
                        <td className="p-4 text-center text-sm font-body text-muted-foreground">{row.free}</td>
                        <td className="p-4 text-center text-sm font-body font-semibold">{row.individual}</td>
                        <td className="p-4 text-center text-sm font-body">{row.familiar}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-20 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-center mb-8">Perguntas frequentes</h2>
            <div className="space-y-4">
              {[
                { q: "Posso cancelar a qualquer momento?", a: "Sim! Você pode cancelar a assinatura quando quiser, sem multa ou fidelidade." },
                { q: "O plano gratuito é realmente grátis?", a: "Sim, para sempre. Você pode acompanhar 1 documento com alertas por email sem pagar nada." },
                { q: "Como funciona o plano Familiar?", a: "Você pode convidar até 4 pessoas da sua família. Cada membro gerencia seus próprios documentos no mesmo painel." },
                { q: "Aceita quais formas de pagamento?", a: "Cartão de crédito (Visa, Mastercard, Elo) e Pix. Processamento seguro via Stripe." },
              ].map((faq) => (
                <div key={faq.q} className="bg-card rounded-lg p-5 shadow-card">
                  <p className="font-display font-semibold text-sm mb-1">{faq.q}</p>
                  <p className="text-sm text-muted-foreground font-body">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <h2 className="text-2xl font-bold mb-3">Pronto para nunca mais pagar multa?</h2>
            <p className="text-muted-foreground font-body mb-6">Comece grátis. Leva menos de 2 minutos.</p>
            <Button variant="hero" size="lg" onClick={() => navigate("/cadastro")}>
              Começar grátis <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
