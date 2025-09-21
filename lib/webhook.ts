// lib/webhook.ts - N8N Webhook Integration

import { ProjectSpec, ProductManagerFormData } from '@/types';
import V2DocumentPrompts from './prompts/v2-document-prompts';

export interface ProjectGenerationRequest {
  projectName?: string;
  description: string;
  techStack: string;
  targetPlatform: string;
  userId?: string;
  userEmail?: string;
  // V2 fields (now the only supported version)
  formData: ProductManagerFormData;
  // Enhanced prompts for document generation
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
  const startTime = Date.now();
  
  try {
    // Validate required fields
    if (!request.projectId) {
      throw new Error('Project ID is required for webhook submission');
    }

    if (!N8N_WEBHOOK_URL) {
      throw new Error('Webhook URL is not configured. Please check your environment variables.');
    }

    console.log('🚀 Submitting project to webhook...');

    // Enhance payload with document prompts (V2 is now the only version)
    let enhancedRequest = { ...request };
    
    if (request.formData) {
      const promptContext = {
        formData: request.formData,
        techStack: request.techStack,
        targetPlatform: request.targetPlatform,
        projectName: request.projectName || 'Untitled Project'
      };
      
      enhancedRequest.documentPrompts = V2DocumentPrompts.getAllPrompts(promptContext);
    }

    // Send to N8N with enhanced error handling and timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'PRD-Chek/1.0',
      },
      body: JSON.stringify({
        ...enhancedRequest,
        timestamp: new Date().toISOString(),
        requestId: generateRequestId(),
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const duration = Date.now() - startTime;
    console.log(`📡 Webhook response received in ${duration}ms`);

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      try {
        const errorText = await response.text();
        if (errorText) {
          errorMessage += ` - ${errorText}`;
        }
      } catch (e) {
        // Ignore error reading response body
      }

      console.error('❌ Webhook error response:', errorMessage);
      
      // Provide user-friendly error messages based on status code
      if (response.status >= 500) {
        throw new Error('Document generation service is temporarily unavailable. Please try again in a few minutes.');
      } else if (response.status === 404) {
        throw new Error('Document generation service endpoint not found. Please contact support.');
      } else if (response.status === 403) {
        throw new Error('Access denied to document generation service. Please contact support.');
      } else if (response.status >= 400) {
        throw new Error('Invalid request to document generation service. Please try again.');
      } else {
        throw new Error(`Document generation service error: ${errorMessage}`);
      }
    }

    console.log('✅ Webhook submission successful');
    return { projectId: request.projectId };
  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error(`❌ Webhook submission failed after ${duration}ms:`, error);
    
    // Handle specific error types
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to document generation service. Please check your internet connection.');
    }
    
    if (error.name === 'AbortError') {
      throw new Error('Request timeout: Document generation service is taking too long to respond. Please try again.');
    }
    
    // Re-throw custom errors as-is
    if (error instanceof Error && error.message.includes('generation service')) {
      throw error;
    }
    
    // Generic fallback
    throw new Error('Failed to start document generation. Please try again or contact support if the problem persists.');
  }
}

/**
 * Generate a unique request ID
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}