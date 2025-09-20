-- Rollback Migration: Remove Multi-Step Form Support
-- This migration removes the multi-step form changes if needed
-- ⚠️ WARNING: This will delete all v2 project data! Use with caution.

-- ============================================================================
-- STEP 1: Drop triggers and functions
-- ============================================================================

-- Drop validation trigger
DROP TRIGGER IF EXISTS validate_project_form_data ON public.projects;

-- Drop validation function
DROP FUNCTION IF EXISTS validate_form_data();

-- Drop helper functions
DROP FUNCTION IF EXISTS get_product_name_from_form_data(JSONB);
DROP FUNCTION IF EXISTS get_product_pitch_from_form_data(JSONB);
DROP FUNCTION IF EXISTS get_target_users_from_form_data(JSONB);
DROP FUNCTION IF EXISTS is_multistep_project(VARCHAR);

-- ============================================================================
-- STEP 2: Drop views
-- ============================================================================

DROP VIEW IF EXISTS public.projects_v2_enhanced;
DROP VIEW IF EXISTS public.document_pipeline_status;

-- ============================================================================
-- STEP 3: Remove indexes
-- ============================================================================

DROP INDEX IF EXISTS idx_projects_form_data;
DROP INDEX IF EXISTS idx_projects_version;
DROP INDEX IF EXISTS idx_documents_stage;
DROP INDEX IF EXISTS idx_projects_user_version;

-- ============================================================================
-- STEP 4: Remove new columns
-- ============================================================================

-- Remove form_data column (⚠️ This will delete all v2 project data!)
ALTER TABLE public.projects DROP COLUMN IF EXISTS form_data;

-- Remove project_version column
ALTER TABLE public.projects DROP COLUMN IF EXISTS project_version;

-- Remove document_stage column
ALTER TABLE public.documents DROP COLUMN IF EXISTS document_stage;

-- ============================================================================
-- STEP 5: Restore original document type constraint
-- ============================================================================

-- Remove new document type constraint
ALTER TABLE public.documents DROP CONSTRAINT IF EXISTS documents_type_check;

-- Restore original constraint (legacy document types only)
ALTER TABLE public.documents 
ADD CONSTRAINT documents_type_check 
CHECK (type IN ('PRD', 'User Stories', 'Sitemap', 'Tech Stack', 'Screens'));

-- ============================================================================
-- STEP 6: Clean up any v2 documents that shouldn't exist
-- ============================================================================

-- Delete any documents with new document types
DELETE FROM public.documents 
WHERE type IN ('Research_Insights', 'Vision_Strategy', 'BRD', 'TRD', 'Planning_Toolkit');

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Uncomment and run these to verify rollback:

-- Check columns were removed
-- SELECT column_name 
-- FROM information_schema.columns 
-- WHERE table_name = 'projects' AND column_name IN ('form_data', 'project_version');

-- Check document types are back to original
-- SELECT constraint_name, check_clause 
-- FROM information_schema.check_constraints 
-- WHERE constraint_name = 'documents_type_check';

-- Check no v2 document types remain
-- SELECT DISTINCT type FROM public.documents;