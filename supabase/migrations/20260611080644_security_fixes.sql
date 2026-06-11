-- Enforce unique usernames (case-insensitive) to prevent leaderboard impersonation
CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_unique_ci
  ON public.profiles (lower(username));

-- Harden handle_new_user to guarantee uniqueness server-side
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  base_name TEXT;
  candidate TEXT;
  suffix INT := 0;
BEGIN
  base_name := COALESCE(NULLIF(trim(NEW.raw_user_meta_data->>'username'), ''), 'Player');
  candidate := base_name;
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE lower(username) = lower(candidate)) LOOP
    suffix := suffix + 1;
    candidate := base_name || '_' || suffix::text;
  END LOOP;
  INSERT INTO public.profiles (user_id, username) VALUES (NEW.id, candidate);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Ensure SECURITY DEFINER functions are not publicly executable
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_leaderboard() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_leaderboard() TO authenticated;
