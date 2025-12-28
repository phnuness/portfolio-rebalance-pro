import { cn } from '@/lib/utils';

interface AllocationBarProps {
  label: string;
  current: number;
  target: number;
  value?: string;
  className?: string;
}

export function AllocationBar({ label, current, target, value, className }: AllocationBarProps) {
  const difference = current - target;
  const isOverweight = difference > 0;
  const isUnderweight = difference < 0;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <div className="flex items-center gap-3">
          {value && <span className="text-muted-foreground font-mono text-xs">{value}</span>}
          <span className="font-mono">
            {current.toFixed(1)}%
            <span className="text-muted-foreground"> / {target.toFixed(0)}%</span>
          </span>
        </div>
      </div>
      
      <div className="relative h-3 rounded-full bg-secondary overflow-hidden">
        {/* Target marker */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-foreground/30 z-10"
          style={{ left: `${Math.min(target, 100)}%` }}
        />
        
        {/* Current fill */}
        <div 
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            isOverweight && "bg-gradient-to-r from-warning to-warning/70",
            isUnderweight && "bg-gradient-to-r from-accent to-accent/70",
            !isOverweight && !isUnderweight && "bg-gradient-to-r from-primary to-primary/70"
          )}
          style={{ width: `${Math.min(current, 100)}%` }}
        />
      </div>

      <div className="flex justify-between text-xs">
        <span className={cn(
          "font-medium",
          isOverweight && "text-warning",
          isUnderweight && "text-accent",
          !isOverweight && !isUnderweight && "text-primary"
        )}>
          {isOverweight && `+${difference.toFixed(1)}% acima`}
          {isUnderweight && `${difference.toFixed(1)}% abaixo`}
          {!isOverweight && !isUnderweight && 'No alvo'}
        </span>
      </div>
    </div>
  );
}
