import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScreenTransitionProps {
  screenKey: string;
  children: ReactNode;
  /** subtle "camera" pan direction */
  direction?: 'horizontal' | 'depth';
}

/**
 * Wraps screens with a fluid transition (fade + scale + slight slide).
 * Mimics a camera moving through the garage.
 */
export function ScreenTransition({ screenKey, children, direction = 'depth' }: ScreenTransitionProps) {
  const initial =
    direction === 'horizontal'
      ? { opacity: 0, x: 24, scale: 0.99 }
      : { opacity: 0, scale: 0.97, y: 8 };
  const exit =
    direction === 'horizontal'
      ? { opacity: 0, x: -24, scale: 0.99 }
      : { opacity: 0, scale: 1.02, y: -8 };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={screenKey}
        initial={initial}
        animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
        exit={exit}
        transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
        className="h-full w-full"
        style={{ willChange: 'transform, opacity' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
