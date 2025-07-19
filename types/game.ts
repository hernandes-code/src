export interface GameMetrics {
  budget: number;
  audience: number;
  satisfaction: number;
  technology: number;
}

export interface GameCard {
  id: string;
  title: string;
  description: string;
  leftChoice: {
    text: string;
    effects: Partial<GameMetrics>;
    consequence: string;
    tip?: string;
  };
  rightChoice: {
    text: string;
    effects: Partial<GameMetrics>;
    consequence: string;
    tip?: string;
  };
  icon: string;
  educationalContent?: string;
  points?: { left: number; right: number };
}

export interface GameState {
  currentCard: number;
  metrics: GameMetrics;
  isGameOver: boolean;
  gameOverReason: string;
  completedCards: string[];
  showingConsequence: boolean;
  lastChoice: 'left' | 'right' | null;
  lastConsequence: string;
  totalPoints: number;
  badges: string[];
  randomEventsTriggered: string[];
  choiceHistory: Array<{
    cardId: string;
    choice: 'left' | 'right';
    points: number;
  }>;
}

export interface LeadData {
  name: string;
  whatsapp: string;
  instagram: string;
  eventType: string;
  mainChallenge: string;
}

export type SwipeDirection = 'left' | 'right' | null;

export interface RandomEvent {
  id: string;
  title: string;
  description: string;
  effects: Partial<GameMetrics>;
  message: string;
}

export interface Badge {
  name: string;
  description: string;
  icon: string;
  requirement: string;
}