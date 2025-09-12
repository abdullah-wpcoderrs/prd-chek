"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

export interface GenerationStatus {
  projectId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  currentStep: string;
  estimatedTime?: number;
  documents: Array<{
    type: string;
    name: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    size?: string;
    downloadUrl?: string;
  }>;
}

interface GenerationContextType {
  activeGenerations: Map<string, GenerationStatus>;
  addGeneration: (projectId: string) => void;
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

  const addGeneration = (projectId: string) => {
    const initialStatus: GenerationStatus = {
      projectId,
      status: 'pending',
      progress: 0,
      currentStep: 'Initializing...',
      documents: [
        { type: "PRD", name: "Product Requirements Document", status: "pending" },
        { type: "User Stories", name: "User Journey Document", status: "pending" },
        { type: "Sitemap", name: "Application Sitemap", status: "pending" },
        { type: "Tech Stack", name: "Technology Requirements", status: "pending" },
        { type: "Screens", name: "Screen Specifications", status: "pending" }
      ]
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