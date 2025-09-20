// lib/webhook.ts - N8N Webhook Integration

import { ProjectSpec, ProductManagerFormData } from '@/types';
import V2DocumentPrompts from './prompts/v2-document-prompts';

export interface ProjectGenerationRequest {
  projectName?: string;
  description: string;
  techStack: string;
  targetPlatform: string;
  complexity: string;
  userId?: string;
  userEmail?: string;
  projectSpec?: ProjectSpec;
  // Enhanced v2 fields
  formData?: ProductManagerFormData;
  projectVersion?: 'v1' | 'v2';
  // Enhanced prompts for v2
  documentPrompts?: {
    research_insights: string;
    vision_strategy: string;
    prd: string;
    brd: string;
    trd: string;
    planning_toolkit: string;
  };
}

// N8N Webhook Configuration
const N8N_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 'https://your-n8n-instance.com/webhook/generate-docs';

/**
 * Submit a project for documentation generation
 * This function sends the project data to N8N and doesn't wait for a response
 */
export async function submitProjectGeneration(request: ProjectGenerationRequest & { projectId?: string }): Promise<{ projectId: string }> {
  try {
    // If projectId is not provided, it means project creation should happen elsewhere
    if (!request.projectId) {
      throw new Error('Project ID is required for webhook submission');
    }

    // Webhook submission (URL and payload logging removed for security)

    // Enhance payload with document prompts for v2 projects
    let enhancedRequest = { ...request };
    
    if (request.projectVersion === 'v2' && request.formData) {
      const promptContext = {
        formData: request.formData,
        techStack: request.techStack,
        targetPlatform: request.targetPlatform,
        complexity: request.complexity,
        projectName: request.projectName || 'Untitled Project'
      };
      
      enhancedRequest.documentPrompts = V2DocumentPrompts.getAllPrompts(promptContext);
    }

    // Send to N8N with the provided project ID (fire and forget)
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...enhancedRequest,
        timestamp: new Date().toISOString(),
        requestId: generateRequestId(),
      }),
    });

    // Response status logging removed for security

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Webhook error response:', errorText);
      throw new Error(`Webhook request failed: ${response.status} ${response.statusText}`);
    }

    // Webhook success logging removed for security
    return { projectId: request.projectId };
  } catch (error) {
    console.error('❌ Failed to submit project generation:', error);
    throw new Error('Failed to submit project for generation. Please try again.');
  }
}

/**
 * Generate a unique request ID
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}