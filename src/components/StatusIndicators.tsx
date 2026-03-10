import { getDaysUntilExpiry, getStatusLevel, type StatusLevel } from "@/lib/documents";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  daysLeft: number;
  className?: string;
}

const statusConfig: Record<StatusLevel, { bg: string; text: string }> = {
  success: { bg: "bg-success/10", text: "text-success" },
  info: { bg: "bg-info/10", text: "text-info" },
  warning: { bg: "bg-warning/10", text: "text-warning" },
  destructive: { bg: "bg-destructive/10", text: "text-destructive" },
};

export function StatusBadge({ daysLeft, className }: StatusBadgeProps) {
  const level = getStatusLevel(daysLeft);
  const config = statusConfig[level];

  const label = daysLeft < 0
    ? `Vencido há ${Math.abs(daysLeft)} dias`
    : daysLeft === 0
    ? "Vence hoje!"
    : `${daysLeft} dias restantes`;

  return (
    <span className={cn("inline-flex items-center rounded-md px-2 py-1 text-xs font-medium font-body", config.bg, config.text, className)}>
      {label}
    </span>
  );
}

interface StatusBarProps {
  daysLeft: number;
  className?: string;
}

const barColors: Record<StatusLevel, string> = {
  success: "bg-success",
  info: "bg-info",
  warning: "bg-warning",
  destructive: "bg-destructive",
};

export function StatusBar({ daysLeft, className }: StatusBarProps) {
  const level = getStatusLevel(daysLeft);
  const percent = daysLeft <= 0 ? 100 : Math.min(100, Math.max(5, ((365 - daysLeft) / 365) * 100));

  return (
    <div className={cn("h-2 rounded-full bg-muted overflow-hidden", className)}>
      <div
        className={cn("h-full rounded-full transition-all", barColors[level])}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
