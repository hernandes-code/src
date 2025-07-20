import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Download, Star, Users, Phone, AtSign, Calendar } from 'lucide-react';
import type { LeadData } from '../types/game';
import logo from '../assets/logo.png';

interface LeadFormProps {
  onSubmit: (data: LeadData) => void;
  isVisible: boolean;
  finalScore: number;
}

export default function LeadForm({ onSubmit, isVisible, finalScore }: LeadFormProps) {
  const [formData, setFormData] = useState<LeadData>({
    name: '',
    whatsapp: '',
    instagram: '',
    eventType: '',
    mainChallenge: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isVisible) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSubmit(formData);
    setIsSubmitting(false);
  };

  const handleInputChange = (field: keyof LeadData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = formData.name && formData.whatsapp && formData.instagram && formData.eventType && formData.mainChallenge;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-card rounded-2xl shadow-glow border border-border/20 p-6 max-w-md w-full animate-bounce-in max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mb-4">
            {/* Logo removido para evitar erro de asset ausente */}
            <Star className="w-12 h-12 text-warning mx-auto animate-pulse-glow" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Parabéns pelo Desempenho!
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Sua pontuação: <span className="font-bold text-primary">{finalScore}/400</span>
          </p>
          <p className="text-xs text-muted-foreground">
            🎁 Receba nosso E-book GRATUITO: "Guia Completo de Bilheteria Digital para Eventos" + acesso a nossa comunidade exclusiva de produtores!
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-foreground">
              <Users className="w-4 h-4 inline mr-2" />
              Nome completo
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Seu nome completo"
              className="bg-secondary/30 border-border/30"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp" className="text-sm font-medium text-foreground">
              <Phone className="w-4 h-4 inline mr-2" />
              WhatsApp
            </Label>
            <Input
              id="whatsapp"
              type="tel"
              value={formData.whatsapp}
              onChange={(e) => handleInputChange('whatsapp', e.target.value)}
              placeholder="(11) 99999-9999"
              className="bg-secondary/30 border-border/30"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instagram" className="text-sm font-medium text-foreground">
              <AtSign className="w-4 h-4 inline mr-2" />
              Instagram do evento
            </Label>
            <Input
              id="instagram"
              type="text"
              value={formData.instagram}
              onChange={(e) => handleInputChange('instagram', e.target.value)}
              placeholder="@seueventoaqui"
              className="bg-secondary/30 border-border/30"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="eventType" className="text-sm font-medium text-foreground">
              <Calendar className="w-4 h-4 inline mr-2" />
              Tipo de evento que produz
            </Label>
            <Select value={formData.eventType} onValueChange={(value) => handleInputChange('eventType', value)}>
              <SelectTrigger className="bg-secondary/30 border-border/30">
                <SelectValue placeholder="Selecione o tipo de evento" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border/30">
                <SelectItem value="show">Shows/Concertos</SelectItem>
                <SelectItem value="festa">Festas</SelectItem>
                <SelectItem value="festival">Festivais</SelectItem>
                <SelectItem value="bar">Bares</SelectItem>
                <SelectItem value="balada">Baladas</SelectItem>
                <SelectItem value="outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mainChallenge" className="text-sm font-medium text-foreground">
              🎯 Maior desafio atual
            </Label>
            <Select value={formData.mainChallenge} onValueChange={(value) => handleInputChange('mainChallenge', value)}>
              <SelectTrigger className="bg-secondary/30 border-border/30">
                <SelectValue placeholder="Selecione o maior desafio" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border/30">
                <SelectItem value="vendas">Aumentar vendas de ingressos</SelectItem>
                <SelectItem value="marketing">Marketing e divulgação</SelectItem>
                <SelectItem value="tecnologia">Soluções tecnológicas</SelectItem>
                <SelectItem value="organizacao">Organização e gestão</SelectItem>
                <SelectItem value="custos">Controle de custos</SelectItem>
                <SelectItem value="publico">Atrair mais público</SelectItem>
                <SelectItem value="outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4">
            <Button 
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground"
            >
              {isSubmitting ? 'Enviando...' : '🎁 Receber E-book Gratuito'}
            </Button>
          </div>
        </form>

        <div className="mt-4 text-xs text-muted-foreground text-center">
          🔒 Seus dados estão seguros. Enviaremos o e-book imediatamente e dicas exclusivas sobre bilheteria digital
        </div>
      </div>
    </div>
  );
}