-- ============================================================================
-- PRD GENERATOR - CONSOLIDATED DATABASE SCHEMA
-- ============================================================================
-- This file contains the complete, working database schema for the PRD Generator
-- Consolidates all migrations and updates into a single comprehensive schema
-- Last Updated: November 14, 2025
-- ============================================================================

-- ============================================================================
-- SECTION 1: CORE TABLES
-- ============================================================================

-- User profiles table (extends Supabase Auth)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table with multi-step form support
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  tech_stack TEXT,
  target_platform TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  current_step TEXT DEFAULT 'Initializing project',
  
  -- Multi-step form support (v2)
  form_data JSONB,
  project_version VARCHAR(10) DEFAULT 'v1',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents table with HTML support and pipeline stages
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Document type (v2 types with PRD restored)
  type TEXT NOT NULL CHECK (type IN (
    'Research_Insights', 
    'Vision_Strategy', 
    'PRD', 
    'BRD', 
    'TRD', 
    'Planning_Toolkit'
  )),
  
  name TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  
  -- File storage (HTML files)
  file_path TEXT,
  file_size BIGINT,
  download_url TEXT,
  
  -- Pipeline stage
  document_stage VARCHAR(20),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Templates table for project templates
CREATE TABLE IF NOT EXISTS public.templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  tech_stacks TEXT[] NOT NULL,
  features TEXT[] NOT NULL,
  rating DECIMAL(2,1) DEFAULT 4.5 CHECK (rating >= 0 AND rating <= 5),
  downloads INTEGER DEFAULT 0,
  document_count INTEGER DEFAULT 5,
  preview_url TEXT,
  
  -- Template prompt content fields
  prd_prompt TEXT NOT NULL,
  user_stories_prompt TEXT NOT NULL,
  sitemap_prompt TEXT NOT NULL,
  tech_stack_prompt TEXT NOT NULL,
  screens_prompt TEXT NOT NULL,
  
  -- Metadata
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- SECTION 2: INDEXES FOR PERFORMANCE
-- ============================================================================

-- User indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Project indexes
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_form_data ON public.projects USING GIN (form_data);
CREATE INDEX IF NOT EXISTS idx_projects_version ON public.projects(project_version);
CREATE INDEX IF NOT EXISTS idx_projects_user_version ON public.projects(user_id, project_version);

-- Document indexes
CREATE INDEX IF NOT EXISTS idx_documents_project_id ON public.documents(project_id);
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON public.documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON public.documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_stage ON public.documents(document_stage);

-- Template indexes
CREATE INDEX IF NOT EXISTS idx_templates_category ON public.templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_active ON public.templates(is_active);
CREATE INDEX IF NOT EXISTS idx_templates_rating ON public.templates(rating);

-- ============================================================================
-- SECTION 3: ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- Users table policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
CREATE POLICY "Users can view their own profile" ON public.users
  FOR ALL USING (auth.uid() = id);

-- Projects table policies
DROP POLICY IF EXISTS "Users can view their own projects" ON public.projects;
CREATE POLICY "Users can view their own projects" ON public.projects
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own projects" ON public.projects;
CREATE POLICY "Users can create their own projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own projects" ON public.projects;
CREATE POLICY "Users can update their own projects" ON public.projects
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own projects" ON public.projects;
CREATE POLICY "Users can delete their own projects" ON public.projects
  FOR DELETE USING (auth.uid() = user_id);

-- Documents table policies
DROP POLICY IF EXISTS "Users can view their own documents" ON public.documents;
CREATE POLICY "Users can view their own documents" ON public.documents
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own documents" ON public.documents;
CREATE POLICY "Users can create their own documents" ON public.documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own documents" ON public.documents;
CREATE POLICY "Users can update their own documents" ON public.documents
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own documents" ON public.documents;
CREATE POLICY "Users can delete their own documents" ON public.documents
  FOR DELETE USING (auth.uid() = user_id);

-- Templates table policies (public read-only)
DROP POLICY IF EXISTS "Anyone can view active templates" ON public.templates;
CREATE POLICY "Anyone can view active templates" ON public.templates
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage templates" ON public.templates;
CREATE POLICY "Admins can manage templates" ON public.templates
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================================================
-- SECTION 4: STORAGE BUCKET AND POLICIES
-- ============================================================================

