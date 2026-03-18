import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Bell, BellOff, CheckCheck, Clock, Mail, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Notification {
  id: string;
  notification_type: string;
  status: string;
  content: string | null;
  scheduled_date: string;
  sent_date: string | null;
  days_before_expiry: number | null;
  documento_id: string | null;
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("usuario_id", user.id)
        .order("scheduled_date", { ascending: false });
      setNotifications(data || []);
      setLoading(false);
    };
    fetch();
  }, [user]);

  const markAsRead = async (id: string) => {
    await supabase.from("notifications").update({ status: "READ" }).eq("id", id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: "READ" } : n))
    );
    toast.success("Notificação marcada como lida");
  };

  const markAllAsRead = async () => {
    if (!user) return;
    await supabase
      .from("notifications")
      .update({ status: "READ" })
      .eq("usuario_id", user.id)
      .neq("status", "READ");
    setNotifications((prev) => prev.map((n) => ({ ...n, status: "READ" })));
    toast.success("Todas marcadas como lidas");
  };

  const unreadCount = notifications.filter((n) => n.status !== "READ").length;
  const filtered = tab === "unread"
    ? notifications.filter((n) => n.status !== "READ")
    : notifications;

  const getIcon = (type: string) => {
    switch (type) {
      case "EMAIL": return Mail;
      case "SMS": return Bell;
      default: return Bell;
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card rounded-lg p-5 shadow-card">
                <Skeleton className="h-5 w-64 mb-2" />
                <Skeleton className="h-4 w-40" />
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Notificações</h1>
            <p className="text-sm text-muted-foreground font-body">
              {unreadCount > 0
                ? `${unreadCount} não lida${unreadCount > 1 ? "s" : ""}`
                : "Tudo em dia"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" className="font-body w-full sm:w-auto" onClick={markAllAsRead}>
              <CheckCheck className="h-4 w-4 mr-1" /> Marcar todas como lidas
            </Button>
          )}
        </div>

        <Tabs value={tab} onValueChange={setTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all" className="font-body">
              Todas
              <Badge variant="secondary" className="ml-2 font-body text-xs">{notifications.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="unread" className="font-body">
              Não lidas
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-destructive text-destructive-foreground font-body text-xs">{unreadCount}</Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <BellOff className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground font-body">
              {tab === "unread" ? "Nenhuma notificação não lida." : "Nenhuma notificação ainda."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((n) => {
              const Icon = getIcon(n.notification_type);
              const isUnread = n.status !== "READ";
              return (
                <div
                  key={n.id}
                  className={`bg-card rounded-lg p-5 shadow-card border-l-4 transition-colors ${
                    isUnread ? "border-l-secondary" : "border-l-transparent"
                  }`}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center shrink-0 ${
                      isUnread ? "bg-secondary/10" : "bg-muted"
                    }`}>
                      <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${isUnread ? "text-secondary" : "text-muted-foreground"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-body ${isUnread ? "font-semibold" : ""}`}>
                        {n.content || "Alerta de vencimento"}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground font-body flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(new Date(n.scheduled_date), "dd MMM yyyy", { locale: ptBR })}
                        </span>
                        {n.days_before_expiry && (
                          <span className="text-xs text-muted-foreground font-body">
                            {n.days_before_expiry} dias antes
                          </span>
                        )}
                        <Badge
                          variant="secondary"
                          className={`text-xs font-body ${
                            n.status === "SENT" ? "bg-success/10 text-success" :
                            n.status === "PENDING" ? "bg-warning/10 text-warning" :
                            n.status === "READ" ? "bg-muted text-muted-foreground" :
                            "bg-destructive/10 text-destructive"
                          }`}
                        >
                          {n.status === "SENT" ? "Enviada" :
                           n.status === "PENDING" ? "Pendente" :
                           n.status === "READ" ? "Lida" : "Falhou"}
                        </Badge>
                      </div>
                    </div>
                    {isUnread && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="font-body text-xs shrink-0"
                        onClick={() => markAsRead(n.id)}
                      >
                        Marcar lida
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Preferences section */}
        <div className="mt-10">
          <h2 className="text-lg font-bold mb-4">Preferências de notificação</h2>
          <div className="bg-card rounded-lg p-6 shadow-card space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display font-semibold text-sm">Email</p>
                <p className="text-xs text-muted-foreground font-body">Receba alertas por email</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display font-semibold text-sm">WhatsApp</p>
                <p className="text-xs text-muted-foreground font-body">Disponível no plano Individual</p>
              </div>
              <Switch disabled />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display font-semibold text-sm">Resumo semanal</p>
                <p className="text-xs text-muted-foreground font-body">Toda segunda-feira de manhã</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
