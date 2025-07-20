import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Download, Image as ImageIcon } from 'lucide-react';
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
  const [generatingImage, setGeneratingImage] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const badgeDetails = {
    PLATFORM_ADOPTER: {
      name: 'Usuário de Plataforma',
      description: 'Reconheceu o valor de usar plataformas completas',
      icon: '🚀',
      message: 'Você entendeu que plataformas integradas multiplicam resultados!',
      image: badgeStrategicMind
    },
    STRATEGIC_MIND: {
      name: 'Mente Estratégica',
      description: 'Priorizou decisões estratégicas ao invés de soluções improvisadas',
      icon: '🧠',
      message: 'Sua visão estratégica se destacou! Produtores organizados criam eventos mais lucrativos.',
      image: badgeStrategicMind
    },
    DATA_MASTER: {
      name: 'Mestre dos Dados',
      description: 'Valorizou coleta e análise de dados',
      icon: '📊',
      message: 'Dados são o combustível do sucesso! Continue usando analytics para otimizar.',
      image: badgeDigitalNative
    },
    RELATIONSHIP_BUILDER: {
      name: 'Construtor de Relacionamentos',
      description: 'Priorizou relacionamentos duradouros',
      icon: '🤝',
      message: 'Relacionamentos sólidos são a base do sucesso! Ferramentas de CRM ajudam a escalar.',
      image: badgeCrowdPleaser
    },
    PROBLEM_SOLVER: {
      name: 'Solucionador Criativo',
      description: 'Transformou crises em oportunidades',
      icon: '💡',
      message: 'Sua criatividade impressiona! Sistemas de gestão dão mais tempo para focar na criatividade.',
      image: badgeCrisisManager
    },
    TECH_ENTHUSIAST: {
      name: 'Entusiasta Tech',
      description: 'Abraçou soluções tecnológicas',
      icon: '💻',
      message: 'Tecnologia é sua aliada! Continue explorando ferramentas que automatizam processos.',
      image: badgeTechMaster
    },
    BUDGET_CONSCIOUS: {
      name: 'Consciente Financeiro',
      description: 'Manteve equilíbrio financeiro',
      icon: '💰',
      message: 'Controle financeiro é essencial! Plataformas com dashboard financeiro facilitam essa gestão.',
      image: badgeBudgetWizard
    },
    PEOPLE_PERSON: {
      name: 'Pessoa do Povo',
      description: 'Focou na experiência e satisfação do público',
      icon: '👥',
      message: 'Foco no público é fundamental! Ferramentas de feedback automatizado ajudam a manter essa conexão.',
      image: badgeSatisfactionGuru
    }
  };

  const shareText = `🏆 ACABEI DE CONQUISTAR A BADGE ${badges.length > 0 ? badgeDetails[badges[0] as keyof typeof badgeDetails]?.name.toUpperCase() : 'NO DESAFIO DO PRODUTOR DE EVENTOS'}!

🔥 ${totalPoints} PONTOS - Que performance incrível!

💪 Você trabalha com eventos? DUVIDO fazer mais pontos que eu!

🚀 Aceita o desafio? Teste agora: [LINK_DO_JOGO]

#EventosDigitais #ProducaoEventos #Desafio #TopPerformance`;

  const generateBadgeImage = async () => {
    if (!badges.length || !canvasRef.current) return null;
    
    setGeneratingImage(true);
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    // Definir tamanho do canvas para story/post
    canvas.width = 1080;
    canvas.height = 1080;
    
    // Fundo branco sólido
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Gradiente sutil de fundo
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, 'rgba(255, 107, 53, 0.05)');
    gradient.addColorStop(1, 'rgba(247, 147, 30, 0.05)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Container principal com sombra elegante
    const containerY = 100;
    const containerHeight = 880;
    const containerX = 60;
    const containerWidth = canvas.width - 120;
    const radius = 30;
    
    // Sombra do container
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 10;
    
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(containerX + radius, containerY);
    ctx.lineTo(containerX + containerWidth - radius, containerY);
    ctx.quadraticCurveTo(containerX + containerWidth, containerY, containerX + containerWidth, containerY + radius);
    ctx.lineTo(containerX + containerWidth, containerY + containerHeight - radius);
    ctx.quadraticCurveTo(containerX + containerWidth, containerY + containerHeight, containerX + containerWidth - radius, containerY + containerHeight);
    ctx.lineTo(containerX + radius, containerY + containerHeight);
    ctx.quadraticCurveTo(containerX, containerY + containerHeight, containerX, containerY + containerHeight - radius);
    ctx.lineTo(containerX, containerY + radius);
    ctx.quadraticCurveTo(containerX, containerY, containerX + radius, containerY);
    ctx.closePath();
    ctx.fill();
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    
    const badgeImg = new Image();
    const mainBadge = badgeDetails[badges[0] as keyof typeof badgeDetails];
    
    return new Promise<string>((resolve) => {
      badgeImg.onload = () => {
        // Header "PARABÉNS!"
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 72px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🎉 PARABÉNS! 🎉', canvas.width / 2, containerY + 100);
        
        // Badge image - maior e centralizada
        const imgSize = 380;
        const imgX = (canvas.width - imgSize) / 2;
        const imgY = containerY + 150;
        
        // Fundo branco para a badge caso tenha transparência
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(imgX + imgSize/2, imgY + imgSize/2, imgSize/2 + 10, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.drawImage(badgeImg, imgX, imgY, imgSize, imgSize);
        
        // Badge name com destaque
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 56px Arial';
        ctx.fillText(mainBadge?.name || '', canvas.width / 2, imgY + imgSize + 80);
        
        // Texto elogioso personalizado
        const compliments = [
          'Você tem talento excepcional!',
          'Sua visão estratégica impressiona!',
          'Parabéns pelo resultado incrível!',
          'Você domina a arte dos eventos!',
          'Que performance fantástica!'
        ];
        const randomCompliment = compliments[Math.floor(Math.random() * compliments.length)];
        
        ctx.font = 'bold 38px Arial';
        ctx.fillStyle = '#ea580c';
        ctx.fillText(randomCompliment, canvas.width / 2, imgY + imgSize + 140);
        
        // Points com destaque
        ctx.font = 'bold 48px Arial';
        ctx.fillStyle = '#1f2937';
        ctx.fillText(`${totalPoints} PONTOS`, canvas.width / 2, imgY + imgSize + 200);
        
        // Separador elegante
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2 - 150, imgY + imgSize + 230);
        ctx.lineTo(canvas.width / 2 + 150, imgY + imgSize + 230);
        ctx.stroke();
        
        // Challenge text mais impactante
        ctx.font = 'bold 44px Arial';
        ctx.fillStyle = '#7c3aed';
        ctx.fillText('Você trabalha com eventos?', canvas.width / 2, imgY + imgSize + 280);
        
        ctx.font = 'bold 48px Arial';
        ctx.fillStyle = '#dc2626';
        ctx.fillText('DUVIDO FAZER MAIS PONTOS!', canvas.width / 2, imgY + imgSize + 340);
        
        // Call to action
        ctx.font = '32px Arial';
        ctx.fillStyle = '#6b7280';
        ctx.fillText('Aceita o desafio? Teste agora!', canvas.width / 2, imgY + imgSize + 390);
        
        // Footer elegante
        ctx.font = 'bold 28px Arial';
        ctx.fillStyle = '#1f2937';
        ctx.fillText('Desafio do Produtor de Eventos', canvas.width / 2, imgY + imgSize + 450);
        
        setGeneratingImage(false);
        resolve(canvas.toDataURL('image/png'));
      };
      
      badgeImg.onerror = () => {
        console.error('Erro ao carregar imagem da badge');
        setGeneratingImage(false);
        resolve('');
      };
      
      badgeImg.src = mainBadge?.image || '';
    });
  };

  const handleShareImage = async () => {
    try {
      const imageDataUrl = await generateBadgeImage();
      if (!imageDataUrl) return;
      
      // Convert data URL to blob
      const response = await fetch(imageDataUrl);
      const blob = await response.blob();
      
      if (navigator.share && navigator.canShare({ files: [new File([blob], 'badge.png', { type: 'image/png' })] })) {
        await navigator.share({
          title: 'Minha Badge do Desafio do Produtor de Eventos',
          text: shareText,
          files: [new File([blob], 'badge.png', { type: 'image/png' })]
        });
      } else {
        // Fallback: download da imagem
        const link = document.createElement('a');
        link.download = 'minha-badge-eventos.png';
        link.href = imageDataUrl;
        link.click();
      }
    } catch (error) {
      console.log('Erro ao compartilhar imagem:', error);
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

          {/* Mensagem educacional para o eBook */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
            <h4 className="font-semibold text-orange-800 mb-2">
              🚀 Quer multiplicar seus resultados?
            </h4>
            <p className="text-sm text-orange-700 mb-3">
              Durante o jogo, você viu como <strong>organização, ferramentas de bilheteria e marketing integrado</strong> fazem a diferença. 
              Nosso eBook ensina como implementar essas estratégias na prática!
            </p>
            <p className="text-xs text-orange-600">
              ✓ Checklists de produção  ✓ Ferramentas recomendadas  ✓ Casos de sucesso
            </p>
          </div>

          {/* Botões */}
          <div className="flex gap-3">
            <Button
              onClick={handleShareImage}
              disabled={generatingImage}
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
            >
              {generatingImage ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Compartilhar Badge
                </>
              )}
            </Button>
            
            <Button
              onClick={onEbookClick}
              variant="outline"
              className="flex-1 border-orange-300 text-orange-600 hover:bg-orange-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar eBook Grátis
            </Button>
          </div>
          
          {/* Canvas hidden para gerar a imagem */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
      </DialogContent>
    </Dialog>
  );
}