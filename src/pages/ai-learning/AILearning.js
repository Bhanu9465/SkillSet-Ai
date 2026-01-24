import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import './AILearning.css';
import ImageGallery from './ImageGallery';
import GuitarAnatomyGuide from './GuitarAnatomyGuide';
import { ChatInput } from './accessibility';
import goatImage from '../../assets/goat.png';

// API key loaded from environment variables
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

function AILearning() {
  const [prompt, setPrompt] = useState('');
  const [tutorPrompt, setTutorPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [generatedText, setGeneratedText] = useState('');
  const [recommendedSteps, setRecommendedSteps] = useState([
    {
      number: 1,
      title: 'Learning Style Description:**'
    },
    {
      number: 2,
      title: 'Key Learning Strengths:**'
    },
    {
      number: 3,
      title: 'Personalized Learning Path:**'
    },
    {
      number: 4,
      title: 'Recommended Learning Resources:**'
    },
    {
      number: 5,
      title: 'Practice Exercises:**'
    },
    {
      number: 6,
      title: 'Knowledge Assessment:**'
    },
    {
      number: 7,
      title: 'Project Opportunities:**'
    },
    {
      number: 8,
      title: 'Learning Community:**'
    },
    {
      number: 9,
      title: 'Advanced Topics:**'
    },
    {
      number: 10,
      title: 'Certification Pathways:**'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState('');
  const [useDirectAPI, setUseDirectAPI] = useState(false);
  const [imageCount, setImageCount] = useState(1);
  const [showGallery, setShowGallery] = useState(false);
  const [showGuitarGuide, setShowGuitarGuide] = useState(false);
  const [showGoatGreeting, setShowGoatGreeting] = useState(true);
  const chatInputRef = useRef(null);

  // Extract steps from LLM response text
  const extractSteps = (text) => {
    if (!text) return [];
    
    // Try to find numbered steps or bullet points in the text
    const stepRegex = /(?:step\s*(\d+)[:\.\)]*\s*|(\d+)[\.\)]\s*|•\s*|[\-\*]\s*)([^\n]+)(?:\n|$)/gi;
    const matches = [...text.matchAll(stepRegex)];
    
    if (matches.length > 0) {
      return matches.map((match, index) => {
        const stepContent = match[3] || match[0];
        const parts = stepContent.split(':').map(part => part.trim());
        
        if (parts.length > 1) {
          return {
            title: parts[0],
            description: parts.slice(1).join(': ')
          };
        } else {
          return {
            title: `Step ${index + 1}`,
            description: stepContent
          };
        }
      });
    }
    
    // If no steps found, try to break by paragraphs as fallback
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    if (paragraphs.length > 1) {
      return paragraphs.map((para, index) => ({
        title: `Step ${index + 1}`,
        description: para.trim()
      }));
    }
    
    return [];
  };

  // Check if prompt is guitar-related
  const isGuitarRelated = (text) => {
    const guitarKeywords = [
      'guitar', 'acoustic', 'electric guitar', 'fender', 'gibson', 'string instrument',
      'fretboard', 'chord', 'pick', 'strumming', 'guitar anatomy', 'learn guitar'
    ];
    
    return guitarKeywords.some(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  // Focus the tutor input when the send button is clicked
  const focusTutorInput = () => {
    if (chatInputRef.current) {
      chatInputRef.current.focus();
    }
  };

  // Handle sending a question to the tutor
  const handleSendQuestion = () => {
    if (!tutorPrompt.trim()) return;
    
    // Here you would handle sending the question to your AI backend
    console.log("Sending question to tutor:", tutorPrompt);
    
    // For now, let's demonstrate by showing the guitar guide for guitar-related questions
    if (isGuitarRelated(tutorPrompt)) {
      setShowGuitarGuide(true);
    } else {
      // For other questions, you could handle differently
      setGeneratedText(`You asked: "${tutorPrompt}"\n\nI'm your AI tutor. I'll help you learn about this topic.`);
    }
    
    // Clear the input after sending
    setTutorPrompt('');
  };

  // Handle pressing Enter to send the question
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendQuestion();
    }
  };

  // For debugging: Log whenever generatedImage changes
  useEffect(() => {
    if (generatedImage) {
      console.log("Image state updated:", generatedImage.substring(0, 50) + "...");
    }
  }, [generatedImage]);

  // Hide goat greeting after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGoatGreeting(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  async function generateImage() {
    if (!prompt) {
      setError('Please enter a prompt.');
      return;
    }
    
    setLoading(true);
    setError(null);
    setGeneratedImage(null);
    setGeneratedText('');
    setRecommendedSteps([]);
    setDebugInfo('');
    setShowGallery(false);
    setShowGuitarGuide(false);

    // Check if this is a guitar-related query
    if (isGuitarRelated(prompt)) {
      setTimeout(() => {
        setShowGuitarGuide(true);
        setLoading(false);
      }, 1000);
      return;
    }

    // If not using direct API, just show the gallery
    if (!useDirectAPI) {
      // Generate sample text and steps for demonstration
      const sampleText = `Here's how to visualize ${prompt}:\n\n` +
        `1. Start by sketching the basic outline\n` +
        `2. Add key elements: Focus on the main components that define your subject\n` +
        `3. Consider perspective: Determine the viewpoint that best illustrates your concept\n` +
        `4. Add details and texture to enhance realism\n` +
        `5. Apply color theory principles for visual impact`;
      
      setGeneratedText(sampleText);
      setRecommendedSteps(extractSteps(sampleText));
      
      setTimeout(() => {
        setShowGallery(true);
        setLoading(false);
      }, 1000);
      return;
    }

    try {
      console.log("Starting image generation for prompt:", prompt);
      setDebugInfo(prev => prev + "Starting request...\n");
      
      const ai = new GoogleGenAI({ apiKey: API_KEY });
      
      // Log available models for debugging
      try {
        const models = await ai.models.list();
        console.log("Available models:", models);
        setDebugInfo(prev => prev + `Available models: ${JSON.stringify(models)}\n`);
      } catch (err) {
        console.warn("Could not list models:", err.message);
        setDebugInfo(prev => prev + `Could not list models: ${err.message}\n`);
      }

      setDebugInfo(prev => prev + "Requesting image generation...\n");
      
      // Set responseModalities to include "Image" so the model can generate an image
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp-image-generation",
        contents: prompt,
        config: {
          responseModalities: [Modality.TEXT, Modality.IMAGE],
          temperature: 0.7,
          topK: 32,
          topP: 1,
          maxOutputTokens: 2048,
        },
      });

      console.log("Full API response:", response);
      setDebugInfo(prev => prev + "Received response from API\n");
      
      // Check if response has the expected structure
      if (!response || !response.candidates || response.candidates.length === 0) {
        throw new Error("Empty or invalid response from API");
      }
      
      setDebugInfo(prev => prev + `Response has ${response.candidates.length} candidates\n`);
      
      const candidate = response.candidates[0];
      if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
        throw new Error("No content parts in response");
      }
      
      setDebugInfo(prev => prev + `Found ${candidate.content.parts.length} content parts\n`);
      
      // Process the response parts
      let imageFound = false;
      for (const part of candidate.content.parts) {
        if (part.text) {
          console.log("Text part found:", part.text);
          setDebugInfo(prev => prev + "Text part found\n");
          setGeneratedText(part.text);
          setRecommendedSteps(extractSteps(part.text));
        } else if (part.inlineData) {
          console.log("Image data found:", part.inlineData.mimeType);
          setDebugInfo(prev => prev + `Image found! MIME type: ${part.inlineData.mimeType}\n`);
          
          // Verify data exists and is valid
          if (!part.inlineData.data) {
            console.error("Image data is empty");
            setDebugInfo(prev => prev + "Error: Image data is empty\n");
            continue;
          }
          
          // For browser display, construct data URL correctly
          const dataUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          console.log("Setting image data URL:", dataUrl.substring(0, 50) + "...");
          
          // For additional validation, check if this looks like a base64 string
          if (!/^[A-Za-z0-9+/=]+$/.test(part.inlineData.data.slice(0, 100))) {
            console.warn("Warning: Image data doesn't look like valid base64");
            setDebugInfo(prev => prev + "Warning: Image data may not be valid base64\n");
          }
          
          setGeneratedImage(dataUrl);
          imageFound = true;
        } else {
          console.log("Unknown part type:", part);
          setDebugInfo(prev => prev + "Unknown part type in response\n");
        }
      }
      
      if (!imageFound) {
        setDebugInfo(prev => prev + "No image was found in the response\n");
        setError("No image was generated. Try a different prompt or check console for details.");
        // Show gallery as fallback since the API failed to generate an image
        setShowGallery(true);
      }
      
    } catch (err) {
      console.error("Error generating image:", err);
      setDebugInfo(prev => prev + `Error: ${err.message}\n${err.stack}\n`);
      setError(`Error: ${err.message}`);
      // Show gallery as fallback since the API had an error
      setShowGallery(true);
    } finally {
      setLoading(false);
    }
  }
  
  // Alternative approach using direct fetch for debugging
  async function fetchImageDirectly() {
    setLoading(true);
    setError(null);
    setDebugInfo("Trying direct fetch approach...\n");
    
    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': API_KEY
        },
        body: JSON.stringify({
          contents: [{ text: prompt }],
          generation_config: {
            response_modalities: ["TEXT", "IMAGE"],
            temperature: 0.7,
            topK: 32,
            topP: 1,
            maxOutputTokens: 2048
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Direct fetch response:", data);
      setDebugInfo(prev => prev + "Direct fetch completed, check console for details\n");
      
      // Try to process this response
      if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
        for (const part of data.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
            const dataUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            setGeneratedImage(dataUrl);
            setDebugInfo(prev => prev + "Found image via direct fetch!\n");
          } else if (part.text) {
            setGeneratedText(part.text);
            setRecommendedSteps(extractSteps(part.text));
          }
        }
      } else {
        // Fallback to the gallery
        setShowGallery(true);
      }
    } catch (err) {
      console.error("Direct fetch error:", err);
      setDebugInfo(prev => prev + `Direct fetch error: ${err.message}\n`);
      // Fallback to the gallery
      setShowGallery(true);
    } finally {
      setLoading(false);
    }
  }

  // Process messages received from the ChatInput component
  const handleChatMessage = (message) => {
    if (!message.trim()) return;
    
    // Here you would handle sending the message to your AI backend
    console.log("Message received from accessible chat input:", message);
    
    // For now, let's demonstrate by showing the guitar guide for guitar-related questions
    if (isGuitarRelated(message)) {
      setShowGuitarGuide(true);
    } else {
      // For other questions, you could handle differently
      setGeneratedText(`You asked: "${message}"\n\nI'm your AI tutor. I'll help you learn about this topic.`);
    }
  };

  return (
    <div className="ai-learning page-container">
      <div className="ai-learning-container">
        <h1>Learn with AI</h1>

        <div className="ai-image-generation-card">
          <h2>Visual Learning: Generate Images with AI</h2>
          <p>Describe something you want to visualize, and the AI will try to generate an image for it.</p>
          <div className="image-prompt-area">
            <textarea
              placeholder="Enter your image description here... (e.g., a cat wearing a spacesuit on the moon)"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
            />
            <div className="controls-row">
              <div className="image-controls">
                <label>
                  Number of images:
                  <select 
                    value={imageCount} 
                    onChange={(e) => setImageCount(Number(e.target.value))}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="4">4</option>
                    <option value="6">6</option>
                  </select>
                </label>
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    checked={useDirectAPI}
                    onChange={() => setUseDirectAPI(!useDirectAPI)}
                  />
                  Use direct API (may be unstable)
                </label>
              </div>
              <div className="button-group">
                <button 
                  onClick={generateImage} 
                  disabled={loading || !prompt}
                  className="primary-button"
                >
                  {loading ? 'Generating...' : 'Generate Image'}
                </button>
                {useDirectAPI && (
                  <button 
                    onClick={fetchImageDirectly} 
                    disabled={loading || !prompt}
                    className="secondary-button"
                  >
                    Try Alternate Method
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {error && <p className="error-message">Error: {error}</p>}
          {loading && <div className="loading-indicator">Generating image, please wait...</div>}
          
          {useDirectAPI && debugInfo && (
            <div className="debug-container">
              <h4>Debug Information:</h4>
              <pre>{debugInfo}</pre>
            </div>
          )}
          
          {generatedText && (
            <div className="generated-text-container">
              <h3>AI Response:</h3>
              <p>{generatedText}</p>
            </div>
          )}
          
          {recommendedSteps.length > 0 && (
            <div className="recommended-steps">
              <h3>Recommended Steps</h3>
              <ul className="steps-list">
                {recommendedSteps.map((step, index) => (
                  <li key={index} className="step-item">
                    <div className="step-header">
                      <div className="step-number">{step.number}</div>
                      <div className="step-title">{step.title}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {showGuitarGuide && <GuitarAnatomyGuide />}
          
          {!useDirectAPI && showGallery && !showGuitarGuide && (
            <ImageGallery 
              prompt={prompt} 
              count={imageCount} 
            />
          )}
          
          {useDirectAPI && generatedImage && (
            <div className="generated-image-container">
              <h3>Generated Image:</h3>
              <img 
                src={generatedImage} 
                alt="Generated by AI based on prompt" 
                onError={(e) => {
                  console.error("Image failed to load:", e);
                  setError("Image failed to load. The data may be corrupted or invalid.");
                  setShowGallery(true); // Fallback to gallery if image fails to load
                }}
              />
            </div>
          )}
        </div>

        {/* Existing Feature Cards */}
        <div className="ai-features">
          <div className="ai-feature-card">
            <h2>AI Tutor</h2>
            <p>Get personalized guidance and instant feedback from our AI tutor.</p>
            <button className="feature-button" onClick={focusTutorInput}>Ask a Question</button>
          </div>
          
          <div className="ai-feature-card">
            <h2>Practice Exercises</h2>
            <p>AI-generated exercises tailored to your skill level.</p>
            <button className="feature-button">Try Exercises</button>
          </div>
          
          <div className="ai-feature-card">
            <h2>Skill Assessment</h2>
            <p>Evaluate your progress with AI-powered assessments.</p>
            <button className="feature-button">Take Assessment</button>
          </div>
        </div>
      </div>
      
      {/* Pass the handleChatMessage function to the ChatInput component */}
      <ChatInput onSendMessage={handleChatMessage} />
      
      {/* Goat Character */}
      <div className="goat-character">
        <div className="goat-greeting" style={{ opacity: showGoatGreeting ? 1 : 0 }}>
          Welcome to AI Learning! I'm your friendly guide. Need help? Just ask!
        </div>
        <img src={goatImage} alt="Goat assistant character" />
      </div>
    </div>
  );
}

export default AILearning;
