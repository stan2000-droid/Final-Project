import React, { createContext, useState, useContext } from 'react';

// Create a context for FeedUpload state
export const FeedUploadContext = createContext();

export const FeedUploadProvider = ({ children }) => {
  // Upload state - persists across navigation
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [sampleRate, setSampleRate] = useState(2);
  const [confidence, setConfidence] = useState(0.5);
  
  // Process state - persists across navigation
  const [uploadLocked, setUploadLocked] = useState(false);
  const [isInferring, setIsInferring] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Function to reset only the file selection (for clear button)
  const clearFile = () => {
    setSelectedFile(null);
    setFileName('');
  };

  // Function to reset all process states (for stop inference)
  const resetProcessState = () => {
    setIsInferring(false);
    setIsUploading(false);
    setUploadLocked(false);
  };

  // Function to reset everything (for complete reset)
  const resetAllState = () => {
    setSelectedFile(null);
    setFileName('');
    setSampleRate(2);
    setConfidence(0.5);
    setIsInferring(false);
    setIsUploading(false);
    setUploadLocked(false);
  };

  const value = {
    // Upload state
    selectedFile,
    setSelectedFile,
    fileName,
    setFileName,
    sampleRate,
    setSampleRate,
    confidence,
    setConfidence,
    
    // Process state
    uploadLocked,
    setUploadLocked,
    isInferring,
    setIsInferring,
    isUploading,
    setIsUploading,
    
    // Helper functions
    clearFile,
    resetProcessState,
    resetAllState,
  };

  return (
    <FeedUploadContext.Provider value={value}>
      {children}
    </FeedUploadContext.Provider>
  );
};

// Custom hook for easier usage
export const useFeedUpload = () => {
  const context = useContext(FeedUploadContext);
  if (!context) {
    throw new Error('useFeedUpload must be used within a FeedUploadProvider');
  }
  return context;
};
