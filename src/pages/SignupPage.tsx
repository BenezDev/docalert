import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { lovable } from "@/integrations/lovable/index";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { toast.error("As senhas não coincidem"); return; }
    if (!agreed) return;
    setLoading(true);
    const result = await signup(name, email, password);
    setLoading(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Conta criada! Verifique seu email para confirmar.");
      navigate("/dashboard");
    }
  };

  const handleGoogle = async () => {
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (error) toast.error("Erro ao conectar com Google");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg shadow-card p-8">
          <div className="flex justify-center mb-8">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-center mb-2">Criar sua conta</h1>
          <p className="text-center text-muted-foreground font-body mb-8">Comece a controlar seus prazos</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="font-body">Nome completo</Label>
              <Input placeholder="João Silva" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <Label className="font-body">Email</Label>
              <Input type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label className="font-body">Telefone</Label>
              <Input type="tel" placeholder="(11) 99999-9999" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div>
              <Label className="font-body">Senha</Label>
              <div className="relative">
                <Input type={showPw ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPw(!showPw)}>
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <Label className="font-body">Confirmar senha</Label>
              <Input type="password" placeholder="••••••••" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
              {confirm && password !== confirm && (
                <p className="text-xs text-destructive mt-1 font-body">As senhas não coincidem</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="terms" checked={agreed} onCheckedChange={(v) => setAgreed(v === true)} />
              <Label htmlFor="terms" className="text-sm font-body text-muted-foreground">
                Aceito os <a href="#" className="text-secondary hover:underline">termos de uso</a>
              </Label>
            </div>
            <Button type="submit" variant="hero" className="w-full" disabled={loading || !agreed}>
              {loading ? "Criando..." : "Criar conta grátis"}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-2 text-muted-foreground font-body">ou</span>
            </div>
          </div>

          <Button variant="outline" className="w-full font-body" onClick={handleGoogle}>
            Cadastrar com Google
          </Button>

          <p className="mt-6 text-center text-sm text-muted-foreground font-body">
            Já tem conta?{" "}
            <Link to="/login" className="text-secondary hover:underline font-semibold">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
