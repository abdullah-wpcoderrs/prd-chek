"use client";

import { useEffect, useCallback, useRef } from 'react';
import { ProductManagerFormData } from '@/types';

interface UseFormPersistenceOptions {
  key: string;
  data: ProductManagerFormData;
  autoSaveInterval?: number; // in milliseconds
  onRestore?: (data: ProductManagerFormData) => void;
}

export function useFormPersistence({
  key,
  data,
  autoSaveInterval = 30000, // 30 seconds default
  onRestore
}: UseFormPersistenceOptions) {
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<string>('');

  // Save to localStorage
  const saveToStorage = useCallback((formData: ProductManagerFormData) => {
    try {
      const dataToSave = {
        formData,
        timestamp: Date.now(),
        version: '2.0'
      };
      localStorage.setItem(key, JSON.stringify(dataToSave));
      lastSavedRef.current = JSON.stringify(formData);
      console.log('Form data saved to localStorage');
    } catch (error) {
      console.error('Failed to save form data:', error);
    }
  }, [key]);

  // Load from localStorage
  const loadFromStorage = useCallback((): ProductManagerFormData | null => {
    try {
      const saved = localStorage.getItem(key);
      if (!saved) return null;

      const parsed = JSON.parse(saved);
      
      // Check if data is recent (within 7 days)
      const isRecent = Date.now() - parsed.timestamp < 7 * 24 * 60 * 60 * 1000;
      if (!isRecent) {
        localStorage.removeItem(key);
        return null;
      }

      return parsed.formData;
    } catch (error) {
      console.error('Failed to load form data:', error);
      return null;
    }
  }, [key]);

  // Clear saved data
  const clearSavedData = useCallback(() => {
    try {
      localStorage.removeItem(key);
      console.log('Saved form data cleared');
    } catch (error) {
      console.error('Failed to clear saved data:', error);
    }
  }, [key]);

  // Check if there's saved data
  const hasSavedData = useCallback((): boolean => {
    try {
      const saved = localStorage.getItem(key);
      if (!saved) return false;

      const parsed = JSON.parse(saved);
      const isRecent = Date.now() - parsed.timestamp < 7 * 24 * 60 * 60 * 1000;
      return isRecent;
    } catch {
      return false;
    }
  }, [key]);

  // Auto-save functionality
  const scheduleAutoSave = useCallback(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      const currentDataString = JSON.stringify(data);
      if (currentDataString !== lastSavedRef.current) {
        saveToStorage(data);
      }
    }, autoSaveInterval);
  }, [data, autoSaveInterval, saveToStorage]);

  // Manual save
  const saveNow = useCallback(() => {
    saveToStorage(data);
  }, [data, saveToStorage]);

  // Load saved data on mount (only once)
  useEffect(() => {
    const savedData = loadFromStorage();
    if (savedData && onRestore) {
      onRestore(savedData);
    }
  }, [loadFromStorage, onRestore]); // Added missing dependencies

  // Auto-save when data changes
  useEffect(() => {
    scheduleAutoSave();
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [scheduleAutoSave]);

  // Handle page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveToStorage(data);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [data, saveToStorage]);

  // Handle visibility change (tab switching)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        saveToStorage(data);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [data, saveToStorage]);

  return {
    saveNow,
    clearSavedData,
    hasSavedData,
    loadFromStorage
  };
}