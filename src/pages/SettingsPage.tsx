import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, UserPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsPage() {
  const { user } = useAuth();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      setLoadingProfile(true);
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (data) {
        setNome(data.nome || "");
        setEmail(data.email || "");
        setTelefone(data.telefone || "");
      }
      setLoadingProfile(false);
    };
    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ nome, email, telefone })
      .eq("user_id", user.id);
    setSaving(false);
    if (error) {
      toast.error("Erro ao salvar. Tente novamente.");
    } else {
      toast.success("Perfil atualizado com sucesso!");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Configurações</h1>

        <Tabs defaultValue="perfil">
          <TabsList className="mb-6 w-full justify-start">
            <TabsTrigger value="perfil" className="font-body">Perfil</TabsTrigger>
            <TabsTrigger value="notificacoes" className="font-body">Notificações</TabsTrigger>
            <TabsTrigger value="plano" className="font-body">Plano</TabsTrigger>
            <TabsTrigger value="familia" className="font-body">Família</TabsTrigger>
          </TabsList>

          <TabsContent value="perfil">
            <div className="bg-card rounded-lg p-6 shadow-card space-y-4">
              {loadingProfile ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 mb-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                  </div>
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
                      {nome?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="font-display font-bold">{nome || "Usuário"}</p>
                      <p className="text-sm text-muted-foreground font-body">{email}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="font-body">Nome</Label>
                    <Input value={nome} onChange={(e) => setNome(e.target.value)} />
                  </div>
                  <div>
                    <Label className="font-body">Email</Label>
                    <Input value={email} type="email" disabled className="opacity-60" />
                    <p className="text-xs text-muted-foreground font-body mt-1">O email não pode ser alterado por aqui.</p>
                  </div>
                  <div>
                    <Label className="font-body">Telefone</Label>
                    <Input value={telefone} onChange={(e) => setTelefone(e.target.value)} type="tel" placeholder="(11) 99999-9999" />
                  </div>
                  <Button variant="hero" onClick={handleSave} disabled={saving}>
                    {saving ? <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Salvando...</> : "Salvar alterações"}
                  </Button>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="notificacoes">
            <div className="bg-card rounded-lg p-6 shadow-card space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display font-semibold">Email</p>
                  <p className="text-sm text-muted-foreground font-body">Receba alertas por email</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display font-semibold">WhatsApp</p>
                  <p className="text-sm text-muted-foreground font-body">Disponível no plano Pessoal</p>
                </div>
                <Switch disabled />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display font-semibold">Resumo semanal</p>
                  <p className="text-sm text-muted-foreground font-body">Receba um resumo toda segunda-feira</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="plano">
            <div className="bg-card rounded-lg p-6 shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <Crown className="h-5 w-5 text-warning" />
                <h3 className="font-display font-bold">Plano Gratuito</h3>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm font-body"><Check className="h-4 w-4 text-success" /> Até 5 documentos</li>
                <li className="flex items-center gap-2 text-sm font-body"><Check className="h-4 w-4 text-success" /> Alertas por email</li>
                <li className="flex items-center gap-2 text-sm font-body"><Check className="h-4 w-4 text-success" /> Guia básico</li>
              </ul>
              <Button variant="hero">Fazer upgrade</Button>
            </div>
          </TabsContent>

          <TabsContent value="familia">
            <div className="bg-card rounded-lg p-6 shadow-card">
              <p className="text-sm text-muted-foreground font-body mb-4">
                Gerencie os membros da sua família. Disponível no plano Pessoal.
              </p>
              <Button variant="outline" className="font-body" disabled>
                <UserPlus className="h-4 w-4 mr-1" /> Convidar membro
              </Button>
              <Badge className="ml-2 bg-warning/10 text-warning border-warning/20 font-body">Plano pago</Badge>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
