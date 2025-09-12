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

    console.log('🚀 Submitting to webhook:', N8N_WEBHOOK_URL);
    console.log('📦 Payload:', JSON.stringify(request, null, 2));

    // Send to N8N with the provided project ID (fire and forget)
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

    console.log('📡 Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Webhook error response:', errorText);
      throw new Error(`Webhook request failed: ${response.status} ${response.statusText}`);
    }

    console.log('✅ Webhook submission successful');
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