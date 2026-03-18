import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { getStatusLevel } from "@/lib/documents";

interface CountdownTimerProps {
  daysLeft: number;
  showHours?: boolean;
  className?: string;
}

const colorMap = {
  success: "text-success",
  info: "text-info",
  warning: "text-warning",
  destructive: "text-destructive",
};

const bgMap = {
  success: "bg-success/10",
  info: "bg-info/10",
  warning: "bg-warning/10",
  destructive: "bg-destructive/10",
};

export function CountdownTimer({ daysLeft, showHours = false, className }: CountdownTimerProps) {
  const level = getStatusLevel(daysLeft);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (!showHours) return;

    const updateTime = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const remaining = Math.max(0, endOfDay.getTime() - now.getTime());
      setHours(Math.floor(remaining / 3600000));
      setMinutes(Math.floor((remaining % 3600000) / 60000));
      setSeconds(Math.floor((remaining % 60000) / 1000));
    };

    updateTime();
    intervalRef.current = setInterval(updateTime, 1000);
    return () => clearInterval(intervalRef.current);
  }, [showHours]);

  const isExpired = daysLeft < 0;
  const absD = Math.abs(daysLeft);

  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      {/* Days */}
      <div className={cn(
        "flex flex-col items-center rounded-lg px-3 py-2 min-w-[56px]",
        bgMap[level]
      )}>
        <span className={cn(
          "text-2xl font-display font-bold tabular-nums leading-none",
          colorMap[level]
        )}>
          {isExpired ? `-${absD}` : absD}
        </span>
        <span className="text-[10px] text-muted-foreground font-body uppercase tracking-wider mt-0.5">
          {absD === 1 ? "dia" : "dias"}
        </span>
      </div>

      {showHours && !isExpired && daysLeft <= 30 && (
        <>
          <span className={cn("text-lg font-display font-bold", colorMap[level])}>:</span>
          <div className={cn("flex flex-col items-center rounded-lg px-2 py-2 min-w-[44px]", bgMap[level])}>
            <span className={cn("text-xl font-display font-bold tabular-nums leading-none", colorMap[level])}>
              {String(hours).padStart(2, "0")}
            </span>
            <span className="text-[10px] text-muted-foreground font-body uppercase tracking-wider mt-0.5">hrs</span>
          </div>
          <span className={cn("text-lg font-display font-bold", colorMap[level])}>:</span>
          <div className={cn("flex flex-col items-center rounded-lg px-2 py-2 min-w-[44px]", bgMap[level])}>
            <span className={cn("text-xl font-display font-bold tabular-nums leading-none", colorMap[level])}>
              {String(minutes).padStart(2, "0")}
            </span>
            <span className="text-[10px] text-muted-foreground font-body uppercase tracking-wider mt-0.5">min</span>
          </div>
          {daysLeft <= 1 && (
            <>
              <span className={cn("text-lg font-display font-bold", colorMap[level])}>:</span>
              <div className={cn("flex flex-col items-center rounded-lg px-2 py-2 min-w-[44px]", bgMap[level])}>
                <span className={cn("text-xl font-display font-bold tabular-nums leading-none animate-pulse", colorMap[level])}>
                  {String(seconds).padStart(2, "0")}
                </span>
                <span className="text-[10px] text-muted-foreground font-body uppercase tracking-wider mt-0.5">seg</span>
              </div>
            </>
          )}
        </>
      )}

      {isExpired && (
        <span className="text-xs font-body font-medium text-destructive ml-1">
          VENCIDO
        </span>
      )}
    </div>
  );
}