-- Create storage bucket for documents (if not exists)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-documents', 'project-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
DROP POLICY IF EXISTS "Users can upload their own documents" ON storage.objects;
CREATE POLICY "Users can upload their own documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'project-documents' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users can view their own documents" ON storage.objects;
CREATE POLICY "Users can view their own documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'project-documents' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users can update their own documents" ON storage.objects;
CREATE POLICY "Users can update their own documents" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'project-documents' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users can delete their own documents" ON storage.objects;
CREATE POLICY "Users can delete their own documents" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'project-documents' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- ============================================================================
-- SECTION 5: HELPER FUNCTIONS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Function to extract product name from form_data
CREATE OR REPLACE FUNCTION get_product_name_from_form_data(form_data_json JSONB)
RETURNS TEXT AS $
BEGIN
  IF form_data_json IS NULL THEN
    RETURN NULL;
  END IF;
  RETURN form_data_json->'step1'->>'productName';
END;
$ LANGUAGE plpgsql IMMUTABLE;

-- Function to extract product pitch from form_data
CREATE OR REPLACE FUNCTION get_product_pitch_from_form_data(form_data_json JSONB)
RETURNS TEXT AS $
BEGIN
  IF form_data_json IS NULL THEN
    RETURN NULL;
  END IF;
  RETURN form_data_json->'step1'->>'productPitch';
END;
$ LANGUAGE plpgsql IMMUTABLE;

-- Function to extract target users from form_data
CREATE OR REPLACE FUNCTION get_target_users_from_form_data(form_data_json JSONB)
RETURNS TEXT AS $
BEGIN
  IF form_data_json IS NULL THEN
    RETURN NULL;
  END IF;
  RETURN form_data_json->'step2'->>'targetUsers';
END;
$ LANGUAGE plpgsql IMMUTABLE;

-- Function to check if project uses multi-step form
CREATE OR REPLACE FUNCTION is_multistep_project(project_version_val VARCHAR)
RETURNS BOOLEAN AS $
BEGIN
  RETURN project_version_val = 'v2';
END;
$ LANGUAGE plpgsql IMMUTABLE;

-- Function to validate form_data structure for v2 projects
CREATE OR REPLACE FUNCTION validate_form_data()
RETURNS TRIGGER AS $
BEGIN
  IF NEW.project_version = 'v2' AND NEW.form_data IS NOT NULL THEN
    IF NOT (NEW.form_data ? 'step1' AND 
            NEW.form_data ? 'step2' AND 
            NEW.form_data ? 'step3' AND 
            NEW.form_data ? 'step4' AND 
            NEW.form_data ? 'step5') THEN
      RAISE EXCEPTION 'Invalid form_data structure: missing required steps';
    END IF;
    
    IF NOT (NEW.form_data->'step1' ? 'productName' AND 
            NEW.form_data->'step1' ? 'productPitch') THEN
      RAISE EXCEPTION 'Invalid form_data: step1 missing required fields';
    END IF;
  END IF;
  RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $
BEGIN
  INSERT INTO public.users (id, email, display_name)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'display_name', new.email));
  RETURN new;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- Template management functions
CREATE OR REPLACE FUNCTION increment_downloads(template_id UUID)
RETURNS INTEGER AS $
DECLARE
  new_count INTEGER;
BEGIN
  UPDATE public.templates 
  SET downloads = downloads + 1
  WHERE id = template_id
  RETURNING downloads INTO new_count;
  RETURN new_count;
END;
$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_template_stats()
RETURNS TABLE(
  total_templates BIGINT,
  total_downloads BIGINT,
  total_categories BIGINT,
  average_rating NUMERIC
) AS $
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_templates,
    SUM(t.downloads) as total_downloads,
    COUNT(DISTINCT t.category) as total_categories,
    ROUND(AVG(t.rating), 1) as average_rating
  FROM public.templates t
  WHERE t.is_active = true;
END;
$ LANGUAGE plpgsql;

