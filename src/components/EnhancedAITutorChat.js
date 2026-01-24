import React, { useState, useRef, useEffect } from 'react';
import { processChatResponse } from '../utils/textProcessor';
import { getTutorResponse } from '../services/geminiService';
import '../styles/EnhancedAITutorChat.css';

// Function to preload an image
const preloadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(url);
    img.onerror = () => reject(new Error('Image failed to load'));
  });
};

const EnhancedAITutorChat = ({ tutorType, tutorStyle }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [error, setError] = useState(null);
  const chatInputRef = useRef(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [imageLoadStatus, setImageLoadStatus] = useState({});

  // Welcome message based on tutor type
  useEffect(() => {
    // Add a welcome message when the component mounts
    if (tutorType && messages.length === 0) {
      const welcomeMessages = {
        visual: "Hello! I'm your Visual Learning AI Tutor. I'll help you understand concepts through visual explanations and diagrams. What would you like to learn today? (I'll generate a custom diagram or visual text for your question!)",
        auditory: "Hello! I'm your Auditory Learning AI Tutor. I'll help you learn through clear verbal explanations and discussions. What topic would you like to explore?",
        kinesthetic: "Hello! I'm your Kinesthetic Learning AI Tutor. I'll help you learn through practical exercises and hands-on activities. What would you like to practice today?"
      };

      // For visual tutor, include visual styled text
      const visualTutorMedia = tutorType.toLowerCase() === 'visual' ? 
        {
          type: 'visualText',
          content: `
            <h3>Welcome to Visual Learning!</h3>
            <p>I'm designed to help you learn through <span class="concept">visual explanations</span> and diagrams.</p>
            
            <h4>How I can help you:</h4>
            <ul class="steps">
              <li>Explain programming concepts with clear visual examples</li>
              <li>Generate diagrams to illustrate data structures and algorithms</li>
              <li>Provide formatted explanations with highlighted key points</li>
              <li>Create visual comparisons between related concepts</li>
            </ul>
            
            <div class="note">
              Ask me about any programming concept like arrays, linked lists, algorithms, or language features!
            </div>
            
            <div class="comparison">
              <div class="comparison-item">
                <h5>Example Topics</h5>
                <p>Arrays, Objects, Functions, Classes, Algorithms, Data Structures</p>
              </div>
              <div class="comparison-item">
                <h5>Example Questions</h5>
                <p>"Explain how arrays work", "Show me a binary tree", "How do hash maps work?"</p>
              </div>
            </div>
          `
        } : null;

      setMessages([{
        type: 'ai',
        content: welcomeMessages[tutorType.toLowerCase()] || welcomeMessages.visual,
        media: visualTutorMedia
      }]);

      // Auto-speak welcome message for auditory tutor
      if (tutorType.toLowerCase() === 'auditory') {
        const welcomeText = welcomeMessages[tutorType.toLowerCase()];
        speakText(welcomeText);
      }
    }
  }, [tutorType, messages.length]);

  // Image preloading effect - handles all image loading
  useEffect(() => {
    messages.forEach(message => {
      if (message.media?.type === 'image' && message.media.url) {
        const imageUrl = message.media.url;
        
        // Only process images that haven't been loaded or attempted yet
        if (!imageLoadStatus[imageUrl]) {
          setImageLoadStatus(prev => ({ ...prev, [imageUrl]: 'loading' }));
          
          preloadImage(imageUrl)
            .then(() => {
              setImageLoadStatus(prev => ({ ...prev, [imageUrl]: 'loaded' }));
            })
            .catch(() => {
              console.error('Failed to preload image:', imageUrl);
              setImageLoadStatus(prev => ({ ...prev, [imageUrl]: 'error' }));
            });
        }
      }
    });
  }, [messages, imageLoadStatus]);

  // Web Speech API - text to speech
  const speakText = (text) => {
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    
    if (!text || typeof window === 'undefined' || !window.speechSynthesis) return;
    
    // Extract plain text from HTML content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = text;
    const plainText = tempDiv.textContent || tempDiv.innerText || text;
    
    const utterance = new SpeechSynthesisUtterance(plainText);
    
    // Set voice properties
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Find a good voice if available
    let voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      // If voices aren't loaded yet (happens in some browsers), wait for them
      window.speechSynthesis.onvoiceschanged = () => {
        voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice => 
          voice.lang.includes('en') && (voice.name.includes('Female') || voice.name.includes('Google'))
        );
        if (preferredVoice) utterance.voice = preferredVoice;
        window.speechSynthesis.speak(utterance);
      };
    } else {
      // Choose an English female voice if available
      const preferredVoice = voices.find(voice => 
        voice.lang.includes('en') && (voice.name.includes('Female') || voice.name.includes('Google'))
      );
      if (preferredVoice) utterance.voice = preferredVoice;
      window.speechSynthesis.speak(utterance);
    }
    
    // Track speaking state
    setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
  };

  // Auto focus the input field when component loads
  useEffect(() => {
    if (chatInputRef.current) {
      chatInputRef.current.focus();
    }
  }, []);

  // Restore scrolling for chat messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    // Add user message to chat
    setMessages(prev => [...prev, { 
      type: 'user',
      content: userMessage,
      media: null
    }]);

    try {
      // For visual tutor, ensure we specifically request images for better demonstration
      const enhancedQuestion = tutorType.toLowerCase() === 'visual' 
        ? `${userMessage} (Please include a visual explanation or diagram with your answer)`
        : userMessage;
        
      // Get response from Gemini API
      const response = await getTutorResponse(tutorType, enhancedQuestion);
      
      // Process response
      const processedContent = processChatResponse(response.response);
      
      // Show media debugging info for visual tutor
      if (tutorType.toLowerCase() === 'visual') {
        console.log('Visual tutor media response:', response.media);
      }
      
      // Add AI response to chat
      setMessages(prev => [...prev, {
        type: 'ai',
        content: processedContent,
        media: response.media
      }]);
      
      // Auto-speak for auditory tutor
      if (tutorType.toLowerCase() === 'auditory' && response.media?.useWebSpeech) {
        speakText(processedContent);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setError('Sorry, I encountered an error. Please try again.');
      setMessages(prev => [...prev, {
        type: 'error',
        content: 'Sorry, I encountered an error communicating with the AI. Please try again.',
        media: null
      }]);
    } finally {
      setIsLoading(false);
      // Focus the input field after sending a message
      if (chatInputRef.current) {
        chatInputRef.current.focus();
      }
    }
  };

  // Handle keyboard shortcut (Enter to send, Shift+Enter for new line)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Render different media types
  const renderMedia = (media) => {
    if (!media) return null;

    switch (media.type) {
      case 'visualText':
        // Render visually styled text for concepts
        return (
          <div className="visual-text-container">
            <div className="visual-text-header">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"></path>
              </svg>
              <span>Visual Explanation</span>
            </div>
            <div className="visual-text-content" dangerouslySetInnerHTML={{ __html: media.content }} />
          </div>
        );
      case 'image':
        console.log("Rendering image media:", media.url ? "URL available" : "No URL");
        
        // Check if this is a local SVG diagram
        const isLocalSvg = typeof media.url === 'string' && (
          media.url.includes('/static/media/') || 
          media.url.endsWith('.svg')
        );
        
        // Determine if this is a diagram based on filename or path
        const isDiagram = isLocalSvg && (
          media.url.includes('diagram') || 
          media.url.includes('array') || 
          media.url.includes('stack') || 
          media.url.includes('queue') || 
          media.url.includes('linked') || 
          media.url.includes('tree') || 
          media.url.includes('hash-map') || 
          media.url.includes('recursion') || 
          media.url.includes('graph') ||
          media.url.includes('sorting') ||
          media.url.includes('loop')
        );

        // If there's visualText as a fallback, use it
        if (!media.url && media.visualText) {
          return (
            <div className="visual-text-container">
              <div className="visual-text-header">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"></path>
                </svg>
                <span>Visual Explanation</span>
              </div>
              <div className="visual-text-content" dangerouslySetInnerHTML={{ __html: media.visualText }} />
            </div>
          );
        }
        
        return (
          <div className={`media-container ${isDiagram ? 'diagram-container' : ''}`}>
            {media.url ? (
              <>
                {isDiagram && <div className="diagram-header">Interactive Diagram</div>}
                <img 
                  src={media.url} 
                  alt={isDiagram ? "Concept diagram" : "Visual explanation"} 
                  className={isDiagram ? "diagram-image" : "media-image"}
                  loading="eager"
                  onError={(e) => {
                    // If error loading remote image, show error message
                    if (!isLocalSvg) {
                      e.target.parentNode.innerHTML = `
                        <div class="image-error">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                          </svg>
                          <span>
                            Image failed to load. 
                            <button 
                              onclick="window.location.reload()" 
                              style="background: none; border: none; text-decoration: underline; cursor: pointer; color: #b91c1c; padding: 0;"
                            >
                              Refresh
                            </button> 
                            to try again.
                          </span>
                        </div>`;
                    } else {
                      // For local SVGs, check if we have visual text as fallback
                      if (media.visualText) {
                        e.target.parentNode.innerHTML = `
                          <div class="visual-text-container">
                            <div class="visual-text-header">
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"></path>
                              </svg>
                              <span>Visual Explanation</span>
                            </div>
                            <div class="visual-text-content">${media.visualText}</div>
                          </div>`;
                      } else {
                        // No visual text, use the icon-based fallback
                        const diagramType = 
                          media.url.includes('array') ? 'Array Data Structure' :
                          media.url.includes('stack') ? 'Stack Data Structure' :
                          media.url.includes('queue') ? 'Queue Data Structure' :
                          media.url.includes('linked') ? 'Linked List' :
                          media.url.includes('tree') ? 'Binary Tree' :
                          media.url.includes('hash-map') ? 'Hash Map' :
                          media.url.includes('recursion') ? 'Recursion' :
                          media.url.includes('sort') ? 'Sorting Algorithms' :
                          media.url.includes('graph') ? 'Graph Data Structure' :
                          media.url.includes('loop') ? 'Loop Structure' :
                          'Programming Concept';
                          
                        const iconPath = 
                          media.url.includes('array') ? 'M3 3h18v18H3z M8 12h8 M8 16h8' :
                          media.url.includes('stack') ? 'M3 3h18v18H3z M7 8h10 M7 12h10 M7 16h10' :
                          media.url.includes('queue') ? 'M3 10h18v7H3z M7 10v7 M11 10v7 M15 10v7' :
                          media.url.includes('linked') ? 'M9 5a2 2 0 012 2 M15 7a2 2 0 104 0 M17 19a2 2 0 100-4 M9 13a2 2 0 100-4 M17 7h-4 M13 17h4 M9 9h4 M13 13h-4' :
                          media.url.includes('tree') ? 'M12 3v6 M5 15l7-6 M19 15l-7-6 M5 15h14' :
                          media.url.includes('hash') ? 'M3 3h18v18H3z M7 8h10 M7 12h10 M7 16h10 M11 6v12' :
                          media.url.includes('recursion') ? 'M21 12a9 9 0 01-9 9 M12 3a9 9 0 00-9 9 M12 7l3 3-3 3' :
                          media.url.includes('sort') ? 'M3 9l4-4 4 4 M7 5v14 M14 20l4-4 4 4 M18 6v14' :
                          media.url.includes('graph') ? 'M3 8a5 5 0 0110 0 5 5 0 01-10 0z M13 12a5 5 0 0110 0 5 5 0 01-10 0z M18 17v-5' :
                          media.url.includes('loop') ? 'M10 5v4a3 3 0 003 3h4 M17 12l-3-3m3 3l-3 3' :
                          'M3 3h18v18H3z';

                        e.target.parentNode.innerHTML = `
                          <div class="diagram-fallback">
                            <div class="diagram-icon">
                              <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#4D61FC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                ${iconPath}
                              </svg>
                            </div>
                            <div class="diagram-info">
                              <h4>${diagramType}</h4>
                              <p>Interactive visual explanation of this concept</p>
                              <button 
                                onclick="window.location.reload()" 
                                class="reload-diagram-btn"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                  <path d="M21 2v6h-6M3 12a9 9 0 0115-6.7L21 8M3 22v-6h6M21 12a9 9 0 01-15 6.7L3 16"></path>
                                </svg>
                                Reload Diagram
                              </button>
                            </div>
                          </div>`;
                      }
                    }
                  }}
                  onClick={(e) => {
                    // Open image in new tab on click for remote images only
                    if (!isLocalSvg) {
                      window.open(media.url, '_blank');
                    }
                  }}
                />
                {isDiagram && 
                  <div className="diagram-caption">
                    {media.url.includes('array') ? 'Array: Sequential collection with direct indexing' :
                     media.url.includes('stack') ? 'Stack: LIFO (Last-In-First-Out) data structure' :
                     media.url.includes('queue') ? 'Queue: FIFO (First-In-First-Out) data structure' :
                     media.url.includes('linked') ? 'Linked List: Sequential nodes with pointers' :
                     media.url.includes('tree') ? 'Tree: Hierarchical structure with parent-child relationships' :
                     media.url.includes('hash-map') ? 'Hash Map: Key-value pairs with O(1) access' :
                     media.url.includes('recursion') ? 'Recursion: Function calling itself with simpler inputs' :
                     media.url.includes('sort') ? 'Sorting: Arranging elements in a specific order' :
                     media.url.includes('graph') ? 'Graph: Nodes connected with edges' :
                     media.url.includes('loop') ? 'Loop: Repetitive execution with condition check' :
                     'Programming concept visualization'}
                  </div>
                }
              </>
            ) : (
              <div className="image-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                <span>Working on generating a visual explanation. Please try a more specific question if needed.</span>
              </div>
            )}
          </div>
        );
      case 'audio':
        return (
          <div className="media-container">
            {media.placeholder ? (
              <div className="audio-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" y1="19" x2="12" y2="23"></line>
                  <line x1="8" y1="23" x2="16" y2="23"></line>
                </svg>
                <span>The audio explanation is being processed. You can read the text response in the meantime.</span>
              </div>
            ) : (
              <div className="audio-controls">
                <button 
                  onClick={() => speakText(media.text)}
                  disabled={isSpeaking}
                  className="audio-button"
                  title="Listen to this response"
                >
                  {isSpeaking ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="6" y="4" width="4" height="16"></rect>
                        <rect x="14" y="4" width="4" height="16"></rect>
                      </svg>
                      <span>Speaking...</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                      </svg>
                      <span>Listen to this response</span>
                    </>
                  )}
                </button>
                {isSpeaking && (
                  <button 
                    onClick={() => window.speechSynthesis.cancel()}
                    className="audio-button stop-button"
                    title="Stop speaking"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="6" y="4" width="12" height="16" rx="2" ry="2"></rect>
                    </svg>
                    <span>Stop</span>
                  </button>
                )}
              </div>
            )}
          </div>
        );
      case 'interactive':
        return (
          <div className="interactive-steps">
            <h4>Interactive Exercises</h4>
            {media.steps && media.steps.map((step) => (
              <div key={step.id} className="interactive-step">
                <input 
                  type="checkbox" 
                  id={`step-${step.id}`} 
                  className="step-checkbox"
                />
                <label htmlFor={`step-${step.id}`} className="step-label">
                  {step.text}
                </label>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="enhanced-aitutor-chat">
      <div 
        className="tutor-header" 
        style={{ 
          background: tutorStyle?.gradient || 'linear-gradient(135deg, #4D61FC 0%, #3B4FE3 100%)' 
        }}
      >
        <div className="tutor-avatar">
          <img 
            src={tutorStyle?.imagePath || '/tutors/default-tutor.png'} 
            alt={tutorStyle?.name || 'AI Tutor'} 
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/100?text=AI+Tutor';
            }}
          />
        </div>
        <div className="tutor-info">
          <h3>{tutorStyle?.name || 'AI Tutor'}</h3>
          <p>{tutorStyle?.description || 'Your personalized learning assistant'}</p>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`chat-message ${msg.type}`}
          >
            <div 
              className="message-content"
              dangerouslySetInnerHTML={{ __html: msg.content }}
            />
            {renderMedia(msg.media)}
          </div>
        ))}
        {isLoading && (
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError(null)} className="dismiss-error">✕</button>
          </div>
        )}
        <div className="scroll-anchor" ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="chat-input-form">
        <input
          ref={chatInputRef}
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Ask your ${tutorStyle?.name || 'AI tutor'} a question...`}
          disabled={isLoading}
          className="chat-input"
        />
        <button 
          type="submit"
          disabled={isLoading || !inputMessage.trim()}
          className="submit-button"
          style={{ 
            background: tutorStyle?.accentColor || '#4D61FC',
            // Make button more visible with larger dimensions
            padding: '12px', 
            borderRadius: '50%',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
          }}
        >
          <svg 
            viewBox="0 0 24 24" 
            className="submit-icon"
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            width="24"
            height="24"
          >
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default EnhancedAITutorChat; 