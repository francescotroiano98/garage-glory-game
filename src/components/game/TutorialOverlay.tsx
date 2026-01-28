import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { TUTORIAL_STEPS } from '@/data/tutorial';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface TutorialOverlayProps {
  onComplete: () => void;
}

export function TutorialOverlay({ onComplete }: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const step = TUTORIAL_STEPS[currentStep];
  const isLast = currentStep === TUTORIAL_STEPS.length - 1;
  const isFirst = currentStep === 0;

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-card border-2 border-primary rounded-2xl shadow-2xl overflow-hidden">
        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 pt-4 pb-2">
          {TUTORIAL_STEPS.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentStep 
                  ? 'bg-primary w-4' 
                  : i < currentStep 
                    ? 'bg-primary/50' 
                    : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="px-6 py-4 text-center">
          <div className="text-5xl mb-4">{step.icon}</div>
          <h2 className="text-xl font-bold mb-2">{step.title}</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between p-4 border-t border-border bg-secondary/30">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrev}
            disabled={isFirst}
            className="gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            className="text-muted-foreground"
          >
            <X className="w-4 h-4 mr-1" />
            Skip
          </Button>

          <Button
            size="sm"
            onClick={handleNext}
            className="gap-1"
          >
            {isLast ? "Let's Go!" : 'Next'}
            {!isLast && <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