-- ============================================================================
-- SECTION 6: TRIGGERS
-- ============================================================================

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_documents_updated_at ON public.documents;
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_templates_updated_at ON public.templates;
CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON public.templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for automatic profile creation on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger for form_data validation
DROP TRIGGER IF EXISTS validate_project_form_data ON public.projects;
CREATE TRIGGER validate_project_form_data
  BEFORE INSERT OR UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION validate_form_data();

-- ============================================================================
-- SECTION 7: VIEWS
-- ============================================================================

-- View for v2 projects with extracted form data
CREATE OR REPLACE VIEW public.projects_v2_enhanced AS
SELECT 
  p.*,
  get_product_name_from_form_data(p.form_data) as extracted_product_name,
  get_product_pitch_from_form_data(p.form_data) as extracted_product_pitch,
  get_target_users_from_form_data(p.form_data) as extracted_target_users,
  (p.form_data->'step1'->>'industry') as industry,
  (p.form_data->'step1'->>'currentStage') as current_stage,
  (p.form_data->'step4'->>'valueProposition') as value_proposition,
  (p.form_data->'step5'->'mustHaveFeatures') as must_have_features,
  (p.form_data->'step5'->'niceToHaveFeatures') as nice_to_have_features
FROM public.projects p
WHERE p.project_version = 'v2';

-- View for document pipeline stages
CREATE OR REPLACE VIEW public.document_pipeline_status AS
SELECT 
  p.id as project_id,
  p.name as project_name,
  p.project_version,
  COUNT(d.id) as total_documents,
  COUNT(CASE WHEN d.status = 'completed' THEN 1 END) as completed_documents,
  COUNT(CASE WHEN d.document_stage = 'discovery' THEN 1 END) as discovery_docs,
  COUNT(CASE WHEN d.document_stage = 'strategy' THEN 1 END) as strategy_docs,
  COUNT(CASE WHEN d.document_stage = 'planning' THEN 1 END) as planning_docs,
  ROUND(
    (COUNT(CASE WHEN d.status = 'completed' THEN 1 END)::DECIMAL / 
     NULLIF(COUNT(d.id), 0)) * 100, 2
  ) as completion_percentage
FROM public.projects p
LEFT JOIN public.documents d ON p.id = d.project_id
GROUP BY p.id, p.name, p.project_version;

-- ============================================================================
-- SECTION 8: PERMISSIONS
-- ============================================================================

-- Grant usage on functions to authenticated users
GRANT EXECUTE ON FUNCTION get_product_name_from_form_data(JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION get_product_pitch_from_form_data(JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION get_target_users_from_form_data(JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION is_multistep_project(VARCHAR) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_downloads(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_template_stats() TO authenticated;

-- Grant select on views to authenticated users
GRANT SELECT ON public.projects_v2_enhanced TO authenticated;
GRANT SELECT ON public.document_pipeline_status TO authenticated;

-- ============================================================================
-- SECTION 9: COLUMN COMMENTS (DOCUMENTATION)
-- ============================================================================

COMMENT ON COLUMN public.projects.form_data IS 'Stores complete multi-step form data as JSON for v2 projects';
COMMENT ON COLUMN public.projects.project_version IS 'Version identifier: v1 (legacy single form) or v2 (multi-step form)';
COMMENT ON COLUMN public.documents.file_path IS 'Path to HTML document file in storage';
COMMENT ON COLUMN public.documents.document_stage IS 'Pipeline stage: discovery, strategy, or planning';

-- ============================================================================
-- SECTION 10: DATA MIGRATION (Update existing records)
-- ============================================================================

-- Mark all existing projects as v1 if not already set
UPDATE public.projects 
SET project_version = 'v1' 
WHERE project_version IS NULL;

-- Update document stages based on document type
UPDATE public.documents 
SET document_stage = CASE 
  WHEN type = 'Research_Insights' THEN 'discovery'
  WHEN type = 'Vision_Strategy' THEN 'strategy'
  WHEN type IN ('PRD', 'BRD', 'TRD', 'Planning_Toolkit') THEN 'planning'
  ELSE NULL
END
WHERE document_stage IS NULL;

-- ============================================================================
-- END OF CONSOLIDATED SCHEMA
-- ============================================================================
