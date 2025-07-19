import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Target, Brain, Zap, Shield, Smartphone, Coins } from 'lucide-react';

interface BadgeSystemProps {
  badges: string[];
  totalPoints: number;
  className?: string;
}

const badgeConfig = {
  TECH_MASTER: {
    name: 'Mestre da Tecnologia',
    description: 'Escolheu soluções tecnológicas avançadas',
    icon: <Zap className="w-4 h-4" />,
    color: 'bg-blue-500'
  },
  BUDGET_WIZARD: {
    name: 'Mago do Orçamento',
    description: 'Manteve o orçamento equilibrado',
    icon: <Coins className="w-4 h-4" />,
    color: 'bg-green-500'
  },
  CROWD_PLEASER: {
    name: 'Conquistador de Multidões',
    description: 'Atraiu uma grande audiência',
    icon: <Target className="w-4 h-4" />,
    color: 'bg-purple-500'
  },
  SATISFACTION_GURU: {
    name: 'Guru da Satisfação',
    description: 'Manteve alta satisfação do público',
    icon: <Star className="w-4 h-4" />,
    color: 'bg-yellow-500'
  },
  STRATEGIC_MIND: {
    name: 'Mente Estratégica',
    description: 'Obteve pontuação excelente',
    icon: <Brain className="w-4 h-4" />,
    color: 'bg-indigo-500'
  },
  CRISIS_MANAGER: {
    name: 'Gestor de Crises',
    description: 'Transformou crises em oportunidades',
    icon: <Shield className="w-4 h-4" />,
    color: 'bg-red-500'
  },
  DIGITAL_NATIVE: {
    name: 'Nativo Digital',
    description: 'Priorizou soluções digitais',
    icon: <Smartphone className="w-4 h-4" />,
    color: 'bg-cyan-500'
  }
};

export default function BadgeSystem({ badges, totalPoints, className }: BadgeSystemProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Points Display */}
      <div className="flex items-center justify-between bg-gradient-card rounded-lg p-4 border border-border/20">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-warning" />
          <span className="text-sm font-medium">Pontos Totais</span>
        </div>
        <span className="text-lg font-bold text-primary">{totalPoints}</span>
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Conquistas Desbloqueadas:</h4>
          <div className="grid grid-cols-1 gap-2">
            {badges.map((badgeId) => {
              const badge = badgeConfig[badgeId as keyof typeof badgeConfig];
              if (!badge) return null;
              
              return (
                <div
                  key={badgeId}
                  className="flex items-center gap-3 bg-gradient-card rounded-lg p-3 border border-border/20 animate-bounce-in"
                >
                  <div className={`p-2 rounded-full ${badge.color} text-white`}>
                    {badge.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-foreground text-sm">{badge.name}</div>
                    <div className="text-xs text-muted-foreground">{badge.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Available Badges */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">Outras Conquistas:</h4>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(badgeConfig)
            .filter(([key]) => !badges.includes(key))
            .map(([key, badge]) => (
              <div
                key={key}
                className="flex items-center gap-2 bg-secondary/30 rounded-lg p-2 opacity-50"
              >
                <div className="p-1 rounded-full bg-muted text-muted-foreground">
                  {badge.icon}
                </div>
                <div className="text-xs text-muted-foreground">{badge.name}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}