import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  to?: string;
  text?: string;
  className?: string;
}

export default function BackButton({
  to = "/",
  text = "Back to Home",
  className = "",
}: BackButtonProps) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors mb-6 group ${className}`}
    >
      <div className="w-8 h-8 rounded-full bg-bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
        <ArrowLeft size={18} />
      </div>
      <span className="font-medium text-sm">{text}</span>
    </Link>
  );
}
