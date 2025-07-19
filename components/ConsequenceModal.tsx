import { Button } from './ui/button';
import { CheckCircle, XCircle } from 'lucide-react';

interface ConsequenceModalProps {
  consequence: string;
  choice: 'left' | 'right';
  onContinue: () => void;
  isVisible: boolean;
}

export default function ConsequenceModal({ 
  consequence, 
  choice, 
  onContinue, 
  isVisible 
}: ConsequenceModalProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-card rounded-2xl shadow-glow border border-border/20 p-6 max-w-sm w-full animate-bounce-in">
        <div className="text-center mb-4">
          <div className="mb-3">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">📊</span>
            </div>
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">
            Consequência
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {consequence}
          </p>
        </div>
        
        <Button 
          onClick={onContinue}
          className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}