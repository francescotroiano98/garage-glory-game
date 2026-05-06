import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface ConfettiBurstProps {
  /** number of particles */
  count?: number;
  /** duration in seconds */
  duration?: number;
  /** stop rendering after burst — parent should toggle */
  onDone?: () => void;
}

const COLORS = [
  'hsl(var(--shop-orange))',
  'hsl(var(--shop-yellow))',
  'hsl(var(--shop-blue))',
  'hsl(var(--success-glow))',
  'hsl(var(--primary))',
];

/**
 * Lightweight DOM-only confetti burst, fixed-position centered.
 * Used on car sale completion. No external deps.
 */
export function ConfettiBurst({ count = 28, duration = 1.4, onDone }: ConfettiBurstProps) {
  const pieces = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
      const dist = 120 + Math.random() * 160;
      return {
        id: i,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist - 40,
        rot: (Math.random() - 0.5) * 540,
        color: COLORS[i % COLORS.length],
        size: 6 + Math.random() * 6,
        delay: Math.random() * 0.08,
      };
    });
  }, [count]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[200] flex items-center justify-center overflow-hidden"
      aria-hidden
    >
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
          animate={{ x: p.x, y: p.y, opacity: 0, rotate: p.rot, scale: 0.6 }}
          transition={{ duration, delay: p.delay, ease: [0.15, 0.85, 0.25, 1] }}
          onAnimationComplete={p.id === 0 ? onDone : undefined}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size * 0.4,
            background: p.color,
            borderRadius: 2,
            boxShadow: '0 1px 2px rgba(0,0,0,0.25)',
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </div>
  );
}
