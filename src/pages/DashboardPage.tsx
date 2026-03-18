import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { StatusBadge, StatusBar } from "@/components/StatusIndicators";
import { StatsCard } from "@/components/StatsCard";
import { Timeline } from "@/components/Timeline";
import { CountdownTimer } from "@/components/CountdownTimer";
import { useDocs } from "@/hooks/useDocs";
import { useRenewals } from "@/hooks/useRenewals";
import { useAuth } from "@/hooks/useAuth";
import { DOCUMENT_TYPES, getDaysUntilExpiry, getStatusLevel, PENALTY_INFO } from "@/lib/documents";
import { Plus, CheckCircle2, AlertTriangle, AlertCircle, DollarSign, ArrowRight, FileText, Shield, TrendingUp, History } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { user } = useAuth();
  const { documents, isLoading } = useDocs();
  const { renewals, totalCost, totalSaved, isLoading: loadingRenewals } = useRenewals();
  const navigate = useNavigate();

  const docsWithDays = documents.map((d) => ({
    ...d,
    daysLeft: getDaysUntilExpiry(d.data_vencimento),
    status: getStatusLevel(getDaysUntilExpiry(d.data_vencimento)),
  }));

  const sorted = [...docsWithDays].sort((a, b) => a.daysLeft - b.daysLeft);
  const urgent = sorted.filter((d) => !d.resolvido && d.daysLeft <= 30);
  const ok = sorted.filter((d) => !d.resolvido && d.daysLeft > 90);
  const attention = sorted.filter((d) => !d.resolvido && d.daysLeft > 7 && d.daysLeft <= 30);
  const critical = sorted.filter((d) => !d.resolvido && d.daysLeft <= 7);

  // Potential savings from pending urgent docs
  const potentialSavings = urgent.reduce((sum, d) => {
    const info = PENALTY_INFO[d.tipo];
    if (!info) return sum;
    return sum + (info.estimatedValue ?? 0);
  }, 0);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  const summaryCards = [
    { label: "Em dia", count: ok.length, icon: CheckCircle2, color: "hsl(var(--success))" },
    { label: "Atenção", count: attention.length, icon: AlertTriangle, color: "hsl(var(--warning))" },
    { label: "Urgente", count: critical.length, icon: AlertCircle, color: "hsl(var(--destructive))" },
    { label: "Economia potencial", count: null, value: `R$ ${potentialSavings.toFixed(0)}`, icon: DollarSign, color: "hsl(var(--secondary))" },
  ];

  // Loading skeleton
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-5 w-80" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-card rounded-lg p-5 shadow-card border-l-4 border-l-muted">
              <Skeleton className="h-4 w-20 mb-3" />
              <Skeleton className="h-9 w-16 mb-1" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-lg p-5 shadow-card">
              <Skeleton className="h-5 w-32 mb-3" />
              <Skeleton className="h-6 w-20 mb-3" />
              <Skeleton className="h-4 w-40 mb-3" />
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </div>
      </DashboardLayout>
    );
  }

  // Empty state
  if (documents.length === 0) {
    return (
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">
            {greeting}, {user?.name?.split(" ")[0]}! 👋
          </h1>
        </div>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-20 w-20 rounded-full bg-secondary/10 flex items-center justify-center mb-6">
            <Shield className="h-10 w-10 text-secondary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Nenhum documento cadastrado</h2>
          <p className="text-muted-foreground font-body mb-6 max-w-md">
            Adicione seus documentos para receber alertas antes de vencer e nunca mais pagar multa por atraso.
          </p>
          <Button variant="hero" size="lg" onClick={() => navigate("/dashboard/adicionar")}>
            <Plus className="h-5 w-5 mr-2" />
            Adicionar primeiro documento
          </Button>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 max-w-2xl w-full">
            {[
              { icon: FileText, title: "Cadastre", desc: "Adicione seus documentos com data de vencimento" },
              { icon: AlertTriangle, title: "Receba alertas", desc: "Avisamos 90, 30 e 7 dias antes" },
              { icon: CheckCircle2, title: "Fique em dia", desc: "Nunca mais pague multa por atraso" },
            ].map((step) => (
              <div key={step.title} className="bg-card rounded-lg p-4 shadow-card text-center">
                <step.icon className="h-6 w-6 text-secondary mx-auto mb-2" />
                <p className="font-display font-semibold text-sm mb-1">{step.title}</p>
                <p className="text-xs text-muted-foreground font-body">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">
          {greeting}, {user?.name?.split(" ")[0]}! 👋
        </h1>
        {urgent.length > 0 && (
          <p className="text-muted-foreground font-body mt-1">
            Você tem {urgent.length} documento{urgent.length > 1 ? "s" : ""} precisando de atenção
          </p>
        )}
      </div>

      {/* Summary Cards — using StatsCard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summaryCards.map((card) => (
          <StatsCard
            key={card.label}
            icon={card.icon}
            title={card.label}
            value={card.value ?? card.count ?? 0}
            borderColor={card.color}
          />
        ))}
      </div>

      {/* Savings Summary — only show if has renewal history */}
      {renewals.length > 0 && (
        <section className="mb-8">
          <div className="bg-card rounded-lg p-6 shadow-card border-l-4 border-l-success">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="h-5 w-5 text-success" />
              <h2 className="text-lg font-bold">Sua economia com o DocAlert</h2>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-2xl font-display font-bold text-success">
                  R$ {totalSaved.toFixed(2).replace(".", ",")}
                </p>
                <p className="text-xs text-muted-foreground font-body">Multas evitadas</p>
              </div>
              <div>
                <p className="text-2xl font-display font-bold">
                  R$ {totalCost.toFixed(2).replace(".", ",")}
                </p>
                <p className="text-xs text-muted-foreground font-body">Gasto com renovações</p>
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-secondary">
                  {renewals.length}
                </p>
                <p className="text-xs text-muted-foreground font-body">Renovações feitas</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Urgent Section */}
      {urgent.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Requer ação agora
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {urgent.map((doc) => {
              const typeInfo = DOCUMENT_TYPES[doc.tipo];
              const penaltyInfo = PENALTY_INFO[doc.tipo];
              const Icon = typeInfo?.icon;
              return (
                <div
                  key={doc.id}
                  className="bg-card rounded-lg p-5 shadow-card border-l-4 cursor-pointer hover:shadow-card-hover transition-shadow"
                  style={{
                    borderLeftColor: doc.daysLeft <= 7 ? "hsl(var(--destructive))" : "hsl(var(--warning))",
                  }}
                  onClick={() => navigate(`/dashboard/documento/${doc.id}`)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {Icon && <Icon className="h-6 w-6 text-muted-foreground" />}
                      <div>
                        <p className="font-display font-semibold">{doc.apelido || typeInfo?.label}</p>
                        <p className="text-xs text-muted-foreground font-body">{typeInfo?.label}</p>
                      </div>
                    </div>
                    <StatusBadge daysLeft={doc.daysLeft} />
                  </div>
                  {penaltyInfo && (
                    <p className="text-sm text-muted-foreground font-body mb-3">
                      Custo se atrasar: <span className="font-semibold text-destructive">{penaltyInfo.penalty}</span>
                    </p>
                  )}
                  <Button variant="secondary" size="sm" className="font-body">
                    Ver como renovar <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Timeline visual */}
      {documents.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
            <History className="h-5 w-5 text-muted-foreground" />
            Linha do tempo (próximos 90 dias)
          </h2>
          <div className="bg-card rounded-lg p-6 shadow-card">
            <Timeline documents={documents} daysAhead={90} />
          </div>
        </section>
      )}

      {/* All Documents — using DocumentCard */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Todos os Documentos</h2>
          <Button variant="hero" size="sm" onClick={() => navigate("/dashboard/adicionar")}>
            <Plus className="h-4 w-4 mr-1" />
            Adicionar documento
          </Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((doc) => (
            <DocumentCard
              key={doc.id}
              id={doc.id}
              tipo={doc.tipo}
              apelido={doc.apelido}
              numero_documento={doc.numero_documento}
              data_vencimento={doc.data_vencimento}
              resolvido={doc.resolvido}
              onDelete={(id) => {
                deleteDocument(id);
              }}
            />
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
}
