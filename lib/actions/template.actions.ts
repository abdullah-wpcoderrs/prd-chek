"use server";

import { createSupabaseServerClient } from "@/lib/supabase-server";

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  tech_stacks: string[];
  features: string[];
  rating: number;
  downloads: number;
  document_count: number;
  preview_url?: string;
  prd_prompt: string;
  user_stories_prompt: string;
  sitemap_prompt: string;
  tech_stack_prompt: string;
  screens_prompt: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TemplateStats {
  total_templates: number;
  total_downloads: number;
  total_categories: number;
  average_rating: number;
}

export async function getTemplates(): Promise<Template[]> {
  const supabase = await createSupabaseServerClient();

  const { data: templates, error } = await supabase
    .from('templates')
    .select('*')
    .eq('is_active', true)
    .order('rating', { ascending: false });

  if (error) {
    console.error('Error fetching templates:', error);
    throw new Error('Failed to fetch templates');
  }

  return templates || [];
}

export async function getTemplateStats(): Promise<TemplateStats> {
  const supabase = await createSupabaseServerClient();

  const { data: templates, error } = await supabase
    .from('templates')
    .select('downloads, rating, category')
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching template stats:', error);
    throw new Error('Failed to fetch template stats');
  }

  if (!templates || templates.length === 0) {
    return {
      total_templates: 0,
      total_downloads: 0,
      total_categories: 0,
      average_rating: 0
    };
  }

  const totalDownloads = templates.reduce((sum, t) => sum + (t.downloads || 0), 0);
  const averageRating = templates.reduce((sum, t) => sum + (t.rating || 0), 0) / templates.length;
  const uniqueCategories = new Set(templates.map(t => t.category)).size;

  return {
    total_templates: templates.length,
    total_downloads: totalDownloads,
    total_categories: uniqueCategories,
    average_rating: Math.round(averageRating * 10) / 10
  };
}

export async function getTemplate(id: string): Promise<Template | null> {
  const supabase = await createSupabaseServerClient();

  const { data: template, error } = await supabase
    .from('templates')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching template:', error);
    return null;
  }

  return template;
}

export async function incrementTemplateDownloads(id: string): Promise<void> {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from('templates')
    .update({ 
      downloads: supabase.rpc('increment_downloads', { template_id: id })
    })
    .eq('id', id);

  if (error) {
    console.error('Error incrementing template downloads:', error);
  }
}

export async function getTemplatesByCategory(category: string): Promise<Template[]> {
  const supabase = await createSupabaseServerClient();

  const { data: templates, error } = await supabase
    .from('templates')
    .select('*')
    .eq('category', category)
    .eq('is_active', true)
    .order('rating', { ascending: false });

  if (error) {
    console.error('Error fetching templates by category:', error);
    throw new Error('Failed to fetch templates by category');
  }

  return templates || [];
}