import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVoiceControl } from '../contexts/VoiceControlContext';

/**
 * Simplified VoiceControl component for blind users
 */
const VoiceControl = () => {
  const { isActive, setIsActive, setListening, transcript, setTranscript } = useVoiceControl();
  const navigate = useNavigate();

  // Basic text-to-speech
  const speak = (text) => {
    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  // Process commands
  const processCommand = (command) => {
    if (!command) return;
    
    command = command.toLowerCase().trim();
    console.log("Processing command:", command);
    
    // Navigation commands
    if (command.includes('help')) {
      speak("Available commands include: go to home, profile, AI tutors, courses, games, quizzes");
    }
    else if (command.includes('home')) {
      speak("Going to home");
      navigate('/');
    }
    else if (command.includes('profile')) {
      speak("Going to profile");
      navigate('/profile');
    }
    else if (command.includes('tutor')) {
      speak("Going to AI tutors");
      navigate('/ai-tutors');
    }
    else if (command.includes('course')) {
      speak("Going to courses");
      navigate('/courses');
    }
    else if (command.includes('game')) {
      speak("Going to games");
      navigate('/games');
    }
    else if (command.includes('quiz')) {
      speak("Going to quizzes");
      navigate('/quizzes');
    }
    else {
      speak("Command not recognized. Say help for commands");
    }
  };

  // Toggle voice control with keyboard
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key === 'v') {
        e.preventDefault();
        const newState = !isActive;
        
        if (newState) {
          window.speechSynthesis.cancel();
          setIsActive(true);
          setTimeout(() => speak("Voice control active. Say help for commands"), 100);
        } else {
          window.speechSynthesis.cancel();
          setIsActive(false);
          setTimeout(() => speak("Voice control off"), 100);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, setIsActive]);

  // Initialize and manage speech recognition
  useEffect(() => {
    if (!isActive) {
      setListening(false);
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    
    let recognition = new SpeechRecognition();
    recognition.continuous = false; // One-shot mode
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    // Main result handler
    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript;
      setTranscript(command);
      processCommand(command);
    };
    
    // Status handlers
    recognition.onstart = () => setListening(true);
    recognition.onend = () => {
      setListening(false);
      if (isActive) {
        // Start a new session after a delay
        setTimeout(() => {
          try {
            recognition.start();
          } catch (e) {
            console.error("Error restarting recognition:", e);
          }
        }, 1000);
      }
    };
    
    // Start initial recognition
    try {
      recognition.start();
    } catch (e) {
      console.error("Error starting recognition:", e);
    }
    
    // Cleanup
    return () => {
      try {
        recognition.stop();
      } catch (e) {
        // Ignore
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, setListening, setTranscript]);

  // Simple UI
  return (
    <div className="voice-control" aria-live="polite">
      {isActive && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          zIndex: 1000,
          maxWidth: '300px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              borderRadius: '50%', 
              background: '#4CAF50',
              marginRight: '8px'
            }}></div>
            <span>Voice Control Active</span>
          </div>
          {transcript && (
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '8px',
              borderRadius: '4px',
              marginTop: '8px',
              fontSize: '14px'
            }}>
              {transcript}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VoiceControl; 