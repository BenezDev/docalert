import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown, type LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  trend?: { value: number; label: string };
  borderColor?: string;
  className?: string;
}

export function StatsCard({ icon: Icon, title, value, trend, borderColor, className }: StatsCardProps) {
  const trendUp = trend && trend.value > 0;
  const trendDown = trend && trend.value < 0;

  return (
    <div
      className={cn(
        "bg-card rounded-lg p-5 shadow-card border-l-4 animate-fade-in",
        className
      )}
      style={{ borderLeftColor: borderColor || "hsl(var(--border))" }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground font-body">{title}</span>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <p className="text-3xl font-display font-bold">{value}</p>
      {trend && (
        <div className="flex items-center gap-1 mt-1">
          {trendUp && <ArrowUp className="h-3 w-3 text-success" />}
          {trendDown && <ArrowDown className="h-3 w-3 text-destructive" />}
          <span className={cn(
            "text-xs font-body font-medium",
            trendUp ? "text-success" : trendDown ? "text-destructive" : "text-muted-foreground"
          )}>
            {trend.value > 0 ? "+" : ""}{trend.value}% {trend.label}
          </span>
        </div>
      )}
    </div>
  );
}
