import { Button } from './ui/button';
import { CheckCircle, RotateCcw } from 'lucide-react';

interface SuccessModalProps {
  onRestart: () => void;
  isVisible: boolean;
}

export default function SuccessModal({ onRestart, isVisible }: SuccessModalProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-card rounded-2xl shadow-glow border border-border/20 p-6 max-w-sm w-full animate-bounce-in">
        <div className="text-center mb-6">
          <div className="mb-4">
            <CheckCircle className="w-16 h-16 text-success mx-auto animate-pulse-glow" />
          </div>
          
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Obrigado!
          </h2>
          
          <p className="text-sm text-muted-foreground mb-4">
            Seus dados foram enviados com sucesso! Em breve você receberá dicas exclusivas sobre como usar a tecnologia para revolucionar seus eventos.
          </p>
          
          <div className="bg-primary/10 rounded-lg p-4 mb-4">
            <p className="text-sm text-primary font-medium">
              💡 Bilheteria digital pode aumentar suas vendas em até 300%!
            </p>
          </div>
        </div>
        
        <Button 
          onClick={onRestart}
          className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Jogar Novamente
        </Button>
      </div>
    </div>
  );
}