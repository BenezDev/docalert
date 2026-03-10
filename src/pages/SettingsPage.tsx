import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, UserPlus } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();

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
              <div className="flex items-center gap-4 mb-4">
                <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <div>
                  <p className="font-display font-bold">{user?.name}</p>
                  <p className="text-sm text-muted-foreground font-body">{user?.email}</p>
                </div>
              </div>
              <div>
                <Label className="font-body">Nome</Label>
                <Input defaultValue={user?.name} />
              </div>
              <div>
                <Label className="font-body">Email</Label>
                <Input defaultValue={user?.email} type="email" />
              </div>
              <div>
                <Label className="font-body">Telefone</Label>
                <Input defaultValue={user?.phone} type="tel" />
              </div>
              <Button variant="hero">Salvar alterações</Button>
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
