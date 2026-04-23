import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { INTRO_SLIDES, SPOTLIGHT_STEPS } from '@/data/tutorial';
import { ChevronRight, X, Coins, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface TutorialOverlayProps {
  onComplete: () => void;
  currentScreen: string;
  tutorialStepCompleted?: string | null; // action id that was just completed
  onRequestNavigate?: (screen: string) => void;
}

export function TutorialOverlay({ onComplete, currentScreen, tutorialStepCompleted, onRequestNavigate }: TutorialOverlayProps) {
  const [phase, setPhase] = useState<'intro' | 'spotlight'>('intro');
  const [introIndex, setIntroIndex] = useState(0);
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [showReward, setShowReward] = useState<number | null>(null);
  const [animateIn, setAnimateIn] = useState(true);
  const { language, t } = useLanguage();
  const observerRef = useRef<MutationObserver | null>(null);

  const currentStep = phase === 'spotlight' ? SPOTLIGHT_STEPS[spotlightIndex] : null;

  // Find and track target element
  const updateTargetRect = useCallback(() => {
    if (phase !== 'spotlight' || !currentStep) return;
    const el = document.querySelector(`[data-tutorial-id="${currentStep.targetId}"]`);
    if (el) {
      setTargetRect(el.getBoundingClientRect());
    } else {
      setTargetRect(null);
    }
  }, [phase, currentStep]);

  useEffect(() => {
    updateTargetRect();
    const interval = setInterval(updateTargetRect, 300);
    
    // Also observe DOM changes
    observerRef.current = new MutationObserver(updateTargetRect);
    observerRef.current.observe(document.body, { childList: true, subtree: true });
    
    return () => {
      clearInterval(interval);
      observerRef.current?.disconnect();
    };
  }, [updateTargetRect]);

  // Navigate to correct screen for step
  useEffect(() => {
    if (phase === 'spotlight' && currentStep?.navigateTo && onRequestNavigate) {
      if (currentScreen !== currentStep.navigateTo) {
        onRequestNavigate(currentStep.navigateTo);
      }
    }
  }, [phase, spotlightIndex, currentStep, currentScreen, onRequestNavigate]);

  // Check if required action was completed
  useEffect(() => {
    if (!currentStep || !tutorialStepCompleted) return;
    
    if (tutorialStepCompleted === currentStep.requiredAction) {
      handleAdvanceSpotlight();
    }
  }, [tutorialStepCompleted]);

  // For "click_target" steps, advance when the target element is clicked
  useEffect(() => {
    if (phase !== 'spotlight' || !currentStep) return;
    if (currentStep.requiredAction !== 'click_target') return;
    const el = document.querySelector(`[data-tutorial-id="${currentStep.targetId}"]`);
    if (!el) return;
    const handler = () => handleAdvanceSpotlight();
    el.addEventListener('click', handler, { once: true });
    return () => el.removeEventListener('click', handler);
  }, [phase, spotlightIndex, currentStep, targetRect]);

  const handleAdvanceSpotlight = () => {
    const step = SPOTLIGHT_STEPS[spotlightIndex];
    if (step?.rewardCoins) {
      setShowReward(step.rewardCoins);
      setTimeout(() => {
        setShowReward(null);
        moveToNextSpotlight();
      }, 1500);
    } else {
      moveToNextSpotlight();
    }
  };

  const moveToNextSpotlight = () => {
    setAnimateIn(false);
    setTimeout(() => {
      if (spotlightIndex >= SPOTLIGHT_STEPS.length - 1) {
        onComplete();
      } else {
        setSpotlightIndex(prev => prev + 1);
        setAnimateIn(true);
      }
    }, 200);
  };

  const handleAcknowledge = () => {
    if (currentStep?.requiredAction === 'acknowledge') {
      handleAdvanceSpotlight();
    }
  };

  const handleIntroNext = () => {
    setAnimateIn(false);
    setTimeout(() => {
      if (introIndex >= INTRO_SLIDES.length - 1) {
        setPhase('spotlight');
        setAnimateIn(true);
      } else {
        setIntroIndex(prev => prev + 1);
        setAnimateIn(true);
      }
    }, 200);
  };

  // INTRO PHASE
  if (phase === 'intro') {
    const slide = INTRO_SLIDES[introIndex];
    const title = language === 'it' ? slide.titleIt : slide.titleEn;
    const desc = language === 'it' ? slide.descIt : slide.descEn;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md">
        <div className={`w-full max-w-sm mx-4 transition-all duration-300 ${animateIn ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}>
          {/* Skip button */}
          <div className="flex justify-end mb-3">
            <Button variant="ghost" size="sm" onClick={onComplete} className="text-white/60 hover:text-white hover:bg-white/10">
              <X className="w-4 h-4 mr-1" />
              {t.skip}
            </Button>
          </div>

          <div className="bg-card border-2 border-primary/50 rounded-2xl shadow-2xl overflow-hidden">
            {/* Progress dots */}
            <div className="flex justify-center gap-2 pt-5 pb-2">
              {INTRO_SLIDES.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i === introIndex ? 'bg-primary w-8' : i < introIndex ? 'bg-primary/50 w-4' : 'bg-muted w-4'
                  }`}
                />
              ))}
            </div>

            {/* Content */}
            <div className="px-8 py-6 text-center">
              <div className="text-6xl mb-5 animate-bounce">{slide.icon}</div>
              <h2 className="text-2xl font-bold mb-3">{title}</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
            </div>

            {/* Action */}
            <div className="px-6 pb-6">
              <Button onClick={handleIntroNext} className="w-full h-12 text-base font-bold gap-2" size="lg">
                {introIndex === INTRO_SLIDES.length - 1 ? t.letsGo : t.next}
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // SPOTLIGHT PHASE
  if (!currentStep) return null;

  const title = language === 'it' ? currentStep.titleIt : currentStep.titleEn;
  const desc = language === 'it' ? currentStep.descIt : currentStep.descEn;
  const isAcknowledge = currentStep.requiredAction === 'acknowledge';
  const padding = 8;

  // Calculate tooltip position
  const getTooltipStyle = (): React.CSSProperties => {
    if (!targetRect) {
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }

    const pos = currentStep.tooltipPosition || 'bottom';
    const margin = 16;

    switch (pos) {
      case 'top':
        return {
          bottom: `${window.innerHeight - targetRect.top + margin}px`,
          left: `${Math.max(16, Math.min(targetRect.left + targetRect.width / 2 - 160, window.innerWidth - 336))}px`,
          width: '320px',
        };
      case 'bottom':
        return {
          top: `${targetRect.bottom + margin}px`,
          left: `${Math.max(16, Math.min(targetRect.left + targetRect.width / 2 - 160, window.innerWidth - 336))}px`,
          width: '320px',
        };
      case 'left':
        return {
          top: `${targetRect.top}px`,
          right: `${window.innerWidth - targetRect.left + margin}px`,
          width: '280px',
        };
      case 'right':
        return {
          top: `${targetRect.top}px`,
          left: `${targetRect.right + margin}px`,
          width: '280px',
        };
      default:
        return {
          top: `${targetRect.bottom + margin}px`,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '320px',
        };
    }
  };

  return (
    <>
      {/* Overlay with cutout */}
      <div className="fixed inset-0 z-[100] pointer-events-none">
        <svg className="w-full h-full pointer-events-none">
          <defs>
            <mask id="tutorial-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              {targetRect && (
                <rect
                  x={targetRect.left - padding}
                  y={targetRect.top - padding}
                  width={targetRect.width + padding * 2}
                  height={targetRect.height + padding * 2}
                  rx="12"
                  fill="black"
                />
              )}
            </mask>
          </defs>
          <rect
            x="0" y="0" width="100%" height="100%"
            fill="rgba(0,0,0,0.75)"
            mask="url(#tutorial-mask)"
            className="pointer-events-none"
          />
        </svg>

        {/* Glowing border around target */}
        {targetRect && (
          <div
            className="absolute border-2 border-primary rounded-xl pointer-events-none animate-pulse shadow-[0_0_20px_rgba(var(--primary),0.4)]"
            style={{
              top: targetRect.top - padding,
              left: targetRect.left - padding,
              width: targetRect.width + padding * 2,
              height: targetRect.height + padding * 2,
            }}
          />
        )}

        {/* For acknowledge steps, block clicks everywhere (user must use the Next button) */}
        {isAcknowledge && (
          <div className="absolute inset-0 pointer-events-auto" />
        )}
      </div>

      {/* Tooltip */}
      <div
        className={`fixed z-[101] pointer-events-auto transition-all duration-300 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
        style={getTooltipStyle()}
      >
        <div className="bg-card border-2 border-primary/40 rounded-xl shadow-2xl p-4">
          {/* Step counter */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{currentStep.icon}</span>
              <span className="text-xs text-muted-foreground font-medium">
                {spotlightIndex + 1}/{SPOTLIGHT_STEPS.length}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={onComplete} className="h-6 px-2 text-xs text-muted-foreground">
              <X className="w-3 h-3 mr-1" />
              {t.skip}
            </Button>
          </div>

          <h3 className="font-bold text-base mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">{desc}</p>

          {/* Progress bar */}
          <div className="flex gap-1 mb-3">
            {SPOTLIGHT_STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all ${
                  i < spotlightIndex ? 'bg-primary' : i === spotlightIndex ? 'bg-primary/60' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          {isAcknowledge && (
            <Button onClick={handleAcknowledge} className="w-full gap-2" size="sm">
              <CheckCircle2 className="w-4 h-4" />
              {spotlightIndex === SPOTLIGHT_STEPS.length - 1 ? t.letsGo : t.next}
            </Button>
          )}

          {!isAcknowledge && (
            <p className="text-xs text-primary font-medium text-center animate-pulse">
              👆 {language === 'it' ? 'Completa l\'azione per continuare' : 'Complete the action to continue'}
            </p>
          )}
        </div>
      </div>

      {/* Reward popup */}
      {showReward && (
        <div className="fixed inset-0 z-[102] flex items-center justify-center pointer-events-none">
          <div className="bg-card border-2 border-yellow-500 rounded-2xl shadow-2xl p-6 text-center animate-bounce pointer-events-auto">
            <Coins className="w-10 h-10 text-yellow-500 mx-auto mb-2" />
            <p className="text-lg font-bold text-yellow-600">+{showReward}</p>
            <p className="text-xs text-muted-foreground">{language === 'it' ? 'Bonus Tutorial!' : 'Tutorial Bonus!'}</p>
          </div>
        </div>
      )}

      {/* Debug overlay */}
      <DebugPanel
        open={debugOpen}
        onToggle={() => setDebugOpen(o => !o)}
        phase={phase}
        currentScreen={currentScreen}
        spotlightIndex={spotlightIndex}
        totalSteps={SPOTLIGHT_STEPS.length}
        step={currentStep}
        targetRect={targetRect}
        lastAction={tutorialStepCompleted ?? null}
      />
    </>
  );
}

interface DebugPanelProps {
  open: boolean;
  onToggle: () => void;
  phase: string;
  currentScreen: string;
  spotlightIndex: number;
  totalSteps: number;
  step: SpotlightStep | null;
  targetRect: DOMRect | null;
  lastAction: string | null;
}

function DebugPanel({ open, onToggle, phase, currentScreen, spotlightIndex, totalSteps, step, targetRect, lastAction }: DebugPanelProps) {
  const selector = step ? `[data-tutorial-id="${step.targetId}"]` : '—';
  const elExists = step ? !!document.querySelector(selector) : false;
  const rectStr = targetRect
    ? `x:${Math.round(targetRect.left)} y:${Math.round(targetRect.top)} w:${Math.round(targetRect.width)} h:${Math.round(targetRect.height)}`
    : 'null';

  return (
    <div className="fixed bottom-2 left-2 z-[110] pointer-events-auto font-mono text-[10px]">
      <button
        onClick={onToggle}
        className="bg-black/80 text-green-400 border border-green-500/60 rounded px-2 py-1 mb-1 block"
      >
        {open ? '🐛 hide debug' : '🐛 show debug'}
      </button>
      {open && (
        <div className="bg-black/85 text-green-300 border border-green-500/40 rounded p-2 max-w-[280px] space-y-0.5 leading-tight">
          <div><span className="text-green-500">phase:</span> {phase}</div>
          <div><span className="text-green-500">screen:</span> {currentScreen}</div>
          <div><span className="text-green-500">step:</span> {spotlightIndex + 1}/{totalSteps} {step ? `(${step.id})` : ''}</div>
          <div><span className="text-green-500">selector:</span> {selector}</div>
          <div>
            <span className="text-green-500">element:</span>{' '}
            <span className={elExists ? 'text-green-300' : 'text-red-400'}>
              {elExists ? 'FOUND' : 'NOT FOUND'}
            </span>
          </div>
          <div><span className="text-green-500">rect:</span> {rectStr}</div>
          <div><span className="text-green-500">required:</span> {step?.requiredAction ?? '—'}</div>
          <div><span className="text-green-500">lastAction:</span> {lastAction ?? '—'}</div>
          <div><span className="text-green-500">navigateTo:</span> {step?.navigateTo ?? '—'}</div>
          <div><span className="text-green-500">tooltipPos:</span> {step?.tooltipPosition ?? 'bottom'}</div>
        </div>
      )}
    </div>
  );
}
