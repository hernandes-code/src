import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface MetricChangeEffect {
  id: string;
  type: 'budget' | 'audience' | 'satisfaction' | 'technology';
  value: number;
  x: number;
  y: number;
}

interface MetricChangeEffectsProps {
  changes: MetricChangeEffect[];
  onComplete: (id: string) => void;
}

const getEffectColor = (type: MetricChangeEffect['type']) => {
  switch (type) {
    case 'budget': return 'text-yellow-400';
    case 'audience': return 'text-orange-400';
    case 'satisfaction': return 'text-green-400';
    case 'technology': return 'text-blue-400';
    default: return 'text-white';
  }
};

const getEffectIcon = (type: MetricChangeEffect['type']) => {
  switch (type) {
    case 'budget': return '💰';
    case 'audience': return '👥';
    case 'satisfaction': return '😊';
    case 'technology': return '💻';
    default: return '✨';
  }
};

export default function MetricChangeEffects({ changes, onComplete }: MetricChangeEffectsProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {changes.map((change) => (
          <motion.div
            key={change.id}
            className={`absolute flex items-center gap-1 font-bold text-sm ${getEffectColor(change.type)} drop-shadow-lg`}
            style={{ left: change.x, top: change.y }}
            initial={{ opacity: 0, scale: 0.5, y: 0 }}
            animate={{ 
              opacity: [0, 1, 1, 0], 
              scale: [0.5, 1.2, 1, 0.8], 
              y: [-20, -40, -60, -80] 
            }}
            transition={{ 
              duration: 2, 
              ease: "easeOut",
              times: [0, 0.2, 0.8, 1]
            }}
            onAnimationComplete={() => onComplete(change.id)}
          >
            <span className="text-base">{getEffectIcon(change.type)}</span>
            <span>{change.value > 0 ? '+' : ''}{change.value}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
