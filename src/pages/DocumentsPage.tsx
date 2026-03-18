import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StatusBadge, StatusBar } from "@/components/StatusIndicators";
import { useDocs } from "@/hooks/useDocs";
import { DOCUMENT_TYPES, getDaysUntilExpiry, type DocumentType } from "@/lib/documents";
import {
  Plus, Search, LayoutGrid, List, ArrowUpDown, Filter, Trash2, Edit, RefreshCw,
} from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

type ViewMode = "cards" | "table";
type SortBy = "vencimento" | "tipo" | "status";
type StatusFilter = "all" | "ok" | "attention" | "critical" | "resolved";

export default function DocumentsPage() {
  const { documents, isLoading, deleteDocument } = useDocs();
  const navigate = useNavigate();

  const [view, setView] = useState<ViewMode>("cards");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<SortBy>("vencimento");

  const enriched = useMemo(() =>
    documents.map((d) => {
      const daysLeft = getDaysUntilExpiry(d.data_vencimento);
      const level = d.resolvido ? "resolved" as const
        : daysLeft <= 7 ? "critical" as const
        : daysLeft <= 30 ? "attention" as const
        : "ok" as const;
      return { ...d, daysLeft, level };
    }), [documents]);

  const filtered = useMemo(() => {
    let list = enriched;

    if (search) {
      const q = search.toLowerCase();
      list = list.filter((d) =>
        (d.apelido || "").toLowerCase().includes(q) ||
        (d.numero_documento || "").toLowerCase().includes(q) ||
        (DOCUMENT_TYPES[d.tipo]?.label || "").toLowerCase().includes(q)
      );
    }

    if (typeFilter !== "all") {
      list = list.filter((d) => d.tipo === typeFilter);
    }

    if (statusFilter !== "all") {
      list = list.filter((d) => d.level === statusFilter);
    }

    list = [...list].sort((a, b) => {
      if (sortBy === "vencimento") return a.daysLeft - b.daysLeft;
      if (sortBy === "tipo") return a.tipo.localeCompare(b.tipo);
      return a.level.localeCompare(b.level);
    });

    return list;
  }, [enriched, search, typeFilter, statusFilter, sortBy]);

  const handleDelete = async (id: string, name: string) => {
    await deleteDocument(id);
    toast.success(`"${name}" removido.`);
  };

  const docTypes = Object.entries(DOCUMENT_TYPES) as [DocumentType, (typeof DOCUMENT_TYPES)[DocumentType]][];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="mb-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-5 w-72" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-card rounded-lg p-5 shadow-card">
              <Skeleton className="h-5 w-32 mb-3" />
              <Skeleton className="h-6 w-20 mb-3" />
              <Skeleton className="h-4 w-40" />
            </div>
          ))}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Meus Documentos</h1>
          <p className="text-sm text-muted-foreground font-body">
            {documents.length} documento{documents.length !== 1 ? "s" : ""} cadastrado{documents.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button variant="hero" onClick={() => navigate("/dashboard/adicionar")}>
          <Plus className="h-4 w-4 mr-1" /> Adicionar documento
        </Button>
      </div>

      {/* Filters bar */}
      <div className="space-y-3 mb-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou número..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 font-body"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[160px] font-body">
              <Filter className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              {docTypes.map(([key, info]) => (
                <SelectItem key={key} value={key}>{info.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
            <SelectTrigger className="w-full sm:w-[150px] font-body">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="ok">Em dia</SelectItem>
              <SelectItem value="attention">Atenção</SelectItem>
              <SelectItem value="critical">Urgente</SelectItem>
              <SelectItem value="resolved">Resolvido</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortBy)}>
            <SelectTrigger className="w-full sm:w-[160px] font-body">
              <ArrowUpDown className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue placeholder="Ordenar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vencimento">Data vencimento</SelectItem>
              <SelectItem value="tipo">Tipo</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex border rounded-md ml-auto">
            <Button
              variant={view === "cards" ? "secondary" : "ghost"}
              size="icon"
              className="h-9 w-9 rounded-r-none"
              onClick={() => setView("cards")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={view === "table" ? "secondary" : "ghost"}
              size="icon"
              className="h-9 w-9 rounded-l-none"
              onClick={() => setView("table")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground font-body mb-4">
            {documents.length === 0 ? "Nenhum documento cadastrado." : "Nenhum documento encontrado com esses filtros."}
          </p>
          {documents.length === 0 && (
            <Button variant="hero" onClick={() => navigate("/dashboard/adicionar")}>
              <Plus className="h-4 w-4 mr-1" /> Adicionar primeiro documento
            </Button>
          )}
        </div>
      )}

      {/* Cards View */}
      {view === "cards" && filtered.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((doc) => {
            const typeInfo = DOCUMENT_TYPES[doc.tipo];
            const Icon = typeInfo?.icon;
            return (
              <div
                key={doc.id}
                className="bg-card rounded-lg p-5 shadow-card hover:shadow-card-hover transition-shadow cursor-pointer border-l-4"
                style={{
                  borderLeftColor: doc.resolvido
                    ? "hsl(var(--success))"
                    : doc.daysLeft <= 7
                    ? "hsl(var(--destructive))"
                    : doc.daysLeft <= 30
                    ? "hsl(var(--warning))"
                    : "hsl(var(--success))",
                }}
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
                {doc.resolvido && (
                  <Badge variant="secondary" className="mb-3 bg-success/10 text-success border-success/20 font-body text-xs">
                    Renovado
                  </Badge>
                )}
                <p className="text-sm text-muted-foreground font-body mb-3">
                  Vence: {new Date(doc.data_vencimento).toLocaleDateString("pt-BR")}
                </p>
                <StatusBar daysLeft={doc.daysLeft} className="mb-3" />
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 font-body text-xs">
                    Ver detalhes
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir documento?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir "{doc.apelido || typeInfo?.label}"?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="font-body">Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-body"
                          onClick={() => handleDelete(doc.id, doc.apelido || typeInfo?.label || "")}
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {view === "table" && filtered.length > 0 && (
        <div className="bg-card rounded-lg shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left p-4 text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider">Documento</th>
                  <th className="text-left p-4 text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider">Tipo</th>
                  <th className="text-left p-4 text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider">Vencimento</th>
                  <th className="text-left p-4 text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="text-right p-4 text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((doc) => {
                  const typeInfo = DOCUMENT_TYPES[doc.tipo];
                  const Icon = typeInfo?.icon;
                  return (
                    <tr
                      key={doc.id}
                      className="border-b last:border-0 hover:bg-muted/20 cursor-pointer transition-colors"
                      onClick={() => navigate(`/dashboard/documento/${doc.id}`)}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {Icon && <Icon className="h-4 w-4 text-muted-foreground shrink-0" />}
                          <div>
                            <p className="font-display font-semibold text-sm">{doc.apelido || typeInfo?.label}</p>
                            {doc.numero_documento && (
                              <p className="text-xs text-muted-foreground font-body">{doc.numero_documento}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-body">{typeInfo?.label}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-body">
                          {new Date(doc.data_vencimento).toLocaleDateString("pt-BR")}
                        </span>
                      </td>
                      <td className="p-4">
                        {doc.resolvido ? (
                          <Badge variant="secondary" className="bg-success/10 text-success border-success/20 font-body text-xs">
                            Renovado
                          </Badge>
                        ) : (
                          <StatusBadge daysLeft={doc.daysLeft} />
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => navigate(`/dashboard/documento/${doc.id}`)}
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Trash2 className="h-3.5 w-3.5 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Excluir documento?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir "{doc.apelido || typeInfo?.label}"?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="font-body">Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-body"
                                  onClick={() => handleDelete(doc.id, doc.apelido || typeInfo?.label || "")}
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
