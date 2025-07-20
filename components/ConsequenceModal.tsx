import { Button } from './ui/button';
import { CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConsequenceModalProps {
  consequence: string;
  choice: 'left' | 'right';
  onContinue: () => void;
  isVisible: boolean;
}

export default function ConsequenceModal({ 
  consequence, 
  choice, 
  onContinue, 
  isVisible 
}: ConsequenceModalProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div 
            className="bg-gradient-card rounded-2xl shadow-glow border border-border/20 p-6 max-w-sm w-full"
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
        <div className="text-center mb-4">
          <div className="mb-3">
            <motion.div 
              className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
            >
              <motion.span 
                className="text-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                📊
              </motion.span>
            </motion.div>
          </div>
          <motion.h3 
            className="text-lg font-bold text-foreground mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Consequência
          </motion.h3>
          <motion.p 
            className="text-sm text-muted-foreground leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {consequence}
          </motion.p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button 
            onClick={onContinue}
            className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground"
          >
            Continuar
          </Button>
        </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}