/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AITutors.css';
import EnhancedAITutorChat from '../../components/EnhancedAITutorChat';
import ErrorMessage from '../../components/common/ErrorMessage';
import { getGeminiTextResponse } from '../../services/geminiService';
import { useLocation } from 'react-router-dom';
/* eslint-enable no-unused-vars */

const tutorStyles = {
  visual: {
    type: 'visual',
    name: 'Visual Tutor',
    description: 'Learn through diagrams, infographics, and visual explanations',
    imagePath: '/tutors/visual-tutor.png',
    strengths: [
      'Interactive diagrams and flowcharts',
      'Visual problem-solving techniques',
      'Mind mapping and concept visualization'
    ],
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    accentColor: '#F59E0B'
  },
  auditory: {
    type: 'auditory',
    name: 'Auditory Tutor',
    description: 'Learn through interactive dialogues and verbal guidance',
    imagePath: '/tutors/auditory-tutor.png',
    strengths: [
      'Interactive discussions',
      'Verbal problem explanations',
      'Audio-based learning materials'
    ],
    gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    accentColor: '#10B981'
  },
  kinesthetic: {
    type: 'kinesthetic',
    name: 'Kinesthetic Tutor',
    description: 'Learn through hands-on activities and practical exercises',
    imagePath: '/tutors/kinesthetic-tutor.png',
    strengths: [
      'Hands-on exercises',
      'Interactive simulations',
      'Practice-based learning'
    ],
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
    accentColor: '#8B5CF6'
  }
};

const assessmentQuestions = {
  visual: [
    {
      id: 'v1',
      question: 'When learning a new programming concept, which method helps you understand best?',
      options: [
        { id: 'v1a', text: 'Diagrams and flowcharts showing the concept flow', weight: 3 },
        { id: 'v1b', text: 'Code examples with highlighted syntax', weight: 2 },
        { id: 'v1c', text: 'Visual metaphors and analogies', weight: 2 }
      ]
    },
    {
      id: 'v2',
      question: 'How do you prefer to plan your coding projects?',
      options: [
        { id: 'v2a', text: 'Creating detailed wireframes and mockups', weight: 3 },
        { id: 'v2b', text: 'Drawing system architecture diagrams', weight: 2 },
        { id: 'v2c', text: 'Making visual mind maps of features', weight: 2 }
      ]
    },
    {
      id: 'v3',
      question: 'When debugging code, what helps you most?',
      options: [
        { id: 'v3a', text: 'Visualizing the data flow through diagrams', weight: 3 },
        { id: 'v3b', text: 'Using debugger visualization tools', weight: 2 },
        { id: 'v3c', text: 'Color-coded error highlighting', weight: 2 }
      ]
    },
    {
      id: 'v4',
      question: 'How do you best understand complex algorithms?',
      options: [
        { id: 'v4a', text: 'Through animated visualizations', weight: 3 },
        { id: 'v4b', text: 'Step-by-step visual breakdowns', weight: 2 },
        { id: 'v4c', text: 'Visual comparison with similar algorithms', weight: 2 }
      ]
    },
    {
      id: 'v5',
      question: 'When learning about data structures, what works best for you?',
      options: [
        { id: 'v5a', text: 'Visual representations of the structure', weight: 3 },
        { id: 'v5b', text: 'Diagrams showing data manipulation', weight: 2 },
        { id: 'v5c', text: 'Interactive visual examples', weight: 2 }
      ]
    }
  ],
  auditory: [
    {
      id: 'a1',
      question: 'How do you prefer to learn new programming languages?',
      options: [
        { id: 'a1a', text: 'Through video tutorials with explanations', weight: 3 },
        { id: 'a1b', text: 'Discussion-based learning sessions', weight: 2 },
        { id: 'a1c', text: 'Audio programming courses', weight: 2 }
      ]
    },
    {
      id: 'a2',
      question: 'When solving coding problems, what approach works best?',
      options: [
        { id: 'a2a', text: 'Talking through the problem out loud', weight: 3 },
        { id: 'a2b', text: 'Discussing solutions with peers', weight: 2 },
        { id: 'a2c', text: 'Listening to explanations of solutions', weight: 2 }
      ]
    },
    {
      id: 'a3',
      question: 'How do you best understand code reviews?',
      options: [
        { id: 'a3a', text: 'Verbal walkthrough of changes', weight: 3 },
        { id: 'a3b', text: 'Discussion-based review sessions', weight: 2 },
        { id: 'a3c', text: 'Explaining your code to others', weight: 2 }
      ]
    },
    {
      id: 'a4',
      question: 'What helps you remember programming concepts?',
      options: [
        { id: 'a4a', text: 'Verbal analogies and examples', weight: 3 },
        { id: 'a4b', text: 'Discussion groups and study sessions', weight: 2 },
        { id: 'a4c', text: 'Recording and listening to explanations', weight: 2 }
      ]
    },
    {
      id: 'a5',
      question: 'How do you prefer to debug your code?',
      options: [
        { id: 'a5a', text: 'Discussing the problem with others', weight: 3 },
        { id: 'a5b', text: 'Rubber duck debugging (explaining aloud)', weight: 2 },
        { id: 'a5c', text: 'Audio debugging logs and alerts', weight: 2 }
      ]
    }
  ],
  kinesthetic: [
    {
      id: 'k1',
      question: 'How do you prefer to practice coding concepts?',
      options: [
        { id: 'k1a', text: 'Building real projects from scratch', weight: 3 },
        { id: 'k1b', text: 'Interactive coding exercises', weight: 2 },
        { id: 'k1c', text: 'Hands-on debugging sessions', weight: 2 }
      ]
    },
    {
      id: 'k2',
      question: 'What helps you learn new frameworks best?',
      options: [
        { id: 'k2a', text: 'Building sample applications', weight: 3 },
        { id: 'k2b', text: 'Following along with tutorials', weight: 2 },
        { id: 'k2c', text: 'Modifying existing projects', weight: 2 }
      ]
    },
    {
      id: 'k3',
      question: 'How do you prefer to explore new APIs?',
      options: [
        { id: 'k3a', text: 'Writing test code and experimenting', weight: 3 },
        { id: 'k3b', text: 'Building small proof-of-concepts', weight: 2 },
        { id: 'k3c', text: 'Interactive API playgrounds', weight: 2 }
      ]
    },
    {
      id: 'k4',
      question: 'What\'s your preferred way to learn about software architecture?',
      options: [
        { id: 'k4a', text: 'Building systems from ground up', weight: 3 },
        { id: 'k4b', text: 'Refactoring existing applications', weight: 2 },
        { id: 'k4c', text: 'Implementing design patterns practically', weight: 2 }
      ]
    },
    {
      id: 'k5',
      question: 'How do you best learn about database concepts?',
      options: [
        { id: 'k5a', text: 'Setting up and managing real databases', weight: 3 },
        { id: 'k5b', text: 'Practicing queries on sample data', weight: 2 },
        { id: 'k5c', text: 'Building database-driven applications', weight: 2 }
      ]
    }
  ]
};

