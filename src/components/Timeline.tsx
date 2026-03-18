import { useNavigate } from "react-router-dom";
import { DOCUMENT_TYPES, getDaysUntilExpiry, getStatusLevel, type DocumentType } from "@/lib/documents";
import { cn } from "@/lib/utils";
import type { DocRecord } from "@/hooks/useDocs";

interface TimelineProps {
  documents: DocRecord[];
  daysAhead?: number;
  className?: string;
}

export function Timeline({ documents, daysAhead = 90, className }: TimelineProps) {
  const navigate = useNavigate();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = documents
    .filter((d) => !d.resolvido)
    .map((d) => ({
      ...d,
      daysLeft: getDaysUntilExpiry(d.data_vencimento),
      date: new Date(d.data_vencimento),
    }))
    .filter((d) => d.daysLeft <= daysAhead && d.daysLeft >= -7)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  if (upcoming.length === 0) {
    return (
      <div className={cn("text-center py-8", className)}>
        <p className="text-sm text-muted-foreground font-body">
          Nenhum vencimento nos próximos {daysAhead} dias 🎉
        </p>
      </div>
    );
  }

  const colorMap = {
    success: "bg-success border-success",
    info: "bg-info border-info",
    warning: "bg-warning border-warning",
    destructive: "bg-destructive border-destructive",
  };

  const dotColorMap = {
    success: "bg-success",
    info: "bg-info",
    warning: "bg-warning",
    destructive: "bg-destructive",
  };

  return (
    <div className={cn("relative", className)}>
      {/* Vertical line */}
      <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

      {/* Today marker */}
      <div className="relative flex items-center gap-4 mb-6">
        <div className="relative z-10 h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
          <div className="h-3 w-3 rounded-full bg-secondary-foreground" />
        </div>
        <span className="text-xs font-body font-semibold text-secondary uppercase tracking-wider">
          Hoje — {today.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
        </span>
      </div>

      {/* Events */}
      {upcoming.map((doc, i) => {
        const level = getStatusLevel(doc.daysLeft);
        const typeInfo = DOCUMENT_TYPES[doc.tipo];
        const Icon = typeInfo?.icon;

        return (
          <div
            key={doc.id}
            className="relative flex items-start gap-4 mb-5 last:mb-0 cursor-pointer group"
            onClick={() => navigate(`/dashboard/documento/${doc.id}`)}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            {/* Dot */}
            <div className={cn(
              "relative z-10 h-8 w-8 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
              dotColorMap[level]
            )}>
              {Icon && <Icon className="h-4 w-4 text-white" />}
            </div>

            {/* Content */}
            <div className={cn(
              "flex-1 bg-card rounded-lg p-4 shadow-card border-l-4 transition-shadow group-hover:shadow-card-hover animate-fade-in",
              colorMap[level].split(" ").filter(c => c.startsWith("border-")).join(" ")
            )}>
              <div className="flex items-center justify-between mb-1">
                <p className="font-display font-semibold text-sm">{doc.apelido || typeInfo?.label}</p>
                <span className={cn(
                  "text-xs font-body font-medium px-2 py-0.5 rounded-full",
                  level === "destructive" ? "bg-destructive/10 text-destructive" :
                  level === "warning" ? "bg-warning/10 text-warning" :
                  level === "info" ? "bg-info/10 text-info" :
                  "bg-success/10 text-success"
                )}>
                  {doc.daysLeft < 0
                    ? `Vencido há ${Math.abs(doc.daysLeft)}d`
                    : doc.daysLeft === 0
                    ? "Vence hoje"
                    : `${doc.daysLeft} dias`}
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-body">
                {doc.date.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
