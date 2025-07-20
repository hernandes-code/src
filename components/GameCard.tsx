import { useState, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
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
  const lastClickTime = useRef(0);

  // Funções de swipe e escolha otimizadas
  const handleChoice = useCallback((choice: 'left' | 'right') => {
    const now = Date.now();
    // Throttle: prevenir cliques muito rápidos (menos de 300ms)
    if (now - lastClickTime.current < 300) return;
    if (isAnimating) return;
    
    lastClickTime.current = now;
    setIsAnimating(true);
    setSwipeDirection(choice);
    setDragOffset(0);
    const selectedChoice = choice === 'left' ? card.leftChoice : card.rightChoice;
    // Reduzir timeout para melhor responsividade
    setTimeout(() => {
      onChoice(choice, selectedChoice.effects, selectedChoice.consequence);
      setSwipeDirection(null);
      setIsAnimating(false);
    }, 200); // Reduzido de 300ms para 200ms
  }, [isAnimating, card.leftChoice, card.rightChoice, onChoice]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (isAnimating) return;
    startX.current = e.touches[0].clientX;
    isDragging.current = true;
  }, [isAnimating]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current || isAnimating) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX.current;
    setDragOffset(diff);
  }, [isAnimating]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging.current || isAnimating) return;
    isDragging.current = false;
    const threshold = 100;
    if (Math.abs(dragOffset) > threshold) {
      const choice = dragOffset > 0 ? 'right' : 'left';
      handleChoice(choice);
    } else {
      setDragOffset(0);
    }
  }, [isAnimating, dragOffset, handleChoice]);

  const getCardStyle = useMemo(() => {
    if (swipeDirection) return {};
    
    const rotation = dragOffset * 0.1;
    const opacity = Math.max(0.7, 1 - Math.abs(dragOffset) * 0.001);
    
    return {
      transform: `translateX(${dragOffset}px) rotate(${rotation}deg)`,
      opacity: opacity
    };
  }, [dragOffset, swipeDirection]);

  // Memoizar variantes de animação para evitar recriação
  const cardVariants = useMemo(() => ({
    initial: { opacity: 0, y: 20, rotateY: -10 },
    animate: { 
      opacity: 1, 
      y: 0, 
      rotateY: 0,
      x: swipeDirection === 'left' ? -1000 : swipeDirection === 'right' ? 1000 : 0,
      rotate: swipeDirection === 'left' ? -30 : swipeDirection === 'right' ? 30 : 0
    },
    transition: { 
      duration: swipeDirection ? 0.2 : 0.4, // Reduzido para mais responsividade
      ease: swipeDirection ? "easeIn" : "easeOut"
    }
  }), [swipeDirection]);

  return (
    <div className={`relative w-full max-w-sm mx-auto min-h-[340px] flex items-center justify-center ${className}`}>
      <motion.div 
        ref={cardRef}
        className="bg-card rounded-2xl shadow-card border border-border/20 p-3 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing select-none w-full"
        style={getCardStyle}
        whileHover={{ scale: 1.02, y: -5 }}
        whileTap={{ scale: 0.98 }}
        variants={cardVariants}
        initial="initial"
        animate="animate"
        transition={cardVariants.transition}
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
        
        {/* Card Header - compacto */}
        <motion.div 
          className="text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }} // Reduzido
        >
          <motion.div 
            className="text-3xl mb-3"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.15, duration: 0.4, type: "spring" }} // Reduzido
          >
            {card.icon}
          </motion.div>
          <motion.h2 
            className="text-lg font-bold text-foreground mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }} // Reduzido
          >
            {card.title}
          </motion.h2>
          <motion.p 
            className="text-sm text-muted-foreground leading-relaxed px-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.3 }} // Reduzido
          >
            {card.description}
          </motion.p>
        </motion.div>

        {/* Choices - compacto */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', marginTop: '6px', marginBottom: '6px' }}>
          {[card.leftChoice, card.rightChoice].map((option, index) => (
            <motion.button
              key={index}
              className={styles.choiceButton}
              style={{ maxWidth: '340px', width: '100%' }}
              onClick={() => handleChoice(index === 0 ? 'left' : 'right')}
              initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + (index * 0.05), duration: 0.3 }} // Reduzido delay e duration
              whileHover={{ 
                scale: 1.02, 
                y: -2,
                boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                transition: { duration: 0.1 } // Hover mais rápido
              }}
              whileTap={{ 
                scale: 0.98,
                transition: { duration: 0.05 } // Tap mais rápido
              }}
            >
              <span className={styles.choiceLabel}>
                {`Opção ${index === 0 ? "A" : "B"}`}
              </span>
              <span className={styles.choiceText}>
                {option.text}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Swipe Hints */}
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground">
          Clique para escolher
        </div>
      </motion.div>
    </div>
  );
}