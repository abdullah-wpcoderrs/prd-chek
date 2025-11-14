// lib/ai/response-parser.ts - Parse AI responses to ProductManagerFormData

import { ProductManagerFormData } from '@/types';

export interface ParsedResponse {
  success: boolean;
  data?: ProductManagerFormData;
  error?: string;
}

/**
 * Parse AI response and validate against ProductManagerFormData structure
 */
export function parseAIResponse(response: string): ParsedResponse {
  try {
    // Remove markdown code blocks if present
    let cleanedResponse = response.trim();
    
    // Remove ```json and ``` if present
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/```\s*$/, '');
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/```\s*$/, '');
    }
    
    // Parse JSON
    const parsed = JSON.parse(cleanedResponse);
    
    // Validate structure
    const validation = validateFormData(parsed);
    
    if (!validation.isValid) {
      return {
        success: false,
        error: `Invalid structure: ${validation.errors.join(', ')}`
      };
    }
    
    return {
      success: true,
      data: parsed as ProductManagerFormData
    };
    
  } catch (error) {
    console.error('Error parsing AI response:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to parse response'
    };
  }
}

/**
 * Validate ProductManagerFormData structure
 */
function validateFormData(data: unknown): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: ['Data must be an object'] };
  }
  
  const formData = data as Record<string, unknown>;
  
  // Validate step1
  if (!formData.step1 || typeof formData.step1 !== 'object') {
    errors.push('Missing or invalid step1');
  } else {
    const step1 = formData.step1 as Record<string, unknown>;
    if (!step1.productName || typeof step1.productName !== 'string') {
      errors.push('step1.productName is required');
    }
    if (!step1.productPitch || typeof step1.productPitch !== 'string') {
      errors.push('step1.productPitch is required');
    }
    if (!step1.industry || typeof step1.industry !== 'string') {
      errors.push('step1.industry is required');
    }
    if (!step1.currentStage || !['idea', 'mvp', 'growth', 'scaling'].includes(step1.currentStage as string)) {
      errors.push('step1.currentStage must be one of: idea, mvp, growth, scaling');
    }
  }
  
  // Validate step2
  if (!formData.step2 || typeof formData.step2 !== 'object') {
    errors.push('Missing or invalid step2');
  } else {
    const step2 = formData.step2 as Record<string, unknown>;
    if (!step2.valueProposition || typeof step2.valueProposition !== 'string') {
      errors.push('step2.valueProposition is required');
    }
    if (!step2.productVision || typeof step2.productVision !== 'string') {
      errors.push('step2.productVision is required');
    }
  }
  
  // Validate step3
  if (!formData.step3 || typeof formData.step3 !== 'object') {
    errors.push('Missing or invalid step3');
  } else {
    const step3 = formData.step3 as Record<string, unknown>;
    if (!step3.targetUsers || typeof step3.targetUsers !== 'string') {
      errors.push('step3.targetUsers is required');
    }
    if (!Array.isArray(step3.painPoints)) {
      errors.push('step3.painPoints must be an array');
    }
    if (!step3.primaryJobToBeDone || typeof step3.primaryJobToBeDone !== 'string') {
      errors.push('step3.primaryJobToBeDone is required');
    }
  }
  
  // Validate step4
  if (!formData.step4 || typeof formData.step4 !== 'object') {
    errors.push('Missing or invalid step4');
  } else {
    const step4 = formData.step4 as Record<string, unknown>;
    if (!Array.isArray(step4.competitors)) {
      errors.push('step4.competitors must be an array');
    }
  }
  
  // Validate step5
  if (!formData.step5 || typeof formData.step5 !== 'object') {
    errors.push('Missing or invalid step5');
  } else {
    const step5 = formData.step5 as Record<string, unknown>;
    if (!Array.isArray(step5.mustHaveFeatures)) {
      errors.push('step5.mustHaveFeatures must be an array');
    }
    if (!Array.isArray(step5.niceToHaveFeatures)) {
      errors.push('step5.niceToHaveFeatures must be an array');
    }
    if (!['RICE', 'MoSCoW', 'Kano'].includes(step5.prioritizationMethod as string)) {
      errors.push('step5.prioritizationMethod must be one of: RICE, MoSCoW, Kano');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Extract changes between two outlines
 */
export function extractChanges(
  oldOutline: ProductManagerFormData,
  newOutline: ProductManagerFormData
): string[] {
  const changes: string[] = [];
  
  // Compare step1
  if (oldOutline.step1.productName !== newOutline.step1.productName) {
    changes.push(`Product name changed to "${newOutline.step1.productName}"`);
  }
  if (oldOutline.step1.industry !== newOutline.step1.industry) {
    changes.push(`Industry changed to "${newOutline.step1.industry}"`);
  }
  if (oldOutline.step1.currentStage !== newOutline.step1.currentStage) {
    changes.push(`Current stage changed to "${newOutline.step1.currentStage}"`);
  }
  
  // Compare step3 pain points
  if (JSON.stringify(oldOutline.step3.painPoints) !== JSON.stringify(newOutline.step3.painPoints)) {
    changes.push('Pain points updated');
  }
  
  // Compare step4 competitors
  if (JSON.stringify(oldOutline.step4.competitors) !== JSON.stringify(newOutline.step4.competitors)) {
    changes.push('Competitors list updated');
  }
  
  // Compare step5 features
  if (JSON.stringify(oldOutline.step5.mustHaveFeatures) !== JSON.stringify(newOutline.step5.mustHaveFeatures)) {
    changes.push('Must-have features updated');
  }
  if (JSON.stringify(oldOutline.step5.niceToHaveFeatures) !== JSON.stringify(newOutline.step5.niceToHaveFeatures)) {
    changes.push('Nice-to-have features updated');
  }
  
  return changes;
}
