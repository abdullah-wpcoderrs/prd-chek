"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import { GenerationDocument, GenerationStatus } from '@/types';
import { formatFileSize } from '@/lib/utils/file-size';

// Re-export for convenience
export type { GenerationDocument, GenerationStatus };

interface GenerationContextType {
  activeGenerations: Map<string, GenerationStatus>;
  addGeneration: (projectId: string) => void;
  removeGeneration: (projectId: string) => void;
  getGenerationStatus: (projectId: string) => GenerationStatus | undefined;
  updateGenerationFromProject: (project: any) => void; // Update from real project data
}

const GenerationContext = createContext<GenerationContextType | undefined>(undefined);

export function useGeneration() {
  const context = useContext(GenerationContext);
  if (!context) {
    throw new Error('useGeneration must be used within a GenerationProvider');
  }
  return context;
}

interface GenerationProviderProps {
  children: ReactNode;
}

export function GenerationProvider({ children }: GenerationProviderProps) {
  const [activeGenerations, setActiveGenerations] = useState<Map<string, GenerationStatus>>(new Map());

  const addGeneration = (projectId: string) => {
    const documents: GenerationDocument[] = [
      // Stage 1: Discovery & Research
      { type: "Research_Insights", name: "Research & Insights Report", status: "pending", stage: "discovery" },
      
      // Stage 2: Vision & Strategy
      { type: "Vision_Strategy", name: "Vision & Strategy Document", status: "pending", stage: "strategy" },
      
      // Stage 3: Requirements & Planning (V2 WITH PRD RESTORED)
      { type: "PRD", name: "Product Requirements Document", status: "pending", stage: "planning" },
      { type: "BRD", name: "Business Requirements Document", status: "pending", stage: "planning" },
      { type: "TRD", name: "Technical Requirements Document", status: "pending", stage: "planning" },
      { type: "Planning_Toolkit", name: "Planning Toolkit", status: "pending", stage: "planning" }
    ];

    const initialStatus: GenerationStatus = {
      projectId,
      status: 'pending',
      progress: 0,
      currentStep: 'Initializing enhanced generation...',
      documents,
      projectVersion: 'v2'
    };

    setActiveGenerations(prev => new Map(prev.set(projectId, initialStatus)));
  };

  const removeGeneration = (projectId: string) => {
    setActiveGenerations(prev => {
      const newMap = new Map(prev);
      newMap.delete(projectId);
      return newMap;
    });
  };

  const getGenerationStatus = (projectId: string): GenerationStatus | undefined => {
    return activeGenerations.get(projectId);
  };

  const updateGenerationFromProject = (project: any) => {
    if (!project || !project.documents) return;

    // Convert DocumentRecord[] to GenerationDocument[]
    const documents: GenerationDocument[] = project.documents.map((doc: any) => ({
      type: doc.type,
      name: doc.name,
      status: doc.status as 'pending' | 'processing' | 'completed' | 'failed',
      size: doc.file_size ? formatFileSize(doc.file_size) : undefined,
      downloadUrl: doc.download_url || undefined,
      stage: doc.document_stage as 'discovery' | 'strategy' | 'planning' | undefined
    }));

    // All projects are now V2
    const projectVersion: 'v2' = 'v2';

    const generationStatus: GenerationStatus = {
      projectId: project.id,
      status: project.status as 'pending' | 'processing' | 'completed' | 'failed',
      progress: project.progress || 0,
      currentStep: project.current_step || 'Initializing...',
      documents,
      projectVersion
    };

    console.log(`🔄 Updated generation status for project ${project.id}:`, {
      version: projectVersion,
      status: generationStatus.status,
      progress: generationStatus.progress,
      documentCount: documents.length,
      documentsWithStages: documents.filter(d => d.stage).length
    });

    setActiveGenerations(prev => new Map(prev.set(project.id, generationStatus)));
  };



  return (
    <GenerationContext.Provider value={{
      activeGenerations,
      addGeneration,
      removeGeneration,
      getGenerationStatus,
      updateGenerationFromProject
    }}>
      {children}
    </GenerationContext.Provider>
  );
}