import { useState } from 'react';
import { soundGenerator } from '../lib/soundGenerator';

export type SoundType = 
  | 'button-click' 
  | 'choice-positive' 
  | 'choice-negative' 
  | 'game-over' 
  | 'success' 
  | 'notification'
  | 'card-flip'
  | 'badge-unlock';

export const useSound = () => {
  const [isMuted, setIsMuted] = useState(false);

  const playSound = async (type: SoundType) => {
    if (isMuted) return;
    
    try {
      switch (type) {
        case 'button-click':
          await soundGenerator.playButtonClick();
          break;
        case 'choice-positive':
          await soundGenerator.playChoicePositive();
          break;
        case 'choice-negative':
          await soundGenerator.playChoiceNegative();
          break;
        case 'game-over':
          await soundGenerator.playGameOver();
          break;
        case 'success':
          await soundGenerator.playSuccess();
          break;
        case 'notification':
          await soundGenerator.playNotification();
          break;
        case 'card-flip':
          await soundGenerator.playCardFlip();
          break;
        case 'badge-unlock':
          await soundGenerator.playBadgeUnlock();
          break;
      }
    } catch (error) {
      console.warn('Could not play sound:', error);
    }
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  return {
    playSound,
    isMuted,
    toggleMute,
  };
};
