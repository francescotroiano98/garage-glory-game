import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  try {
    const authHeader = req.headers.get('Authorization') ?? '';
    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) return json({ error: 'Missing auth token' }, 401);

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;

    // Verify caller
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) return json({ error: 'Unauthorized' }, 401);

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

    // Verify admin role
    const { data: roleRow } = await admin
      .from('user_roles')
      .select('role')
      .eq('user_id', userData.user.id)
      .eq('role', 'admin')
      .maybeSingle();
    if (!roleRow) return json({ error: 'Forbidden: admin only' }, 403);

    const body = await req.json().catch(() => ({}));
    const action = body.action as string;

    if (action === 'list') {
      const { data: profiles, error } = await admin
        .from('profiles')
        .select('id, user_id, username, total_profit, total_cars_sold, level, money, created_at, updated_at')
        .order('total_profit', { ascending: false });
      if (error) return json({ error: error.message }, 500);

      // Fetch emails via auth admin (paginated)
      const emails: Record<string, string> = {};
      let page = 1;
      while (true) {
        const { data: usersPage, error: e2 } = await admin.auth.admin.listUsers({ page, perPage: 200 });
        if (e2) break;
        for (const u of usersPage.users) emails[u.id] = u.email ?? '';
        if (usersPage.users.length < 200) break;
        page += 1;
        if (page > 20) break;
      }

      const rows = (profiles ?? []).map((p) => ({ ...p, email: emails[p.user_id] ?? '' }));
      return json({ users: rows });
    }

    if (action === 'update') {
      const { user_id, username, total_profit, total_cars_sold, level, money } = body;
      if (!user_id) return json({ error: 'user_id required' }, 400);
      const patch: Record<string, unknown> = {};
      if (typeof username === 'string') patch.username = username.trim();
      if (typeof total_profit === 'number') patch.total_profit = Math.max(0, Math.floor(total_profit));
      if (typeof total_cars_sold === 'number') patch.total_cars_sold = Math.max(0, Math.floor(total_cars_sold));
      if (typeof level === 'number') patch.level = Math.max(1, Math.min(40, Math.floor(level)));
      if (typeof money === 'number') patch.money = Math.max(0, Math.min(1_000_000_000, Math.floor(money)));
      if (Object.keys(patch).length === 0) return json({ error: 'No fields to update' }, 400);
      const { error } = await admin.from('profiles').update(patch).eq('user_id', user_id);
      if (error) return json({ error: error.message }, 500);
      return json({ ok: true });
    }

    if (action === 'reset') {
      const { user_id } = body;
      if (!user_id) return json({ error: 'user_id required' }, 400);
      const { error } = await admin
        .from('profiles')
        .update({ total_profit: 0, total_cars_sold: 0, level: 1, money: 500 })
        .eq('user_id', user_id);
      if (error) return json({ error: error.message }, 500);
      return json({ ok: true });
    }

    if (action === 'delete') {
      const { user_id } = body;
      if (!user_id) return json({ error: 'user_id required' }, 400);
      if (user_id === userData.user.id) return json({ error: 'Cannot delete yourself' }, 400);
      const { error } = await admin.auth.admin.deleteUser(user_id);
      if (error) return json({ error: error.message }, 500);
      return json({ ok: true });
    }

    return json({ error: 'Unknown action' }, 400);
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});