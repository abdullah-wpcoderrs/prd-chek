-- Fix storage policies and bucket configuration for N8N file structure
-- Run this in your Supabase SQL Editor

-- Step 1: Fix bucket configuration
-- Make sure the bucket is private (not public)
UPDATE storage.buckets 
SET public = false 
WHERE id = 'project-documents';

-- Step 2: Drop existing storage policies
DROP POLICY IF EXISTS "Users can upload their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Service can upload documents to project-documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view documents they own" ON storage.objects;
DROP POLICY IF EXISTS "Service can update documents in project-documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete documents they own" ON storage.objects;

-- Step 3: Create new storage policies that work with current file structure
-- These policies will check document ownership via the documents table

-- Policy for uploading documents (used by N8N service role)
CREATE POLICY "Service can upload documents to project-documents" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'project-documents');

-- Policy for viewing documents (used by authenticated users)
-- This allows users to view documents they own based on the documents table
CREATE POLICY "Users can view documents they own" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'project-documents' 
    AND EXISTS (
      SELECT 1 FROM public.documents 
      WHERE documents.file_path = storage.objects.name 
      AND documents.user_id = auth.uid()
    )
  );

-- Policy for updating documents (used by N8N service role)
CREATE POLICY "Service can update documents in project-documents" ON storage.objects
  FOR UPDATE USING (bucket_id = 'project-documents');

-- Policy for deleting documents (used by authenticated users)
CREATE POLICY "Users can delete documents they own" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'project-documents' 
    AND EXISTS (
      SELECT 1 FROM public.documents 
      WHERE documents.file_path = storage.objects.name 
      AND documents.user_id = auth.uid()
    )
  );

-- Step 4: Fix existing document records to ensure proper file_path format
-- Update any file_path entries that don't have .pdf extension
UPDATE public.documents 
SET file_path = file_path || '.pdf'
WHERE file_path IS NOT NULL 
  AND file_path NOT LIKE '%.pdf'
  AND status = 'completed';

-- Step 5: Update download URLs to use proper signed URL format
-- Note: N8N should update these with proper signed URLs when uploading
-- This is just to clean up any existing malformed URLs
UPDATE public.documents 
SET download_url = NULL
WHERE download_url LIKE '%/public/%'
  AND status = 'completed';

-- Step 6: Create function to generate proper signed URLs for documents
CREATE OR REPLACE FUNCTION get_document_signed_url(file_path text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- This function would need to be implemented with proper Supabase signed URL generation
  -- For now, return the file path which will be handled by the application
  RETURN file_path;
END;
$$;

-- Verification queries to check the fixes
-- Run these after applying the above fixes:

-- Check bucket configuration
-- SELECT id, name, public FROM storage.buckets WHERE id = 'project-documents';

-- Check storage policies
-- SELECT schemaname, tablename, policyname, cmd, qual FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';

-- Check document file paths
-- SELECT id, type, file_path, download_url, status FROM public.documents WHERE file_path IS NOT NULL;