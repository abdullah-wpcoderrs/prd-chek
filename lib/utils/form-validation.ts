import { ProductManagerFormData, ProductBasics, UsersProblems, MarketContext, ValueVision, RequirementsPlanning } from '@/types';

export interface ValidationError {
  field: string;
  message: string;
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
}

export interface StepValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

// Validation rules configuration
const VALIDATION_RULES = {
  productName: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z0-9\s\-_&.]+$/,
    patternMessage: 'Product name can only contain letters, numbers, spaces, and basic punctuation'
  },
  productPitch: {
    required: true,
    minLength: 20,
    maxLength: 500
  },
  industry: {
    required: true
  },
  targetUsers: {
    required: true,
    minLength: 10,
    maxLength: 300
  },
  primaryJobToBeDone: {
    required: true,
    minLength: 10,
    maxLength: 200
  },
  painPoints: {
    required: true,
    minItems: 1,
    maxItems: 10,
    itemMinLength: 5,
    itemMaxLength: 100
  },
  differentiation: {
    required: true,
    minLength: 20,
    maxLength: 400
  },
  valueProposition: {
    required: true,
    minLength: 20,
    maxLength: 300
  },
  productVision: {
    required: true,
    minLength: 20,
    maxLength: 400
  },
  mustHaveFeatures: {
    required: true,
    minItems: 1,
    maxItems: 20,
    itemMinLength: 3,
    itemMaxLength: 100
  }
};

// Helper function to validate a single field
function validateField(value: any, rules: any, fieldName: string): ValidationError[] {
  const errors: ValidationError[] = [];

  // Required validation
  if (rules.required) {
    if (Array.isArray(value)) {
      if (value.length === 0) {
        errors.push({
          field: fieldName,
          message: `${fieldName.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`,
          type: 'required'
        });
      }
    } else if (!value || (typeof value === 'string' && !value.trim())) {
      errors.push({
        field: fieldName,
        message: `${fieldName.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`,
        type: 'required'
      });
    }
  }

  // Skip other validations if field is empty and not required
  if (!value || (typeof value === 'string' && !value.trim())) {
    return errors;
  }

  // String validations
  if (typeof value === 'string') {
    // Min length
    if (rules.minLength && value.trim().length < rules.minLength) {
      errors.push({
        field: fieldName,
        message: `Must be at least ${rules.minLength} characters long`,
        type: 'minLength'
      });
    }

    // Max length
    if (rules.maxLength && value.trim().length > rules.maxLength) {
      errors.push({
        field: fieldName,
        message: `Must be no more than ${rules.maxLength} characters long`,
        type: 'maxLength'
      });
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(value.trim())) {
      errors.push({
        field: fieldName,
        message: rules.patternMessage || 'Invalid format',
        type: 'pattern'
      });
    }
  }

  // Array validations
  if (Array.isArray(value)) {
    // Min items
    if (rules.minItems && value.length < rules.minItems) {
      errors.push({
        field: fieldName,
        message: `Must have at least ${rules.minItems} item${rules.minItems !== 1 ? 's' : ''}`,
        type: 'required'
      });
    }

    // Max items
    if (rules.maxItems && value.length > rules.maxItems) {
      errors.push({
        field: fieldName,
        message: `Cannot have more than ${rules.maxItems} items`,
        type: 'maxLength'
      });
    }

    // Validate each item
    if (rules.itemMinLength || rules.itemMaxLength) {
      value.forEach((item, index) => {
        if (typeof item === 'string') {
          if (rules.itemMinLength && item.trim().length < rules.itemMinLength) {
            errors.push({
              field: `${fieldName}[${index}]`,
              message: `Item ${index + 1} must be at least ${rules.itemMinLength} characters long`,
              type: 'minLength'
            });
          }
          if (rules.itemMaxLength && item.trim().length > rules.itemMaxLength) {
            errors.push({
              field: `${fieldName}[${index}]`,
              message: `Item ${index + 1} must be no more than ${rules.itemMaxLength} characters long`,
              type: 'maxLength'
            });
          }
        }
      });
    }
  }

  return errors;
}

