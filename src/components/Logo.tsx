import { Link } from "react-router-dom";
import logoIcon from "@/assets/logo-icon.png";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const imgSizes = { sm: "h-7", md: "h-9", lg: "h-11" };
  const textSizes = { sm: "text-lg", md: "text-xl", lg: "text-2xl" };

  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <img
        src={logoIcon}
        alt="DocAlert"
        className={`${imgSizes[size]} w-auto`}
      />
      <span className={`font-display font-bold text-foreground ${textSizes[size]}`}>
        Doc<span className="text-secondary">Alert</span>
      </span>
    </Link>
  );
}
