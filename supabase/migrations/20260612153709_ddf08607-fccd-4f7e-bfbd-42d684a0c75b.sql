-- Allow anon users to read profiles for the public leaderboard
GRANT SELECT ON public.profiles TO anon;

-- Add a permissive policy so unauthenticated users can view leaderboard entries
CREATE POLICY "Allow anon to view leaderboard profiles"
ON public.profiles
FOR SELECT
TO anon
USING (true);
