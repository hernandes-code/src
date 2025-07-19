import { Button } from './ui/button';
import { Trophy, AlertTriangle, RotateCcw } from 'lucide-react';
import { GameMetrics } from '../types/game';

interface GameOverModalProps {
  metrics: GameMetrics;
  reason: string;
  onRestart: () => void;
  onContinueToForm: () => void;
  isVisible: boolean;
}

export default function GameOverModal({ 
  metrics, 
  reason, 
  onRestart, 
  onContinueToForm,
  isVisible 
}: GameOverModalProps) {
  if (!isVisible) return null;

  const isSuccess = metrics.budget > 0 && metrics.audience > 0 && metrics.satisfaction > 0 && metrics.technology > 0;
  const totalScore = metrics.budget + metrics.audience + metrics.satisfaction + metrics.technology;

  const getPerformanceMessage = () => {
    if (totalScore >= 280) return "Excelente! Você domina a produção de eventos!";
    if (totalScore >= 220) return "Muito bom! Você entende bem o negócio.";
    if (totalScore >= 160) return "Bom trabalho! Há espaço para melhorias.";
    return "Que tal tentar novamente? A tecnologia é sua aliada!";
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-card rounded-2xl shadow-glow border border-border/20 p-6 max-w-sm w-full animate-bounce-in">
        <div className="text-center mb-6">
          <div className="mb-4">
            {isSuccess ? (
              <Trophy className="w-16 h-16 text-warning mx-auto animate-pulse-glow" />
            ) : (
              <AlertTriangle className="w-16 h-16 text-destructive mx-auto animate-pulse-glow" />
            )}
          </div>
          
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {isSuccess ? 'Parabéns!' : 'Fim de Jogo'}
          </h2>
          
          <p className="text-sm text-muted-foreground mb-4">
            {reason}
          </p>
          
          <div className="bg-secondary/30 rounded-lg p-4 mb-4">
            <div className="text-lg font-bold text-foreground mb-2">
              Pontuação Final: {totalScore}/400
            </div>
            <p className="text-sm text-primary">
              {getPerformanceMessage()}
            </p>
          </div>

          <div className="text-xs text-muted-foreground">
            💡 Dica: Bilheteria digital e marketing são fundamentais para o sucesso!
          </div>
        </div>
        
        <div className="space-y-3">
          <Button 
            onClick={onContinueToForm}
            className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground"
          >
            Continuar para Formulário
          </Button>
          
          <Button 
            onClick={onRestart}
            variant="outline"
            className="w-full border-border/30"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Jogar Novamente
          </Button>
        </div>
      </div>
    </div>
  );
}