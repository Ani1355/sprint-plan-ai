import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string;
  change?: {
    value: string;
    trend: "up" | "down" | "neutral";
  };
  icon: LucideIcon;
  className?: string;
  style?: React.CSSProperties;
}

export function KPICard({ title, value, change, icon: Icon, className, style }: KPICardProps) {
  return (
    <div className={cn("card-elevated p-6 animate-fade-in", className)} style={style}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-body-small text-text-secondary font-medium">{title}</p>
          <p className="text-display text-card-foreground font-bold">{value}</p>
        </div>
        <div className="w-12 h-12 bg-gradient-brand rounded-2xl flex items-center justify-center">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      
      {change && (
        <div className="mt-4 flex items-center gap-2">
          <span className={cn(
            "text-body-small font-medium",
            change.trend === "up" && "text-success",
            change.trend === "down" && "text-error",
            change.trend === "neutral" && "text-text-muted"
          )}>
            {change.trend === "up" && "↗"} 
            {change.trend === "down" && "↙"} 
            {change.value}
          </span>
          <span className="text-body-small text-text-muted">vs last period</span>
        </div>
      )}
    </div>
  );
}