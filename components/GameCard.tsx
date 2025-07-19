import { useState, useRef } from 'react';
import { GameCard as GameCardType, SwipeDirection } from '../types/game';
import styles from './GameCard.module.css';

interface GameCardProps {
  card: GameCardType;
  onChoice: (choice: 'left' | 'right', effects: any, consequence: string) => void;
  className?: string;
}

export default function GameCard({ card, onChoice, className = '' }: GameCardProps) {
  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const isDragging = useRef(false);

  // Funções de swipe e escolha
  const handleChoice = (choice: 'left' | 'right') => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSwipeDirection(choice);
    setDragOffset(0);
    const selectedChoice = choice === 'left' ? card.leftChoice : card.rightChoice;
    setTimeout(() => {
      onChoice(choice, selectedChoice.effects, selectedChoice.consequence);
      setSwipeDirection(null);
      setIsAnimating(false);
    }, 300);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isAnimating) return;
    startX.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || isAnimating) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX.current;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging.current || isAnimating) return;
    isDragging.current = false;
    const threshold = 100;
    if (Math.abs(dragOffset) > threshold) {
      const choice = dragOffset > 0 ? 'right' : 'left';
      handleChoice(choice);
    } else {
      setDragOffset(0);
    }
  };

  const getCardStyle = () => {
    if (swipeDirection) return {};
    
    const rotation = dragOffset * 0.1;
    const opacity = Math.max(0.7, 1 - Math.abs(dragOffset) * 0.001);
    
    return {
      transform: `translateX(${dragOffset}px) rotate(${rotation}deg)`,
      opacity: opacity
    };
  };

  return (
    <div 
      className={`
        relative w-full max-w-sm mx-auto min-h-[420px] flex items-center justify-center
        ${swipeDirection === 'left' ? 'animate-swipe-left' : ''}
        ${swipeDirection === 'right' ? 'animate-swipe-right' : ''}
        ${!swipeDirection ? 'animate-card-enter' : ''}
        ${className}
      `}
    >
      <div 
        ref={cardRef}
        className="bg-card rounded-2xl shadow-card border border-border/20 p-4 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing select-none w-full"
        style={getCardStyle()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        
        {/* Drag Hints */}
        {Math.abs(dragOffset) > 20 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`text-6xl ${dragOffset > 0 ? 'text-success' : 'text-destructive'}`}>
              {dragOffset > 0 ? '👉' : '👈'}
            </div>
          </div>
        )}
        
        {/* Card Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">{card.icon}</div>
          <h2 className="text-xl font-bold text-foreground mb-3">{card.title}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed px-4">
            {card.description}
          </p>
        </div>

        {/* Choices */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginTop: '8px', marginBottom: '8px' }}>
          {[card.leftChoice, card.rightChoice].map((option, index) => (
            <button
              key={index}
              className={styles.choiceButton}
              style={{ maxWidth: '340px', width: '100%' }}
              onClick={() => handleChoice(index === 0 ? 'left' : 'right')}
            >
              <span className={styles.choiceLabel}>
                {`Opção ${index === 0 ? "A" : "B"}`}
              </span>
              <span className={styles.choiceText}>
                {option.text}
              </span>
            </button>
          ))}
        </div>

        {/* Swipe Hints */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground">
          👈 Deslize ou clique para escolher 👉
        </div>
      </div>
    </div>
  );
}