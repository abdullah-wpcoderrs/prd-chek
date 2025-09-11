// lib/webhook.ts - N8N Webhook Integration

import { ProjectSpec } from '@/types';

export interface ProjectGenerationRequest {
  projectName?: string;
  description: string;
  techStack: string;
  targetPlatform: string;
  complexity: string;
  userId?: string;
  projectSpec?: ProjectSpec;
}

export interface GenerationStatus {
  projectId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  currentStep: string;
  estimatedTime?: number;
  documents: DocumentStatus[];
}

export interface DocumentStatus {
  type: 'PRD' | 'User Stories' | 'Sitemap' | 'Tech Stack' | 'Screens';
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
  size?: string;
}

// N8N Webhook Configuration
const N8N_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 'https://your-n8n-instance.com/webhook/generate-docs';
const N8N_STATUS_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_STATUS_WEBHOOK_URL || 'https://your-n8n-instance.com/webhook/status';

/**
 * Submit a project for documentation generation
 */
export async function submitProjectGeneration(request: ProjectGenerationRequest): Promise<{ projectId: string }> {
  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...request,
        timestamp: new Date().toISOString(),
        requestId: generateRequestId(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Webhook request failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Failed to submit project generation:', error);
    throw new Error('Failed to submit project for generation. Please try again.');
  }
}

/**
 * Get the current status of a project generation
 */
export async function getGenerationStatus(projectId: string): Promise<GenerationStatus> {
  try {
    const response = await fetch(`${N8N_STATUS_WEBHOOK_URL}?projectId=${projectId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Status request failed: ${response.statusText}`);
    }

    const status = await response.json();
    return status;
  } catch (error) {
    console.error('Failed to get generation status:', error);
    throw new Error('Failed to get project status. Please try again.');
  }
}

/**
 * Poll for status updates with exponential backoff
 */
export async function pollGenerationStatus(
  projectId: string,
  onStatusUpdate: (status: GenerationStatus) => void,
  maxAttempts: number = 60 // 5 minutes with 5-second intervals
): Promise<GenerationStatus> {
  let attempts = 0;
  const baseDelay = 5000; // 5 seconds

  const poll = async (): Promise<GenerationStatus> => {
    attempts++;
    
    try {
      const status = await getGenerationStatus(projectId);
      onStatusUpdate(status);

      // If completed or failed, return the final status
      if (status.status === 'completed' || status.status === 'failed') {
        return status;
      }

      // If max attempts reached, throw error
      if (attempts >= maxAttempts) {
        throw new Error('Generation timeout: Process is taking longer than expected');
      }

      // Calculate delay with exponential backoff (capped at 30 seconds)
      const delay = Math.min(baseDelay * Math.pow(1.2, attempts - 1), 30000);
      
      // Continue polling after delay
      await new Promise(resolve => setTimeout(resolve, delay));
      return poll();
    } catch (error) {
      if (attempts < 3) {
        // Retry up to 3 times for network errors
        await new Promise(resolve => setTimeout(resolve, baseDelay));
        return poll();
      }
      throw error;
    }
  };

  return poll();
}

/**
 * Generate a unique request ID
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Mock functions for development/testing
 */
export const mockWebhookFunctions = {
  async submitProjectGeneration(request: ProjectGenerationRequest): Promise<{ projectId: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const projectId = `project_${Date.now()}`;
    
    // Store mock project in localStorage for demo
    const projects = JSON.parse(localStorage.getItem('mockProjects') || '[]');
    const newProject = {
      id: projectId,
      ...request,
      status: 'processing',
      createdAt: new Date().toISOString(),
      documents: [
        { type: 'PRD', name: 'Product Requirements Document', status: 'processing' },
        { type: 'User Stories', name: 'User Journey Document', status: 'pending' },
        { type: 'Sitemap', name: 'Application Sitemap', status: 'pending' },
        { type: 'Tech Stack', name: 'Technology Requirements', status: 'pending' },
        { type: 'Screens', name: 'Screen Specifications', status: 'pending' },
      ]
    };
    
    projects.push(newProject);
    localStorage.setItem('mockProjects', JSON.stringify(projects));
    
    return { projectId };
  },

  async getGenerationStatus(projectId: string): Promise<GenerationStatus> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const projects = JSON.parse(localStorage.getItem('mockProjects') || '[]');
    const project = projects.find((p: any) => p.id === projectId);
    
    if (!project) {
      throw new Error('Project not found');
    }

    // Simulate progress
    const now = Date.now();
    const created = new Date(project.createdAt).getTime();
    const elapsed = now - created;
    const totalTime = 5 * 60 * 1000; // 5 minutes total
    const progress = Math.min(100, (elapsed / totalTime) * 100);
    
    // Update document statuses based on progress
    const documents = project.documents.map((doc: any, index: number) => {
      const docProgress = (progress - (index * 20)) / 20 * 100;
      let status = 'pending';
      
      if (docProgress >= 100) {
        status = 'completed';
      } else if (docProgress > 0) {
        status = 'processing';
      }
      
      return {
        ...doc,
        status,
        size: status === 'completed' ? `${(Math.random() * 3 + 1).toFixed(1)} MB` : undefined,
        downloadUrl: status === 'completed' ? `#download-${doc.type}` : undefined,
      };
    });
    
    const overallStatus = progress >= 100 ? 'completed' : 'processing';
    const currentStep = documents.find((d: any) => d.status === 'processing')?.name || 'Finalizing documents';
    
    // Update project in localStorage
    project.status = overallStatus;
    project.progress = progress;
    project.documents = documents;
    localStorage.setItem('mockProjects', JSON.stringify(projects));
    
    return {
      projectId,
      status: overallStatus,
      progress,
      currentStep,
      estimatedTime: overallStatus === 'processing' ? Math.max(0, totalTime - elapsed) : 0,
      documents,
    };
  }
};

// Use mock functions in development, real functions in production
export const webhookAPI = process.env.NODE_ENV === 'development' ? mockWebhookFunctions : {
  submitProjectGeneration,
  getGenerationStatus,
};