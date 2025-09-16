export type Recipe = {
  id?: string;
  name: string;
  ingredients: string[];
  instructions: string;
};

export type Comment = {
  id?: string;
  comment: string;
  created_at: string;
  user_id: string;
  recipe_id: string;
};

export interface ProjectSpec {
  coreFeatures: string;
  targetUsers: string;
  designStyle: string;
  customDesignStyle?: string;
  brandGuidelines: string;
  multiUserRoles: boolean;
  roleDefinitions?: string;
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