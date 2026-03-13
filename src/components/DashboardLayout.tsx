import { Link, useLocation, useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useDocs } from "@/hooks/useDocs";
import { getDaysUntilExpiry } from "@/lib/documents";
import { Bell, LayoutDashboard, FileText, Users, Settings, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Documentos", path: "/dashboard/documentos", icon: FileText },
  { label: "Família", path: "/dashboard/familia", icon: Users },
  { label: "Configurações", path: "/dashboard/configuracoes", icon: Settings },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { documents } = useDocs();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const urgentCount = documents.filter((d) => !d.resolvido && getDaysUntilExpiry(d.data_vencimento) <= 30).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Logo size="sm" />
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={location.pathname === item.path ? "secondary" : "ghost"}
                    size="sm"
                    className="font-body gap-2"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative" onClick={() => navigate("/dashboard")}>
              <Bell className="h-4 w-4" />
              {urgentCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-body">
                  {urgentCount > 9 ? "9+" : urgentCount}
                </span>
              )}
            </Button>
            <div className="hidden md:flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                {user?.name?.charAt(0) || "U"}
              </div>
              <span className="text-sm font-body font-medium">{user?.name || "Usuário"}</span>
            </div>
            <Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => { logout(); navigate("/"); }}>
              <LogOut className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden border-t bg-card p-4 space-y-2">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}>
                <Button
                  variant={location.pathname === item.path ? "secondary" : "ghost"}
                  className="w-full justify-start gap-2 font-body"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
            <Button variant="ghost" className="w-full justify-start gap-2 font-body text-destructive" onClick={() => { logout(); navigate("/"); }}>
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        )}
      </header>

      <main className="container py-6 md:py-8">
        {children}
      </main>
    </div>
  );
}
