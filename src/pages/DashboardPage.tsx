import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { StatusBadge, StatusBar } from "@/components/StatusIndicators";
import { useDocs } from "@/hooks/useDocs";
import { useAuth } from "@/hooks/useAuth";
import { DOCUMENT_TYPES, getDaysUntilExpiry, getStatusLevel, PENALTY_INFO } from "@/lib/documents";
import { Plus, CheckCircle2, AlertTriangle, AlertCircle, DollarSign, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const { documents } = useDocs();
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

  const totalSavings = urgent.reduce((sum, d) => {
    const info = PENALTY_INFO[d.tipo];
    if (!info) return sum;
    const match = info.penalty.match(/[\d.,]+/);
    return sum + (match ? parseFloat(match[0].replace(".", "").replace(",", ".")) : 0);
  }, 0);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  const summaryCards = [
    { label: "Em dia", count: ok.length, icon: CheckCircle2, color: "text-success", border: "border-l-success" },
    { label: "Atenção", count: attention.length, icon: AlertTriangle, color: "text-warning", border: "border-l-warning" },
    { label: "Urgente", count: critical.length, icon: AlertCircle, color: "text-destructive", border: "border-l-destructive" },
    { label: "Economia potencial", count: null, value: `R$ ${totalSavings.toFixed(0)}`, icon: DollarSign, color: "text-secondary", border: "border-l-secondary" },
  ];

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

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summaryCards.map((card) => (
          <div key={card.label} className={`bg-card rounded-lg p-5 shadow-card border-l-4 ${card.border}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground font-body">{card.label}</span>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <p className="text-3xl font-display font-bold">
              {card.value ?? card.count}
            </p>
            <p className="text-xs text-muted-foreground font-body mt-1">
              {card.count !== null ? (card.count === 1 ? "documento" : "documentos") : "se renovar agora"}
            </p>
          </div>
        ))}
      </div>

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

      {/* All Documents */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Todos os Documentos</h2>
          <Button variant="hero" size="sm" onClick={() => navigate("/dashboard/adicionar")}>
            <Plus className="h-4 w-4 mr-1" />
            Adicionar documento
          </Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((doc) => {
            const typeInfo = DOCUMENT_TYPES[doc.tipo];
            const Icon = typeInfo?.icon;
            return (
              <div
                key={doc.id}
                className="bg-card rounded-lg p-5 shadow-card hover:shadow-card-hover transition-shadow cursor-pointer"
                onClick={() => navigate(`/dashboard/documento/${doc.id}`)}
              >
                <div className="flex items-center gap-3 mb-3">
                  {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-semibold truncate">{doc.apelido || typeInfo?.label}</p>
                    <p className="text-xs text-muted-foreground font-body">{typeInfo?.label}</p>
                  </div>
                </div>
                <StatusBadge daysLeft={doc.daysLeft} className="mb-3" />
                <p className="text-sm text-muted-foreground font-body mb-3">
                  Vence: {new Date(doc.data_vencimento).toLocaleDateString("pt-BR")}
                </p>
                <StatusBar daysLeft={doc.daysLeft} className="mb-3" />
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 font-body text-xs">Ver detalhes</Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </DashboardLayout>
  );
}
