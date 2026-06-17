import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Crown, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LeaderboardEntry {
  username: string;
  total_profit: number;
  total_cars_sold: number;
  level: number;
}

export function LeaderboardScreen() {
  const { t, formatMoney } = useLanguage();
  const { username: myUsername } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadLeaderboard();
    // Auto-refresh every 15s while the screen is mounted so newly synced
    // profits show up without needing to switch tabs.
    const id = setInterval(() => loadLeaderboard(true), 15000);
    return () => clearInterval(id);
  }, []);

  const loadLeaderboard = async (silent = false) => {
    if (!silent) setRefreshing(true);
    const { data } = await supabase.rpc('get_leaderboard');
    if (data) setEntries(data as LeaderboardEntry[]);
    setLoading(false);
    setRefreshing(false);
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="w-5 h-5 text-yellow-500 fill-yellow-500/20" />;
    if (index === 1) return <Medal className="w-5 h-5 text-muted-foreground" />;
    if (index === 2) return <Medal className="w-5 h-5 text-orange-500" />;
    return <span className="w-5 h-5 flex items-center justify-center text-xs font-bold text-muted-foreground">#{index + 1}</span>;
  };

  return (
    <div className="flex flex-col h-[100svh] pb-20">
      <div className="p-4 border-b-2 border-border bg-gradient-to-b from-secondary/30 to-transparent shrink-0 sticky top-0 z-20 bg-background/95 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            {t.leaderboard}
          </h1>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => loadLeaderboard()}
            disabled={refreshing}
            aria-label="Refresh leaderboard"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="h-[calc(100svh-258px)] overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="text-center text-muted-foreground py-8">{t.loading}...</div>
        ) : entries.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">{t.noPlayersYet}</div>
        ) : (
          entries.map((entry, i) => (
            <Card
              key={`${entry.username}-${i}`}
              className={`border-2 ${entry.username === myUsername ? 'border-primary bg-primary/5' : ''}`}
            >
              <CardContent className="p-3 flex items-center gap-3">
                {getRankIcon(i)}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">
                    {entry.username}
                    {entry.username === myUsername && <span className="text-primary ml-1">({t.you})</span>}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Lv.{entry.level} • {entry.total_cars_sold} {t.vehiclesSold}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-primary">{formatMoney(entry.total_profit)}</p>
                  <p className="text-[10px] text-muted-foreground">{t.totalProfit}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
