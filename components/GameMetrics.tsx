import type { GameMetrics } from '../types/game';
import { Progress } from './ui/progress';
import { DollarSign, Users, Heart, Smartphone } from 'lucide-react';

interface GameMetricsProps {
  metrics: GameMetrics;
}

export default function GameMetrics({ metrics }: GameMetricsProps) {
  const metricsConfig = [
    {
      key: 'budget',
      label: 'Orçamento',
      value: metrics.budget,
      icon: DollarSign,
      color: 'text-warning',
      bgColor: 'bg-warning'
    },
    {
      key: 'audience',
      label: 'Público',
      value: metrics.audience,
      icon: Users,
      color: 'text-accent',
      bgColor: 'bg-accent'
    },
    {
      key: 'satisfaction',
      label: 'Satisfação',
      value: metrics.satisfaction,
      icon: Heart,
      color: 'text-success',
      bgColor: 'bg-success'
    },
    {
      key: 'technology',
      label: 'Tecnologia',
      value: metrics.technology,
      icon: Smartphone,
      color: 'text-primary',
      bgColor: 'bg-primary'
    }
  ];

  const getHealthColor = (value: number) => {
    if (value > 70) return 'bg-success';
    if (value > 40) return 'bg-warning';
    return 'bg-destructive';
  };

  return (
    <div className="grid grid-cols-2 gap-3 p-4 bg-card/50 rounded-xl border border-border/20">
      {metricsConfig.map((metric) => {
        const Icon = metric.icon;
        return (
          <div key={metric.key} className="flex items-center space-x-2">
            <div className={`p-1.5 rounded-lg ${metric.bgColor}/20`}>
              <Icon className={`w-4 h-4 ${metric.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-foreground truncate">
                  {metric.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {metric.value}%
                </span>
              </div>
              <Progress 
                value={metric.value} 
                className="h-1.5"
                indicatorClassName={getHealthColor(metric.value)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}