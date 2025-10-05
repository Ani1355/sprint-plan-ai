-- Drop existing restrictive RLS policies
DROP POLICY IF EXISTS "Users can create own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can view own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can soft delete own projects" ON public.projects;

DROP POLICY IF EXISTS "Users can create features for own projects" ON public.features;
DROP POLICY IF EXISTS "Users can view features of own projects" ON public.features;
DROP POLICY IF EXISTS "Users can update features of own projects" ON public.features;
DROP POLICY IF EXISTS "Users can delete features of own projects" ON public.features;

DROP POLICY IF EXISTS "Users can create tech requirements for own projects" ON public.technical_requirements;
DROP POLICY IF EXISTS "Users can view tech requirements of own projects" ON public.technical_requirements;
DROP POLICY IF EXISTS "Users can update tech requirements of own projects" ON public.technical_requirements;

DROP POLICY IF EXISTS "Users can create journey maps for own projects" ON public.journey_maps;
DROP POLICY IF EXISTS "Users can view journey maps of own projects" ON public.journey_maps;
DROP POLICY IF EXISTS "Users can update journey maps of own projects" ON public.journey_maps;

DROP POLICY IF EXISTS "Users can create prd documents for own projects" ON public.prd_documents;
DROP POLICY IF EXISTS "Users can view prd documents of own projects" ON public.prd_documents;

DROP POLICY IF EXISTS "Users can create activity logs for own projects" ON public.activity_logs;
DROP POLICY IF EXISTS "Users can view activity logs of own projects" ON public.activity_logs;

-- Make owner_id nullable since we won't have authentication
ALTER TABLE public.projects ALTER COLUMN owner_id DROP NOT NULL;

-- Create public access policies for all tables
CREATE POLICY "Anyone can create projects" ON public.projects
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view projects" ON public.projects
  FOR SELECT USING (true);

CREATE POLICY "Anyone can update projects" ON public.projects
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete projects" ON public.projects
  FOR DELETE USING (true);

CREATE POLICY "Anyone can create features" ON public.features
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view features" ON public.features
  FOR SELECT USING (true);

CREATE POLICY "Anyone can update features" ON public.features
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete features" ON public.features
  FOR DELETE USING (true);

CREATE POLICY "Anyone can create tech requirements" ON public.technical_requirements
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view tech requirements" ON public.technical_requirements
  FOR SELECT USING (true);

CREATE POLICY "Anyone can update tech requirements" ON public.technical_requirements
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete tech requirements" ON public.technical_requirements
  FOR DELETE USING (true);

CREATE POLICY "Anyone can create journey maps" ON public.journey_maps
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view journey maps" ON public.journey_maps
  FOR SELECT USING (true);

CREATE POLICY "Anyone can update journey maps" ON public.journey_maps
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete journey maps" ON public.journey_maps
  FOR DELETE USING (true);

CREATE POLICY "Anyone can create prd documents" ON public.prd_documents
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view prd documents" ON public.prd_documents
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create activity logs" ON public.activity_logs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view activity logs" ON public.activity_logs
  FOR SELECT USING (true);