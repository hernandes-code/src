import { useState, useEffect } from 'react';
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

export default function ReignsGame() {
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
    choiceHistory: []
  });

  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [randomEvent, setRandomEvent] = useState<any>(null);
  const [showRandomEvent, setShowRandomEvent] = useState(false);
  const [showBadgeCompletion, setShowBadgeCompletion] = useState(false);

  // Calculate badges based on performance
  const calculateBadges = (metrics: GameMetricsType, totalPoints: number) => {
    const badges = [];
    
    if (metrics.budget >= 70) badges.push('BUDGET_WIZARD');
    if (metrics.audience >= 75) badges.push('CROWD_PLEASER');
    if (metrics.satisfaction >= 70) badges.push('SATISFACTION_GURU');
    if (metrics.technology >= 65) badges.push('TECH_MASTER');
    if (totalPoints >= 250) badges.push('STRATEGIC_MIND');
    
    // Se não conseguiu nenhuma badge específica, dar uma badge baseada na métrica mais alta
    if (badges.length === 0) {
      const maxMetric = Math.max(metrics.budget, metrics.audience, metrics.satisfaction, metrics.technology);
      if (maxMetric === metrics.budget) badges.push('BUDGET_WIZARD');
      else if (maxMetric === metrics.audience) badges.push('CROWD_PLEASER');
      else if (maxMetric === metrics.satisfaction) badges.push('SATISFACTION_GURU');
      else badges.push('TECH_MASTER');
    }
    
    return badges;
  };

  // Check for game over conditions
  useEffect(() => {
    const { metrics } = gameState;
    
    if (metrics.budget <= 0) {
      setGameState(prev => ({ 
        ...prev, 
        isGameOver: true, 
        gameOverReason: 'Seu orçamento acabou! Sem dinheiro, o evento não pode continuar.' 
      }));
    } else if (metrics.audience <= 0) {
      setGameState(prev => ({ 
        ...prev, 
        isGameOver: true, 
        gameOverReason: 'Ninguém quer ir ao seu evento! Você precisa de mais estratégias de marketing.' 
      }));
    } else if (metrics.satisfaction <= 0) {
      setGameState(prev => ({ 
        ...prev, 
        isGameOver: true, 
        gameOverReason: 'Seu público está insatisfeito! A experiência do evento foi muito ruim.' 
      }));
    } else if (gameState.currentCard >= gameCards.length) {
      // Game completed successfully - calculate badges
      const earnedBadges = calculateBadges(metrics, gameState.totalPoints);
      setGameState(prev => ({ 
        ...prev, 
        isGameOver: true, 
        gameOverReason: 'Você completou todos os desafios! O evento foi um sucesso.',
        badges: earnedBadges
      }));
      // Show badge completion modal instead of game over modal
      setShowBadgeCompletion(true);
    }
  }, [gameState.metrics, gameState.currentCard]);

  const applyMetricsEffects = (effects: Partial<GameMetricsType>) => {
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

  const handleChoice = (choice: 'left' | 'right', effects: Partial<GameMetricsType>, consequence: string) => {
    const currentCardId = gameCards[gameState.currentCard].id;
    const currentCard = gameCards[gameState.currentCard];
    const points = currentCard.points ? currentCard.points[choice] : 15;
    
    setGameState(prev => ({
      ...prev,
      lastChoice: choice,
      lastConsequence: consequence,
      showingConsequence: true,
      completedCards: [...prev.completedCards, currentCardId],
      totalPoints: prev.totalPoints + points,
      choiceHistory: [...prev.choiceHistory, { cardId: currentCardId, choice, points }]
    }));

    applyMetricsEffects(effects);
    
    // Random event chance (20%)
    if (Math.random() < 0.2) {
      const availableEvents = randomEvents.filter(e => !gameState.randomEventsTriggered.includes(e.id));
      if (availableEvents.length > 0) {
        const selectedEvent = availableEvents[Math.floor(Math.random() * availableEvents.length)];
        setRandomEvent(selectedEvent);
        setShowRandomEvent(true);
        setGameState(prev => ({
          ...prev,
          randomEventsTriggered: [...prev.randomEventsTriggered, selectedEvent.id]
        }));
      }
    }
  };

  const handleConsequenceContinue = () => {
    setGameState(prev => ({
      ...prev,
      showingConsequence: false,
      currentCard: prev.currentCard + 1,
      lastChoice: null,
      lastConsequence: ''
    }));
  };

  const handleRestart = () => {
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
      choiceHistory: []
    });
    setShowLeadForm(false);
    setShowSuccess(false);
  };

  const handleContinueToForm = () => {
    setShowLeadForm(true);
  };

  const handleFormSubmit = (data: LeadData) => {
    console.log('Lead data submitted:', data);
    // Here you would typically send the data to your backend
    setShowLeadForm(false);
    setShowSuccess(true);
  };

  const handleBadgeCompletionClose = () => {
    setShowBadgeCompletion(false);
    setShowLeadForm(true);
  };

  const getCurrentCard = () => {
    if (gameState.currentCard >= gameCards.length) return null;
    return gameCards[gameState.currentCard];
  };

  const currentCard = getCurrentCard();
  const totalScore = gameState.metrics.budget + gameState.metrics.audience + gameState.metrics.satisfaction + gameState.metrics.technology;

  return (
    <div className="min-h-screen bg-gradient-warm">
      <div className="max-w-md mx-auto">
        
        {/* Hero Section */}
          <div className="relative h-40 mb-4 overflow-hidden">
          <img 
            src={heroImage} 
            alt="Event Production" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <img 
                src={logo} 
                alt="Logo da empresa" 
                className="w-8 h-8 mr-2"
              />
              <h1 className="text-xl font-bold text-foreground">
                Produtor de Eventos
              </h1>
            </div>
            <p className="text-xs text-muted-foreground">
              Tome decisões inteligentes e veja seu evento crescer!
            </p>
          </div>
        </div>

        <div className="px-4 pb-4 pt-2">

        {/* Game Metrics */}
        <GameMetrics metrics={gameState.metrics} />
        
        {/* Badge System - Hidden during game */}

        {/* Progress Indicator */}
        <div className="mt-3 mb-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>Progresso</span>
            <span>{gameState.currentCard + 1} / {gameCards.length}</span>
          </div>
          <div className="w-full bg-secondary/30 rounded-full h-2">
            <div 
              className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((gameState.currentCard + 1) / gameCards.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Game Card */}
        {currentCard && !gameState.isGameOver && (
          <AnimatePresence mode="wait">
            <motion.div
              key={gameState.currentCard}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              <GameCard 
                card={currentCard} 
                onChoice={handleChoice}
                className="mb-6"
              />
            </motion.div>
          </AnimatePresence>
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
          onComplete={() => setShowOnboarding(false)}
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
          onEbookClick={handleContinueToForm}
        />
        </div>
      </div>
    </div>
  );
}