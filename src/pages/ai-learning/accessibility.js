import { useEffect, useRef, useState } from 'react';

// Text-to-Speech Utilities
export const useSpeechQueue = () => {
  const queue = useRef([]);
  const speaking = useRef(false);

  const speak = (text, options = {}) => {
    const utterance = new SpeechSynthesisUtterance(text);
    Object.assign(utterance, options);
    queue.current.push(utterance);
    processQueue();
  };

  const processQueue = () => {
    if (!speaking.current && queue.current.length > 0) {
      speaking.current = true;
      const utterance = queue.current.shift();
      utterance.onend = () => {
        speaking.current = false;
        processQueue();
      };
      window.speechSynthesis.speak(utterance);
    }
  };

  const cancel = () => {
    window.speechSynthesis.cancel();
    queue.current = [];
    speaking.current = false;
  };

  useEffect(() => {
    return () => cancel();
  }, []);

  return { speak, cancel };
};

// Visual Processing Utilities
export const processVisualContent = async (content, type) => {
  switch (type) {
    case 'diagram':
      return await generateDiagram(content);
    case 'infographic':
      return await generateInfographic(content);
    case 'mindmap':
      return await generateMindMap(content);
    default:
      return content;
  }
};

const generateDiagram = async (content) => {
  // Placeholder for diagram generation logic
  // This would integrate with a diagramming library like Mermaid.js
  return {
    type: 'diagram',
    data: content,
    format: 'svg'
  };
};

const generateInfographic = async (content) => {
  // Placeholder for infographic generation logic
  return {
    type: 'infographic',
    data: content,
    format: 'html'
  };
};

const generateMindMap = async (content) => {
  // Placeholder for mind map generation logic
  return {
    type: 'mindmap',
    data: content,
    format: 'svg'
  };
};

// Accessibility Settings Hook
export const useAccessibilitySettings = (initialSettings = {}) => {
  const defaultSettings = {
    textToSpeech: false,
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReader: false,
    ...initialSettings
  };

  const [settings, setSettings] = useState(defaultSettings);

  const updateSettings = (newSettings) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));

    // Apply settings to document
    document.documentElement.style.setProperty(
      '--font-size-base', 
      settings.largeText ? '18px' : '16px'
    );
    
    document.documentElement.style.setProperty(
      '--contrast-multiplier',
      settings.highContrast ? '1.2' : '1'
    );

    if (settings.reducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
  };

  useEffect(() => {
    // Initialize settings
    updateSettings(settings);
  }, []);

  return [settings, updateSettings];
};

// Visual Processing Components
export const AccessibleImage = ({ src, alt, description }) => {
  const { speak } = useSpeechQueue();
  
  return (
    <div className="accessible-image">
      <img src={src} alt={alt} />
      <button 
        className="description-button"
        onClick={() => speak(description)}
        aria-label="Read image description"
      >
        📢
      </button>
      <div className="image-description" aria-hidden="true">
        {description}
      </div>
    </div>
  );
};

export const AccessibleDiagram = ({ data, description }) => {
  const { speak } = useSpeechQueue();
  
  return (
    <div className="accessible-diagram">
      <div className="diagram-container" dangerouslySetInnerHTML={{ __html: data }} />
      <button 
        className="description-button"
        onClick={() => speak(description)}
        aria-label="Read diagram description"
      >
        📢
      </button>
      <div className="diagram-description" aria-hidden="true">
        {description}
      </div>
    </div>
  );
};

// Keyboard Navigation
export const useKeyboardNavigation = (refs) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        const currentIndex = refs.findIndex(ref => ref.current === document.activeElement);
        if (currentIndex !== -1) {
          e.preventDefault();
          const nextIndex = e.shiftKey ? 
            (currentIndex - 1 + refs.length) % refs.length : 
            (currentIndex + 1) % refs.length;
          refs[nextIndex].current?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [refs]);
};

/**
 * ChatInput component for accessible user interaction
 * Includes text-to-speech feedback and keyboard navigation
 */
export const ChatInput = ({ onSendMessage }) => {
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef(null);
  const { speak } = useSpeechQueue();
  const { preferences } = useAccessibilitySettings();
  const { registerNavigable } = useKeyboardNavigation();

  useEffect(() => {
    // Register this input for keyboard navigation
    if (inputRef.current) {
      registerNavigable(inputRef.current);
    }
  }, [registerNavigable]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      // Provide auditory feedback if speech is enabled
      if (preferences.speechEnabled) {
        speak(`Sending message: ${inputValue}`);
      }
      
      // Capture the message before clearing the input
      const message = inputValue;
      
      // Clear input after sending
      setInputValue('');
      
      // Call the callback from parent component if provided
      if (onSendMessage && typeof onSendMessage === 'function') {
        onSendMessage(message);
      } else {
        // Fallback to console log if no callback provided
        console.log("Sending message:", message);
      }
      
      // Add accessibility feedback for successful submission
      if (preferences.speechEnabled) {
        speak("Message sent successfully");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Provide error feedback if speech is enabled
      if (preferences.speechEnabled) {
        speak("Failed to send message. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="chat-input-container" role="region" aria-label="Message input">
      <form onSubmit={handleSubmit} className="chat-input-wrapper">
        <input
          ref={inputRef}
          type="text"
          className="chat-input"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type your message here..."
          aria-label="Message input field"
          disabled={isSubmitting}
        />
        <button 
          type="submit" 
          className="chat-send-button"
          aria-label="Send message"
          disabled={!inputValue.trim() || isSubmitting}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </button>
      </form>
    </div>
  );
};
