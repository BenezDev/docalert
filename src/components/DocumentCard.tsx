import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StatusBadge, StatusBar } from "@/components/StatusIndicators";
import { DOCUMENT_TYPES, getDaysUntilExpiry, PENALTY_INFO, type DocumentType } from "@/lib/documents";
import { MoreVertical, Edit, Trash2, RefreshCw, Eye } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DocumentCardProps {
  id: string;
  tipo: DocumentType;
  apelido?: string | null;
  numero_documento?: string | null;
  data_vencimento: string;
  resolvido: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onRenew?: (id: string) => void;
  className?: string;
}

function maskNumber(num: string): string {
  if (num.length <= 4) return num;
  return "•".repeat(num.length - 4) + num.slice(-4);
}

export function DocumentCard({
  id, tipo, apelido, numero_documento, data_vencimento, resolvido,
  onEdit, onDelete, onRenew, className,
}: DocumentCardProps) {
  const navigate = useNavigate();
  const typeInfo = DOCUMENT_TYPES[tipo];
  const Icon = typeInfo?.icon;
  const daysLeft = getDaysUntilExpiry(data_vencimento);
  const penaltyInfo = PENALTY_INFO[tipo];

  const borderColor = resolvido
    ? "hsl(var(--success))"
    : daysLeft <= 7 ? "hsl(var(--destructive))"
    : daysLeft <= 30 ? "hsl(var(--warning))"
    : "hsl(var(--success))";

  return (
    <div
      className={cn(
        "bg-card rounded-lg p-5 shadow-card hover:shadow-card-hover transition-all cursor-pointer border-l-4 animate-fade-in",
        className
      )}
      style={{ borderLeftColor: borderColor }}
      onClick={() => navigate(`/dashboard/documento/${id}`)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 min-w-0">
          {Icon && (
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <Icon className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
          <div className="min-w-0">
            <p className="font-display font-semibold truncate">{apelido || typeInfo?.label}</p>
            <p className="text-xs text-muted-foreground font-body">{typeInfo?.label}</p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem onClick={() => navigate(`/dashboard/documento/${id}`)}>
              <Eye className="h-4 w-4 mr-2" /> Ver detalhes
            </DropdownMenuItem>
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(id)}>
                <Edit className="h-4 w-4 mr-2" /> Editar
              </DropdownMenuItem>
            )}
            {onRenew && !resolvido && (
              <DropdownMenuItem onClick={() => onRenew(id)}>
                <RefreshCw className="h-4 w-4 mr-2" /> Renovar
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem className="text-destructive" onClick={() => onDelete(id)}>
                <Trash2 className="h-4 w-4 mr-2" /> Excluir
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Number masked */}
      {numero_documento && (
        <p className="text-xs text-muted-foreground font-body font-mono mb-2">
          Nº {maskNumber(numero_documento)}
        </p>
      )}

      {/* Status */}
      <div className="flex items-center gap-2 mb-3">
        <StatusBadge daysLeft={daysLeft} />
        {resolvido && (
          <Badge variant="secondary" className="bg-success/10 text-success border-success/20 font-body text-xs">
            Renovado
          </Badge>
        )}
      </div>

      {/* Expiry date */}
      <p className="text-sm text-muted-foreground font-body mb-3">
        Vence: {new Date(data_vencimento).toLocaleDateString("pt-BR")}
      </p>

      {/* Progress bar */}
      <StatusBar daysLeft={daysLeft} className="mb-3" />

      {/* Penalty warning */}
      {penaltyInfo && !resolvido && daysLeft <= 30 && (
        <p className="text-xs text-destructive font-body">
          ⚠ Multa: {penaltyInfo.penalty}
        </p>
      )}
    </div>
  );
}
