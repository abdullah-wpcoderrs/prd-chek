"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useGeneration } from '@/lib/context/GenerationContext';
import type { ProjectWithDocuments } from '@/lib/actions/project.actions';
import { useSupabase } from './useSupabase';

export function useRealtimeProjects() {
  const { user } = useAuth();
  const { addGeneration, removeGeneration } = useGeneration();
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
        
        // Update generation context with active projects
        data?.forEach(project => {
          if (project.status === 'processing' || project.status === 'pending') {
            addGeneration(project.id);
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

    // Enhanced real-time subscriptions with error handling
    const projectSubscription = supabase
      .channel('projects_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Project change:', payload);
          
          // Optimistic updates for better UX
          if (payload.eventType === 'INSERT') {
            const newProject = payload.new as ProjectWithDocuments;
            setProjects(prev => [newProject, ...prev]);
            
            // Add to generation context if it's being processed
            if (newProject.status === 'processing' || newProject.status === 'pending') {
              addGeneration(newProject.id);
            }
          } else if (payload.eventType === 'UPDATE') {
            const updatedProject = payload.new as ProjectWithDocuments;
            setProjects(prev => prev.map(project => 
              project.id === updatedProject.id 
                ? { ...project, ...updatedProject }
                : project
            ));
            
            // Update generation context based on status
            if (updatedProject.status === 'completed' || updatedProject.status === 'failed') {
              removeGeneration(updatedProject.id);
            } else if (updatedProject.status === 'processing' || updatedProject.status === 'pending') {
              addGeneration(updatedProject.id);
            }
          } else if (payload.eventType === 'DELETE') {
            const deletedProject = payload.old as ProjectWithDocuments;
            setProjects(prev => prev.filter(project => project.id !== deletedProject.id));
            removeGeneration(deletedProject.id);
          }
          
          // Also fetch to ensure data consistency
          setTimeout(() => fetchProjects(), 1000);
        }
      )
      .on('system', { event: 'postgres_changes_disconnected' }, () => {
        console.log('Real-time connection lost, attempting to reconnect...');
        setError('Connection lost. Reconnecting...');
      })
      .on('system', { event: 'postgres_changes_connected' }, () => {
        console.log('Real-time connection restored');
        setError(null);
        fetchProjects(); // Refresh data on reconnect
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to project changes');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Failed to subscribe to project changes');
          setError('Real-time updates unavailable');
        }
      });

    // Subscribe to real-time changes for documents
    const documentSubscription = supabase
      .channel('documents_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'documents',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Document change:', payload);
          
          // Update documents within projects
          if (payload.eventType === 'UPDATE') {
            setProjects(prev => prev.map(project => ({
              ...project,
              documents: project.documents.map(doc => 
                doc.id === payload.new.id 
                  ? { ...doc, ...payload.new }
                  : doc
              )
            })));
          }
          
          // Refresh projects to get updated document data
          setTimeout(() => fetchProjects(), 500);
        }
      )
      .subscribe();

    // Cleanup function
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      projectSubscription.unsubscribe();
      documentSubscription.unsubscribe();
    };
  }, [user?.id, supabase, isOnline]);

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

  return { 
    projects, 
    loading, 
    error, 
    refetch,
    isOnline,
    reconnectAttempts
  };
}