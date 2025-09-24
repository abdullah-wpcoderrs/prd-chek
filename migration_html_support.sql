-- Simplified migration for HTML-only documents
-- No need for content_type since all documents will be HTML
-- Keep existing file_path column structure

-- Add comment to clarify that file_path now points to HTML files
COMMENT ON COLUMN public.documents.file_path IS 'Path to HTML document file in storage';