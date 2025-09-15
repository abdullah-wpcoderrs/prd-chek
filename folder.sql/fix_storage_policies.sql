-- Fix storage policies to allow current N8N file structure
-- Run this in your Supabase SQL Editor

-- Drop existing storage policies
DROP POLICY IF EXISTS "Users can upload their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own documents" ON storage.objects;

-- Create new storage policies that work with current file structure
-- These policies will check document ownership via the documents table

-- Policy for uploading documents (used by N8N service role)
CREATE POLICY "Service can upload documents to project-documents" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'project-documents');

-- Policy for viewing documents (used by authenticated users)
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