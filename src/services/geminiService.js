import axios from 'axios';
import { getLocalDiagram } from './visualTutorService';

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

// Base Gemini text model
export const getGeminiTextResponse = async (prompt) => {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const data = {
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: 'text/plain',
      },
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
          ],
        },
      ],
    };

    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.data || !response.data.candidates || !response.data.candidates[0]) {
      throw new Error('Invalid response format from Gemini');
    }

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error calling Gemini text API:', error);
    throw error;
  }
};

// Gemini image generation model
export const getGeminiImageGeneration = async (prompt) => {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${GEMINI_API_KEY}`;
    
    const data = {
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: 'text/plain',
      },
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
          ],
        },
      ],
    };

    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.data) {
      return { text: "Failed to generate image", imageUrl: null };
    }

    // Handle different response structures
    let imageUrl = null;
    
    // Look for inlineData in the response
    if (response.data.candidates && 
        response.data.candidates[0] && 
        response.data.candidates[0].content && 
        response.data.candidates[0].content.parts) {
      
      const parts = response.data.candidates[0].content.parts;
      
      // Find the part with inline data
      const inlineDataPart = parts.find(part => part.inlineData);
      
      if (inlineDataPart && inlineDataPart.inlineData) {
        const mimeType = inlineDataPart.inlineData.mimeType || 'image/jpeg';
        const data = inlineDataPart.inlineData.data;
        
        if (data) {
          imageUrl = `data:${mimeType};base64,${data}`;
        }
      }
    }
    
    return {
      text: response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Image generated successfully",
      imageUrl: imageUrl
    };
  } catch (error) {
    console.error('Error calling Gemini image generation API:', error);
    console.error('Error details:', error.response?.data || error.message);
    return { text: "Error generating image", imageUrl: null };
  }
};

// Format prompt based on tutor type
export const formatTutorPrompt = (tutorType, question) => {
  const tutorPrompts = {
    visual: `You are a visual learning AI tutor who specializes in explaining concepts through imagery, diagrams, and visual explanations. 
             Create a response to this question that would be ideal for a visual learner.
             Be concise but thorough, use clear language, and focus on visual explanations.
             
             Additionally, structure your response with visual elements by:
             1. Using <h3> and <h4> tags for clear section headings
             2. Highlighting key concepts with <span class="concept">concept name</span>
             3. Using <span class="highlight">text</span> for important points
             4. Structuring steps in a <ul class="steps"><li>step text</li></ul> format
             5. Creating comparison sections with <div class="comparison"><div class="comparison-item"><h5>Title</h5><p>Content</p></div></div>
             6. Adding notes with <div class="note">Important note text</div>
             7. Including code examples with <pre class="example"><code>code here</code></pre>
             8. Using <span class="comment">comment text</span> within code examples
             
             Question: ${question}`,
    
    auditory: `You are an auditory learning AI tutor who specializes in explaining concepts through verbal descriptions, 
               auditory patterns, and sound-based analogies.
               Create a response to this question that would be ideal for an auditory learner.
               Be concise but thorough, use clear language, and focus on verbal explanations that would sound good when read aloud.
               Question: ${question}`,
    
    kinesthetic: `You are a kinesthetic learning AI tutor who specializes in explaining concepts through practical, hands-on examples, 
                  physical analogies, and interactive exercises.
                  Create a response to this question that would be ideal for a kinesthetic learner.
                  Be concise but thorough, use clear language, and include practical exercises or simulations the learner could try.
                  Format any exercises or activities as numbered steps.
                  Question: ${question}`
  };

  return tutorPrompts[tutorType.toLowerCase()] || tutorPrompts.visual;
};

// Generate visual text with properly formatted HTML for visual explanations
export const generateVisualText = (topic, response) => {
  // Process the response text to enhance visual formatting if needed
  let visualText = response;
  
  // Make sure we have basic HTML structure
  if (!visualText.includes('<h3>') && !visualText.includes('<h4>')) {
    // Add a title
    const topicTitle = topic.charAt(0).toUpperCase() + topic.slice(1);
    visualText = `<h3>Visual Guide: ${topicTitle}</h3>` + visualText;
  }
  
  // Add concept spans to common programming terms if not already marked up
  const programmingConcepts = [
    'array', 'variable', 'function', 'method', 'class', 'object', 
    'inheritance', 'recursion', 'iteration', 'loop', 'algorithm',
    'data structure', 'hash map', 'stack', 'queue', 'linked list',
    'tree', 'graph', 'sorting', 'searching', 'big O'
  ];
  
  // Only apply these enhancements if the response doesn't already have HTML formatting
  if (!visualText.includes('class="concept"')) {
    programmingConcepts.forEach(concept => {
      // Use word boundaries to avoid partial matches
      const conceptRegex = new RegExp(`\\b${concept}\\b`, 'gi');
      // Skip replacing in HTML tags
      visualText = visualText.replace(conceptRegex, match => {
        return `<span class="concept">${match}</span>`;
      });
    });
  }
  
  // Add highlight spans to important phrases if not already marked
  if (!visualText.includes('class="highlight"')) {
    const importantPhrases = [
      'important', 'key concept', 'remember', 'note that', 'crucial',
      'essential', 'fundamental', 'primary', 'critical'
    ];
    
    importantPhrases.forEach(phrase => {
      const phraseRegex = new RegExp(`(${phrase}[^.!?]*[.!?])`, 'gi');
      visualText = visualText.replace(phraseRegex, '<span class="highlight">$1</span>');
    });
  }
  
  // Convert numbered lists to visual steps if not already formatted
  if (!visualText.includes('class="steps"')) {
    // Match numbered lists (1. Step one, 2. Step two, etc.)
    const numberedListRegex = /(\d+\.\s+[^\n]+\n?)+/g;
    visualText = visualText.replace(numberedListRegex, match => {
      // Extract each step
      const steps = match.split(/\d+\.\s+/).filter(step => step.trim());
      return '<ul class="steps">' + 
        steps.map(step => `<li>${step.trim()}</li>`).join('') + 
        '</ul>';
    });
  }

  return visualText;
};

// Generate diagram URLs using QuickChart and Mermaid syntax
// eslint-disable-next-line no-unused-vars
const generateDiagramUrl = (topic) => {
  const topic_lower = topic.toLowerCase();
  
  // Choose the right diagram type based on the topic
  let diagram = '';
  
  if (topic_lower.includes('array') || topic_lower.includes('list')) {
    // Array diagram
    diagram = `graph LR
      A[Index 0] --- B[Index 1] --- C[Index 2] --- D[Index 3] --- E[...] --- F[Index n]
      style A fill:#4D61FC,color:white
      style B fill:#4D61FC,color:white
      style C fill:#4D61FC,color:white
      style D fill:#4D61FC,color:white
      style F fill:#4D61FC,color:white`;
  } 
  else if (topic_lower.includes('stack')) {
    // Stack diagram
    diagram = `graph TD
      A[Top: Last In] --> B[Element] --> C[Element] --> D[Bottom: First In]
      style A fill:#4D61FC,color:white
      style B fill:#5D71FC,color:white
      style C fill:#6D81FC,color:white
      style D fill:#7D91FC,color:white`;
  }
  else if (topic_lower.includes('queue')) {
    // Queue diagram
    diagram = `graph LR
      A[First In] --> B[Element] --> C[Element] --> D[Last In]
      style A fill:#4D61FC,color:white
      style B fill:#5D71FC,color:white
      style C fill:#6D81FC,color:white
      style D fill:#7D91FC,color:white`;
  }
  else if (topic_lower.includes('tree') || topic_lower.includes('binary')) {
    // Binary tree diagram
    diagram = `graph TD
      A[Root] --> B[Left Child] & C[Right Child]
      B --> D[Left Grandchild] & E[Right Grandchild]
      C --> F[Left Grandchild] & G[Right Grandchild]
      style A fill:#4D61FC,color:white
      style B fill:#5D71FC,color:white
      style C fill:#5D71FC,color:white`;
  }
  else if (topic_lower.includes('hash') || topic_lower.includes('map') || topic_lower.includes('dict')) {
    // Hash map diagram
    diagram = `graph TD
      A[Hash Table] --> B[Bucket 0] & C[Bucket 1] & D[Bucket 2] & E[...]
      B --> F[Key-Value]
      C --> G[Key-Value] --> H[Key-Value]
      style A fill:#4D61FC,color:white
      style B fill:#5D71FC,color:white
      style C fill:#5D71FC,color:white
      style D fill:#5D71FC,color:white`;
  }
  else if (topic_lower.includes('linked')) {
    // Linked list diagram
    diagram = `graph LR
      A[Head] --> B[Node] --> C[Node] --> D[Node] --> E[Null]
      B -- Data --> F[Value 1]
      C -- Data --> G[Value 2]
      D -- Data --> H[Value 3]
      style A fill:#4D61FC,color:white
      style B fill:#5D71FC,color:white
      style C fill:#6D81FC,color:white
      style D fill:#7D91FC,color:white`;
  }
  else if (topic_lower.includes('recursion')) {
    // Recursion diagram
    diagram = `graph TD
      A[Function Call] --> B[Function Call] --> C[Function Call] --> D[Base Case]
      D --> E[Return] --> F[Return] --> G[Return]
      style A fill:#4D61FC,color:white
      style B fill:#5D71FC,color:white
      style C fill:#6D81FC,color:white
      style D fill:#7D91FC,color:white`;
  }
  else if (topic_lower.includes('sort') || topic_lower.includes('algorithm')) {
    // Sorting algorithm general diagram
    diagram = `graph TD
      A[Unsorted Array] --> B[Sorting Algorithm]
      B --> C[Sorted Array]
      B --> D{Compare} --> E[Swap] --> D
      style A fill:#4D61FC,color:white
      style B fill:#5D71FC,color:white
      style C fill:#6D81FC,color:white`;
  }
  else if (topic_lower.includes('graph')) {
    // Graph diagram
    diagram = `graph TD
      A((Node A)) --- B((Node B))
      A --- C((Node C))
      B --- D((Node D))
      C --- D
      style A fill:#4D61FC,color:white
      style B fill:#5D71FC,color:white
      style C fill:#6D81FC,color:white
      style D fill:#7D91FC,color:white`;
  }
  else if (topic_lower.includes('function') || topic_lower.includes('method')) {
    // Function diagram
    diagram = `graph LR
      A[Input] --> B[Function] --> C[Output]
      style A fill:#4D61FC,color:white
      style B fill:#5D71FC,color:white
      style C fill:#6D81FC,color:white`;
  }
  else if (topic_lower.includes('variable') || topic_lower.includes('data type')) {
    // Variables and data types
    diagram = `graph TD
      A[Variables] --> B[Primitive Types] & C[Reference Types]
      B --> D[Numbers] & E[Strings] & F[Boolean]
      C --> G[Objects] & H[Arrays] & I[Functions]
      style A fill:#4D61FC,color:white
      style B fill:#5D71FC,color:white
      style C fill:#5D71FC,color:white`;
  }
  else if (topic_lower.includes('loop')) {
    // Loop diagram
    diagram = `graph TD
      A[Initialize] --> B{Condition}
      B -- True --> C[Body]
      C --> D[Update] --> B
      B -- False --> E[Exit Loop]
      style A fill:#4D61FC,color:white
      style B fill:#5D71FC,color:white
      style C fill:#6D81FC,color:white
      style D fill:#7D91FC,color:white`;
  }
  else if (topic_lower.includes('class') || topic_lower.includes('object')) {
    // Object-oriented programming
    diagram = `graph TD
      A[Class] --> B[Attributes] & C[Methods]
      A --> D[Object 1] & E[Object 2]
      style A fill:#4D61FC,color:white
      style B fill:#5D71FC,color:white
      style C fill:#5D71FC,color:white
      style D fill:#6D81FC,color:white
      style E fill:#6D81FC,color:white`;
  }
  else {
    // Generic coding concept diagram
    diagram = `graph LR
      A[Input] --> B[Process] --> C[Output]
      style A fill:#4D61FC,color:white
      style B fill:#5D71FC,color:white
      style C fill:#6D81FC,color:white`;
  }
  
  // Use QuickChart to render the Mermaid diagram
  const encodedDiagram = encodeURIComponent(diagram);
  return `https://quickchart.io/mermaid?theme=dark&backgroundColor=transparent&width=500&height=300&mermaid=${encodedDiagram}`;
};

