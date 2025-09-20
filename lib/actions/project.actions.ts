"use server";

import { createSupabaseServerClient, getAuthenticatedUser, getAuthenticatedUserWithEmail } from "@/lib/supabase-server";
import { submitProjectGeneration } from "@/lib/webhook";
import { revalidatePath } from "next/cache";
import { ProjectSpec, ProductManagerFormData } from "@/types";

export interface CreateProjectData {
  name: string;
  description: string;
  techStack: string;
  targetPlatform: string;
  complexity: string;
  projectSpec?: ProjectSpec;
}

// New interface for multi-step form data
export interface CreateProjectDataV2 {
  formData: ProductManagerFormData;
  techStack?: string;
  targetPlatform?: string;
  complexity?: string;
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
  document_stage?: string | null; // V2 enhancement: document stage
  created_at: string;
  updated_at: string;
}



// V1 function removed - V2 is now the only supported version

export async function createProjectAndStartGeneration(data: CreateProjectDataV2): Promise<{ projectId: string }> {
  const userId = await getAuthenticatedUser();
  const supabase = await createSupabaseServerClient();

  // Create project record with enhanced data
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert([{
      user_id: userId,
      name: data.formData.step1.productName,
      description: data.formData.step1.productPitch,
      tech_stack: data.techStack || 'To be determined',
      target_platform: data.targetPlatform || 'web',
      complexity: data.complexity || 'medium',
      status: 'pending',
      progress: 0,
      current_step: 'Initializing project',
      // Store the complete form data as JSON
      form_data: data.formData,
      // Mark as v2 project
      project_version: 'v2'
    }])
    .select()
    .single();

  if (projectError) {
    console.error('❌ Error creating project:', projectError);
    throw new Error(`Failed to create project: ${projectError.message}`);
  }

  // Create enhanced document placeholders
  const documentTypesV2 = [
    // Stage 1: Discovery & Research
    { type: 'Research_Insights', name: 'Research & Insights Report', stage: 'discovery' },
    
    // Stage 2: Vision & Strategy  
    { type: 'Vision_Strategy', name: 'Vision & Strategy Document', stage: 'strategy' },
    
    // Stage 3: Requirements & Planning
    { type: 'PRD', name: 'Product Requirements Document', stage: 'planning' },
    { type: 'BRD', name: 'Business Requirements Document', stage: 'planning' },
    { type: 'TRD', name: 'Technical Requirements Document', stage: 'planning' },
    { type: 'Planning_Toolkit', name: 'Planning Toolkit', stage: 'planning' }
  ];

  const { error: documentsError } = await supabase
    .from('documents')
    .insert(
      documentTypesV2.map(doc => ({
        project_id: project.id,
        user_id: userId,
        type: doc.type,
        name: doc.name,
        status: 'pending',
        document_stage: doc.stage
      }))
    );

  if (documentsError) {
    console.error('❌ Error creating document records:', documentsError);
    throw new Error(`Failed to create document records: ${documentsError.message}`);
  }

  console.log('✅ Enhanced document placeholders created');

  // Submit to N8N webhook for document generation
  try {
    const { id: userIdWithEmail, email: userEmail } = await getAuthenticatedUserWithEmail();
    
    await submitProjectGeneration({
      projectId: project.id,
      userId: userIdWithEmail,
      userEmail: userEmail || undefined,
      projectName: data.formData.step1.productName,
      description: data.formData.step1.productPitch,
      techStack: data.techStack || 'To be determined',
      targetPlatform: data.targetPlatform || 'web',
      complexity: data.complexity || 'medium',
      formData: data.formData,
    });
    
    console.log('✅ Project submitted to generation pipeline');
  } catch (error) {
    console.error('❌ Failed to submit to webhook, but project was created:', error);
    // Project is still created in database even if webhook fails
    throw error; // Re-throw the error so user sees the issue
  }

  revalidatePath('/projects');
  return { projectId: project.id };
}

// Legacy V1 createProject function removed - use createProjectAndStartGeneration instead

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

export async function updateProject(
  projectId: string,
  data: {
    name?: string;
    description?: string;
    tech_stack?: string;
    target_platform?: string;
    complexity?: string;
  }
): Promise<{ success: boolean }> {
  const userId = await getAuthenticatedUser();
  const supabase = await createSupabaseServerClient();

  // Project update logging removed for security

  const { error } = await supabase
    .from('projects')
    .update(data)
    .eq('id', projectId)
    .eq('user_id', userId); // Ensure user can only update their own projects

  if (error) {
    console.error('❌ Error updating project:', error);
    throw new Error(`Failed to update project: ${error.message}`);
  }

  console.log('✅ Project updated successfully');

  revalidatePath('/projects');
  return { success: true };
}

export async function deleteProject(projectId: string): Promise<{ success: boolean }> {
  const userId = await getAuthenticatedUser();
  const supabase = await createSupabaseServerClient();

  // Project deletion logging removed for security

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

// Duplicate function removed - use createProjectAndStartGeneration instead

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