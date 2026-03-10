import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface FlipDigitProps {
  digit: string;
  className?: string;
}

function FlipDigit({ digit, className }: FlipDigitProps) {
  const [current, setCurrent] = useState(digit);
  const [prev, setPrev] = useState(digit);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (digit !== current) {
      setPrev(current);
      setFlipping(true);
      const timer = setTimeout(() => {
        setCurrent(digit);
        setFlipping(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [digit, current]);

  return (
    <span className={cn("flip-digit-container", className)}>
      <span className="flip-digit">
        <span className={cn("flip-digit-face", flipping && "flip-out")}>{flipping ? prev : current}</span>
        {flipping && <span className="flip-digit-face flip-in">{digit}</span>}
      </span>
    </span>
  );
}

interface FlipCounterProps {
  value: string;
  className?: string;
}

export function FlipCounter({ value, className }: FlipCounterProps) {
  const chars = value.split("");

  return (
    <span className={cn("inline-flex items-baseline gap-[1px]", className)}>
      {chars.map((char, i) => {
        const isDigit = /\d/.test(char);
        if (!isDigit) {
          return (
            <span key={`sep-${i}`} className="flip-separator">{char}</span>
          );
        }
        return <FlipDigit key={`d-${i}`} digit={char} />;
      })}
    </span>
  );
}

interface PenaltyCalculatorProps {
  basePenalty: number;
  daysLeft: number;
  penaltyLabel: string;
  extras?: string[];
  points?: string;
}

export function PenaltyCalculator({ basePenalty, daysLeft, penaltyLabel, extras, points }: PenaltyCalculatorProps) {
  const [showSavings, setShowSavings] = useState(false);
  const [displayValue, setDisplayValue] = useState(basePenalty);
  const animFrameRef = useRef<number>();

  // Animate value changes
  useEffect(() => {
    const target = basePenalty;
    const start = displayValue;
    const diff = target - start;
    if (Math.abs(diff) < 0.01) { setDisplayValue(target); return; }

    const duration = 600;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(start + diff * eased);
      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); };
  }, [basePenalty]);

  const formattedValue = displayValue.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="penalty-calculator">
      {/* Days countdown */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-1">
          <FlipCounter
            value={Math.abs(daysLeft).toString().padStart(2, "0")}
            className="text-3xl"
          />
        </div>
        <span className="text-sm font-body text-muted-foreground">
          {daysLeft < 0 ? "dias de atraso" : daysLeft === 0 ? "vence hoje" : "dias restantes"}
        </span>
      </div>

      {/* Penalty / Savings toggle */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-xs font-body text-muted-foreground mb-1 uppercase tracking-wider">
            {showSavings ? "Economia ao renovar" : "Custo do atraso"}
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-body font-medium text-muted-foreground">R$</span>
            <FlipCounter
              value={formattedValue}
              className={cn(
                "text-3xl font-display font-bold transition-colors duration-300",
                showSavings ? "text-success" : "text-destructive"
              )}
            />
          </div>
          {points && (
            <p className="text-xs font-body text-muted-foreground mt-1">+ {points}</p>
          )}
          {extras?.map((e) => (
            <p key={e} className="text-xs font-body text-muted-foreground">+ {e}</p>
          ))}
        </div>

        {/* Toggle button */}
        <button
          onClick={() => setShowSavings(!showSavings)}
          className={cn(
            "penalty-toggle",
            showSavings ? "penalty-toggle-savings" : "penalty-toggle-cost"
          )}
          aria-label={showSavings ? "Ver custo do atraso" : "Ver economia ao renovar"}
        >
          <span className="text-lg">{showSavings ? "✅" : "💸"}</span>
        </button>
      </div>
    </div>
  );
}
