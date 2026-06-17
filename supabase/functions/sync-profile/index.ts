// Edge function: validates and updates leaderboard stats server-side.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Reasonable per-call caps (sync runs ~every 5s while playing).
// These prevent a client from injecting absurd jumps in stats.
const MAX_PROFIT_DELTA = 5_000_000;    // max profit increase per sync call
const MAX_CARS_DELTA = 50;             // max cars sold increase per sync call
const MAX_LEVEL_DELTA = 2;             // max level increase per sync call

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return json({ error: "Missing authorization" }, 401);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Validate JWT using anon client
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return json({ error: "Unauthorized" }, 401);
    }
    const userId = userData.user.id;

    const body = await req.json().catch(() => ({}));
    const totalProfit = Number(body.total_profit);
    const totalCarsSold = Number(body.total_cars_sold);
    const level = Number(body.level);

    if (
      !Number.isFinite(totalProfit) || totalProfit < 0 ||
      !Number.isFinite(totalCarsSold) || totalCarsSold < 0 ||
      !Number.isFinite(level) || level < 1
    ) {
      return json({ error: "Invalid stats payload" }, 400);
    }

    // Service-role client to read & update bypassing RLS safely after our own checks.
    const admin = createClient(supabaseUrl, serviceKey);

    const { data: current, error: readErr } = await admin
      .from("profiles")
      .select("total_profit, total_cars_sold, level")
      .eq("user_id", userId)
      .maybeSingle();
    if (readErr) return json({ error: "Profile read failed" }, 500);

    const cur = current ?? { total_profit: 0, total_cars_sold: 0, level: 1 };

    // Stats are monotonic: never allow decreases (prevents resetting low to game the leaderboard later).
    const safeProfit = Math.max(
      Number(cur.total_profit),
      Math.min(totalProfit, Number(cur.total_profit) + MAX_PROFIT_DELTA),
    );
    const safeCars = Math.max(
      Number(cur.total_cars_sold),
      Math.min(totalCarsSold, Number(cur.total_cars_sold) + MAX_CARS_DELTA),
    );
    const safeLevel = Math.max(
      Number(cur.level),
      Math.min(level, Number(cur.level) + MAX_LEVEL_DELTA),
    );

    const { error: updErr } = await admin
      .from("profiles")
      .update({
        total_profit: safeProfit,
        total_cars_sold: safeCars,
        level: safeLevel,
      })
      .eq("user_id", userId);
    if (updErr) return json({ error: "Profile update failed" }, 500);

    return json({
      ok: true,
      total_profit: safeProfit,
      total_cars_sold: safeCars,
      level: safeLevel,
      clamped:
        safeProfit !== totalProfit ||
        safeCars !== totalCarsSold ||
        safeLevel !== level,
    });
  } catch (e) {
    console.error("sync-profile error", e);
    return json({ error: "Internal error" }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}