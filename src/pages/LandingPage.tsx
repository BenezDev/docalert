import { Link, useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import dashboardMockup from "@/assets/dashboard-mockup.png";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Shield,
  FileText,
  DollarSign,
  Users,
  Smartphone,
  Building2,
  Check,
  ArrowRight,
  Car,
  Plane,
  Heart,
} from "lucide-react";

const painCards = [
  {
    icon: Car,
    title: "CNH vencida",
    penalty: "R$ 293,47",
    extras: ["+ 5 pontos na carteira", "+ Risco de apreensão"],
  },
  {
    icon: FileText,
    title: "CRLV atrasado",
    penalty: "R$ 293,47",
    extras: ["+ Veículo pode ser apreendido", "+ Responsabilidade civil"],
  },
  {
    icon: Plane,
    title: "Passaporte vencido",
    penalty: "Viagem cancelada",
    extras: ["+ Prejuízo médio: R$ 3.000", "+ Stress e transtorno"],
  },
];

const features = [
  { icon: Bell, title: "Alertas inteligentes", desc: "Avisa 90, 30 e 7 dias antes" },
  { icon: FileText, title: "Todos documentos em um lugar", desc: "CNH, CRLV, IPVA, Passaporte e mais" },
  { icon: DollarSign, title: "Custo do atraso em tempo real", desc: "Veja quanto vai perder se ignorar" },
  { icon: Users, title: "Modo família", desc: "Gerencie docs de toda a família" },
  { icon: Smartphone, title: "Guia passo a passo", desc: "Sabe exatamente como renovar" },
  { icon: Building2, title: "Modo MEI/Empresa", desc: "Alvarás, certidões e muito mais" },
];

const plans = [
  {
    name: "Gratuito",
    price: "R$ 0",
    period: "",
    features: ["Até 5 documentos", "Alertas por email", "Guia básico"],
    cta: "Começar grátis",
    highlighted: false,
  },
  {
    name: "Pessoal",
    price: "R$ 9,90",
    period: "/mês",
    features: [
      "Documentos ilimitados",
      "Alertas por WhatsApp",
      "Modo família (até 4 pessoas)",
      "Guia completo passo a passo",
      "Calculadora de multas",
    ],
    cta: "Assinar agora",
    highlighted: true,
  },
  {
    name: "MEI/Empresa",
    price: "R$ 29,90",
    period: "/mês",
    features: [
      "Tudo do plano pessoal",
      "Documentos empresariais",
      "Múltiplos CNPJs",
      "Relatórios",
      "Suporte prioritário",
    ],
    cta: "Falar com vendas",
    highlighted: false,
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container flex h-16 items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-8">
            <a href="#funcionalidades" className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
              Funcionalidades
            </a>
            <a href="#precos" className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
              Preços
            </a>
            <Link to="/login">
              <Button variant="ghost" size="sm">Entrar</Button>
            </Link>
            <Link to="/cadastro">
              <Button variant="hero" size="sm">Começar Grátis</Button>
            </Link>
          </nav>
          <Link to="/cadastro" className="md:hidden">
            <Button variant="hero" size="sm">Começar Grátis</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 md:py-32">
        <div className="container text-center max-w-3xl mx-auto">
          <Badge className="mb-6 bg-secondary/10 text-secondary border-secondary/20 font-body">
            Nunca mais perca um prazo de documento
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
            Nunca mais pague multa por documento vencido
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-body mb-8 max-w-2xl mx-auto">
            DocAlert monitora seus documentos, avisa antes de vencer e te guia para renovar. Simples assim.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" onClick={() => navigate("/cadastro")}>
              Criar conta grátis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="hero-outline" size="lg" onClick={() => {
              document.getElementById("funcionalidades")?.scrollIntoView({ behavior: "smooth" });
            }}>
              Ver funcionalidades
            </Button>
          </div>
        </div>
      </section>

      {/* Pain Section */}
      <section className="py-20 bg-muted">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Quanto custa esquecer?</h2>
          <p className="text-center text-muted-foreground font-body mb-12 max-w-xl mx-auto">
            Documentos vencidos geram multas, perda de tempo e transtorno. Veja o que pode acontecer:
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {painCards.map((card) => (
              <div
                key={card.title}
                className="bg-card rounded-lg p-6 shadow-card border-l-4 border-destructive"
              >
                <card.icon className="h-8 w-8 text-destructive mb-4" />
                <h3 className="font-display font-bold text-lg mb-2">{card.title}</h3>
                <p className="text-2xl font-display font-bold text-destructive mb-3">{card.penalty}</p>
                {card.extras.map((e) => (
                  <p key={e} className="text-sm text-muted-foreground font-body">{e}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="funcionalidades" className="py-20">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Tudo que você precisa</h2>
          <p className="text-center text-muted-foreground font-body mb-12 max-w-xl mx-auto">
            Uma plataforma completa para nunca mais esquecer um prazo importante.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((f) => (
              <div key={f.title} className="bg-card rounded-lg p-6 shadow-card hover:shadow-card-hover transition-shadow">
                <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <f.icon className="h-5 w-5 text-secondary" />
                </div>
                <h3 className="font-display font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground font-body">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="precos" className="py-20 bg-muted">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Planos e preços</h2>
          <p className="text-center text-muted-foreground font-body mb-12">Escolha o plano ideal para você</p>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-card rounded-lg p-8 shadow-card relative ${
                  plan.highlighted ? "ring-2 ring-secondary scale-105" : ""
                }`}
              >
                {plan.highlighted && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-secondary-foreground font-body">
                    Mais popular
                  </Badge>
                )}
                <h3 className="font-display font-bold text-xl mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-3xl font-display font-bold">{plan.price}</span>
                  <span className="text-muted-foreground font-body">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm font-body">
                      <Check className="h-4 w-4 text-success mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.highlighted ? "hero" : "outline"}
                  className="w-full"
                  onClick={() => navigate("/cadastro")}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start gap-2">
              <Logo size="sm" />
              <p className="text-sm text-muted-foreground font-body">Nunca mais perca um prazo de documento</p>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground font-body">
              <a href="#" className="hover:text-foreground transition-colors">Sobre</a>
              <a href="#" className="hover:text-foreground transition-colors">Privacidade</a>
              <a href="#" className="hover:text-foreground transition-colors">Termos</a>
            </div>
            <p className="text-sm text-muted-foreground font-body flex items-center gap-1">
              Feito com <Heart className="h-3 w-3 text-destructive fill-destructive" /> para brasileiros
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
