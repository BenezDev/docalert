import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { OnboardingChatbot } from "@/components/OnboardingChatbot";
import dashboardMockup from "@/assets/dashboard-mockup.png";
import avatarMariana from "@/assets/avatar-mariana.jpg";
import avatarRicardo from "@/assets/avatar-ricardo.jpg";
import avatarCamila from "@/assets/avatar-camila.jpg";
import avatarBruno from "@/assets/avatar-bruno.jpg";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Clock,
  ShieldCheck,
  Zap,
  Star,
  ChevronRight,
  CheckCircle2,
  Calculator,
  Share2,
  Heart,
  DollarSign,
} from "lucide-react";

// Penalty calculator data
const CALC_DOCS = [
  { label: "CNH vencida", value: 293.47, extras: "5 pontos + apreensão" },
  { label: "CRLV atrasado", value: 293.47, extras: "Veículo apreendido" },
  { label: "IPVA atrasado", value: 450, extras: "Dívida ativa" },
  { label: "Passaporte vencido", value: 3000, extras: "Viagem cancelada" },
];

function PenaltyCalcWidget() {
  const [selected, setSelected] = useState(0);
  const doc = CALC_DOCS[selected];
  const navigate = useNavigate();

  return (
    <div className="bg-card rounded-xl p-6 shadow-card border border-border/50">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="h-5 w-5 text-destructive" />
        <h3 className="font-display font-bold">Quanto você pode perder?</h3>
      </div>
      <div className="flex flex-wrap gap-2 mb-5">
        {CALC_DOCS.map((d, i) => (
          <button
            key={d.label}
            onClick={() => setSelected(i)}
            className={`px-3 py-1.5 rounded-full text-xs font-body font-medium transition-colors ${
              i === selected
                ? "bg-destructive text-destructive-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>
      <div className="bg-destructive/5 dark:bg-destructive/10 rounded-lg p-5 mb-4">
        <p className="text-xs text-muted-foreground font-body uppercase tracking-wider mb-1">Multa estimada</p>
        <p className="text-4xl font-display font-bold text-destructive">
          R$ {doc.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </p>
        <p className="text-sm text-muted-foreground font-body mt-1">+ {doc.extras}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-success/10 dark:bg-success/15 rounded-lg p-3">
          <p className="text-xs text-muted-foreground font-body mb-0.5">Com DocAlert</p>
          <p className="text-lg font-display font-bold text-success">R$ 0,00</p>
        </div>
        <Button variant="hero" size="sm" onClick={() => navigate("/cadastro")}>
          Evitar multa <ArrowRight className="h-3 w-3 ml-1" />
        </Button>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();

  const shareLink = `${window.location.origin}/cadastro`;
  const shareText = "Proteja sua família! Nunca mais pague multa por documento vencido.";

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: "DocAlert", text: shareText, url: shareLink });
    } else {
      navigator.clipboard.writeText(`${shareText} ${shareLink}`);
      // Feedback is subtle — just copies
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
            <Link to="/login">
              <Button variant="ghost" size="sm" className="font-body text-muted-foreground hidden sm:inline-flex">Entrar</Button>
              <Button variant="ghost" size="sm" className="font-body text-muted-foreground sm:hidden px-2">Entrar</Button>
            </Link>
            <Link to="/cadastro">
              <Button variant="hero" size="sm" className="hidden sm:inline-flex">Começar grátis</Button>
              <Button variant="hero" size="sm" className="sm:hidden text-xs px-3">Começar</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="container max-w-5xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-sm font-body font-medium text-secondary mb-4 tracking-wide uppercase">
              Para quem já esqueceu e pagou caro
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-foreground leading-[1.15] mb-5">
              Seus documentos vencem.<br className="hidden sm:block" />
              A gente avisa antes.
            </h1>
            <p className="text-base md:text-lg text-muted-foreground font-body max-w-xl mx-auto mb-8 leading-relaxed">
              Cadastre CNH, CRLV, passaporte e mais. Receba alertas com antecedência 
              e saiba exatamente o que fazer para renovar — sem surpresas, sem multas.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="hero" size="lg" onClick={() => navigate("/cadastro")} className="text-base px-8">
                Começar grátis
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="text-base text-muted-foreground"
                onClick={() => document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth" })}
              >
                Como funciona?
              </Button>
            </div>
            <p className="mt-5 text-xs text-muted-foreground font-body">
              Grátis para 1 documento · Individual R$ 9,90/mês · Familiar R$ 19,90/mês
            </p>
          </div>

          {/* Screenshot + Calculator side by side */}
          <div className="grid lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
            <div className="lg:col-span-3">
              <div className="rounded-xl shadow-2xl overflow-hidden border border-border/40 bg-card">
                <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border/40 bg-muted/30">
                  <div className="h-2.5 w-2.5 rounded-full bg-border" />
                  <div className="h-2.5 w-2.5 rounded-full bg-border" />
                  <div className="h-2.5 w-2.5 rounded-full bg-border" />
                  <div className="ml-3 h-5 flex-1 max-w-xs rounded bg-border/50" />
                </div>
                <img
                  src={dashboardMockup}
                  alt="Painel do DocAlert mostrando documentos monitorados"
                  className="w-full h-auto"
                  loading="eager"
                />
              </div>
            </div>
            <div className="lg:col-span-2 flex flex-col justify-center">
              <PenaltyCalcWidget />
            </div>
          </div>
        </div>
      </section>

      {/* Números */}
      <section className="py-12 border-y bg-card">
        <div className="container max-w-4xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
            {[
              { number: "47 milhões", label: "de CNHs vencem por ano no Brasil" },
              { number: "R$ 293", label: "é a multa por dirigir com CNH vencida" },
              { number: "72%", label: "das pessoas só lembram quando é tarde" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-xl md:text-2xl font-display font-bold text-foreground">{stat.number}</p>
                <p className="text-xs md:text-sm text-muted-foreground font-body mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section id="como-funciona" className="py-20">
        <div className="container max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">Simples de usar. Difícil de esquecer.</h2>
          <p className="text-center text-muted-foreground font-body mb-14 max-w-lg mx-auto">
            Em menos de 2 minutos você cadastra seus documentos e pronto — a gente cuida do resto.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Cadastre seus documentos", desc: "Informe o tipo e a data de vencimento. Só isso.", icon: Zap },
              { step: "02", title: "Receba alertas no tempo certo", desc: "Avisamos 90, 30 e 7 dias antes do vencimento.", icon: Clock },
              { step: "03", title: "Renove sem stress", desc: "Mostramos o passo a passo, quanto custa e onde ir.", icon: ShieldCheck },
            ].map((item) => (
              <div key={item.step} className="relative">
                <span className="text-5xl font-display font-bold text-muted/60 absolute -top-2 -left-1 select-none">{item.step}</span>
                <div className="pt-10">
                  <item.icon className="h-5 w-5 text-secondary mb-3" />
                  <h3 className="font-display font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground font-body leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custos */}
      <section className="py-20 bg-muted/50">
        <div className="container max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">O custo de não se organizar</h2>
          <p className="text-center text-muted-foreground font-body mb-12 max-w-lg mx-auto">
            Esquecer a data de vencimento pode sair caro. Literalmente.
          </p>
          <div className="space-y-4 max-w-2xl mx-auto">
            {[
              { doc: "CNH vencida", consequence: "Multa de R$ 293,47 + 5 pontos na carteira + risco de apreensão" },
              { doc: "CRLV atrasado", consequence: "Multa de R$ 293,47 + veículo pode ser apreendido" },
              { doc: "Passaporte vencido", consequence: "Viagem cancelada + prejuízo médio de R$ 3.000" },
              { doc: "IPVA atrasado", consequence: "Multa de 0,33% ao dia + juros + pode ir para dívida ativa" },
            ].map((item) => (
              <div key={item.doc} className="flex items-start gap-4 bg-card rounded-lg p-5 shadow-card border-l-4 border-l-destructive">
                <div className="shrink-0 mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-destructive" />
                </div>
                <div>
                  <p className="font-display font-semibold text-sm">{item.doc}</p>
                  <p className="text-sm text-muted-foreground font-body">{item.consequence}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos com foto e economia */}
      <section className="py-20">
        <div className="container max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Quem usa, recomenda</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                quote: "Quase perdi uma viagem internacional porque meu passaporte tinha vencido. Nunca mais depois do DocAlert.",
                name: "Mariana S.",
                role: "Viajante frequente",
                avatar: avatarMariana,
                saved: "R$ 3.000",
                savedLabel: "em viagem salva",
              },
              {
                quote: "Gerencio os documentos da minha família inteira. É simples e me poupa uma dor de cabeça enorme.",
                name: "Ricardo P.",
                role: "Pai de família",
                avatar: avatarRicardo,
                saved: "R$ 586",
                savedLabel: "em multas evitadas",
              },
              {
                quote: "Como MEI, tenho vários prazos para acompanhar. O DocAlert me avisa de tudo sem eu precisar lembrar.",
                name: "Camila F.",
                role: "Microempreendedora",
                avatar: avatarCamila,
                saved: "R$ 1.200",
                savedLabel: "em taxas evitadas",
              },
              {
                quote: "Paguei multa por CNH vencida ano passado. Agora tenho o DocAlert e durmo tranquilo.",
                name: "Bruno M.",
                role: "Motorista",
                avatar: avatarBruno,
                saved: "R$ 293",
                savedLabel: "em multa evitada",
              },
            ].map((t) => (
              <div key={t.name} className="bg-card rounded-lg p-6 shadow-card">
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-3.5 w-3.5 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-sm text-foreground font-body leading-relaxed mb-4">"{t.quote}"</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="h-10 w-10 rounded-full object-cover"
                      loading="lazy"
                    />
                    <div>
                      <p className="text-sm font-display font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground font-body">{t.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-display font-bold text-success">{t.saved}</p>
                    <p className="text-[10px] text-muted-foreground font-body">{t.savedLabel}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compartilhamento familiar */}
      <section className="py-16 bg-secondary/5 dark:bg-secondary/10">
        <div className="container max-w-3xl text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-6 w-6 text-destructive" />
            <Share2 className="h-5 w-5 text-secondary" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Proteja quem você ama
          </h2>
          <p className="text-muted-foreground font-body mb-6 max-w-lg mx-auto">
            Seus pais, filhos e parceiro(a) também esquecem prazos. 
            Compartilhe o DocAlert e evite multas na família toda.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="hero" size="lg" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar com a família
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate("/cadastro")}>
              Criar conta Familiar
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground font-body mt-4">
            Plano Familiar: até 5 pessoas por R$ 19,90/mês
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/50">
        <div className="container max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Tudo que você precisa, nada que não precisa</h2>
              <p className="text-muted-foreground font-body mb-6 leading-relaxed">
                O DocAlert não tenta fazer de tudo. Ele faz uma coisa e faz bem: 
                garantir que você nunca mais esqueça um prazo de documento.
              </p>
              <Button variant="hero" onClick={() => navigate("/cadastro")}>
                Começar grátis <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {[
                "Alertas por email com 90, 30 e 7 dias de antecedência",
                "Guia passo a passo para renovar cada documento",
                "Calculadora de multas em tempo real",
                "Suporte a 11 tipos de documentos (CNH, CRLV, IPVA, Passaporte…)",
                "Modo família — gerencie docs de até 4 pessoas",
                "Funciona no celular, tablet e desktop",
              ].map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                  <p className="text-sm font-body text-foreground">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Preços */}
      <section id="precos" className="py-20">
        <div className="container max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">Preço justo, sem surpresas</h2>
          <p className="text-center text-muted-foreground font-body mb-12">
            Comece de graça. Faça upgrade quando precisar de mais.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card rounded-lg p-7 shadow-card border border-border/50">
              <h3 className="font-display font-bold text-lg mb-1">Gratuito</h3>
              <p className="text-muted-foreground font-body text-sm mb-5">Para experimentar</p>
              <p className="text-3xl font-display font-bold mb-6">R$ 0</p>
              <ul className="space-y-3 mb-8">
                {["1 documento", "Alertas por email", "Guia básico de renovação"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm font-body">
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full font-body" onClick={() => navigate("/cadastro")}>
                Começar grátis
              </Button>
            </div>
            <div className="bg-card rounded-lg p-7 shadow-card ring-2 ring-secondary relative">
              <div className="absolute -top-3 right-6 bg-secondary text-secondary-foreground text-xs font-body font-semibold px-3 py-1 rounded-full">
                Recomendado
              </div>
              <h3 className="font-display font-bold text-lg mb-1">Individual</h3>
              <p className="text-muted-foreground font-body text-sm mb-5">Para quem quer tranquilidade total</p>
              <div className="mb-6">
                <span className="text-3xl font-display font-bold">R$ 9,90</span>
                <span className="text-muted-foreground font-body">/mês</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["Documentos ilimitados", "Alertas por WhatsApp", "Guia completo + calculadora de multas"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm font-body">
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant="hero" className="w-full" onClick={() => navigate("/cadastro")}>
                Assinar agora
              </Button>
            </div>
            <div className="bg-card rounded-lg p-7 shadow-card border border-border/50">
              <h3 className="font-display font-bold text-lg mb-1">Familiar</h3>
              <p className="text-muted-foreground font-body text-sm mb-5">Para toda a família</p>
              <div className="mb-6">
                <span className="text-3xl font-display font-bold">R$ 19,90</span>
                <span className="text-muted-foreground font-body">/mês</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["Tudo do Individual", "Até 5 membros da família", "Painel compartilhado"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm font-body">
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant="hero" className="w-full" onClick={() => navigate("/cadastro")}>
                Assinar agora
              </Button>
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground font-body mt-6">
            Precisa de plano empresarial? <a href="mailto:contato@docalert.com.br" className="text-secondary hover:underline">Fale com a gente — sob consulta</a>
          </p>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container max-w-2xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Não espere levar uma multa para se organizar
          </h2>
          <p className="font-body opacity-80 mb-8 max-w-lg mx-auto">
            Crie sua conta em 30 segundos e cadastre seu primeiro documento agora. 
            É grátis e você pode cancelar quando quiser.
          </p>
          <Button
            size="lg"
            className="bg-card text-foreground hover:bg-card/90 font-semibold text-base px-8 shadow-lg"
            onClick={() => navigate("/cadastro")}
          >
            Criar conta grátis
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Logo size="sm" />
            <div className="flex gap-6 text-sm text-muted-foreground font-body">
              <a href="#" className="hover:text-foreground transition-colors">Termos</a>
              <a href="#" className="hover:text-foreground transition-colors">Privacidade</a>
              <a href="mailto:contato@docalert.com.br" className="hover:text-foreground transition-colors">Contato</a>
            </div>
            <p className="text-xs text-muted-foreground font-body">
              © {new Date().getFullYear()} DocAlert
            </p>
          </div>
        </div>
      </footer>

      {/* Chatbot flutuante */}
      <OnboardingChatbot />
    </div>
  );
}
