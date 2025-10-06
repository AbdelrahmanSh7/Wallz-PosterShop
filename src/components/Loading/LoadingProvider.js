import React, { createContext, useContext, useState, useCallback } from 'react';
import Loading from './Loading';

const LoadingContext = createContext();

export const useLoadingContext = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoadingContext must be used within a LoadingProvider');
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [globalLoading, setGlobalLoading] = useState(false);
  const [globalLoadingText, setGlobalLoadingText] = useState('Loading...');
  const [loadingStates, setLoadingStates] = useState({});

  // Global loading methods
  const startGlobalLoading = useCallback((text = 'Loading...') => {
    setGlobalLoadingText(text);
    setGlobalLoading(true);
  }, []);

  const stopGlobalLoading = useCallback(() => {
    setGlobalLoading(false);
    setGlobalLoadingText('Loading...');
  }, []);

  const setGlobalLoadingState = useCallback((loading, text = 'Loading...') => {
    setGlobalLoadingText(text);
    setGlobalLoading(loading);
  }, []);

  // Component-specific loading methods
  const startComponentLoading = useCallback((componentId, text = 'Loading...') => {
    setLoadingStates(prev => ({
      ...prev,
      [componentId]: { isLoading: true, text }
    }));
  }, []);

  const stopComponentLoading = useCallback((componentId) => {
    setLoadingStates(prev => {
      const newState = { ...prev };
      delete newState[componentId];
      return newState;
    });
  }, []);

  const setComponentLoading = useCallback((componentId, loading, text = 'Loading...') => {
    setLoadingStates(prev => ({
      ...prev,
      [componentId]: { isLoading: loading, text }
    }));
  }, []);

  const isComponentLoading = useCallback((componentId) => {
    return loadingStates[componentId]?.isLoading || false;
  }, [loadingStates]);

  const getComponentLoadingText = useCallback((componentId) => {
    return loadingStates[componentId]?.text || 'Loading...';
  }, [loadingStates]);

  const hasAnyComponentLoading = Object.values(loadingStates).some(state => state.isLoading);

  // Clear all loading states
  const clearAllLoading = useCallback(() => {
    setGlobalLoading(false);
    setLoadingStates({});
  }, []);

  const contextValue = {
    // Global loading
    globalLoading,
    globalLoadingText,
    startGlobalLoading,
    stopGlobalLoading,
    setGlobalLoadingState,
    
    // Component loading
    loadingStates,
    startComponentLoading,
    stopComponentLoading,
    setComponentLoading,
    isComponentLoading,
    getComponentLoadingText,
    hasAnyComponentLoading,
    
    // Utility
    clearAllLoading
  };

  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
      {globalLoading && (
        <Loading 
          overlay={true}
          text={globalLoadingText}
          size="large"
          color="primary"
        />
      )}
    </LoadingContext.Provider>
  );
};
