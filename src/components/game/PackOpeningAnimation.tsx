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
  const dragRef = useRef<{ active: boolean; startX: number; lastTickAt: number }>({
    active: false, startX: 0, lastTickAt: 0,
  });

  // Tear sits in the upper third of the pack so the player rips off a thinner top strip
  // (more realistic, and the shiny swipe indicator stays in a comfortable thumb zone).
  const TEAR_TOP_PCT = 28; // % of container height where the tear runs
  const TEAR_AMPLITUDE = 5; // tooth height in %
  // Pre-computed jagged tear path used as clip-path on the top strip.
  const tearClipPath = useRef<string>('');
  const tearClipPathBottom = useRef<string>('');
  if (!tearClipPath.current) {
    const teeth = 22;
    const top: string[] = ['0% 0%', '100% 0%'];
    const bot: string[] = [];
    for (let i = teeth; i >= 0; i--) {
      const x = (i / teeth) * 100;
      const y = TEAR_TOP_PCT - (i % 2 === 0 ? 0 : TEAR_AMPLITUDE - Math.random() * 2);
      top.push(`${x.toFixed(2)}% ${y.toFixed(2)}%`);
    }
    for (let i = 0; i <= teeth; i++) {
      const x = (i / teeth) * 100;
      const y = TEAR_TOP_PCT - (i % 2 === 0 ? 0 : TEAR_AMPLITUDE - Math.random() * 2);
      bot.push(`${x.toFixed(2)}% ${y.toFixed(2)}%`);
    }
    tearClipPath.current = `polygon(${top.join(', ')})`;
    tearClipPathBottom.current = `polygon(${bot.join(', ')}, 100% 100%, 0% 100%)`;
  }
  // Shorter swipe so it stays well within the thumb zone on mobile.
  const SWIPE_DISTANCE = 130;

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
    dragRef.current = { active: true, startX: e.clientX, lastTickAt: 0 };
    (e.target as Element).setPointerCapture?.(e.pointerId);
    try { playSound('paperRip'); } catch {}
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.active || phase !== 'swipe') return;
    const dx = Math.max(0, e.clientX - dragRef.current.startX);
    const p = Math.min(1, dx / SWIPE_DISTANCE);
    setRipProgress(p);
    // Re-trigger short rip crackles at progress checkpoints
    const tick = Math.floor(p * 4);
    if (tick > dragRef.current.lastTickAt) {
      dragRef.current.lastTickAt = tick;
      try { playSound('paperRip'); } catch {}
    }
    if (p >= 1) {
      dragRef.current.active = false;
      setPhase('ripping');
      try { playSound('paperRip'); } catch {}
      setTimeout(() => { try { playSound('purchase'); } catch {} }, 200);
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
            {/* Top half (gets pulled away with a torn zig-zag edge) */}
            <div
              className="absolute inset-x-0 top-0"
              style={{
                height: '100%',
                transform: `translate(${ripProgress * 220}px, ${ripProgress * -30}px) rotate(${ripProgress * 14}deg)`,
                transition: dragRef.current.active ? 'none' : 'transform 200ms ease',
                transformOrigin: 'bottom left',
                clipPath: tearClipPath.current,
                WebkitClipPath: tearClipPath.current,
                filter: ripProgress > 0 ? 'drop-shadow(0 6px 8px rgba(0,0,0,0.45))' : undefined,
              }}
            >
              {packImage ? (
                <img src={packImage} alt="" className="w-full h-[300px] object-contain" />
              ) : (
                <div className="w-full h-[300px] flex items-center justify-center text-[120px]">{packIcon}</div>
              )}
            </div>

            {/* Bottom (stays) — clipped with the inverse tear */}
            <div
              className="absolute inset-0"
              style={{
                clipPath: tearClipPathBottom.current,
                WebkitClipPath: tearClipPathBottom.current,
              }}
            >
              {packImage ? (
                <img src={packImage} alt="" className="w-full h-[300px] object-contain" />
              ) : (
                <div className="w-full h-[300px] flex items-center justify-center text-[120px]">
                  {packIcon}
                </div>
              )}
            </div>

            {/* Shiny swipe indicator line — sits exactly along the tear */}
            <div
              className="absolute pointer-events-none overflow-hidden"
              style={{
                top: `calc(${TEAR_TOP_PCT}% - 6px)`,
                left: '18%',
                right: '18%',
                height: 12,
                opacity: 1 - ripProgress * 0.8,
              }}
            >
              {/* base bright bar */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,240,180,0.95) 20%, rgba(255,255,255,1) 50%, rgba(255,240,180,0.95) 80%, rgba(255,255,255,0) 100%)',
                  boxShadow: '0 0 12px rgba(255,240,180,0.9), 0 0 24px rgba(255,200,80,0.5)',
                  filter: 'blur(0.5px)',
                }}
              />
              {/* moving sheen */}
              <div
                className="absolute inset-y-0 w-1/3 anim-sheen-slide"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.95), rgba(255,255,255,0))',
                  mixBlendMode: 'screen',
                }}
              />
            </div>

            {/* Warm light leak that grows as the tear opens */}
            {ripProgress > 0.05 && (
              <div
                className="absolute pointer-events-none"
                style={{
                  top: `calc(${TEAR_TOP_PCT}% - 8px)`,
                  left: '18%',
                  right: '18%',
                  height: 20,
                  background:
                    'radial-gradient(ellipse at center, rgba(255,240,180,0.95), rgba(255,240,180,0) 70%)',
                  opacity: Math.min(1, ripProgress * 1.4),
                  filter: 'blur(4px)',
                }}
              />
            )}

            {/* Tiny paper shred particles flying off */}
            {ripProgress > 0.15 && (
              <>
                {[...Array(6)].map((_, i) => (
                  <span
                    key={i}
                    className="absolute block bg-card/90 rounded-sm"
                    style={{
                      top: `${TEAR_TOP_PCT - 2}%`,
                      left: `${20 + i * 12}%`,
                      width: 4 + (i % 3),
                      height: 6,
                      transform: `translate(${ripProgress * (40 + i * 8)}px, ${ripProgress * (-20 - i * 4)}px) rotate(${ripProgress * (60 + i * 30)}deg)`,
                      opacity: ripProgress,
                      transition: dragRef.current.active ? 'none' : 'transform 200ms ease, opacity 200ms ease',
                    }}
                  />
                ))}
              </>
            )}

            {/* Swipe hint arrow — anchored just above the shiny line */}
            {ripProgress < 0.05 && (
              <div
                className="absolute left-1/2 -translate-x-1/2 text-white/90 text-xs flex items-center gap-1 animate-pulse whitespace-nowrap"
                style={{ top: `calc(${TEAR_TOP_PCT}% - 32px)` }}
              >
                <span>{t.swipeToOpen}</span>
                <span>👉</span>
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