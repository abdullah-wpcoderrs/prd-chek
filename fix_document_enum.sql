-- Fix for document type enum error - Convert enum back to text
-- Run this in your Supabase SQL Editor to fix the enum issue

-- Step 1: First, let's see what we're working with
SELECT 
    column_name, 
    data_type, 
    udt_name 
FROM information_schema.columns 
WHERE table_name = 'documents' AND column_name = 'type';

-- Step 2: Convert the column from enum back to text
-- This handles the case where document_type_enum already exists
ALTER TABLE public.documents 
ALTER COLUMN type TYPE TEXT;

-- Step 3: Drop the enum type completely (if no other tables use it)
DROP TYPE IF EXISTS document_type_enum CASCADE;

-- Step 4: Drop any existing CHECK constraint
ALTER TABLE public.documents 
DROP CONSTRAINT IF EXISTS documents_type_check;

-- Step 5: Add new CHECK constraint that includes PRD and all V2 document types
ALTER TABLE public.documents 
ADD CONSTRAINT documents_type_check 
CHECK (type IN (
  -- V2 document types (including PRD)
  'Research_Insights', 
  'Vision_Strategy', 
  'PRD', 
  'BRD', 
  'TRD', 
  'Planning_Toolkit'
));

-- Step 6: Ensure NOT NULL constraint
ALTER TABLE public.documents 
ALTER COLUMN type SET NOT NULL;

-- Step 7: Verify the change worked
SELECT 
    column_name, 
    data_type, 
    udt_name 
FROM information_schema.columns 
WHERE table_name = 'documents' AND column_name = 'type';

SELECT 
    constraint_name, 
    check_clause 
FROM information_schema.check_constraints 
WHERE constraint_name = 'documents_type_check';