// Step 1 validation
export function validateStep1(data: ProductBasics): StepValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Validate each field
  errors.push(...validateField(data.productName, VALIDATION_RULES.productName, 'productName'));
  errors.push(...validateField(data.productPitch, VALIDATION_RULES.productPitch, 'productPitch'));
  errors.push(...validateField(data.industry, VALIDATION_RULES.industry, 'industry'));

  // Custom validations
  if (data.productName && data.productPitch && 
      data.productName.toLowerCase() === data.productPitch.toLowerCase()) {
    warnings.push({
      field: 'productPitch',
      message: 'Product pitch should be different from the product name',
      type: 'custom'
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

// Step 2 validation
export function validateStep2(data: UsersProblems): StepValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  errors.push(...validateField(data.targetUsers, VALIDATION_RULES.targetUsers, 'targetUsers'));
  errors.push(...validateField(data.primaryJobToBeDone, VALIDATION_RULES.primaryJobToBeDone, 'primaryJobToBeDone'));
  errors.push(...validateField(data.painPoints, VALIDATION_RULES.painPoints, 'painPoints'));

  // Check for duplicate pain points
  const uniquePainPoints = new Set(data.painPoints.map(p => p.toLowerCase().trim()));
  if (uniquePainPoints.size < data.painPoints.length) {
    warnings.push({
      field: 'painPoints',
      message: 'Some pain points appear to be duplicates',
      type: 'custom'
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

// Step 3 validation
export function validateStep3(data: MarketContext): StepValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  errors.push(...validateField(data.differentiation, VALIDATION_RULES.differentiation, 'differentiation'));

  // Validate competitors
  if (data.competitors.length > 10) {
    warnings.push({
      field: 'competitors',
      message: 'Consider focusing on the top 5-7 most relevant competitors',
      type: 'custom'
    });
  }

  // Check for duplicate competitors
  const uniqueCompetitors = new Set(data.competitors.map(c => c.name.toLowerCase().trim()));
  if (uniqueCompetitors.size < data.competitors.length) {
    warnings.push({
      field: 'competitors',
      message: 'Some competitors appear to be duplicates',
      type: 'custom'
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

// Step 4 validation
export function validateStep4(data: ValueVision): StepValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  errors.push(...validateField(data.valueProposition, VALIDATION_RULES.valueProposition, 'valueProposition'));
  errors.push(...validateField(data.productVision, VALIDATION_RULES.productVision, 'productVision'));

  // Check if value proposition and vision are too similar
  if (data.valueProposition && data.productVision) {
    const similarity = calculateStringSimilarity(data.valueProposition, data.productVision);
    if (similarity > 0.8) {
      warnings.push({
        field: 'productVision',
        message: 'Product vision should be distinct from the value proposition',
        type: 'custom'
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

// Step 5 validation
export function validateStep5(data: RequirementsPlanning): StepValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  errors.push(...validateField(data.mustHaveFeatures, VALIDATION_RULES.mustHaveFeatures, 'mustHaveFeatures'));

  // Check for overlap between must-have and nice-to-have features
  const mustHaveSet = new Set(data.mustHaveFeatures.map(f => f.toLowerCase().trim()));
  const niceToHaveSet = new Set(data.niceToHaveFeatures.map(f => f.toLowerCase().trim()));
  const overlap = [...mustHaveSet].filter(f => niceToHaveSet.has(f));
  
  if (overlap.length > 0) {
    warnings.push({
      field: 'niceToHaveFeatures',
      message: 'Some features appear in both must-have and nice-to-have lists',
      type: 'custom'
    });
  }

  // Warn if too many must-have features
  if (data.mustHaveFeatures.length > 15) {
    warnings.push({
      field: 'mustHaveFeatures',
      message: 'Consider if all features are truly "must-have" for the initial version',
      type: 'custom'
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

// Validate entire form
export function validateEntireForm(data: ProductManagerFormData): {
  isValid: boolean;
  stepResults: Record<string, StepValidationResult>;
  totalErrors: number;
  totalWarnings: number;
} {
  const stepResults = {
    step1: validateStep1(data.step1),
    step2: validateStep2(data.step2),
    step3: validateStep3(data.step3),
    step4: validateStep4(data.step4),
    step5: validateStep5(data.step5)
  };

  const totalErrors = Object.values(stepResults).reduce((sum, result) => sum + result.errors.length, 0);
  const totalWarnings = Object.values(stepResults).reduce((sum, result) => sum + result.warnings.length, 0);
  const isValid = Object.values(stepResults).every(result => result.isValid);

  return {
    isValid,
    stepResults,
    totalErrors,
    totalWarnings
  };
}

// Helper function to calculate string similarity
function calculateStringSimilarity(str1: string, str2: string): number {
  const words1 = str1.toLowerCase().split(/\s+/);
  const words2 = str2.toLowerCase().split(/\s+/);
  const allWords = new Set([...words1, ...words2]);
  
  let commonWords = 0;
  for (const word of allWords) {
    if (words1.includes(word) && words2.includes(word)) {
      commonWords++;
    }
  }
  
  return commonWords / allWords.size;
}

// Get field-specific validation rules for UI hints
export function getFieldValidationRules(fieldName: string) {
  return VALIDATION_RULES[fieldName as keyof typeof VALIDATION_RULES] || {};
}