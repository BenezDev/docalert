import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useDocs } from "@/hooks/useDocs";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { DOCUMENT_TYPES, type DocumentType } from "@/lib/documents";
import { CalendarIcon, Loader2, Check, Zap } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const QUICK_TYPES: DocumentType[] = ["CNH", "CRLV", "IPVA", "PASSAPORTE"];
const DEFAULT_ALERT_DAYS = [90, 30, 7];

export function QuickAddDocument() {
  const [open, setOpen] = useState(false);
  const [tipo, setTipo] = useState<DocumentType | "">("");
  const [dataVenc, setDataVenc] = useState<Date | undefined>();
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const { user } = useAuth();
  const { addDocument } = useDocs();
  const navigate = useNavigate();

  const handleQuickSave = async () => {
    if (!tipo || !dataVenc || !user) return;
    setSaving(true);

    const docId = await addDocument({
      tipo,
      data_vencimento: dataVenc.toISOString().split("T")[0],
      resolvido: false,
    });

    // Auto-create default alerts
    if (docId) {
      await supabase.from("alertas_configuracao").insert(
        DEFAULT_ALERT_DAYS.map((dias) => ({
          documento_id: docId,
          usuario_id: user.id,
          dias_antes: dias,
          via_email: true,
          ativo: true,
        }))
      );
    }

    setSaving(false);
    setDone(true);
    toast.success("Documento adicionado! Alertas configurados automaticamente.");
    
    setTimeout(() => {
      setDone(false);
      setTipo("");
      setDataVenc(undefined);
      setOpen(false);
    }, 1500);
  };

  if (!open) {
    return (
      <Button
        variant="hero"
        size="lg"
        className="w-full gap-2 animate-fade-in-up"
        onClick={() => setOpen(true)}
      >
        <Zap className="h-5 w-5" />
        Adicionar documento rápido
      </Button>
    );
  }

  return (
    <div className="bg-card rounded-xl p-5 shadow-card border-2 border-secondary/30 animate-fade-in-up space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Zap className="h-4 w-4 text-secondary" />
        <p className="font-display font-bold text-sm">Adicionar em 2 toques</p>
      </div>

      {/* Type selection */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {QUICK_TYPES.map((key) => {
          const info = DOCUMENT_TYPES[key];
          const Icon = info.icon;
          return (
            <button
              key={key}
              className={cn(
                "flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all text-center",
                tipo === key
                  ? "border-secondary bg-secondary/5 scale-[1.02]"
                  : "border-transparent bg-muted/50 hover:bg-muted"
              )}
              onClick={() => setTipo(key)}
            >
              <Icon className={cn("h-5 w-5", tipo === key ? "text-secondary" : "text-muted-foreground")} />
              <span className="text-xs font-body font-medium">{info.label}</span>
            </button>
          );
        })}
      </div>

      {/* Date picker */}
      {tipo && (
        <div className="animate-fade-in-up">
          <p className="text-xs text-muted-foreground font-body mb-1.5">Data de vencimento</p>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal font-body",
                  !dataVenc && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dataVenc ? format(dataVenc, "dd/MM/yyyy") : "Selecione a data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dataVenc}
                onSelect={setDataVenc}
                locale={ptBR}
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      )}

      {/* Save button */}
      {tipo && dataVenc && (
        <div className="animate-fade-in-up">
          <p className="text-xs text-muted-foreground font-body mb-2">
            ✓ Alertas em 90, 30 e 7 dias serão criados automaticamente
          </p>
          <Button
            variant="hero"
            className="w-full"
            onClick={handleQuickSave}
            disabled={saving || done}
          >
            {done ? (
              <><Check className="h-4 w-4 mr-1" /> Adicionado!</>
            ) : saving ? (
              <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Salvando...</>
            ) : (
              "Salvar documento"
            )}
          </Button>
        </div>
      )}

      <button
        className="text-xs text-muted-foreground font-body hover:text-foreground transition-colors"
        onClick={() => navigate("/dashboard/adicionar")}
      >
        Ou adicionar com mais detalhes →
      </button>
    </div>
  );
}
