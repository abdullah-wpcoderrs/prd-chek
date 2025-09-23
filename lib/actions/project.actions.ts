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
  projectSpec?: ProjectSpec;
}

// New interface for multi-step form data
export interface CreateProjectDataV2 {
  formData: ProductManagerFormData;
  techStack?: string;
  targetPlatform?: string;
}

export interface ProjectWithDocuments {
  id: string;
  user_id: string;
  name: string;
  description: string;
  tech_stack: string;
  target_platform: string;
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

  console.log('🚀 Starting project creation with webhook-first approach...');

  // Step 1: Test webhook connectivity and prepare payload FIRST
  let webhookPayload;
  try {
    const { id: userIdWithEmail, email: userEmail } = await getAuthenticatedUserWithEmail();
    
    webhookPayload = {
      userId: userIdWithEmail,
      userEmail: userEmail || undefined,
      projectName: data.formData.step1.productName,
      description: data.formData.step1.productPitch,
      techStack: data.techStack || 'To be determined',
      targetPlatform: data.targetPlatform || 'web',
      formData: data.formData,
    };

    console.log('📡 Testing webhook connectivity...');
    
    // Test webhook connectivity without projectId first
    await testWebhookConnectivity();
    
  } catch (error) {
    console.error('❌ Webhook connectivity test failed:', error);
    throw new Error('Unable to connect to document generation service. Please check your internet connection and try again.');
  }

  // Step 2: Create project record only after webhook test passes
  let project;
  try {
    console.log('💾 Creating project record...');
    
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .insert([{
        user_id: userId,
        name: data.formData.step1.productName,
        description: data.formData.step1.productPitch,
        tech_stack: data.techStack || 'To be determined',
        target_platform: data.targetPlatform || 'web',
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

    project = projectData;
    console.log('✅ Project record created successfully');

  } catch (error) {
    console.error('❌ Project creation failed:', error);
    throw error;
  }

  // Step 3: Create document placeholders
  try {
    console.log('📄 Creating document placeholders...');
    
    const documentTypesV2 = [
      // Stage 1: Discovery & Research
      { type: 'Research_Insights', name: 'Research & Insights Report', stage: 'discovery' },
      
      // Stage 2: Vision & Strategy  
      { type: 'Vision_Strategy', name: 'Vision & Strategy Document', stage: 'strategy' },
      
      // Stage 3: Requirements & Planning - V2 WITH PRD RESTORED
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
      // Rollback: Delete the project if document creation fails
      await rollbackProject(project.id, supabase);
      throw new Error(`Failed to create document records: ${documentsError.message}`);
    }

    console.log('✅ Document placeholders created successfully');

  } catch (error) {
    console.error('❌ Document creation failed:', error);
    throw error;
  }

  // Step 4: Submit to webhook with project ID
  try {
    console.log('🚀 Submitting to generation pipeline...');
    
    await submitProjectGeneration({
      ...webhookPayload,
      projectId: project.id, // Now we have the project ID
    });
    
    console.log('✅ Project submitted to generation pipeline successfully');

  } catch (error) {
    console.error('❌ Webhook submission failed after project creation:', error);
    
    // Rollback: Delete the project and documents since webhook failed
    try {
      await rollbackProject(project.id, supabase);
      console.log('🔄 Project rolled back due to webhook failure');
    } catch (rollbackError) {
      console.error('❌ Rollback failed:', rollbackError);
    }
    
    throw new Error('Failed to start document generation. The project was not created. Please try again.');
  }

  revalidatePath('/projects');
  return { projectId: project.id };
}

// Helper function to test webhook connectivity
async function testWebhookConnectivity(): Promise<void> {
  const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
  
  if (!webhookUrl) {
    throw new Error('Webhook URL not configured');
  }

  // Simple connectivity test - just check if the endpoint is reachable
  try {
    const response = await fetch(webhookUrl, {
      method: 'HEAD', // Use HEAD to test connectivity without sending data
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Accept any response that's not a network error
    // Even 404 or 405 means the server is reachable
    if (!response) {
      throw new Error('No response from webhook service');
    }
    
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to reach document generation service');
    }
    throw error;
  }
}

// Helper function to rollback project creation
async function rollbackProject(projectId: string, supabase: any): Promise<void> {
  try {
    // Delete documents first (foreign key constraint)
    await supabase
      .from('documents')
      .delete()
      .eq('project_id', projectId);

    // Then delete the project
    await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    console.log('🔄 Project and documents rolled back successfully');
  } catch (error) {
    console.error('❌ Rollback operation failed:', error);
    throw new Error('Failed to clean up after error. Please contact support.');
  }
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