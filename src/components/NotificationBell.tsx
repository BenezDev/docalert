import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Bell, Clock, CheckCheck } from "lucide-react";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface NotifItem {
  id: string;
  content: string | null;
  status: string;
  scheduled_date: string;
  notification_type: string;
}

export function NotificationBell() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotifItem[]>([]);
  const [open, setOpen] = useState(false);
  const fetched = useRef(false);

  useEffect(() => {
    if (!user || fetched.current) return;
    fetched.current = true;
    supabase
      .from("notifications")
      .select("id, content, status, scheduled_date, notification_type")
      .eq("usuario_id", user.id)
      .order("scheduled_date", { ascending: false })
      .limit(5)
      .then(({ data }) => {
        if (data) setNotifications(data);
      });
  }, [user]);

  const unread = notifications.filter((n) => n.status !== "READ").length;

  const markAsRead = async (id: string) => {
    await supabase.from("notifications").update({ status: "READ" }).eq("id", id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: "READ" } : n))
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-body animate-scale-in">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="p-3 border-b flex items-center justify-between">
          <p className="font-display font-semibold text-sm">Notificações</p>
          {unread > 0 && (
            <Badge className="bg-destructive text-destructive-foreground font-body text-xs">
              {unread} nova{unread > 1 ? "s" : ""}
            </Badge>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-sm text-muted-foreground font-body">Nenhuma notificação</p>
          </div>
        ) : (
          <div className="max-h-72 overflow-y-auto">
            {notifications.map((n) => {
              const isUnread = n.status !== "READ";
              return (
                <div
                  key={n.id}
                  className={`p-3 border-b last:border-0 cursor-pointer hover:bg-muted/50 transition-colors ${
                    isUnread ? "bg-secondary/5" : ""
                  }`}
                  onClick={() => markAsRead(n.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${
                      isUnread ? "bg-secondary" : "bg-transparent"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-body ${isUnread ? "font-semibold" : ""}`}>
                        {n.content || "Alerta de vencimento"}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-body flex items-center gap-1 mt-0.5">
                        <Clock className="h-2.5 w-2.5" />
                        {format(new Date(n.scheduled_date), "dd MMM", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="p-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            className="w-full font-body text-xs text-secondary"
            onClick={() => { setOpen(false); navigate("/dashboard/notificacoes"); }}
          >
            Ver todas as notificações
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
