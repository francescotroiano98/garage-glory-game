import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Crown } from 'lucide-react';

interface LeaderboardEntry {
  username: string;
  total_profit: number;
  total_cars_sold: number;
  level: number;
  user_id: string;
}

export function LeaderboardScreen() {
  const { t, formatMoney } = useLanguage();
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('username, total_profit, total_cars_sold, level, user_id')
      .order('total_profit', { ascending: false })
      .limit(50);
    if (data) setEntries(data);
    setLoading(false);
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="w-5 h-5 text-yellow-500 fill-yellow-500/20" />;
    if (index === 1) return <Medal className="w-5 h-5 text-muted-foreground" />;
    if (index === 2) return <Medal className="w-5 h-5 text-orange-500" />;
    return <span className="w-5 h-5 flex items-center justify-center text-xs font-bold text-muted-foreground">#{index + 1}</span>;
  };

  return (
    <div className="flex flex-col min-h-full pb-20">
      <div className="p-4 border-b-2 border-border bg-gradient-to-b from-secondary/30 to-transparent">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          {t.leaderboard}
        </h1>
      </div>

      <div className="flex-1 p-4 space-y-2">
        {loading ? (
          <div className="text-center text-muted-foreground py-8">{t.loading}...</div>
        ) : entries.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">{t.noPlayersYet}</div>
        ) : (
          entries.map((entry, i) => (
            <Card
              key={entry.user_id}
              className={`border-2 ${entry.user_id === user?.id ? 'border-primary bg-primary/5' : ''}`}
            >
              <CardContent className="p-3 flex items-center gap-3">
                {getRankIcon(i)}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">
                    {entry.username}
                    {entry.user_id === user?.id && <span className="text-primary ml-1">({t.you})</span>}
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
