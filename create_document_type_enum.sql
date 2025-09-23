-- Create ENUM type for document types (V2 with PRD restored)
CREATE TYPE document_type_enum AS ENUM (
  'Research_Insights',
  'Vision_Strategy', 
  'PRD',
  'BRD',
  'TRD',
  'Planning_Toolkit'
);

-- Drop the existing CHECK constraint
ALTER TABLE public.documents 
DROP CONSTRAINT IF EXISTS documents_type_check;

-- Change the type column to use the ENUM
ALTER TABLE public.documents 
ALTER COLUMN type TYPE document_type_enum 
USING type::document_type_enum;

-- Add NOT NULL constraint if not already present
ALTER TABLE public.documents 
ALTER COLUMN type SET NOT NULL;