// Process response based on tutor type
export const getTutorResponse = async (tutorType, question) => {
  try {
    const prompt = formatTutorPrompt(tutorType, question);
    // For visual tutor, also generate an image
    if (tutorType.toLowerCase() === 'visual') {
      try {
        // Get text response
        const textResponse = await getGeminiTextResponse(prompt);
        
        // Create visually enhanced text
        const visualText = generateVisualText(question, textResponse);
        
        // Get a local diagram image based on the question topic
        const localDiagram = getLocalDiagram(question);
        
        // Return both the plain response, visual text and the diagram
        return {
          response: textResponse,
          media: {
            type: 'image',
            url: localDiagram,
            visualText: visualText // Include the visual text as a fallback or complement
          }
        };
      } catch (error) {
        console.error('Error generating visualization, trying fallback:', error);
        
        try {
          // Fallback to text-only response with default diagram
          const fallbackResponse = await getGeminiTextResponse(prompt);
          const visualText = generateVisualText(question, fallbackResponse);
          
          // If the diagram fails, we can still return the visual text as primary
          if (Math.random() > 0.5) {  // 50% chance to use visual text instead of SVG
            return { 
              response: fallbackResponse, 
              media: {
                type: 'visualText',
                content: visualText
              } 
            };
          } else {
            const defaultLocalDiagram = getLocalDiagram('default');
            
            return { 
              response: fallbackResponse, 
              media: {
                type: 'image',
                url: defaultLocalDiagram,
                visualText: visualText
              } 
            };
          }
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError);
          return { response: "I'm sorry, I couldn't generate a response. Please try again with a different question.", media: null };
        }
      }
    } 
    // For auditory tutor (text for now, could be enhanced with audio)
    else if (tutorType.toLowerCase() === 'auditory') {
      const textResponse = await getGeminiTextResponse(prompt);
      return { 
        response: textResponse,
        media: { 
          type: 'audio', 
          placeholder: false,
          text: textResponse,
          // Add data for browser's text-to-speech functionality
          useWebSpeech: true 
        }
      };
    } 
    // For kinesthetic tutor (include interactive elements)
    else if (tutorType.toLowerCase() === 'kinesthetic') {
      const textResponse = await getGeminiTextResponse(prompt);
      
      // Extract steps or exercises from the response using regex to find numbered lists
      const stepsMatch = textResponse.match(/\d+\.\s+(.+?)(?=\n\d+\.|$)/gs);
      const interactiveSteps = stepsMatch 
        ? stepsMatch.map((step, index) => ({
            id: index + 1,
            text: step.trim(),
            completed: false,
            type: 'exercise'
          }))
        : null;

      return { 
        response: textResponse,
        media: interactiveSteps && interactiveSteps.length > 0 
          ? { type: 'interactive', steps: interactiveSteps } 
          : null
      };
    }
    
    // Default fallback
    const textResponse = await getGeminiTextResponse(prompt);
    return { response: textResponse, media: null };
  } catch (error) {
    console.error('Error getting tutor response:', error);
    throw error;
  }
}; 