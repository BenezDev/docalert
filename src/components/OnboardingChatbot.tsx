import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, X, ArrowRight, Car, FileText, Coins, Plane, CreditCard, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DOC_OPTIONS = [
  { tipo: "CNH", label: "CNH", icon: Car, desc: "Carteira de Habilitação" },
  { tipo: "CRLV", label: "CRLV", icon: FileText, desc: "Licenciamento do Veículo" },
  { tipo: "IPVA", label: "IPVA", icon: Coins, desc: "Imposto Veicular" },
  { tipo: "PASSAPORTE", label: "Passaporte", icon: Plane, desc: "Passaporte" },
  { tipo: "RG", label: "RG", icon: CreditCard, desc: "Identidade" },
];

interface Message {
  from: "bot" | "user";
  text: string;
}

export function OnboardingChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: "Olá! 👋 Qual documento você quer proteger primeiro?" },
  ]);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSelect = (tipo: string, label: string) => {
    setSelectedDoc(tipo);
    setMessages((prev) => [
      ...prev,
      { from: "user", text: label },
      { from: "bot", text: `Ótima escolha! Vou te ajudar a cadastrar sua ${label}. Clique abaixo para começar. 🚀` },
    ]);
  };

  const handleGo = () => {
    navigate(`/cadastro`);
    setOpen(false);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-200",
          open
            ? "bg-muted text-muted-foreground scale-90"
            : "bg-secondary text-secondary-foreground hover:scale-105"
        )}
        aria-label={open ? "Fechar chat" : "Abrir assistente"}
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 max-h-[480px] bg-card rounded-xl shadow-2xl border border-border/50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-secondary text-secondary-foreground p-4">
            <p className="font-display font-bold text-sm">DocAlert Assistente</p>
            <p className="text-xs opacity-80 font-body">Resposta instantânea</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-72">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] rounded-lg p-3 text-sm font-body",
                  msg.from === "bot"
                    ? "bg-muted text-foreground"
                    : "bg-secondary text-secondary-foreground ml-auto"
                )}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Options or CTA */}
          <div className="p-3 border-t bg-card">
            {!selectedDoc ? (
              <div className="grid grid-cols-2 gap-2">
                {DOC_OPTIONS.map((doc) => (
                  <button
                    key={doc.tipo}
                    onClick={() => handleSelect(doc.tipo, doc.label)}
                    className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted text-left transition-colors"
                  >
                    <doc.icon className="h-4 w-4 text-secondary shrink-0" />
                    <div>
                      <p className="text-xs font-display font-semibold">{doc.label}</p>
                      <p className="text-[10px] text-muted-foreground font-body">{doc.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <Button variant="hero" className="w-full" onClick={handleGo}>
                Criar conta e cadastrar
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
