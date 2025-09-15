-- Templates table schema and initial data
-- Run this SQL in your Supabase SQL Editor

-- Create templates table
CREATE TABLE public.templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  tech_stacks TEXT[] NOT NULL,
  features TEXT[] NOT NULL,
  rating DECIMAL(2,1) DEFAULT 4.5 CHECK (rating >= 0 AND rating <= 5),
  downloads INTEGER DEFAULT 0,
  document_count INTEGER DEFAULT 5,
  preview_url TEXT,
  
  -- Template prompt content fields
  prd_prompt TEXT NOT NULL,
  user_stories_prompt TEXT NOT NULL,
  sitemap_prompt TEXT NOT NULL,
  tech_stack_prompt TEXT NOT NULL,
  screens_prompt TEXT NOT NULL,
  
  -- Metadata
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_templates_category ON public.templates(category);
CREATE INDEX idx_templates_active ON public.templates(is_active);
CREATE INDEX idx_templates_rating ON public.templates(rating);

-- Enable Row Level Security (RLS) - templates are public read-only
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for public read access
CREATE POLICY "Anyone can view active templates" ON public.templates
  FOR SELECT USING (is_active = true);

-- Create RLS policy for admin management (if needed)
CREATE POLICY "Admins can manage templates" ON public.templates
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Add trigger for updated_at
CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON public.templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();