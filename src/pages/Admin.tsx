import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, RefreshCw, Trash2, RotateCcw, Save, Shield, Search } from 'lucide-react';

interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  username: string;
  total_profit: number;
  total_cars_sold: number;
  level: number;
  created_at: string;
}

function AdminInner() {
  const { user, isAdmin, loading } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState('');
  const [edits, setEdits] = useState<Record<string, Partial<AdminUser>>>({});

  const load = async () => {
    setBusy(true);
    const { data, error } = await supabase.functions.invoke('admin-users', { body: { action: 'list' } });
    setBusy(false);
    if (error || data?.error) {
      toast.error(data?.error ?? error?.message ?? 'Failed to load');
      return;
    }
    setUsers(data.users ?? []);
  };

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!user) return <Navigate to="/" replace />;
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-2 border-destructive/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Shield className="w-5 h-5" /> Access denied</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Il tuo account non ha i privilegi di amministratore.</p>
            <Link to="/"><Button variant="outline" className="w-full"><ArrowLeft className="w-4 h-4 mr-2" />Torna al gioco</Button></Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const setField = (uid: string, field: keyof AdminUser, value: string | number) => {
    setEdits((prev) => ({ ...prev, [uid]: { ...prev[uid], [field]: value } }));
  };

  const saveUser = async (u: AdminUser) => {
    const patch = edits[u.user_id];
    if (!patch) return;
    setBusy(true);
    const { data, error } = await supabase.functions.invoke('admin-users', {
      body: { action: 'update', user_id: u.user_id, ...patch },
    });
    setBusy(false);
    if (error || data?.error) {
      toast.error(data?.error ?? error?.message ?? 'Update failed');
      return;
    }
    toast.success('Utente aggiornato');
    setEdits((prev) => { const n = { ...prev }; delete n[u.user_id]; return n; });
    load();
  };

  const resetUser = async (u: AdminUser) => {
    if (!confirm(`Azzerare le statistiche di ${u.username}?`)) return;
    const { data, error } = await supabase.functions.invoke('admin-users', {
      body: { action: 'reset', user_id: u.user_id },
    });
    if (error || data?.error) return toast.error(data?.error ?? 'Reset failed');
    toast.success('Statistiche azzerate');
    load();
  };

  const deleteUser = async (u: AdminUser) => {
    if (!confirm(`ELIMINARE definitivamente l'account ${u.email || u.username}? Questa azione è irreversibile.`)) return;
    const { data, error } = await supabase.functions.invoke('admin-users', {
      body: { action: 'delete', user_id: u.user_id },
    });
    if (error || data?.error) return toast.error(data?.error ?? 'Delete failed');
    toast.success('Utente eliminato');
    load();
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-card/95 backdrop-blur border-b-2 border-border p-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Link to="/"><Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button></Link>
          <h1 className="text-lg font-bold flex items-center gap-2"><Shield className="w-5 h-5 text-primary" /> Admin Panel</h1>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={busy}>
          <RefreshCw className={`w-4 h-4 mr-2 ${busy ? 'animate-spin' : ''}`} />
          Ricarica
        </Button>
      </header>

      <div className="p-4 space-y-4 max-w-4xl mx-auto">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Cerca per username o email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <p className="text-xs text-muted-foreground">Totale utenti: {users.length}</p>

        {filtered.map((u) => {
          const edit = edits[u.user_id] ?? {};
          const dirty = Object.keys(edit).length > 0;
          const currentUsername = (edit.username as string) ?? u.username;
          const currentProfit = (edit.total_profit as number) ?? u.total_profit;
          const currentCars = (edit.total_cars_sold as number) ?? u.total_cars_sold;
          const currentLevel = (edit.level as number) ?? u.level;
          return (
            <Card key={u.user_id} className="border-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex flex-wrap items-center justify-between gap-2">
                  <span>{u.username}</span>
                  <span className="text-xs font-normal text-muted-foreground break-all">{u.email}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <label className="text-xs">
                    Username
                    <Input value={currentUsername} onChange={(e) => setField(u.user_id, 'username', e.target.value)} className="mt-1" />
                  </label>
                  <label className="text-xs">
                    Livello (1-40)
                    <Input type="number" min={1} max={40} value={currentLevel}
                      onChange={(e) => setField(u.user_id, 'level', parseInt(e.target.value) || 1)} className="mt-1" />
                  </label>
                  <label className="text-xs">
                    Profitto totale
                    <Input type="number" min={0} value={currentProfit}
                      onChange={(e) => setField(u.user_id, 'total_profit', parseInt(e.target.value) || 0)} className="mt-1" />
                  </label>
                  <label className="text-xs">
                    Veicoli venduti
                    <Input type="number" min={0} value={currentCars}
                      onChange={(e) => setField(u.user_id, 'total_cars_sold', parseInt(e.target.value) || 0)} className="mt-1" />
                  </label>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button size="sm" onClick={() => saveUser(u)} disabled={!dirty || busy}>
                    <Save className="w-4 h-4 mr-1" /> Salva
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => resetUser(u)} disabled={busy}>
                    <RotateCcw className="w-4 h-4 mr-1" /> Reset stats
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteUser(u)} disabled={busy || u.user_id === user.id}>
                    <Trash2 className="w-4 h-4 mr-1" /> Elimina
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filtered.length === 0 && !busy && (
          <p className="text-center text-muted-foreground py-8">Nessun utente trovato.</p>
        )}
      </div>
    </div>
  );
}

export default function Admin() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AdminInner />
      </AuthProvider>
    </LanguageProvider>
  );
}