import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useDocs } from "@/hooks/useDocs";
import { DOCUMENT_TYPES, type DocumentType } from "@/lib/documents";
import { CalendarIcon, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

const steps = ["Tipo", "Dados", "Alertas"];

export default function AddDocumentPage() {
  const [step, setStep] = useState(0);
  const [tipo, setTipo] = useState<DocumentType | "">("");
  const [apelido, setApelido] = useState("");
  const [dataVenc, setDataVenc] = useState<Date | undefined>();
  const [numero, setNumero] = useState("");
  const [dataEmissao, setDataEmissao] = useState<Date | undefined>();
  const [obs, setObs] = useState("");
  const [alertDays, setAlertDays] = useState<number[]>([90, 30, 7]);
  const [viaEmail, setViaEmail] = useState(true);

  const { addDocument } = useDocs();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!tipo || !dataVenc) return;
    setSaving(true);
    const docId = await addDocument({
      tipo,
      apelido: apelido || undefined,
      numero_documento: numero || undefined,
      data_vencimento: dataVenc.toISOString().split("T")[0],
      data_emissao: dataEmissao?.toISOString().split("T")[0],
      observacoes: obs || undefined,
      resolvido: false,
    });

    // Save alert configs
    if (docId && alertDays.length > 0) {
      const { supabase } = await import("@/integrations/supabase/client");
      const { useAuth } = await import("@/hooks/useAuth");
      // We already have user from context, get it directly
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        await supabase.from("alertas_configuracao").insert(
          alertDays.map((dias) => ({
            documento_id: docId,
            usuario_id: authUser.id,
            dias_antes: dias,
            via_email: viaEmail,
            ativo: true,
          }))
        );
      }
    }

    setSaving(false);
    const { toast } = await import("sonner");
    toast.success("Documento adicionado com sucesso!");
    navigate("/dashboard");
  };

  const docTypes = Object.entries(DOCUMENT_TYPES) as [DocumentType, (typeof DOCUMENT_TYPES)[DocumentType]][];

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" size="sm" className="mb-4 font-body" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
        </Button>

        <h1 className="text-2xl font-bold mb-6">Adicionar Documento</h1>

        {/* Stepper */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold font-body transition-colors",
                i < step ? "bg-success text-success-foreground" :
                i === step ? "bg-primary text-primary-foreground" :
                "bg-muted text-muted-foreground"
              )}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={cn("text-sm font-body hidden sm:block", i === step ? "font-semibold" : "text-muted-foreground")}>
                {s}
              </span>
              {i < steps.length - 1 && <div className="w-8 h-px bg-border" />}
            </div>
          ))}
        </div>

        {/* Step 1: Type */}
        {step === 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Qual documento você quer adicionar?</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {docTypes.map(([key, info]) => {
                const Icon = info.icon;
                return (
                  <button
                    key={key}
                    className={cn(
                      "bg-card rounded-lg p-4 shadow-card text-left hover:shadow-card-hover transition-shadow border-2",
                      tipo === key ? "border-secondary" : "border-transparent"
                    )}
                    onClick={() => setTipo(key)}
                  >
                    <Icon className={cn("h-6 w-6 mb-2", tipo === key ? "text-secondary" : "text-muted-foreground")} />
                    <p className="font-display font-semibold text-sm">{info.label}</p>
                    <p className="text-xs text-muted-foreground font-body">{info.description}</p>
                  </button>
                );
              })}
            </div>
            <div className="mt-6 flex justify-end">
              <Button variant="hero" disabled={!tipo} onClick={() => setStep(1)}>
                Próximo <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Data */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Dados do documento</h2>
            <div>
              <Label className="font-body">Apelido (opcional)</Label>
              <Input placeholder={`ex: ${DOCUMENT_TYPES[tipo as DocumentType]?.label} do João`} value={apelido} onChange={(e) => setApelido(e.target.value)} />
            </div>
            <div>
              <Label className="font-body">Data de vencimento *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal font-body", !dataVenc && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataVenc ? format(dataVenc, "dd/MM/yyyy") : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dataVenc} onSelect={setDataVenc} locale={ptBR} className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label className="font-body">Número do documento (opcional)</Label>
              <Input value={numero} onChange={(e) => setNumero(e.target.value)} />
            </div>
            <div>
              <Label className="font-body">Data de emissão (opcional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal font-body", !dataEmissao && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataEmissao ? format(dataEmissao, "dd/MM/yyyy") : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dataEmissao} onSelect={setDataEmissao} locale={ptBR} className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label className="font-body">Observações (opcional)</Label>
              <Textarea value={obs} onChange={(e) => setObs(e.target.value)} placeholder="Anotações sobre este documento..." />
            </div>
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setStep(0)}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
              </Button>
              <Button variant="hero" disabled={!dataVenc} onClick={() => setStep(2)}>
                Próximo <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Alerts */}
        {step === 2 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Quando quer ser avisado?</h2>
            <div className="space-y-3 mb-6">
              {[90, 30, 7, 1].map((d) => (
                <div key={d} className="flex items-center gap-3">
                  <Checkbox
                    checked={alertDays.includes(d)}
                    onCheckedChange={(checked) =>
                      setAlertDays((prev) => (checked ? [...prev, d] : prev.filter((x) => x !== d)))
                    }
                  />
                  <span className="font-body text-sm">
                    {d} dia{d > 1 ? "s" : ""} antes
                    {d === 90 && <span className="text-xs text-muted-foreground ml-1">(recomendado)</span>}
                  </span>
                </div>
              ))}
            </div>

            <h3 className="font-semibold mb-3">Como receber:</h3>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <Checkbox checked={viaEmail} onCheckedChange={(v) => setViaEmail(v === true)} />
                <span className="font-body text-sm">Email (grátis)</span>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox disabled />
                <span className="font-body text-sm text-muted-foreground">WhatsApp (plano pago)</span>
              </div>
            </div>

            {dataVenc && alertDays.length > 0 && (
              <div className="bg-muted rounded-lg p-4 mb-6">
                <p className="text-sm font-body text-muted-foreground">
                  Você receberá alertas por email nos seguintes dias:
                </p>
                <ul className="mt-2 space-y-1">
                  {alertDays.sort((a, b) => b - a).map((d) => {
                    const alertDate = new Date(dataVenc);
                    alertDate.setDate(alertDate.getDate() - d);
                    return (
                      <li key={d} className="text-sm font-body font-medium">
                        {format(alertDate, "dd/MM/yyyy")} — {d} dias antes
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
              </Button>
              <Button variant="hero" onClick={handleSave}>
                Salvar documento
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
