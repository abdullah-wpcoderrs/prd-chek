-- ============================================================================
-- FIX: Update documents_type_check constraint (SAFE VERSION)
-- ============================================================================
-- This script safely fixes the document type constraint
-- Run this in your Supabase SQL Editor

-- Step 1: Check what document types currently exist in your database
SELECT DISTINCT type, COUNT(*) as count
FROM public.documents
GROUP BY type
ORDER BY count DESC;

-- Step 2: Drop the existing constraint (this will work even with existing data)
ALTER TABLE public.documents 
DROP CONSTRAINT IF EXISTS documents_type_check;

-- Step 3: OPTION A - If you want to keep existing documents, add a constraint that includes both old and new types
-- Uncomment this if you have old documents you want to keep:
/*
ALTER TABLE public.documents 
ADD CONSTRAINT documents_type_check 
CHECK (type IN (
  -- V1 Legacy types
  'PRD', 'User Stories', 'Sitemap', 'Tech Stack', 'Screens',
  -- V2 New types
  'Research_Insights', 'Vision_Strategy', 'BRD', 'TRD', 'Planning_Toolkit'
));
*/

-- Step 4: OPTION B - If you want to migrate old documents to new types
-- This updates old v1 document types to v2 equivalents
UPDATE public.documents 
SET type = CASE 
  WHEN type = 'User Stories' THEN 'Research_Insights'
  WHEN type = 'Sitemap' THEN 'Planning_Toolkit'
  WHEN type = 'Tech Stack' THEN 'TRD'
  WHEN type = 'Screens' THEN 'Vision_Strategy'
  ELSE type  -- Keep PRD as is (it exists in both v1 and v2)
END
WHERE type IN ('User Stories', 'Sitemap', 'Tech Stack', 'Screens');

-- Step 5: Now add the v2-only constraint
ALTER TABLE public.documents 
ADD CONSTRAINT documents_type_check 
CHECK (type IN (
  'Research_Insights', 
  'Vision_Strategy', 
  'PRD', 
  'BRD', 
  'TRD', 
  'Planning_Toolkit'
));

-- Step 6: Verify the constraint was updated
SELECT constraint_name, check_clause 
FROM information_schema.check_constraints 
WHERE constraint_name = 'documents_type_check';

-- Step 7: Verify all documents now have valid types
SELECT DISTINCT type, COUNT(*) as count
FROM public.documents
GROUP BY type
ORDER BY type;
