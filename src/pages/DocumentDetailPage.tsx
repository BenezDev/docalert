import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { StatusBadge, StatusBar } from "@/components/StatusIndicators";
import { useDocs } from "@/hooks/useDocs";
import { DOCUMENT_TYPES, getDaysUntilExpiry, PENALTY_INFO, RENEWAL_GUIDES } from "@/lib/documents";
import { ArrowLeft, Edit, Trash2, CheckCircle2, Clock, ExternalLink } from "lucide-react";
import { PenaltyCalculator } from "@/components/PenaltyCalculator";

export default function DocumentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getDocument, updateDocument, deleteDocument } = useDocs();
  const navigate = useNavigate();

  const doc = getDocument(id || "");
  if (!doc) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <p className="text-muted-foreground font-body">Documento não encontrado.</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/dashboard")}>Voltar</Button>
        </div>
      </DashboardLayout>
    );
  }

  const typeInfo = DOCUMENT_TYPES[doc.tipo];
  const Icon = typeInfo?.icon;
  const daysLeft = getDaysUntilExpiry(doc.data_vencimento);
  const penaltyInfo = PENALTY_INFO[doc.tipo];
  const guide = RENEWAL_GUIDES[doc.tipo];

  const handleDelete = async () => {
    await deleteDocument(doc.id);
    navigate("/dashboard");
  };

  const handleResolve = async () => {
    await updateDocument(doc.id, { resolvido: !doc.resolvido });
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" size="sm" className="mb-4 font-body" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
        </Button>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            {Icon && <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
              <Icon className="h-6 w-6 text-muted-foreground" />
            </div>}
            <div>
              <h1 className="text-2xl font-bold">{doc.apelido || typeInfo?.label}</h1>
              <p className="text-sm text-muted-foreground font-body">{typeInfo?.description}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon"><Edit className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={handleDelete}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-card rounded-lg p-6 shadow-card border-l-4 mb-6" style={{
          borderLeftColor: daysLeft <= 7 ? "hsl(var(--destructive))" : daysLeft <= 30 ? "hsl(var(--warning))" : daysLeft <= 90 ? "hsl(var(--info))" : "hsl(var(--success))",
        }}>
          <StatusBadge daysLeft={daysLeft} className="mb-3" />
          <p className="text-sm text-muted-foreground font-body mb-1">Data de vencimento</p>
          <p className="text-xl font-display font-bold mb-4">
            {new Date(doc.data_vencimento).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
          </p>
          <StatusBar daysLeft={daysLeft} className="mb-4" />

          {penaltyInfo && !doc.resolvido && daysLeft <= 90 && (() => {
            const penaltyValue = penaltyInfo.estimatedValue ?? 0;
            return penaltyValue > 0 ? (
              <div className="mb-4">
                <PenaltyCalculator
                  basePenalty={penaltyValue}
                  daysLeft={daysLeft}
                  penaltyLabel={penaltyInfo.penalty}
                  extras={penaltyInfo.extras}
                  points={penaltyInfo.points}
                />
              </div>
            ) : (
              <div className="bg-destructive/5 rounded-lg p-4 mb-4">
                <p className="text-sm font-body text-muted-foreground mb-1">Se não renovar até lá:</p>
                <p className="font-display font-bold text-lg text-destructive">{penaltyInfo.penalty}</p>
                {penaltyInfo.extras?.map((e) => (
                  <p key={e} className="text-sm font-body text-muted-foreground">+ {e}</p>
                ))}
              </div>
            );
          })()}

          <Button
            variant={doc.resolvido ? "outline" : "success"}
            className="font-body"
            onClick={handleResolve}
          >
            <CheckCircle2 className="h-4 w-4 mr-1" />
            {doc.resolvido ? "Marcar como pendente" : "Já renovei"}
          </Button>
        </div>

        {/* Renewal Guide */}
        {guide && !doc.resolvido && (
          <div className="bg-card rounded-lg shadow-card overflow-hidden mb-6">
            <div className="p-5 border-b">
              <h2 className="font-display font-bold text-lg">Passo a Passo para Renovar</h2>
              <p className="text-sm text-muted-foreground font-body">
                Tempo estimado: {guide.totalTime} · Custo estimado: {guide.totalCost}
              </p>
            </div>
            <div className="p-5 space-y-0">
              {guide.steps.map((s, i) => (
                <div key={i} className="flex gap-4 pb-6 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    {i < guide.steps.length - 1 && <div className="w-px flex-1 bg-border border-dashed mt-1" />}
                  </div>
                  <div className="pb-2">
                    <p className="font-display font-semibold text-sm">Passo {i + 1}: {s.title}</p>
                    <p className="text-sm text-muted-foreground font-body">{s.description}</p>
                    <div className="flex gap-4 mt-1">
                      {s.time && <span className="text-xs text-muted-foreground font-body">⏱ {s.time}</span>}
                      {s.cost && <span className="text-xs text-muted-foreground font-body">💰 {s.cost}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="bg-card rounded-lg p-5 shadow-card">
          <h3 className="font-display font-semibold mb-3">Informações</h3>
          <dl className="space-y-2 text-sm font-body">
            {doc.numero_documento && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Número</dt>
                <dd className="font-medium">{doc.numero_documento}</dd>
              </div>
            )}
            {doc.data_emissao && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Emissão</dt>
                <dd className="font-medium">{new Date(doc.data_emissao).toLocaleDateString("pt-BR")}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Adicionado em</dt>
              <dd className="font-medium">{new Date(doc.criado_em).toLocaleDateString("pt-BR")}</dd>
            </div>
            {doc.observacoes && (
              <div className="pt-2 border-t">
                <dt className="text-muted-foreground mb-1">Observações</dt>
                <dd>{doc.observacoes}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </DashboardLayout>
  );
}

