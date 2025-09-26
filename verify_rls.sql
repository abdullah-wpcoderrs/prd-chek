-- SQL script to verify RLS policies for projects table

-- Check if RLS is enabled on projects table
SELECT 
  tablename, 
  relrowsecurity as rls_enabled,
  relforcerowsecurity as force_rls
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relname = 'projects';

-- Check existing RLS policies on projects table
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policy
WHERE polrelid = 'public.projects'::regclass;

-- Check if current user can access their own projects
-- Replace 'USER_ID_HERE' with an actual user ID to test
/*
SELECT COUNT(*) as user_projects
FROM projects 
WHERE user_id = 'USER_ID_HERE';
*/

-- Check if current user can update their own projects
-- Replace 'PROJECT_ID_HERE' and 'USER_ID_HERE' with actual values to test
/*
UPDATE projects 
SET name = name 
WHERE id = 'PROJECT_ID_HERE' AND user_id = 'USER_ID_HERE';
*/

-- Check document RLS policies
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policy
WHERE polrelid = 'public.documents'::regclass;