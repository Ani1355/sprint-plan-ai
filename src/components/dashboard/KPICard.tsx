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
    <div className={cn("card-elevated p-4 sm:p-6 animate-fade-in", className)} style={style}>
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1 min-w-0 flex-1">
          <p className="text-xs sm:text-sm text-text-secondary font-medium truncate">{title}</p>
          <p className="text-2xl sm:text-3xl lg:text-4xl text-card-foreground font-bold truncate">{value}</p>
        </div>
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-brand rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" aria-hidden="true" />
        </div>
      </div>
      
      {change && (
        <div className="mt-3 sm:mt-4 flex items-center gap-2">
          <span className={cn(
            "text-xs sm:text-sm font-medium",
            change.trend === "up" && "text-success",
            change.trend === "down" && "text-error",
            change.trend === "neutral" && "text-text-muted"
          )}>
            {change.trend === "up" && "↗"} 
            {change.trend === "down" && "↙"} 
            {change.value}
          </span>
          <span className="text-xs sm:text-sm text-text-muted hidden sm:inline">vs last period</span>
        </div>
      )}
    </div>
  );
}