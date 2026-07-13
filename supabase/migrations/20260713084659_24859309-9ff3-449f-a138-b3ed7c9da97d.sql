
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS money BIGINT NOT NULL DEFAULT 500;

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users WHERE email = 'francesco.troiano.98.roma@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
