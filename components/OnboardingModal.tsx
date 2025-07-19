import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Play, BookOpen, Target, Trophy, Users } from 'lucide-react';

interface OnboardingModalProps {
  isVisible: boolean;
  onComplete: () => void;
}

const onboardingSteps = [
  {
    title: 'Bem-vindo ao Simulador de Eventos!',
    description: 'Você é um produtor de eventos que precisa tomar decisões estratégicas para criar eventos de sucesso.',
    icon: <Play className="w-8 h-8" />,
    content: 'Cada escolha que você fizer impactará diretamente no orçamento, audiência, satisfação e tecnologia do seu evento.'
  },
  {
    title: 'Como Funciona o Jogo',
    description: 'Você receberá cartas com cenários reais que produtores enfrentam no dia a dia.',
    icon: <Target className="w-8 h-8" />,
    content: 'Suas decisões não são obviamente certas ou erradas - cada uma tem consequências específicas que você descobrirá.'
  },
  {
    title: 'Sistema de Pontos e Badges',
    description: 'Ganhe pontos com suas escolhas e desbloqueie badges especiais baseados no seu estilo de gestão.',
    icon: <Trophy className="w-8 h-8" />,
    content: 'Existem diferentes caminhos para o sucesso - seja um Mestre da Tecnologia, Mago do Orçamento ou Conquistador de Multidões!'
  },
  {
    title: 'Bilheteria Digital e Marketing',
    description: 'Durante o jogo, você descobrirá como soluções digitais podem transformar seus eventos.',
    icon: <BookOpen className="w-8 h-8" />,
    content: 'Ao final, você receberá um e-book GRATUITO com estratégias avançadas de bilheteria digital e marketing para eventos.'
  },
  {
    title: 'Comunidade Exclusiva',
    description: 'Junte-se a outros produtores de eventos e compartilhe experiências.',
    icon: <Users className="w-8 h-8" />,
    content: 'Tenha acesso a dicas exclusivas, cases de sucesso e networking com profissionais do setor.'
  }
];

export default function OnboardingModal({ isVisible, onComplete }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isVisible) return null;

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const currentStepData = onboardingSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="bg-gradient-card border-border/20 shadow-glow max-w-md w-full p-6 animate-scale-in">
        
        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex space-x-2">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index <= currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            {currentStep + 1} de {onboardingSteps.length}
          </span>
        </div>

        {/* Content */}
        <div className="text-center space-y-4 mb-8">
          <div className="flex justify-center text-primary">
            {currentStepData.icon}
          </div>
          
          <h2 className="text-xl font-bold text-foreground">
            {currentStepData.title}
          </h2>
          
          <p className="text-sm text-muted-foreground">
            {currentStepData.description}
          </p>
          
          <div className="bg-secondary/30 rounded-lg p-4 text-xs text-foreground">
            {currentStepData.content}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </Button>

          <Button
            onClick={handleNext}
            className="flex items-center gap-2 bg-gradient-primary"
          >
            {currentStep === onboardingSteps.length - 1 ? 'Começar Jogo' : 'Próximo'}
            {currentStep !== onboardingSteps.length - 1 && <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>

        {/* Skip Option */}
        <div className="text-center mt-4">
          <button
            onClick={onComplete}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Pular introdução
          </button>
        </div>
      </Card>
    </div>
  );
}