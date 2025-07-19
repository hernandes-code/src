import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertTriangle, TrendingUp, Zap, Star, DollarSign } from 'lucide-react';
import type { RandomEvent } from '@/types/game';

interface RandomEventModalProps {
  event: RandomEvent | null;
  isVisible: boolean;
  onContinue: () => void;
}

const eventIcons = {
  'weather-crisis': <AlertTriangle className="w-8 h-8 text-orange-500" />,
  'viral-moment': <TrendingUp className="w-8 h-8 text-green-500" />,
  'technical-issue': <Zap className="w-8 h-8 text-red-500" />,
  'celebrity-surprise': <Star className="w-8 h-8 text-yellow-500" />,
  'sponsor-bonus': <DollarSign className="w-8 h-8 text-blue-500" />
};

export default function RandomEventModal({ event, isVisible, onContinue }: RandomEventModalProps) {
  if (!isVisible || !event) return null;

  const getEffectText = (effects: any) => {
    const effectTexts = [];
    if (effects.budget) effectTexts.push(`Orçamento ${effects.budget > 0 ? '+' : ''}${effects.budget}`);
    if (effects.audience) effectTexts.push(`Audiência ${effects.audience > 0 ? '+' : ''}${effects.audience}`);
    if (effects.satisfaction) effectTexts.push(`Satisfação ${effects.satisfaction > 0 ? '+' : ''}${effects.satisfaction}`);
    if (effects.technology) effectTexts.push(`Tecnologia ${effects.technology > 0 ? '+' : ''}${effects.technology}`);
    return effectTexts.join(' • ');
  };

  const getEventColor = (eventId: string) => {
    switch (eventId) {
      case 'weather-crisis':
      case 'technical-issue':
        return 'border-red-500/30 bg-red-500/5';
      case 'viral-moment':
      case 'celebrity-surprise':
      case 'sponsor-bonus':
        return 'border-green-500/30 bg-green-500/5';
      default:
        return 'border-border/20';
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className={`max-w-md w-full p-6 animate-bounce-in ${getEventColor(event.id)}`}>
        
        {/* Header */}
        <div className="text-center space-y-4 mb-6">
          <div className="flex justify-center">
            {eventIcons[event.id as keyof typeof eventIcons]}
          </div>
          
          <div className="bg-gradient-card rounded-lg p-3 border border-border/20">
            <h3 className="font-bold text-foreground mb-1">🎲 EVENTO ALEATÓRIO</h3>
            <h2 className="text-lg font-bold text-primary">{event.title}</h2>
          </div>
          
          <p className="text-sm text-muted-foreground">
            {event.description}
          </p>
        </div>

        {/* Effect Description */}
        <div className="bg-secondary/30 rounded-lg p-4 mb-6 space-y-3">
          <p className="text-sm text-foreground">
            {event.message}
          </p>
          
          <div className="flex items-center justify-center">
            <div className="bg-gradient-card rounded-lg px-3 py-2 border border-border/20">
              <span className="text-xs font-medium text-primary">
                {getEffectText(event.effects)}
              </span>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <Button
            onClick={onContinue}
            className="bg-gradient-primary hover:opacity-90 text-primary-foreground"
          >
            Continuar
          </Button>
        </div>
      </Card>
    </div>
  );
}