import React, { createContext, useState, useContext } from 'react';

// Create the voice control context
const VoiceControlContext = createContext();

// Create a provider component for the voice control state
export const VoiceControlProvider = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  // Function to toggle voice control on/off
  const toggleVoiceControl = () => {
    setIsActive(prev => !prev);
  };

  // Values to be provided to the context
  const contextValue = {
    isActive,
    setIsActive,
    listening,
    setListening,
    transcript,
    setTranscript,
    toggleVoiceControl
  };

  return (
    <VoiceControlContext.Provider value={contextValue}>
      {children}
    </VoiceControlContext.Provider>
  );
};

// Custom hook to use the voice control context
export const useVoiceControl = () => {
  const context = useContext(VoiceControlContext);
  if (!context) {
    throw new Error('useVoiceControl must be used within a VoiceControlProvider');
  }
  return context;
};

export default VoiceControlContext; 