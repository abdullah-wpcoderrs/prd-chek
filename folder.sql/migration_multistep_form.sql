-- Migration: Add Multi-Step Form Support
-- This migration adds support for the new multi-step product manager form
-- Run this in your Supabase SQL Editor

-- ============================================================================
-- STEP 1: Add new columns to projects table
-- ============================================================================

-- Add form_data column to store the complete multi-step form data as JSON
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS form_data JSONB;

-- Add project_version to distinguish between old and new form formats
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS project_version VARCHAR(10) DEFAULT 'v1';

-- Add comment for documentation
COMMENT ON COLUMN public.projects.form_data IS 'Stores complete multi-step form data as JSON for v2 projects';
COMMENT ON COLUMN public.projects.project_version IS 'Version identifier: v1 (legacy single form) or v2 (multi-step form)';

-- ============================================================================
-- STEP 2: Update documents table to support new document types
-- ============================================================================

-- Remove the CHECK constraint on document type to allow new document types
ALTER TABLE public.documents 
DROP CONSTRAINT IF EXISTS documents_type_check;

-- Add new CHECK constraint that includes both legacy and new document types
ALTER TABLE public.documents 
ADD CONSTRAINT documents_type_check 
CHECK (type IN (
  -- Legacy document types (v1)
  'PRD', 'User Stories', 'Sitemap', 'Tech Stack', 'Screens',
  -- New document types (v2)
  'Research_Insights', 'Vision_Strategy', 'BRD', 'TRD', 'Planning_Toolkit'
));

-- Add document_stage column to categorize documents by pipeline stage
ALTER TABLE public.documents 
ADD COLUMN IF NOT EXISTS document_stage VARCHAR(20);

-- Add comment for documentation
COMMENT ON COLUMN public.documents.document_stage IS 'Pipeline stage: discovery, strategy, or planning';

-- ============================================================================
-- STEP 3: Create indexes for better performance
-- ============================================================================

-- Index on form_data for JSON queries
CREATE INDEX IF NOT EXISTS idx_projects_form_data 
ON public.projects USING GIN (form_data);

-- Index on project_version for filtering
CREATE INDEX IF NOT EXISTS idx_projects_version 
ON public.projects (project_version);

-- Index on document_stage for filtering
CREATE INDEX IF NOT EXISTS idx_documents_stage 
ON public.documents (document_stage);

-- Composite index for user + version queries
CREATE INDEX IF NOT EXISTS idx_projects_user_version 
ON public.projects (user_id, project_version);

-- ============================================================================
-- STEP 4: Create helper functions for form data management
-- ============================================================================

-- Function to extract product name from form_data
CREATE OR REPLACE FUNCTION get_product_name_from_form_data(form_data_json JSONB)
RETURNS TEXT AS $$
BEGIN
  IF form_data_json IS NULL THEN
    RETURN NULL;
  END IF;
  
  RETURN form_data_json->'step1'->>'productName';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to extract product pitch from form_data
CREATE OR REPLACE FUNCTION get_product_pitch_from_form_data(form_data_json JSONB)
RETURNS TEXT AS $$
BEGIN
  IF form_data_json IS NULL THEN
    RETURN NULL;
  END IF;
  
  RETURN form_data_json->'step1'->>'productPitch';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to extract target users from form_data
CREATE OR REPLACE FUNCTION get_target_users_from_form_data(form_data_json JSONB)
RETURNS TEXT AS $$
BEGIN
  IF form_data_json IS NULL THEN
    RETURN NULL;
  END IF;
  
  RETURN form_data_json->'step2'->>'targetUsers';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to check if project uses new multi-step form
CREATE OR REPLACE FUNCTION is_multistep_project(project_version_val VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN project_version_val = 'v2';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================================
-- STEP 5: Update existing projects to v1 (legacy format)
-- ============================================================================

-- Mark all existing projects as v1 (legacy format)
UPDATE public.projects 
SET project_version = 'v1' 
WHERE project_version IS NULL;

-- ============================================================================
-- STEP 6: Create views for easier querying
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
-- STEP 7: Update document stages for new document types
-- ============================================================================

-- Update document stages based on document type
UPDATE public.documents 
SET document_stage = CASE 
  WHEN type = 'Research_Insights' THEN 'discovery'
  WHEN type = 'Vision_Strategy' THEN 'strategy'
  WHEN type IN ('PRD', 'BRD', 'TRD', 'Planning_Toolkit') THEN 'planning'
  ELSE NULL -- Legacy documents don't have stages
END
WHERE document_stage IS NULL;

-- ============================================================================
-- STEP 8: Create triggers for automatic form_data validation
-- ============================================================================

-- Function to validate form_data structure for v2 projects
CREATE OR REPLACE FUNCTION validate_form_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Only validate v2 projects
  IF NEW.project_version = 'v2' AND NEW.form_data IS NOT NULL THEN
    -- Check if required top-level keys exist
    IF NOT (NEW.form_data ? 'step1' AND 
            NEW.form_data ? 'step2' AND 
            NEW.form_data ? 'step3' AND 
            NEW.form_data ? 'step4' AND 
            NEW.form_data ? 'step5') THEN
      RAISE EXCEPTION 'Invalid form_data structure: missing required steps';
    END IF;
    
    -- Check if step1 has required fields
    IF NOT (NEW.form_data->'step1' ? 'productName' AND 
            NEW.form_data->'step1' ? 'productPitch') THEN
      RAISE EXCEPTION 'Invalid form_data: step1 missing required fields';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for form_data validation
CREATE TRIGGER validate_project_form_data
  BEFORE INSERT OR UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION validate_form_data();

-- ============================================================================
-- STEP 9: Grant necessary permissions
-- ============================================================================

-- Grant usage on new functions to authenticated users
GRANT EXECUTE ON FUNCTION get_product_name_from_form_data(JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION get_product_pitch_from_form_data(JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION get_target_users_from_form_data(JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION is_multistep_project(VARCHAR) TO authenticated;

-- Grant select on new views to authenticated users
GRANT SELECT ON public.projects_v2_enhanced TO authenticated;
GRANT SELECT ON public.document_pipeline_status TO authenticated;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Uncomment and run these queries to verify the migration:

-- Check new columns exist
-- SELECT column_name, data_type, is_nullable, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'projects' AND column_name IN ('form_data', 'project_version');

-- Check document type constraint
-- SELECT constraint_name, check_clause 
-- FROM information_schema.check_constraints 
-- WHERE constraint_name = 'documents_type_check';

-- Check indexes were created
-- SELECT indexname, indexdef 
-- FROM pg_indexes 
-- WHERE tablename IN ('projects', 'documents') 
-- AND indexname LIKE 'idx_%form_data%' OR indexname LIKE 'idx_%version%' OR indexname LIKE 'idx_%stage%';

-- Check functions were created
-- SELECT routine_name, routine_type 
-- FROM information_schema.routines 
-- WHERE routine_name LIKE '%form_data%' OR routine_name LIKE '%multistep%';

-- Check views were created
-- SELECT table_name, table_type 
-- FROM information_schema.tables 
-- WHERE table_name LIKE '%_v2_%' OR table_name LIKE '%pipeline%';

-- Sample query to test form_data extraction
-- SELECT 
--   id, 
--   name, 
--   project_version,
--   get_product_name_from_form_data(form_data) as product_name,
--   form_data->'step1'->>'industry' as industry
-- FROM public.projects 
-- WHERE project_version = 'v2' 
-- LIMIT 5;