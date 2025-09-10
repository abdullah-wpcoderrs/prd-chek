"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { webhookAPI } from '@/lib/webhook';

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
  startGeneration: (projectId: string) => void;
  stopGeneration: (projectId: string) => void;
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
  const [pollingIntervals, setPollingIntervals] = useState<Map<string, NodeJS.Timeout>>(new Map());

  const startGeneration = (projectId: string) => {
    // Initialize the generation status
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

    // Start polling for this project
    const interval = setInterval(async () => {
      try {
        const status = await webhookAPI.getGenerationStatus(projectId);
        
        setActiveGenerations(prev => {
          const newMap = new Map(prev);
          newMap.set(projectId, status);
          return newMap;
        });

        // Stop polling if completed or failed
        if (status.status === 'completed' || status.status === 'failed') {
          stopGeneration(projectId);
        }
      } catch (error) {
        console.error(`Failed to poll status for project ${projectId}:`, error);
        // Continue polling despite errors, but could implement retry logic here
      }
    }, 3000); // Poll every 3 seconds

    setPollingIntervals(prev => new Map(prev.set(projectId, interval)));
  };

  const stopGeneration = (projectId: string) => {
    // Clear the polling interval
    const interval = pollingIntervals.get(projectId);
    if (interval) {
      clearInterval(interval);
      setPollingIntervals(prev => {
        const newMap = new Map(prev);
        newMap.delete(projectId);
        return newMap;
      });
    }

    // Keep the generation status for a while, but mark it as not actively polling
    // This allows the UI to show final status
    setTimeout(() => {
      setActiveGenerations(prev => {
        const newMap = new Map(prev);
        const status = newMap.get(projectId);
        if (status && (status.status === 'completed' || status.status === 'failed')) {
          newMap.delete(projectId);
        }
        return newMap;
      });
    }, 10000); // Remove completed/failed generations after 10 seconds
  };

  const getGenerationStatus = (projectId: string): GenerationStatus | undefined => {
    return activeGenerations.get(projectId);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      pollingIntervals.forEach(interval => clearInterval(interval));
    };
  }, [pollingIntervals]);

  return (
    <GenerationContext.Provider value={{
      activeGenerations,
      startGeneration,
      stopGeneration,
      getGenerationStatus
    }}>
      {children}
    </GenerationContext.Provider>
  );
}