import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart } from "recharts";

interface KPICardProps {
  title: string;
  value: string;
  change?: {
    value: string;
    trend: "up" | "down" | "neutral";
  };
  icon: LucideIcon;
  data?: { value: number }[];
  className?: string;
  style?: React.CSSProperties;
}

export function KPICard({ title, value, change, icon: Icon, data, className, style }: KPICardProps) {
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
      
      {data && data.length > 0 && (
        <div className="mt-3 sm:mt-4">
          <ChartContainer
            config={{ series: { label: title, color: "hsl(var(--primary))" } }}
            className="h-14 w-full"
            aria-label={`${title} trend sparkline`}
          >
            <AreaChart data={data} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
              <defs>
                <linearGradient id="kpiGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                fill="url(#kpiGradient)"
                strokeWidth={2}
                isAnimationActive
                dot={false}
                activeDot={{ r: 3 }}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            </AreaChart>
          </ChartContainer>
        </div>
      )}

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