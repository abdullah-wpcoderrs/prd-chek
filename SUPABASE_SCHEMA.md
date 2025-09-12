# Supabase Database Schema

This document outlines the database schema required for the PRD Generator application with native Supabase Auth and real-time document updates.

## Overview

The database consists of three main tables:
- `users` - Stores additional user profile information (references auth.users)
- `projects` - Stores project metadata
- `documents` - Stores document information and file references

All tables implement Row Level Security (RLS) to ensure users can only access their own data using Supabase Auth's built-in `auth.uid()` function.

## SQL Schema

Run the following SQL commands in your Supabase SQL editor:

```sql
-- Supabase Database Schema for PRD Generator with Native Supabase Auth
-- This file contains all the SQL commands needed to set up the database

-- Note: We don't need a separate users table since Supabase Auth manages users
-- auth.uid() returns the authenticated user's UUID directly

-- Create user profiles table (optional, for additional user data)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  tech_stack TEXT,
  target_platform TEXT,
  complexity TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  current_step TEXT DEFAULT 'Initializing project',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create documents table
CREATE TABLE public.documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('PRD', 'User Stories', 'Sitemap', 'Tech Stack', 'Screens')),
  name TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  file_path TEXT,
  file_size BIGINT,
  download_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_documents_project_id ON public.documents(project_id);
CREATE INDEX idx_documents_user_id ON public.documents(user_id);
CREATE INDEX idx_documents_status ON public.documents(status);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view their own profile" ON public.users
  FOR ALL USING (auth.uid() = id);

-- Create RLS policies for projects table
CREATE POLICY "Users can view their own projects" ON public.projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" ON public.projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" ON public.projects
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for documents table
CREATE POLICY "Users can view their own documents" ON public.documents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own documents" ON public.documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents" ON public.documents
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents" ON public.documents
  FOR DELETE USING (auth.uid() = user_id);

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) VALUES ('project-documents', 'project-documents', false);

-- Create storage policies
CREATE POLICY "Users can upload their own documents" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'project-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can view their own documents" ON storage.objects
  FOR SELECT USING (bucket_id = 'project-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can update their own documents" ON storage.objects
  FOR UPDATE USING (bucket_id = 'project-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can delete their own documents" ON storage.objects
  FOR DELETE USING (bucket_id = 'project-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'display_name', new.email));
  RETURN new;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Trigger to automatically create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Storage Structure

Documents are stored in Supabase Storage with the following structure:

```
Storage bucket: "project-documents"
├── {user_id}/
│   ├── {project_id}/
│   │   ├── prd/
│   │   │   └── document.pdf
│   │   ├── user-stories/
│   │   │   └── document.pdf
│   │   ├── sitemap/
│   │   │   └── document.pdf
│   │   ├── tech-stack/
│   │   │   └── document.pdf
│   │   └── screens/
│   │       └── document.pdf
```

## Environment Variables

Make sure these environment variables are set in your `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# N8N Webhooks (if using external workflow)
NEXT_PUBLIC_N8N_WEBHOOK_URL=your_n8n_webhook_url
NEXT_PUBLIC_N8N_STATUS_WEBHOOK_URL=your_n8n_status_url
```

## N8N Integration

Your N8N workflow should:

1. **Receive webhook data** including:
   - `projectId` (Supabase project UUID)
   - `userId` (Clerk user ID)
   - Project specification data

2. **Update project status** during generation:
   ```javascript
   // Update project progress
   await supabase
     .from('projects')
     .update({ 
       status: 'processing', 
       progress: 25, 
       current_step: 'Generating PRD...' 
     })
     .eq('id', projectId)
     .eq('user_id', userId);
   ```

3. **Update document status** as each document is completed:
   ```javascript
   // Update individual document
   await supabase
     .from('documents')
     .update({ 
       status: 'completed',
       file_path: `${userId}/${projectId}/prd/document.pdf`,
       file_size: fileSize,
       download_url: downloadUrl
     })
     .eq('project_id', projectId)
     .eq('type', 'PRD')
     .eq('user_id', userId);
   ```

4. **Upload files** to the correct storage path:
   ```javascript
   const filePath = `${userId}/${projectId}/prd/document.pdf`;
   await supabase.storage
     .from('project-documents')
     .upload(filePath, fileBuffer);
   ```

## Security Features

1. **Row Level Security (RLS)**: All database operations are automatically filtered by user ID
2. **Storage Policies**: Files can only be accessed by their owners
3. **Clerk Token Forwarding**: User authentication is seamlessly passed to Supabase
4. **Input Validation**: All data inputs are validated via Zod schemas

## Real-time Updates

The application automatically receives real-time updates when:
- Project status or progress changes
- Document status changes
- New documents are uploaded
- Any database record is modified

This ensures users see immediate updates without manual refresh.