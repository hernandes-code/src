import { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Share2, Download, Check } from 'lucide-react';
import logo from '../assets/logo.png';
import badgeTechMaster from '../assets/badge-tech-master.png';
import badgeBudgetWizard from '../assets/badge-budget-wizard.png';
import badgeCrowdPleaser from '../assets/badge-crowd-pleaser.png';
import badgeSatisfactionGuru from '../assets/badge-satisfaction-guru.png';
import badgeRiskTaker from '../assets/badge-risk-taker.png';
import badgeStrategicMind from '../assets/badge-strategic-mind.png';
import badgeCrisisManager from '../assets/badge-crisis-manager.png';
import badgeDigitalNative from '../assets/badge-digital-native.png';

interface BadgeCompletionModalProps {
  isVisible: boolean;
  badges: string[];
  totalPoints: number;
  onClose: () => void;
  onEbookClick: () => void;
}

export default function BadgeCompletionModal({ 
  isVisible, 
  badges, 
  totalPoints, 
  onClose,
  onEbookClick
}: BadgeCompletionModalProps) {
  const [copied, setCopied] = useState(false);

  const badgeDetails = {
    TECH_MASTER: {
      name: 'Mestre da Tecnologia',
      description: 'Você priorizou soluções tecnológicas em suas decisões',
      icon: '🔧',
      message: 'Parabéns! Você demonstrou visão estratégica para tecnologia em eventos.',
      image: badgeTechMaster
    },
    BUDGET_WIZARD: {
      name: 'Mago do Orçamento',
      description: 'Terminou o jogo com excelente controle financeiro',
      icon: '💰',
      message: 'Impressionante! Você tem talento natural para gestão financeira.',
      image: badgeBudgetWizard
    },
    CROWD_PLEASER: {
      name: 'Conquistador de Multidões',
      description: 'Manteve alta audiência durante todo o evento',
      icon: '👥',
      message: 'Fantástico! Você sabe como atrair e manter seu público.',
      image: badgeCrowdPleaser
    },
    SATISFACTION_GURU: {
      name: 'Guru da Satisfação',
      description: 'Priorizou sempre a experiência do cliente',
      icon: '⭐',
      message: 'Excelente! Você entende o que faz um evento memorável.',
      image: badgeSatisfactionGuru
    },
    RISK_TAKER: {
      name: 'Tomador de Riscos',
      description: 'Ousou em momentos decisivos e deu certo',
      icon: '🎲',
      message: 'Corajoso! Você tem o perfil empreendedor ideal.',
      image: badgeRiskTaker
    },
    STRATEGIC_MIND: {
      name: 'Mente Estratégica',
      description: 'Demonstrou pensamento estratégico excepcional',
      icon: '🧠',
      message: 'Brilhante! Você tem potencial para grandes eventos.',
      image: badgeStrategicMind
    },
    CRISIS_MANAGER: {
      name: 'Gestor de Crises',
      description: 'Transformou problemas em oportunidades',
      icon: '🚨',
      message: 'Impressionante! Você tem sangue frio para situações difíceis.',
      image: badgeCrisisManager
    },
    DIGITAL_NATIVE: {
      name: 'Nativo Digital',
      description: 'Abraçou soluções digitais modernas',
      icon: '📱',
      message: 'Perfeito! Você entende o futuro dos eventos.',
      image: badgeDigitalNative
    }
  };

  const shareText = `🎉 Acabei de completar o desafio do Produtor de Eventos!

${badges.length > 0 ? `Conquistei ${badges.length} badge${badges.length > 1 ? 's' : ''}:
${badges.map(badge => `${badgeDetails[badge as keyof typeof badgeDetails]?.icon} ${badgeDetails[badge as keyof typeof badgeDetails]?.name}`).join('\n')}

` : ''}💯 Pontuação final: ${totalPoints}

Você também produz eventos? Teste suas habilidades: [LINK_DO_JOGO]

#EventosDigitais #ProducaoEventos #Gamificacao`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Desafio do Produtor de Eventos',
          text: shareText,
        });
      } catch (error) {
        console.log('Erro ao compartilhar:', error);
      }
    } else {
      // Fallback para desktop
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog open={isVisible} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-foreground">
            🎉 Parabéns!
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Badge principal */}
          {badges.length > 0 && (
            <div className="text-center">
              <div className="mb-4">
                <img 
                  src={badgeDetails[badges[0] as keyof typeof badgeDetails]?.image} 
                  alt={badgeDetails[badges[0] as keyof typeof badgeDetails]?.name}
                  className="w-32 h-32 mx-auto object-contain"
                />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                {badgeDetails[badges[0] as keyof typeof badgeDetails]?.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {badgeDetails[badges[0] as keyof typeof badgeDetails]?.message}
              </p>
              <div className="text-center">
                <p className="text-lg font-semibold text-primary mb-2">
                  {totalPoints} pontos
                </p>
                <p className="text-sm text-muted-foreground">
                  Você consegue fazer um evento melhor?
                </p>
              </div>
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-2">
            <Button
              onClick={handleShare}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {copied ? (
                <Check className="w-4 h-4 mr-2" />
              ) : (
                <Share2 className="w-4 h-4 mr-2" />
              )}
              {copied ? 'Copiado!' : 'Compartilhar'}
            </Button>
            
            <Button
              onClick={onEbookClick}
              variant="outline"
              className="flex-1"
            >
              Receber ebook
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}