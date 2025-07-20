import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import { gameCards, INITIAL_METRICS, randomEvents, GAME_BADGES } from '../data/gameCards';
import type { GameState, GameMetrics as GameMetricsType, LeadData } from '../types/game';
import GameCard from './GameCard';
import GameMetrics from './GameMetrics';
import heroImage from '../assets/hero-events.jpg';
import logo from '../assets/logo.png';
import ConsequenceModal from './ConsequenceModal';
import GameOverModal from './GameOverModal';
import LeadForm from './LeadForm';
import SuccessModal from './SuccessModal';
import OnboardingModal from './OnboardingModal';
import RandomEventModal from './RandomEventModal';
import BadgeSystem from './BadgeSystem';
import BadgeCompletionModal from './BadgeCompletionModal';
import { useSound } from '../hooks/useSound';
import { Volume2, VolumeX } from 'lucide-react';
import MetricChangeEffects from './MetricChangeEffects';

export default function ReignsGame() {
  const { playSound, isMuted, toggleMute } = useSound();
  const gameOverProcessed = useRef(false);
  
  const [gameState, setGameState] = useState<GameState>({
    currentCard: 0,
    metrics: { ...INITIAL_METRICS },
    isGameOver: false,
    gameOverReason: '',
    completedCards: [],
    showingConsequence: false,
    lastChoice: null,
    lastConsequence: '',
    totalPoints: 0,
    badges: [],
    randomEventsTriggered: [],
    choiceHistory: [],
    choiceCategories: {
      strategic: 0,
      organized: 0,
      platform_user: 0,
      data_driven: 0,
      creative: 0,
      relationship_focused: 0,
      inclusive: 0,
      proactive: 0
    }
  });

  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [randomEvent, setRandomEvent] = useState<any>(null);
  const [showRandomEvent, setShowRandomEvent] = useState(false);
  const [showBadgeCompletion, setShowBadgeCompletion] = useState(false);
  const [metricEffects, setMetricEffects] = useState<any[]>([]);
  const [cardKey, setCardKey] = useState(0); // Para forçar re-render da carta
  const [cardVisible, setCardVisible] = useState(true); // Controla visibilidade da carta

  // Calculate badges based on performance and choices
  const calculateBadges = (metrics: GameMetricsType, totalPoints: number, choiceCategories: any) => {
    const badges = [];
    
    // Platform adoption badge
    if (choiceCategories.platform_user >= 1 || choiceCategories.organized >= 3) {
      badges.push('PLATFORM_ADOPTER');
    }
    
    // Strategic thinking badge
    if (choiceCategories.strategic >= 2 || choiceCategories.data_driven >= 2) {
      badges.push('STRATEGIC_MIND');
    }
    
    // Relationship focused badge
    if (choiceCategories.relationship_focused >= 2 || choiceCategories.proactive >= 2) {
      badges.push('RELATIONSHIP_BUILDER');
    }
    
    // Problem solving badge
    if (choiceCategories.creative >= 1 || (metrics.satisfaction >= 70 && choiceCategories.inclusive >= 1)) {
      badges.push('PROBLEM_SOLVER');
    }
    
    // Data analysis badge
    if (choiceCategories.data_driven >= 1 || metrics.technology >= 70) {
      badges.push('DATA_MASTER');
    }
    
    // Technology enthusiast badge
    if (metrics.technology >= 70 || choiceCategories.platform_user >= 1) {
      badges.push('TECH_ENTHUSIAST');
    }
    
    // Budget conscious badge
    if (metrics.budget >= 60) {
      badges.push('BUDGET_CONSCIOUS');
    }
    
    // People person badge
    if (metrics.satisfaction >= 65 || choiceCategories.relationship_focused >= 2) {
      badges.push('PEOPLE_PERSON');
    }
    
    // Garantir que sempre tenha pelo menos uma badge educacional
    if (badges.length === 0) {
      // Dar badge baseada na categoria de escolha mais frequente
      const maxCategory = Object.entries(choiceCategories).reduce((a, b) => 
        choiceCategories[a[0]] > choiceCategories[b[0]] ? a : b
      );
      
      if (maxCategory[0] === 'strategic' || maxCategory[0] === 'organized') {
        badges.push('STRATEGIC_MIND');
      } else if (maxCategory[0] === 'platform_user') {
        badges.push('PLATFORM_ADOPTER');
      } else if (maxCategory[0] === 'data_driven') {
        badges.push('DATA_MASTER');
      } else {
        badges.push('PROBLEM_SOLVER');
      }
    }
    
    return badges;
  };

  // Check for game over conditions
  useEffect(() => {
    const { metrics, isGameOver, currentCard } = gameState;
    
    // Prevent infinite loops by checking if game is already over or processed
    if (isGameOver || gameOverProcessed.current) return;
    
    // Only check for game over after at least 2 cards have been played
    // This prevents immediate game over when stats start at 0
    if (currentCard < 2) return;
    
    if (metrics.budget <= 0) {
      gameOverProcessed.current = true;
      playSound('game-over');
      setGameState(prev => ({ 
        ...prev, 
        isGameOver: true, 
        gameOverReason: 'Seu orçamento acabou! Sem dinheiro, o evento não pode continuar.' 
      }));
    } else if (metrics.audience < 0) {
      gameOverProcessed.current = true;
      playSound('game-over');
      setGameState(prev => ({ 
        ...prev, 
        isGameOver: true, 
        gameOverReason: 'Ninguém quer ir ao seu evento! Você precisa de mais estratégias de marketing.' 
      }));
    } else if (metrics.satisfaction < 0) {
      gameOverProcessed.current = true;
      playSound('game-over');
      setGameState(prev => ({ 
        ...prev, 
        isGameOver: true, 
        gameOverReason: 'Seu público está insatisfeito! A experiência do evento foi muito ruim.' 
      }));
    } else if (currentCard >= gameCards.length) {
      gameOverProcessed.current = true;
      // Game completed successfully - calculate badges
      const earnedBadges = calculateBadges(metrics, gameState.totalPoints, gameState.choiceCategories);
      playSound('success');
      setGameState(prev => ({ 
        ...prev, 
        isGameOver: true, 
        gameOverReason: 'Você completou todos os desafios! O evento foi um sucesso.',
        badges: earnedBadges
      }));
      // Show badge completion modal instead of game over modal
      setShowBadgeCompletion(true);
      setTimeout(() => playSound('badge-unlock'), 500);
    }
  }, [gameState.metrics.budget, gameState.metrics.audience, gameState.metrics.satisfaction, gameState.metrics.technology, gameState.currentCard, gameState.isGameOver, gameState.totalPoints, gameState.choiceCategories, playSound]);

  const applyMetricsEffects = (effects: Partial<GameMetricsType>) => {
    // Create visual effects for metrics changes
    const newEffects: any[] = [];
    Object.entries(effects).forEach(([key, value]) => {
      if (value && value !== 0) {
        newEffects.push({
          id: `${key}-${Date.now()}-${Math.random()}`,
          type: key,
          value: value,
          x: Math.random() * 300 + 50,
          y: Math.random() * 200 + 100,
        });
      }
    });
    
    if (newEffects.length > 0) {
      setMetricEffects(prev => [...prev, ...newEffects]);
    }

    setGameState(prev => ({
      ...prev,
      metrics: {
        budget: Math.max(0, Math.min(100, prev.metrics.budget + (effects.budget || 0))),
        audience: Math.max(0, Math.min(100, prev.metrics.audience + (effects.audience || 0))),
        satisfaction: Math.max(0, Math.min(100, prev.metrics.satisfaction + (effects.satisfaction || 0))),
        technology: Math.max(0, Math.min(100, prev.metrics.technology + (effects.technology || 0)))
      }
    }));
  };

  const handleEffectComplete = (id: string) => {
    setMetricEffects(prev => prev.filter(effect => effect.id !== id));
  };

  const handleChoice = useCallback((choice: 'left' | 'right', effects: Partial<GameMetricsType>, consequence: string) => {
    const currentCardId = gameCards[gameState.currentCard].id;
    const currentCard = gameCards[gameState.currentCard];
    const points = currentCard.points ? currentCard.points[choice] : 15;
    const chosenOption = choice === 'left' ? currentCard.leftChoice : currentCard.rightChoice;
    const category = chosenOption.category || 'general';
    
    // Esconder a carta imediatamente para evitar animação dupla
    setCardVisible(false);
    
    // Play sound based on choice effects
    const totalEffect = (effects.budget || 0) + (effects.audience || 0) + (effects.satisfaction || 0) + (effects.technology || 0);
    if (totalEffect > 0) {
      playSound('choice-positive');
    } else if (totalEffect < 0) {
      playSound('choice-negative');
    } else {
      playSound('button-click');
    }
    
    // Aguardar a animação da carta antes de mostrar a consequência
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        lastChoice: choice,
        lastConsequence: consequence,
        showingConsequence: true,
        completedCards: [...prev.completedCards, currentCardId],
        totalPoints: prev.totalPoints + points,
        choiceHistory: [...prev.choiceHistory, { cardId: currentCardId, choice, points, category }],
        choiceCategories: {
          ...prev.choiceCategories,
          [category]: (prev.choiceCategories[category] || 0) + 1
        }
      }));

      applyMetricsEffects(effects);
      
      // Random event chance (20%)
      if (Math.random() < 0.2) {
        const availableEvents = randomEvents.filter(e => !gameState.randomEventsTriggered.includes(e.id));
        if (availableEvents.length > 0) {
          const selectedEvent = availableEvents[Math.floor(Math.random() * availableEvents.length)];
          setRandomEvent(selectedEvent);
          setShowRandomEvent(true);
          setTimeout(() => playSound('notification'), 800);
          setGameState(prev => ({
            ...prev,
            randomEventsTriggered: [...prev.randomEventsTriggered, selectedEvent.id]
          }));
        }
      }
    }, 200); // Tempo da animação da carta
  }, [gameState.currentCard, gameState.randomEventsTriggered, playSound]);

  const handleConsequenceContinue = useCallback(() => {
    playSound('card-flip');
    setGameState(prev => ({
      ...prev,
      showingConsequence: false,
      currentCard: prev.currentCard + 1,
      lastChoice: null,
      lastConsequence: ''
    }));
    
    // Mostrar a nova carta com uma pequena pausa para melhor UX
    setTimeout(() => {
      setCardVisible(true);
      setCardKey(prev => prev + 1); // Força re-render
    }, 100);
  }, [playSound]);

  const handleRestart = useCallback(() => {
    gameOverProcessed.current = false; // Reset the flag
    setCardVisible(true); // Mostrar carta no reinício
    setGameState({
      currentCard: 0,
      metrics: { ...INITIAL_METRICS },
      isGameOver: false,
      gameOverReason: '',
      completedCards: [],
      showingConsequence: false,
      lastChoice: null,
      lastConsequence: '',
      totalPoints: 0,
      badges: [],
      randomEventsTriggered: [],
      choiceHistory: [],
      choiceCategories: {
        strategic: 0,
        organized: 0,
        platform_user: 0,
        data_driven: 0,
        creative: 0,
        relationship_focused: 0,
        inclusive: 0,
        proactive: 0
      }
    });
    setShowLeadForm(false);
    setShowSuccess(false);
    setCardKey(0); // Reset card key
  }, []);

  const handleContinueToForm = useCallback(() => {
    setShowLeadForm(true);
  }, []);

  const handleEbookClick = useCallback(() => {
    setShowBadgeCompletion(false);
    setShowLeadForm(true);
  }, []);

  const handleFormSubmit = useCallback((data: LeadData) => {
    console.log('Lead data submitted:', data);
    // Here you would typically send the data to your backend
    setShowLeadForm(false);
    setShowSuccess(true);
  }, []);

  const handleBadgeCompletionClose = useCallback(() => {
    setShowBadgeCompletion(false);
    setShowLeadForm(true);
  }, []);

  const getCurrentCard = () => {
    if (gameState.currentCard >= gameCards.length) return null;
    return gameCards[gameState.currentCard];
  };

  const currentCard = getCurrentCard();
  const totalScore = gameState.metrics.budget + gameState.metrics.audience + gameState.metrics.satisfaction + gameState.metrics.technology;

  return (
    <div className="min-h-screen bg-gradient-warm">
      <div className="max-w-md mx-auto">
        {/* Sound Toggle Button */}
        <motion.button
          onClick={() => {
            playSound('button-click');
            toggleMute();
          }}
          className="fixed top-4 right-4 z-40 bg-black/20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-black/30 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{ pointerEvents: 'auto' }}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </motion.button>

        {/* Hero Section - otimizado para mobile */}
        <motion.div 
          className="w-full mt-1 mb-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Card hero: imagem de fundo com título e subtítulo sobrepostos */}
          <div className="w-full max-w-md mx-auto h-48 sm:h-56 md:h-64 rounded-xl overflow-hidden relative">
            <img 
              src={heroImage}
              alt="Event Production" 
              className="w-full h-full object-cover"
              style={{ 
                objectPosition: '50% 80%', // Alinhamento centro-inferior
                transform: 'none',
                position: 'static'
              }}
            />
            {/* Overlay para contraste - melhorado */}
                        {/* Overlay reduzido + sombra no topo para texto */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10" />
            {/* Sombra específica no topo para destacar o texto */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/60 via-black/30 to-transparent z-11" />
            {/* Título e subtítulo centralizados e compactos */}
                        {/* Título e subtítulo centralizados */}
            <div className="absolute inset-0 flex flex-col items-center justify-start z-20 px-4 pt-4">
              <div className="flex items-center justify-center mb-1">
                <img 
                  src={logo}
                  alt="Logo da empresa" 
                  className="w-6 h-6 mr-2"
                />
                <h1 className="text-lg font-bold text-white drop-shadow-2xl shadow-black/80" style={{
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8), 1px -1px 2px rgba(0,0,0,0.8), -1px 1px 2px rgba(0,0,0,0.8)'
                }}>
                  Produtor de Eventos
                </h1>
              </div>
              <p className="text-xs text-white mb-2 text-center drop-shadow-xl shadow-black/80" style={{
                textShadow: '1px 1px 2px rgba(0,0,0,0.8), -1px -1px 1px rgba(0,0,0,0.8), 1px -1px 1px rgba(0,0,0,0.8), -1px 1px 1px rgba(0,0,0,0.8)'
              }}>
                Tome decisões inteligentes e veja seu evento crescer!
              </p>
            </div>
            {/* Status: na base da imagem, centralizados com barrinhas */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[95%] max-w-sm z-30 px-2">
              <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-white text-[9px]">
                {/* Orçamento */}
                <div className="flex items-center gap-1 drop-shadow-lg bg-black/20 rounded-md px-1.5 py-1">
                  <span className="text-yellow-400 text-xs flex-shrink-0">💰</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-medium text-[9px] leading-tight">Orçamento</span>
                      <span className="font-bold text-yellow-400 text-[9px] leading-tight">{gameState.metrics.budget}%</span>
                    </div>
                    <div className="w-full bg-black/40 rounded-full h-1 overflow-hidden">
                      <div 
                        className="bg-yellow-400 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${gameState.metrics.budget}%` }}
                      />
                    </div>
                  </div>
                </div>
                {/* Público */}
                <div className="flex items-center gap-1 drop-shadow-lg bg-black/20 rounded-md px-1.5 py-1">
                  <span className="text-orange-400 text-xs flex-shrink-0">👥</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-medium text-[9px] leading-tight">Público</span>
                      <span className="font-bold text-orange-400 text-[9px] leading-tight">{gameState.metrics.audience}%</span>
                    </div>
                    <div className="w-full bg-black/40 rounded-full h-1 overflow-hidden">
                      <div 
                        className="bg-orange-400 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${gameState.metrics.audience}%` }}
                      />
                    </div>
                  </div>
                </div>
                {/* Satisfação */}
                <div className="flex items-center gap-1 drop-shadow-lg bg-black/20 rounded-md px-1.5 py-1">
                  <span className="text-green-400 text-xs flex-shrink-0">😊</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-medium text-[9px] leading-tight">Satisfação</span>
                      <span className="font-bold text-green-400 text-[9px] leading-tight">{gameState.metrics.satisfaction}%</span>
                    </div>
                    <div className="w-full bg-black/40 rounded-full h-1 overflow-hidden">
                      <div 
                        className="bg-green-400 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${gameState.metrics.satisfaction}%` }}
                      />
                    </div>
                  </div>
                </div>
                {/* Tecnologia */}
                <div className="flex items-center gap-1 drop-shadow-lg bg-black/20 rounded-md px-1.5 py-1">
                  <span className="text-blue-400 text-xs flex-shrink-0">💻</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-medium text-[9px] leading-tight">Tecnologia</span>
                      <span className="font-bold text-blue-400 text-[9px] leading-tight">{gameState.metrics.technology}%</span>
                    </div>
                    <div className="w-full bg-black/40 rounded-full h-1 overflow-hidden">
                      <div 
                        className="bg-blue-400 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${gameState.metrics.technology}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Game Metrics removido daqui, agora está sobre a imagem hero */}
        
        {/* Badge System - Hidden during game */}

        {/* Progress Indicator - compacto */}
        <motion.div 
          className="mt-2 mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <div className="flex items-center justify-between text-xs text-gray-700 mb-1">
            <span>Progresso</span>
            <span>{gameState.currentCard + 1} / {gameCards.length}</span>
          </div>
          <div className="w-full bg-orange-100 rounded-full h-1.5 overflow-hidden">
            <motion.div 
              className="bg-orange-400 h-1.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((gameState.currentCard + 1) / gameCards.length) * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Game Card */}
        {currentCard && !gameState.isGameOver && !gameState.showingConsequence && cardVisible && (
          <motion.div
            key={`${gameState.currentCard}-${cardKey}`}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            <GameCard 
              card={currentCard} 
              onChoice={handleChoice}
              className="mb-2"
            />
          </motion.div>
        )}

        {/* Consequence Modal */}
        <ConsequenceModal
          consequence={gameState.lastConsequence}
          choice={gameState.lastChoice || 'left'}
          onContinue={handleConsequenceContinue}
          isVisible={gameState.showingConsequence}
        />

        {/* Game Over Modal */}
        <GameOverModal
          metrics={gameState.metrics}
          reason={gameState.gameOverReason}
          onRestart={handleRestart}
          onContinueToForm={handleContinueToForm}
          isVisible={gameState.isGameOver && !showLeadForm && !showSuccess && !showBadgeCompletion}
        />

        {/* Lead Form */}
        <LeadForm
          onSubmit={handleFormSubmit}
          isVisible={showLeadForm}
          finalScore={totalScore}
        />

        {/* Success Modal */}
        <SuccessModal
          onRestart={handleRestart}
          isVisible={showSuccess}
        />

        {/* Onboarding Modal */}
        <OnboardingModal
          isVisible={showOnboarding}
          onComplete={() => {
            setShowOnboarding(false);
            setCardVisible(true); // Garantir que a primeira carta seja visível
          }}
        />

        {/* Random Event Modal */}
        <RandomEventModal
          event={randomEvent}
          isVisible={showRandomEvent}
          onContinue={() => setShowRandomEvent(false)}
        />

        {/* Badge Completion Modal */}
        <BadgeCompletionModal
          isVisible={showBadgeCompletion}
          badges={gameState.badges}
          totalPoints={gameState.totalPoints}
          onClose={handleBadgeCompletionClose}
          onEbookClick={handleEbookClick}
        />

        {/* Metric Change Effects */}
        <MetricChangeEffects
          changes={metricEffects}
          onComplete={handleEffectComplete}
        />
      </div>
    </div>
  );
}