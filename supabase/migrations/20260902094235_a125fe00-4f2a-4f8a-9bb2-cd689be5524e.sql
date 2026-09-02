-- Remove broad anonymous access to the full profiles table (exposed money).
-- The leaderboard is served by the get_leaderboard() RPC, so no anon table access is needed.
DROP POLICY IF EXISTS "Allow anon to view leaderboard profiles" ON public.profiles;

-- Ensure the leaderboard RPC is callable by everyone (anon + logged in) but only returns leaderboard columns.
GRANT EXECUTE ON FUNCTION public.get_leaderboard() TO anon;
GRANT EXECUTE ON FUNCTION public.get_leaderboard() TO authenticated;