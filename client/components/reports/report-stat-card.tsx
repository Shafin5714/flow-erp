import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReportStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
}

export function ReportStatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  className,
}: ReportStatCardProps) {
  return (
    <Card className={cn("overflow-hidden border-zinc-200 dark:border-zinc-800", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-zinc-50/50 dark:bg-zinc-900/20">
        <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          {title}
        </CardTitle>
        <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{value}</div>
        {(description || trend) && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 flex items-center">
            {trend && (
              <span
                className={cn(
                  "mr-1 font-medium",
                  trend.value > 0
                    ? "text-emerald-600 dark:text-emerald-500"
                    : trend.value < 0
                      ? "text-rose-600 dark:text-rose-500"
                      : "text-zinc-500"
                )}
              >
                {trend.value > 0 ? "+" : ""}
                {trend.value}%
              </span>
            )}
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
