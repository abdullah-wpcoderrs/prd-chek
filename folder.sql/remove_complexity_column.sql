-- Migration script to remove complexity column from projects table
-- This script should be run after updating the application code

-- Remove the complexity column from projects table
ALTER TABLE public.projects DROP COLUMN IF EXISTS complexity;