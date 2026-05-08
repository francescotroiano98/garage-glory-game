-- Restrict SELECT on profiles to the row owner
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;

CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Remove direct UPDATE; all writes must go through sync-profile edge function (service role)
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Public leaderboard view excluding user_id
CREATE OR REPLACE VIEW public.leaderboard
WITH (security_invoker = true)
AS
SELECT
  username,
  total_profit,
  total_cars_sold,
  level,
  created_at
FROM public.profiles;

-- Allow anyone to read the leaderboard view
GRANT SELECT ON public.leaderboard TO anon, authenticated;

-- The view uses security_invoker, so it needs an RLS policy on profiles for read.
-- Add a policy allowing limited columns? Instead, allow SELECT for leaderboard purposes via a permissive policy
-- restricted to no sensitive use: we'll make a second SELECT policy that only the view can rely on by granting
-- through SECURITY DEFINER function instead.
DROP VIEW IF EXISTS public.leaderboard;

CREATE OR REPLACE FUNCTION public.get_leaderboard()
RETURNS TABLE (
  username text,
  total_profit bigint,
  total_cars_sold integer,
  level integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT username, total_profit, total_cars_sold, level
  FROM public.profiles
  ORDER BY total_profit DESC
  LIMIT 50;
$$;

REVOKE EXECUTE ON FUNCTION public.get_leaderboard() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_leaderboard() TO authenticated;