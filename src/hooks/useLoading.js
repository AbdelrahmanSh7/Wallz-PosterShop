import { useState, useCallback } from 'react';

// Custom hook for managing loading states
export const useLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState);
  const [loadingText, setLoadingText] = useState('Loading...');

  const startLoading = useCallback((text = 'Loading...') => {
    setLoadingText(text);
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    setLoadingText('Loading...');
  }, []);

  const setLoading = useCallback((loading, text = 'Loading...') => {
    setLoadingText(text);
    setIsLoading(loading);
  }, []);

  return {
    isLoading,
    loadingText,
    startLoading,
    stopLoading,
    setLoading
  };
};

// Hook for managing multiple loading states
export const useMultipleLoading = () => {
  const [loadingStates, setLoadingStates] = useState({});

  const startLoading = useCallback((key, text = 'Loading...') => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: { isLoading: true, text }
    }));
  }, []);

  const stopLoading = useCallback((key) => {
    setLoadingStates(prev => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });
  }, []);

  const setLoading = useCallback((key, loading, text = 'Loading...') => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: { isLoading: loading, text }
    }));
  }, []);

  const isLoading = useCallback((key) => {
    return loadingStates[key]?.isLoading || false;
  }, [loadingStates]);

  const getLoadingText = useCallback((key) => {
    return loadingStates[key]?.text || 'Loading...';
  }, [loadingStates]);

  const hasAnyLoading = Object.values(loadingStates).some(state => state.isLoading);

  return {
    loadingStates,
    startLoading,
    stopLoading,
    setLoading,
    isLoading,
    getLoadingText,
    hasAnyLoading
  };
};

// Hook for async operations with loading
export const useAsyncLoading = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeAsync = useCallback(async (asyncFunction, loadingText = 'Loading...') => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await asyncFunction();
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    executeAsync
  };
};
