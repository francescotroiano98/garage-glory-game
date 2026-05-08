
-- 1. Restrict profiles SELECT to authenticated users (no longer expose user_id to anon)
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles are viewable by authenticated users"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- 2. Revoke EXECUTE on SECURITY DEFINER functions from anon/authenticated.
-- These are trigger functions and should only run from inside the database.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
