
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  className?: string;
  variant?: 'primary' | 'white';
}

export function StatCard({ label, value, icon: Icon, trend, className, variant = 'white' }: StatCardProps) {
  return (
    <Card className={cn(
      "overflow-hidden border-none shadow-md transition-all hover:shadow-lg",
      variant === 'primary' ? "bg-primary text-primary-foreground" : "bg-white",
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className={cn(
              "text-sm font-medium",
              variant === 'primary' ? "text-primary-foreground/80" : "text-muted-foreground"
            )}>{label}</p>
            <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
          </div>
          <div className={cn(
            "rounded-xl p-3",
            variant === 'primary' ? "bg-white/20" : "bg-primary/10 text-primary"
          )}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
        {trend && (
          <p className={cn(
            "mt-4 text-xs font-medium",
            variant === 'primary' ? "text-primary-foreground/70" : "text-emerald-600"
          )}>
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
