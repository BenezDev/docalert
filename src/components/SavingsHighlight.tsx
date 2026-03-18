import { useEffect, useState, useRef } from "react";
import { TrendingUp, Shield, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface SavingsHighlightProps {
  totalSaved: number;
  totalRenewals: number;
  totalCost: number;
  className?: string;
}

function AnimatedCounter({ value, prefix = "" }: { value: number; prefix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    if (animated.current || value === 0) return;
    animated.current = true;
    const duration = 1200;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [value]);

  return (
    <span ref={ref} className="animate-counter-pop">
      {prefix}{display.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(".", ",")}
    </span>
  );
}

export function SavingsHighlight({ totalSaved, totalRenewals, totalCost, className }: SavingsHighlightProps) {
  const roi = totalCost > 0 ? ((totalSaved / totalCost) * 100).toFixed(0) : "∞";

  return (
    <div className={cn(
      "bg-gradient-to-br from-success/5 to-success/10 dark:from-success/10 dark:to-success/15 rounded-xl p-6 border border-success/20 relative overflow-hidden",
      className
    )}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-success/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-success/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-10 w-10 rounded-full bg-success/20 flex items-center justify-center">
            <Trophy className="h-5 w-5 text-success" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm">Sua economia com DocAlert</h3>
            <p className="text-xs text-muted-foreground font-body">Parabéns por se organizar!</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center sm:text-left">
            <p className="text-3xl sm:text-4xl font-display font-bold text-success">
              <AnimatedCounter value={totalSaved} prefix="R$ " />
            </p>
            <p className="text-xs text-muted-foreground font-body mt-1 flex items-center gap-1 justify-center sm:justify-start">
              <Shield className="h-3 w-3" /> Multas evitadas
            </p>
          </div>

          <div className="text-center">
            <p className="text-2xl font-display font-bold">
              {totalRenewals}
            </p>
            <p className="text-xs text-muted-foreground font-body mt-1">
              Renovações feitas
            </p>
          </div>

          <div className="text-center sm:text-right">
            <p className="text-2xl font-display font-bold text-secondary">
              {roi}%
            </p>
            <p className="text-xs text-muted-foreground font-body mt-1 flex items-center gap-1 justify-center sm:justify-end">
              <TrendingUp className="h-3 w-3" /> ROI do DocAlert
            </p>
          </div>
        </div>

        {totalSaved >= 500 && (
          <div className="mt-4 pt-4 border-t border-success/20">
            <p className="text-xs font-body text-success font-medium text-center sm:text-left">
              🏆 Você já economizou mais de R$ 500! Continue assim.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