const LoadingState = () => (
  <div className="loading-container">
    <div className="loading-text">
      Preparing Your Personalized AI Tutor
    </div>
    <div className="loading-subtext">
      Analyzing your learning preferences...
    </div>
    <div className="loading-spinner" />
  </div>
);

function AITutors() {
  const [currentStep, setCurrentStep] = useState('selection');
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [assessmentAnswers, setAssessmentAnswers] = useState({});
  const [learningPath, setLearningPath] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const loadingRef = useRef(null);
  const pageTopRef = useRef(null);
  const location = useLocation();

  // Make sure we're importing BACKEND_URL if needed to fix the warning
  // eslint-disable-next-line no-unused-vars
  const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  
  // Always scroll to top when component mounts, regardless of previous scroll position
  useEffect(() => {
    // Add class to the body to disable smooth scrolling
    document.body.classList.add('ai-tutors-page-active');
    document.documentElement.classList.add('ai-tutors-page-active');
    
    // Scroll to top immediately on component mount
    window.scrollTo(0, 0);
    forceScrollTop();
    
    // Also try after a 50ms delay in case of race conditions
    const timer = setTimeout(() => {
      forceScrollTop();
    }, 50);
    
    // Clean up function to remove the class when component unmounts
    return () => {
      document.body.classList.remove('ai-tutors-page-active');
      document.documentElement.classList.remove('ai-tutors-page-active');
      clearTimeout(timer);
    };
  }, [location]); // Add location dependency to ensure it runs when route changes
  
  // Keep scrolling for loading indicator
  useEffect(() => {
    if (isLoading && loadingRef.current) {
      // Small delay to ensure component is rendered
      setTimeout(() => {
        loadingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [isLoading]);
  
  // Enhanced version of force scroll top that uses multiple approaches
  const forceScrollTop = () => {
    // Disable smooth scrolling temporarily
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.scrollBehavior = 'auto';
    
    // Method 1: Standard window scrolling with {top: 0}
    window.scrollTo(0, 0);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto'
    });
    
    // Method 2: Document element scrolling
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0; // For Safari
    
    // Method 3: Element-based scrolling if available
    if (pageTopRef.current) {
      pageTopRef.current.scrollIntoView({
        block: 'start',
        inline: 'nearest',
        behavior: 'auto'
      });
    }
    
    // Method 4: Force scroll with focus
    const scrollToTopEl = document.getElementById('page-top');
    if (scrollToTopEl) {
      scrollToTopEl.focus();
      scrollToTopEl.blur();
    }
    
    // Re-enable smooth scrolling after a delay
    setTimeout(() => {
      document.documentElement.style.scrollBehavior = '';
      document.body.style.scrollBehavior = '';
    }, 100);
  };

  // Reset scroll position when changing steps
  useEffect(() => {
    forceScrollTop();
    
    // Set a delayed call to catch any race conditions
    const timer = setTimeout(forceScrollTop, 100);
    return () => clearTimeout(timer);
  }, [currentStep]);

  // Add a script to the head to force immediate scroll without any smooth scrolling
  useEffect(() => {
    // Create a script element to execute scrolling logic immediately
    const scrollScript = document.createElement('script');
    scrollScript.id = 'ai-tutors-scroll-script';
    scrollScript.innerHTML = `
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    `;
    
    // Add the script to the document
    document.head.appendChild(scrollScript);
    
    // Clean up
    return () => {
      const existingScript = document.getElementById('ai-tutors-scroll-script');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [currentStep]);

  const handleTutorSelect = (tutorType) => {
    // First update the state
    setSelectedTutor(tutorType);
    
    // Force scroll to top before changing steps
    forceScrollTop();
    
    // Then change the step after a small delay to ensure DOM is ready
    setTimeout(() => {
      setCurrentStep('assessment');
      // Apply scroll again after state update
      forceScrollTop();
    }, 10);
  };

  const handleAnswerSelect = (questionId, answerId) => {
    setAssessmentAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const generateLearningPath = async (answers, tutorType) => {
    try {
      // Calculate learning style scores
      const scores = Object.entries(answers).reduce((acc, [questionId, answerId]) => {
        const question = assessmentQuestions[tutorType].find(q => q.id === questionId.split('_')[0]);
        if (!question) return acc;
        
        const option = question.options.find(opt => opt.id === answerId);
        if (!option) return acc;
        
        return {
          ...acc,
          [questionId]: {
            question: question.question,
            answer: option.text,
            weight: option.weight
          }
        };
      }, {});

      // Create a prompt for the Gemini API
      const answerSummary = Object.entries(scores)
        .map(([id, data]) => `Question: ${data.question}\nAnswer: ${data.answer}\n`)
        .join('\n');

      const prompt = `
You are an expert AI education assistant specializing in personalized learning paths.
Create a personalized learning path for a student based on their assessment results.
The student has selected the ${tutorType} learning style. Here are their answers to the assessment:

${answerSummary}

Based on these responses, create:
1. A brief description of their learning style and preferences (2-3 sentences)
2. 3-5 key learning strengths based on their answers (format as bullet points with * or -)
3. A 5-step personalized learning path with specific recommendations tailored to their ${tutorType} learning style (format as numbered steps)

Format your response in clean, well-structured markdown. Make sure strengths are clearly formatted as bullet points and steps are numbered.

Your response should be professional, encouraging, and focus on maximizing their learning potential through their preferred learning style.
`;

      // Get response from Gemini
      const geminiResponse = await getGeminiTextResponse(prompt);
      
      // Process and clean the response text
      const cleanResponse = geminiResponse.trim();
      
      // Parse the response to extract sections
      // Find the description (first paragraph before any bullet points or numbered lists)
      const description = cleanResponse.split(/\n\s*[*\-\d.]/).shift().trim() ||
        'Your personalized learning path is designed to optimize your learning based on your assessment results.';
      
      // Extract strengths section (bullet points)
      // eslint-disable-next-line no-useless-escape
      const strengthsRegex = /(?:strengths|key strengths)[:\s]*\n((?:[\s]*[*\-][^\n]*\n)+)/i;
      const strengthsMatch = cleanResponse.match(strengthsRegex);
      let strengths = [];
      
      if (strengthsMatch && strengthsMatch[1]) {
        // eslint-disable-next-line no-useless-escape
        strengths = strengthsMatch[1].split(/[*\-]/)
          .map(s => s.trim())
          .filter(s => s.length > 0);
      } else {
        // Fallback: look for any bullet points
        // eslint-disable-next-line no-useless-escape
        const bulletPointsRegex = /[*\-]\s*([^\n]+)/g;
        const bulletMatches = [...cleanResponse.matchAll(bulletPointsRegex)];
        strengths = bulletMatches.map(match => match[1].trim()).slice(0, 5);
      }
      
      // Extract recommendations/steps section (numbered lists)
      const recommendationsRegex = /(?:\d\.|\d\))\s*([^\n]+)/g;
      const recommendationMatches = [...cleanResponse.matchAll(recommendationsRegex)];
      const recommendations = recommendationMatches.map(match => match[1].trim());

      return {
        description,
        tutorType,
        strengths: strengths.length > 0 ? strengths : [
          "Preference for " + tutorType + " learning methods",
          "Strong ability to process information through " + tutorType + " channels",
          "Natural aptitude for learning with " + tutorType + " teaching approaches"
        ],
        recommendations: recommendations.length > 0 ? recommendations : [
          "Start with foundational " + tutorType + " learning exercises",
          "Practice with interactive " + tutorType + " learning materials",
          "Engage with peers through " + tutorType + " learning activities",
          "Apply knowledge through " + tutorType + " practice sessions",
          "Create your own " + tutorType + " learning materials to reinforce concepts"
        ],
        adaptiveLearningPath: true
      };
    } catch (error) {
      console.error('Learning path generation error:', error);
      throw error;
    }
  };

  const handleAssessmentSubmit = async () => {
    try {
      // Disable smooth scrolling temporarily
      document.documentElement.style.scrollBehavior = 'auto';
      document.body.style.scrollBehavior = 'auto';
      
      // First scroll to top - do this early
      forceScrollTop();
      
      setIsLoading(true);
      setError(null);

      const results = await generateLearningPath(assessmentAnswers, selectedTutor);
      
      // Set the learning path first
      setLearningPath(results);
      
      // Force scroll again before changing step
      forceScrollTop();
      
      // Then update the current step with a slight delay
      setTimeout(() => {
        setCurrentStep('results');
        
        // Apply multiple scroll attempts with increasing delays
        forceScrollTop();
        
        // Insert direct script for immediate execution
        const scrollScript = document.createElement('script');
        scrollScript.textContent = `
          window.scrollTo(0, 0);
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        `;
        document.head.appendChild(scrollScript);
        setTimeout(() => {
          document.head.removeChild(scrollScript);
        }, 100);
        
        setTimeout(forceScrollTop, 50);
        setTimeout(forceScrollTop, 200);
        setTimeout(forceScrollTop, 500);
      }, 10);
      
    } catch (error) {
      console.error('Assessment error:', error);
      setError('Failed to process assessment results. Please try again.');
    } finally {
      setIsLoading(false);
      // Restore smooth scrolling
      setTimeout(() => {
        document.documentElement.style.scrollBehavior = '';
        document.body.style.scrollBehavior = '';
      }, 500);
    }
  };

  const renderTutorCard = (tutor) => {
    const colorClasses = {
      visual: 'visual-tutor',
      auditory: 'auditory-tutor',
      kinesthetic: 'kinesthetic-tutor'
    };

    return (
      <div className={`tutor-card ${colorClasses[tutor.type]}`}>
        <div className="tutor-image-container">
          <img src={tutor.imagePath} alt={tutor.name} className="tutor-image" />
        </div>
        <h3>{tutor.name}</h3>
        <p>{tutor.description}</p>
        <div className="key-features">
          <h4>Key Features:</h4>
          <ul>
            {tutor.strengths.map((strength, index) => (
              <li key={index}>{strength}</li>
            ))}
          </ul>
        </div>
        <button 
          className="start-learning-btn"
          onClick={() => handleTutorSelect(tutor.type)}
        >
          START LEARNING NOW
        </button>
      </div>
    );
  };

  const renderAssessment = () => {
    if (!selectedTutor || !assessmentQuestions[selectedTutor.toLowerCase()]) {
      return null;
    }

    return (
      <div className="assessment-container">
        <h2>Learning Style Assessment</h2>
        <p className="assessment-intro">
          Answer these questions to help us create a personalized learning experience for you.
          This will help your AI tutor understand your preferences and provide tailored guidance.
        </p>
        <div className="questions-container">
          {assessmentQuestions[selectedTutor.toLowerCase()].map((q) => (
            <div key={q.id} className="question-card">
              <p className="question-text">{q.question}</p>
              <div className="options-container">
                {q.options.map((option) => (
                  <button
                    key={option.id}
                    className={`option-btn ${assessmentAnswers[q.id] === option.id ? 'selected' : ''}`}
                    onClick={() => handleAnswerSelect(q.id, option.id)}
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="assessment-actions">
          {error ? (
            <ErrorMessage message={error} onRetry={handleAssessmentSubmit} />
          ) : (
            <>
              <button
                className="submit-btn"
                onClick={handleAssessmentSubmit}
                disabled={Object.keys(assessmentAnswers).length < assessmentQuestions[selectedTutor.toLowerCase()].length}
              >
                Create My Learning Path
              </button>
              {isLoading && <div ref={loadingRef}><LoadingState /></div>}
            </>
          )}
        </div>
      </div>
    );
  };

  const renderResults = () => {
    // Get the tutor color class based on selectedTutor
    const tutorColorClass = selectedTutor ? `${selectedTutor}-tutor` : '';

    // Function to clean placeholder text
    const cleanPlaceholderText = (text) => {
      if (!text) return '';
      
      // Remove markdown-style headers like *1. Learning Style Description:**
      return text.replace(/^\*\d+\.\s+[^*]+\*\*$/m, '').trim();
    };

    // Fallback recommendations if none are provided
    const getFallbackRecommendations = () => {
      const fallbacks = {
        visual: [
          "Study with visual diagrams and flowcharts",
          "Use visual mnemonics for complex concepts",
          "Watch video tutorials with visual demonstrations",
          "Create mind maps for organizing information",
          "Use color-coding in your notes and study materials"
        ],
        auditory: [
          "Participate in discussion groups and verbal exchanges",
          "Record and listen to key concepts and explanations",
          "Verbalize problems aloud when solving them",
          "Use audio learning materials and podcasts",
          "Engage in pair programming with verbal explanations"
        ],
        kinesthetic: [
          "Practice hands-on coding exercises regularly",
          "Build small projects to reinforce concepts",
          "Use interactive tutorials with practical components",
          "Implement code examples while learning new material",
          "Participate in hackathons and practical workshops"
        ]
      };
      
      return fallbacks[selectedTutor] || fallbacks.visual;
    };

    return (
      <div className="results-container">
        <div className="results-content">
          <div className={`learning-path-section ${tutorColorClass}`}>
            <h2>Your Personalized Learning Path</h2>
            {learningPath && (
              <div className="learning-path-flowchart">
                <div className="path-description">
                  {cleanPlaceholderText(learningPath.description) || 
                    `Here's a customized learning path based on your ${selectedTutor} learning style preferences.`}
                </div>
                
                {learningPath.strengths && learningPath.strengths.length > 0 && (
                  <div className="strengths-section">
                    <h3>Learning Strengths</h3>
                    <ul className="strengths-list">
                      {learningPath.strengths
                        .filter(strength => !strength.startsWith('*') && strength.trim().length > 0)
                        .map((strength, index) => (
                          <li key={index} className="strength-item">
                            <span className="strength-icon">✓</span>
                            <span>{strength}</span>
                          </li>
                        ))
                      }
                    </ul>
                  </div>
                )}
                
                <div className="path-steps">
                  <h3>Recommended Steps</h3>
                  <div className="steps-container">
                    {(learningPath.recommendations && learningPath.recommendations.length > 0 
                      ? learningPath.recommendations
                          .filter(step => !step.startsWith('*') && step.trim().length > 0)
                      : getFallbackRecommendations()
                    ).map((step, index) => (
                      <div key={index} className="path-step">
                        <div className="step-number">{index + 1}</div>
                        <div className="step-content">{step}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={`chat-section ${tutorColorClass}`}>
            <div className="chat-header">
              <h3>Chat with Your {tutorStyles[selectedTutor]?.name}</h3>
              <p className="chat-intro">Ask questions and get explanations tailored to your learning style.</p>
            </div>
            <div className="tutor-chat-container">
              <EnhancedAITutorChat tutorType={selectedTutor} tutorStyle={tutorStyles[selectedTutor]} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="ai-tutors-page">
      <div 
        id="page-top" 
        ref={pageTopRef} 
        tabIndex="-1"
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          height: 1, 
          width: 1, 
          margin: 0, 
          padding: 0, 
          outline: 'none'
        }} 
      />
      
      <div className="page-header">
        <h1>Choose Your AI Learning Style</h1>
        <p>Select a tutor that matches your preferred way of learning. Each tutor is specialized in a different teaching approach to help you learn more effectively.</p>
      </div>
      <AnimatePresence mode="wait">
        {error && <ErrorMessage message={error} />}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          onAnimationStart={() => {
            // Force scroll to top before animation starts
            forceScrollTop();
          }}
        >
          {currentStep === 'selection' && (
            <div className="tutors-grid">
              {Object.values(tutorStyles).map(tutor => renderTutorCard(tutor))}
            </div>
          )}
          {currentStep === 'assessment' && renderAssessment()}
          {currentStep === 'results' && renderResults()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default AITutors;
