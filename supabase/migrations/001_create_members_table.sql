-- ============================================================
-- IEEE CS GECI – Members Table & RBAC Setup
-- ============================================================
-- Run this in the InsForge / Supabase SQL Editor.

-- 1. Create members table
CREATE TABLE IF NOT EXISTS public.members (
  id             UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  ieee_member_id TEXT UNIQUE,
  full_name      TEXT NOT NULL,
  email          TEXT UNIQUE NOT NULL,
  role           TEXT NOT NULL DEFAULT 'member'
                   CHECK (role IN ('member', 'execom', 'admin')),
  department     TEXT,
  year           TEXT,
  phone          TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER members_updated_at
  BEFORE UPDATE ON public.members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 3. Auto-insert into members when a new auth user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.members (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'member')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Enable Row Level Security
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- 5. Helper function: check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.members
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- 6. RLS Policies

-- Admins can do everything
CREATE POLICY "admin_all" ON public.members
  FOR ALL
  USING (public.is_admin());

-- Users can read their own row
CREATE POLICY "user_select_own" ON public.members
  FOR SELECT
  USING (id = auth.uid());

-- Users can update their own row (but not change their role)
CREATE POLICY "user_update_own" ON public.members
  FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid() AND role = (SELECT role FROM public.members WHERE id = auth.uid()));

-- 7. Grant access
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.members TO authenticated;
