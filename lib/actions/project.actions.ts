"use server";

import { createSupabaseServerClient, getAuthenticatedUser } from "@/lib/supabase-server";
import { submitProjectGeneration } from "@/lib/webhook";
import { revalidatePath } from "next/cache";
import { ProjectSpec } from "@/types";

export interface CreateProjectData {
  name: string;
  description: string;
  techStack: string;
  targetPlatform: string;
  complexity: string;
  projectSpec?: ProjectSpec;
}

export interface ProjectWithDocuments {
  id: string;
  user_id: string;
  name: string;
  description: string;
  tech_stack: string;
  target_platform: string;
  complexity: string;
  status: string;
  progress: number;
  current_step: string;
  created_at: string;
  updated_at: string;
  documents: DocumentRecord[];
}

export interface DocumentRecord {
  id: string;
  project_id: string;
  user_id: string;
  type: string;
  name: string;
  status: string;
  file_path: string | null;
  file_size: number | null;
  download_url: string | null;
  created_at: string;
  updated_at: string;
}

export async function createProjectAndStartGeneration(data: CreateProjectData): Promise<{ projectId: string }> {
  const userId = await getAuthenticatedUser();
  
  console.log('🚀 Starting project creation and generation...');
  console.log('📄 Project data:', JSON.stringify(data, null, 2));
  
  // Create project in Supabase first
  const { projectId } = await createProject(data);
  
  try {
    console.log('🚀 Submitting to webhook with projectId:', projectId);
    // Submit to N8N webhook with project ID, user ID, and project spec
    await submitProjectGeneration({
      projectId,
      userId,
      projectName: data.name,
      description: data.description,
      techStack: data.techStack,
      targetPlatform: data.targetPlatform,
      complexity: data.complexity,
      projectSpec: data.projectSpec,
    });
    console.log('✅ Webhook submission successful');
  } catch (error) {
    console.error('❌ Failed to submit to webhook, but project was created:', error);
    // Project is still created in database even if webhook fails
    throw error; // Re-throw the error so user sees the issue
  }
  
  return { projectId };
}

export async function createProject(data: CreateProjectData): Promise<{ projectId: string }> {
  const userId = await getAuthenticatedUser();
  const supabase = await createSupabaseServerClient();

  console.log('🗄 Creating project for user:', userId);

  // Create project record
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert([{
      user_id: userId,
      name: data.name,
      description: data.description,
      tech_stack: data.techStack,
      target_platform: data.targetPlatform,
      complexity: data.complexity,
      status: 'pending',
      progress: 0,
      current_step: 'Initializing project'
    }])
    .select()
    .single();

  if (projectError) {
    console.error('❌ Error creating project:', projectError);
    throw new Error(`Failed to create project: ${projectError.message}`);
  }

  console.log('✅ Project created with ID:', project.id);

  // Create document placeholders
  const documentTypes = [
    { type: 'PRD', name: 'Product Requirements Document' },
    { type: 'User Stories', name: 'User Journey Document' },
    { type: 'Sitemap', name: 'Application Sitemap' },
    { type: 'Tech Stack', name: 'Technology Requirements' },
    { type: 'Screens', name: 'Screen Specifications' }
  ];

  const { error: documentsError } = await supabase
    .from('documents')
    .insert(
      documentTypes.map(doc => ({
        project_id: project.id,
        user_id: userId,
        type: doc.type,
        name: doc.name,
        status: 'pending'
      }))
    );

  if (documentsError) {
    console.error('❌ Error creating document records:', documentsError);
    throw new Error(`Failed to create document records: ${documentsError.message}`);
  }

  console.log('✅ Document placeholders created');

  revalidatePath('/projects');
  return { projectId: project.id };
}

export async function getUserProjects(): Promise<ProjectWithDocuments[]> {
  const userId = await getAuthenticatedUser();
  const supabase = await createSupabaseServerClient();

  const { data: projects, error } = await supabase
    .from('projects')
    .select(`
      *,
      documents (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    throw new Error('Failed to fetch projects');
  }

  return projects || [];
}

export async function getProject(projectId: string): Promise<ProjectWithDocuments | null> {
  const userId = await getAuthenticatedUser();
  const supabase = await createSupabaseServerClient();

  const { data: project, error } = await supabase
    .from('projects')
    .select(`
      *,
      documents (*)
    `)
    .eq('id', projectId)
    .eq('user_id', userId) // Ensure user can only access their own projects
    .single();

  if (error) {
    console.error('Error fetching project:', error);
    return null;
  }

  return project;
}

export async function updateProjectStatus(
  projectId: string, 
  status: string, 
  progress?: number, 
  currentStep?: string
) {
  const userId = await getAuthenticatedUser();
  const supabase = await createSupabaseServerClient();

  const updateData: Record<string, unknown> = { status };
  if (progress !== undefined) updateData.progress = progress;
  if (currentStep) updateData.current_step = currentStep;

  const { error } = await supabase
    .from('projects')
    .update(updateData)
    .eq('id', projectId)
    .eq('user_id', userId); // Ensure user can only update their own projects

  if (error) {
    console.error('Error updating project status:', error);
    throw new Error('Failed to update project status');
  }

  revalidatePath('/projects');
}

export async function deleteProject(projectId: string): Promise<{ success: boolean }> {
  const userId = await getAuthenticatedUser();
  const supabase = await createSupabaseServerClient();

  console.log('🗑️ Deleting project:', projectId, 'for user:', userId);

  // First, delete all documents associated with the project
  const { error: documentsError } = await supabase
    .from('documents')
    .delete()
    .eq('project_id', projectId)
    .eq('user_id', userId); // Ensure user can only delete their own documents

  if (documentsError) {
    console.error('❌ Error deleting project documents:', documentsError);
    throw new Error(`Failed to delete project documents: ${documentsError.message}`);
  }

  console.log('✅ Project documents deleted');

  // Then delete the project itself
  const { error: projectError } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)
    .eq('user_id', userId); // Ensure user can only delete their own projects

  if (projectError) {
    console.error('❌ Error deleting project:', projectError);
    throw new Error(`Failed to delete project: ${projectError.message}`);
  }

  console.log('✅ Project deleted successfully');

  revalidatePath('/projects');
  return { success: true };
}

export async function updateDocumentStatus(
  documentId: string,
  status: string,
  filePath?: string,
  fileSize?: number,
  downloadUrl?: string
) {
  const userId = await getAuthenticatedUser();
  const supabase = await createSupabaseServerClient();

  const updateData: Record<string, unknown> = { status };
  if (filePath) updateData.file_path = filePath;
  if (fileSize) updateData.file_size = fileSize;
  if (downloadUrl) updateData.download_url = downloadUrl;

  const { error } = await supabase
    .from('documents')
    .update(updateData)
    .eq('id', documentId)
    .eq('user_id', userId); // Ensure user can only update their own documents

  if (error) {
    console.error('Error updating document status:', error);
    throw new Error('Failed to update document status');
  }

  revalidatePath('/projects');
}