import { useEffect, useState, ReactNode } from 'react';

// Eagerly collect all image asset URLs bundled with the app.
const imageModules = import.meta.glob(
  '/src/assets/**/*.{png,jpg,jpeg,webp,svg,gif}',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;

const ALL_IMAGE_URLS = Object.values(imageModules);

function preloadImage(url: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = url;
  });
}

interface Props {
  children: ReactNode;
}

export function AssetPreloader({ children }: Props) {
  const [loaded, setLoaded] = useState(0);
  const [ready, setReady] = useState(false);
  const total = ALL_IMAGE_URLS.length;

  useEffect(() => {
    let cancelled = false;
    let done = 0;

    // Safety timeout: never block the game longer than 15s.
    const timeout = setTimeout(() => {
      if (!cancelled) setReady(true);
    }, 15000);

    const concurrency = 12;
    let index = 0;

    const worker = async () => {
      while (index < ALL_IMAGE_URLS.length) {
        const i = index++;
        await preloadImage(ALL_IMAGE_URLS[i]);
        if (cancelled) return;
        done++;
        setLoaded(done);
      }
    };

    const workers = Array.from({ length: concurrency }, worker);
    Promise.all(workers).then(() => {
      if (!cancelled) setReady(true);
    });

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, []);

  if (ready) return <>{children}</>;

  const pct = total === 0 ? 100 : Math.round((loaded / total) * 100);

  return (
    <div className="h-[100svh] w-full flex flex-col items-center justify-center bg-background text-foreground px-8 gap-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Garage Glory</h1>
        <p className="text-sm text-muted-foreground">Loading assets…</p>
      </div>
      <div className="w-full max-w-xs h-3 rounded-full bg-muted overflow-hidden border border-border">
        <div
          className="h-full bg-primary transition-all duration-150 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground tabular-nums">
        {loaded} / {total} ({pct}%)
      </p>
    </div>
  );
}