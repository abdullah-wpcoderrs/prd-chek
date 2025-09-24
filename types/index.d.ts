export type Comment = {
  id?: string;
  comment: string;
  created_at: string;
  user_id: string;
  project_id?: string;
};

// Legacy ProjectSpec - keeping for backward compatibility
export interface ProjectSpec {
  coreFeatures: string;
  targetUsers: string;
  designStyle: string;
  customDesignStyle?: string;
  brandGuidelines: string;
  multiUserRoles: boolean;
  roleDefinitions?: string;
}

// New Multi-Step Form Types
export interface ProductBasics {
  productName: string;
  productPitch: string;
  industry: string;
  currentStage: 'idea' | 'mvp' | 'growth' | 'scaling';
  techStack?: string;
  targetPlatform?: 'web' | 'mobile' | 'desktop' | 'both' | 'other';
}

export interface UsersProblems {
  targetUsers: string;
  painPoints: string[];
  primaryJobToBeDone: string;
}

export interface Competitor {
  name: string;
  note: string;
}

export interface MarketContext {
  competitors: Competitor[];
  differentiation: string;
  marketTrend?: string;
}

export interface ValueVision {
  valueProposition: string;
  productVision: string;
  successMetric?: string;
}

export interface RequirementsPlanning {
  mustHaveFeatures: string[];
  niceToHaveFeatures: string[];
  constraints?: string;
  prioritizationMethod: 'RICE' | 'MoSCoW' | 'Kano';
}

export interface ProductManagerFormData {
  step1: ProductBasics;
  step2: UsersProblems;
  step3: MarketContext;
  step4: ValueVision;
  step5: RequirementsPlanning;
}

export interface CreateProjectDataV2 {
  formData: ProductManagerFormData;
  techStack?: string;
  targetPlatform?: string;
  complexity?: string;
}

// Document generation types
export interface GenerationDocument {
  type: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  size?: string;
  downloadUrl?: string;
  stage?: 'discovery' | 'strategy' | 'planning';
}

export interface GenerationStatus {
  projectId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  currentStep: string;
  estimatedTime?: number;
  documents: GenerationDocument[];
  projectVersion?: 'v2';
}

// Add type declarations for PDF.js
declare module "pdfjs-dist/build/pdf" {
  const pdfjsLib: any;
  export default pdfjsLib;
}

declare module "pdfjs-dist/build/pdf.worker?url" {
  const workerUrl: string;
  export default workerUrl;
}

// Enhanced type declarations for PDF.js .mjs files to fix TypeScript errors
declare module "pdfjs-dist/build/pdf.mjs" {
  const pdfjsLib: any;
  export default pdfjsLib;
}

declare module "pdfjs-dist/build/pdf.worker.mjs" {
  const pdfjsWorker: any;
  export default pdfjsWorker;
}

// Additional declarations for dynamic imports used in DocumentViewer
declare module "pdfjs-dist" {
  const pdfjsLib: any;
  export default pdfjsLib;
  export * from "pdfjs-dist/types/pdf";
}