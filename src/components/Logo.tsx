import { Shield, Bell } from "lucide-react";
import { Link } from "react-router-dom";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "h-6", md: "h-8", lg: "h-10" };
  const textSizes = { sm: "text-lg", md: "text-xl", lg: "text-2xl" };

  return (
    <Link to="/" className="flex items-center gap-2 group">
      <div className="relative">
        <Shield className={`${sizes[size]} w-auto text-primary`} />
        <Bell className="absolute -top-0.5 -right-0.5 h-3 w-3 text-secondary" />
      </div>
      <span className={`font-display font-bold text-foreground ${textSizes[size]}`}>
        Doc<span className="text-secondary">Alert</span>
      </span>
    </Link>
  );
}
