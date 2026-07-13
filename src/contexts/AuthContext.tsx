import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  username: string | null;
  isAdmin: boolean;
  serverMoney: number | null;
  updateProfile: (data: { total_profit?: number; total_cars_sold?: number; level?: number; money?: number }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [serverMoney, setServerMoney] = useState<number | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        // Defer profile fetch to avoid deadlock
        setTimeout(() => fetchProfile(session.user.id), 0);
        setTimeout(() => fetchIsAdmin(session.user.id), 0);
      } else {
        setUsername(null);
        setIsAdmin(false);
        setServerMoney(null);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
        fetchIsAdmin(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase.from('profiles').select('username, money').eq('user_id', userId).single();
    if (data) {
      setUsername(data.username);
      setServerMoney(typeof data.money === 'number' ? data.money : Number(data.money ?? 500));
    }
  };

  const fetchIsAdmin = async (userId: string) => {
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();
    setIsAdmin(!!data);
  };

  const signUp = async (email: string, password: string, username: string) => {
    const cleanUsername = (username ?? '').trim();
    if (cleanUsername.length < 2 || cleanUsername.length > 24) {
      return { error: 'Username must be between 2 and 24 characters' };
    }
    if (!/^[A-Za-z0-9_\- ]+$/.test(cleanUsername)) {
      return { error: 'Username contains invalid characters' };
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username: cleanUsername } },
    });
    if (error) {
      const msg = /duplicate|unique|23505/i.test(error.message)
        ? 'That username is already taken. Please choose another.'
        : error.message;
      return { error: msg };
    }
    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = async (data: { total_profit?: number; total_cars_sold?: number; level?: number; money?: number }) => {
    if (!user) return;
    // Stats are validated server-side via the sync-profile edge function to prevent
    // client-side tampering of leaderboard rankings.
    const { data: res } = await supabase.functions.invoke('sync-profile', {
      body: {
        total_profit: data.total_profit ?? 0,
        total_cars_sold: data.total_cars_sold ?? 0,
        level: data.level ?? 1,
        money: data.money,
      },
    });
    if (res && typeof res.money === 'number') setServerMoney(res.money);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut, username, isAdmin, serverMoney, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
