import { useEffect, useRef, useState } from 'react';
import { Sparkles, Star, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CollectibleCard, parseCardId } from '@/data/cards';
import { CAR_IMAGES } from '@/data/cars';
import { MOTO_IMAGES } from '@/data/motorcycles';
import { TRUCK_IMAGES } from '@/data/trucks';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSound } from '@/hooks/useSound';

function getCardImage(category: any, variant: number): string | undefined {
  return (
    CAR_IMAGES[category as keyof typeof CAR_IMAGES]?.[variant - 1] ||
    MOTO_IMAGES[category as keyof typeof MOTO_IMAGES]?.[variant - 1] ||
    TRUCK_IMAGES[category as keyof typeof TRUCK_IMAGES]?.[variant - 1]
  );
}

type Phase = 'swipe' | 'ripping' | 'reveal' | 'summary';

interface Props {
  cards: CollectibleCard[] | null;
  packIcon?: string;
  packImage?: string;
  onClose: () => void;
}

export function PackOpeningAnimation({ cards, packIcon = '📦', packImage, onClose }: Props) {
  const { t } = useLanguage();
  const { playSound } = useSound();
  const [phase, setPhase] = useState<Phase>('swipe');
  const [revealIndex, setRevealIndex] = useState(0);
  const [ripProgress, setRipProgress] = useState(0); // 0-1
  const dragRef = useRef<{ active: boolean; startX: number }>({ active: false, startX: 0 });

  // Reset state whenever a new pack arrives
  useEffect(() => {
    if (!cards) return;
    setPhase('swipe');
    setRevealIndex(0);
    setRipProgress(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards]);

  if (!cards) return null;

  const onPointerDown = (e: React.PointerEvent) => {
    if (phase !== 'swipe') return;
    dragRef.current = { active: true, startX: e.clientX };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.active || phase !== 'swipe') return;
    const dx = Math.max(0, e.clientX - dragRef.current.startX);
    const p = Math.min(1, dx / 220);
    setRipProgress(p);
    if (p >= 1) {
      dragRef.current.active = false;
      setPhase('ripping');
      try { playSound('purchase'); } catch {}
      setTimeout(() => setPhase('reveal'), 600);
    }
  };
  const onPointerUp = () => {
    if (phase !== 'swipe') return;
    dragRef.current.active = false;
    if (ripProgress < 1) setRipProgress(0);
  };

  const advance = () => {
    if (phase !== 'reveal') return;
    if (revealIndex < cards.length - 1) {
      const next = cards[revealIndex + 1];
      if (next.rarity !== 'base') {
        try { playSound('skillUp'); } catch {}
      } else {
        try { playSound('buttonClick'); } catch {}
      }
      setRevealIndex(revealIndex + 1);
    } else {
      setPhase('summary');
    }
  };

  const current = cards[revealIndex];
  const { category, variant } = parseCardId(current.id);
  const image = getCardImage(category, variant);

  const rarityClasses =
    current.rarity === 'gold'
      ? 'border-yellow-400 card-gold'
      : current.rarity === 'reverse'
      ? 'border-blue-400 card-holo'
      : 'border-border';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm select-none"
      onClick={phase === 'reveal' ? advance : undefined}
    >
      {/* Phase 1: swipe to rip */}
      {phase === 'swipe' && (
        <div className="flex flex-col items-center gap-4 px-6">
          <div
            className="relative touch-none cursor-grab active:cursor-grabbing"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            style={{ width: 220, height: 300 }}
          >
            {/* Top half (gets pulled) */}
            <div
              className="absolute inset-x-0 top-0 h-1/2 overflow-hidden"
              style={{
                transform: `translateX(${ripProgress * 180}px) rotate(${ripProgress * 8}deg)`,
                transition: dragRef.current.active ? 'none' : 'transform 200ms ease',
                transformOrigin: 'bottom left',
              }}
            >
              {packImage ? (
                <img src={packImage} alt="" className="w-full h-[300px] object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.5)]" />
              ) : (
                <div className="w-full h-[300px] flex items-center justify-center text-[120px]">{packIcon}</div>
              )}
              {/* Jagged tear edge */}
              <div
                className="absolute bottom-0 left-0 right-0 h-2"
                style={{
                  background:
                    'linear-gradient(45deg, transparent 33%, hsl(var(--background)) 33%, hsl(var(--background)) 66%, transparent 66%), linear-gradient(-45deg, transparent 33%, hsl(var(--background)) 33%, hsl(var(--background)) 66%, transparent 66%)',
                  backgroundSize: '8px 8px',
                  opacity: ripProgress,
                }}
              />
            </div>
            {/* Bottom half (stays) */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 overflow-hidden">
              {packImage ? (
                <img
                  src={packImage}
                  alt=""
                  className="w-full h-[300px] object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.5)]"
                  style={{ transform: 'translateY(-50%)' }}
                />
              ) : (
                <div className="w-full h-[300px] flex items-center justify-center text-[120px]" style={{ transform: 'translateY(-50%)' }}>
                  {packIcon}
                </div>
              )}
            </div>

            {/* Swipe hint arrow */}
            {ripProgress < 0.05 && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-white/90 text-xs flex items-center gap-1 animate-pulse">
                <span>👉</span>
                <span>{t.swipeToOpen}</span>
              </div>
            )}
          </div>
          <p className="text-white/70 text-xs">
            {Math.round(ripProgress * 100)}%
          </p>
        </div>
      )}

      {/* Phase 2: rip + flash */}
      {phase === 'ripping' && (
        <div className="relative">
          {packImage ? (
            <img src={packImage} alt="" className="w-56 anim-pack-rip drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)]" />
          ) : (
            <div className="text-[140px] anim-pack-rip">{packIcon}</div>
          )}
          <div className="absolute inset-0 -m-40 bg-white anim-pack-flash rounded-full blur-2xl" />
        </div>
      )}

      {/* Phase 3: reveal cards one-by-one */}
      {phase === 'reveal' && (
        <div className="flex flex-col items-center gap-4 px-6">
          <div
            key={revealIndex}
            className={`relative w-56 aspect-[3/4] rounded-2xl border-4 overflow-hidden anim-card-flip-in ${rarityClasses}`}
            style={{ background: 'hsl(var(--card))' }}
          >
            {image && (
              <img src={image} alt={current.name} className="w-full h-full object-cover relative z-[1]" />
            )}
            {current.rarity === 'gold' && (
              <Star className="absolute top-2 left-2 w-6 h-6 text-yellow-400 fill-yellow-400 z-[2] drop-shadow" />
            )}
            {current.rarity === 'reverse' && (
              <Sparkles className="absolute top-2 left-2 w-6 h-6 text-blue-300 z-[2] drop-shadow" />
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-2 py-1 z-[2]">
              <p className="text-xs text-white font-bold truncate text-center">{current.name}</p>
              <p className="text-[10px] text-white/70 text-center capitalize">{current.rarity}</p>
            </div>

            {/* Sparkle burst on rare cards */}
            {current.rarity !== 'base' && (
              <>
                <span className="absolute top-1/2 left-1/2 w-32 h-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-300/30 blur-2xl anim-sparkle-burst" />
                <span className="absolute top-1/2 left-1/2 w-20 h-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/50 blur-xl anim-sparkle-burst" style={{ animationDelay: '120ms' }} />
              </>
            )}
          </div>

          <p className="text-white/80 text-xs">
            {revealIndex + 1} / {cards.length} — tap to continue
          </p>
        </div>
      )}

      {/* Phase 4: full grid summary */}
      {phase === 'summary' && (
        <div className="flex flex-col items-center gap-3 p-4 max-w-sm w-full">
          <h2 className="text-white text-lg font-bold flex items-center gap-2">
            <Package className="w-5 h-5" /> {t.packOpened}
          </h2>
          <div className="grid grid-cols-5 gap-2 w-full">
            {cards.map((card, i) => {
              const { category: cc, variant: cv } = parseCardId(card.id);
              const img = getCardImage(cc, cv);
              const cls =
                card.rarity === 'gold'
                  ? 'border-yellow-400'
                  : card.rarity === 'reverse'
                  ? 'border-blue-400'
                  : 'border-border';
              return (
                <div key={i} className={`aspect-[3/4] rounded-md border-2 overflow-hidden bg-card ${cls}`}>
                  {img && <img src={img} alt={card.name} className="w-full h-full object-cover" />}
                </div>
              );
            })}
          </div>
          <Button onClick={onClose} className="mt-2">OK</Button>
        </div>
      )}
    </div>
  );
}