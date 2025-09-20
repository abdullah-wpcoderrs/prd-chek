"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import { GenerationDocument, GenerationStatus } from '@/types';

// Re-export for convenience
export type { GenerationDocument, GenerationStatus };

interface GenerationContextType {
  activeGenerations: Map<string, GenerationStatus>;
  addGeneration: (projectId: string, version?: 'v1' | 'v2') => void;
  removeGeneration: (projectId: string) => void;
  getGenerationStatus: (projectId: string) => GenerationStatus | undefined;
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

  const addGeneration = (projectId: string, version: 'v1' | 'v2' = 'v2') => {
    const documentsV1: GenerationDocument[] = [
      { type: "PRD", name: "Product Requirements Document", status: "pending" },
      { type: "User Stories", name: "User Journey Document", status: "pending" },
      { type: "Sitemap", name: "Application Sitemap", status: "pending" },
      { type: "Tech Stack", name: "Technology Requirements", status: "pending" },
      { type: "Screens", name: "Screen Specifications", status: "pending" }
    ];

    const documentsV2: GenerationDocument[] = [
      // Stage 1: Discovery & Research
      { type: "Research_Insights", name: "Research & Insights Report", status: "pending", stage: "discovery" },
      
      // Stage 2: Vision & Strategy
      { type: "Vision_Strategy", name: "Vision & Strategy Document", status: "pending", stage: "strategy" },
      
      // Stage 3: Requirements & Planning
      { type: "PRD", name: "Product Requirements Document", status: "pending", stage: "planning" },
      { type: "BRD", name: "Business Requirements Document", status: "pending", stage: "planning" },
      { type: "TRD", name: "Technical Requirements Document", status: "pending", stage: "planning" },
      { type: "Planning_Toolkit", name: "Planning Toolkit", status: "pending", stage: "planning" }
    ];

    const initialStatus: GenerationStatus = {
      projectId,
      status: 'pending',
      progress: 0,
      currentStep: version === 'v2' ? 'Initializing enhanced generation...' : 'Initializing...',
      documents: version === 'v2' ? documentsV2 : documentsV1,
      projectVersion: version
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

  return (
    <GenerationContext.Provider value={{
      activeGenerations,
      addGeneration,
      removeGeneration,
      getGenerationStatus
    }}>
      {children}
    </GenerationContext.Provider>
  );
}