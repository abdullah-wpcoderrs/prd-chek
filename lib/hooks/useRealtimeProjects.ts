"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useGeneration } from '@/lib/context/GenerationContext';
import type { ProjectWithDocuments } from '@/lib/actions/project.actions';
import { useSupabase } from './useSupabase';

export function useRealtimeProjects() {
  const { user } = useAuth();
  const { removeGeneration, updateGenerationFromProject } = useGeneration();
  const supabase = useSupabase();
  const [projects, setProjects] = useState<ProjectWithDocuments[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [isOnline, setIsOnline] = useState(true);


  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    // Network status monitoring
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial fetch with retry logic
    const fetchProjects = async (retryCount = 0) => {
      try {
        setError(null);
        const { data, error } = await supabase
          .from('projects')
          .select(`
            *,
            documents (*)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProjects(data || []);

        // Update generation context with active projects and real document data
        data?.forEach(project => {
          if (project.status === 'processing' || project.status === 'pending') {
            updateGenerationFromProject(project);
          } else if (project.status === 'completed' || project.status === 'failed') {
            removeGeneration(project.id);
          }
        });

        setReconnectAttempts(0); // Reset on successful fetch
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch projects';
        setError(errorMessage);

        // Retry logic for network errors
        if (retryCount < 3 && isOnline) {
          setTimeout(() => {
            setReconnectAttempts(retryCount + 1);
            fetchProjects(retryCount + 1);
          }, Math.pow(2, retryCount) * 1000); // Exponential backoff
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();

    // TEMPORARILY DISABLED: Real-time subscriptions to debug UI freezing issue
    // Using polling approach instead for more reliable updates
    
    // Polling for project updates every 5 seconds for processing projects
    const pollInterval = setInterval(() => {
      const hasProcessingProjects = projects.some(p => p.status === 'processing' || p.status === 'pending');
      if (hasProcessingProjects) {
        console.log('Polling for project updates...');
        fetchProjects();
      }
    }, 5000);

    // Cleanup polling interval
    const cleanupPolling = () => {
      clearInterval(pollInterval);
    };

    // Cleanup function
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      cleanupPolling();
    };
  }, [user?.id, supabase, isOnline, projects, removeGeneration, updateGenerationFromProject]);

  // Manual refresh function
  const refetch = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          documents (*)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh projects');
    } finally {
      setLoading(false);
    }
  };

  // Optimistic update function for immediate UI updates
  const optimisticUpdate = (updateFn: (projects: ProjectWithDocuments[]) => ProjectWithDocuments[]) => {
    setProjects(updateFn);
  };

  // Simplified optimistic delete function
  const optimisticDelete = (projectId: string) => {
    console.log('Optimistic delete for project:', projectId);
    setProjects(prev => {
      const filtered = prev.filter(project => project.id !== projectId);
      console.log('Projects after optimistic delete:', filtered.length);
      return filtered;
    });
    // Also remove from generation context
    removeGeneration(projectId);
  };

  return {
    projects,
    loading,
    error,
    refetch,
    isOnline,
    reconnectAttempts,
    optimisticUpdate,
    optimisticDelete
  };
}