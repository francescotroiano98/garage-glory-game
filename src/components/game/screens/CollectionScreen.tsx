import { Album, Lock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function CollectionScreen() {
  const { t } = useLanguage();

  return (
    <div className="h-full flex flex-col">
      <div className="shrink-0 p-4 pb-2">
        <div className="flex items-center gap-2">
          <Album className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-bold">{t.collection}</h1>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{t.collectionDesc}</p>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-20">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Lock className="w-10 h-10 text-primary/50" />
          </div>
          <h2 className="text-xl font-bold mb-2">{t.comingSoon}</h2>
          <p className="text-sm text-muted-foreground max-w-[250px]">
            {t.collectionDesc}
          </p>
        </div>
      </div>
    </div>
  );
}
