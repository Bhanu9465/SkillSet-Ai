import { storeAssessmentData } from '../../services/languageModel';

// Learning path templates for each learning style
export const learningPathTemplates = {
  visual: {
    title: "Visual Learning Path",
    steps: [
      {
        title: "Visual Context",
        description: "To understand {{concept}}, let's visualize it with diagrams and visual explanations.",
        aiPrompt: "Explain {{concept}} using diagrams, flowcharts, and visual representations. Focus on spatial relationships and visual organization of information."
      },
      {
        title: "Concept Map",
        description: "Let's create a concept map showing how {{concept}} connects to related ideas.",
        aiPrompt: "Create a concept map or mind map for {{concept}}, showing relationships between key ideas. Use visual hierarchy and organization."
      },
      {
        title: "Code Visualization",
        description: "Let's look at how {{concept}} is implemented in code with annotated examples.",
        aiPrompt: "Show code examples of {{concept}} with visual annotations highlighting key parts. Include explanatory diagrams of code execution and data flow."
      },
      {
        title: "Visual Pattern Recognition",
        description: "Identify visual patterns and structures in {{concept}}.",
        aiPrompt: "Identify and explain visual patterns or structures in {{concept}}. Use examples that showcase the pattern recognition aspects of this topic."
      },
      {
        title: "Infographic Summary",
        description: "Let's summarize what we've learned about {{concept}} in a visual way.",
        aiPrompt: "Create an infographic-style summary of {{concept}} with key points, visual examples, and diagrams. Emphasize the most important visual aspects of the topic."
      }
    ],
    recommendedDiagrams: [
      "array",
      "tree",
      "linked list",
      "stack",
      "queue",
      "hash map",
      "recursion",
      "sorting",
      "graph",
      "loop"
    ]
  },
  auditory: {
    title: "Auditory Learning Path",
    steps: [
      {
        title: "Verbal Introduction",
        description: "Let's hear an explanation of {{concept}} in clear, concise language.",
        aiPrompt: "Explain {{concept}} using clear, descriptive language. Focus on verbal explanations and use analogies that can be easily understood through listening."
      },
      {
        title: "Question & Answer Session",
        description: "Let's explore {{concept}} through a series of questions and answers.",
        aiPrompt: "Create a Q&A session about {{concept}}, with questions someone might ask and detailed verbal answers. Structure it as a dialogue."
      },
      {
        title: "Audio Walkthrough",
        description: "Let's walk through how {{concept}} works step by step with spoken explanations.",
        aiPrompt: "Provide a step-by-step verbal explanation of {{concept}} as if you were explaining it in a lecture. Include clear transitions between steps."
      },
      {
        title: "Verbal Problem Solving",
        description: "Let's solve problems related to {{concept}} through verbal reasoning.",
        aiPrompt: "Present a problem related to {{concept}} and then talk through the solution process verbally, explaining your reasoning at each step."
      },
      {
        title: "Summary Narration",
        description: "Let's summarize what we've learned about {{concept}} in a spoken recap.",
        aiPrompt: "Create a concise verbal summary of the key points about {{concept}}. Structure it as a recap that would work well as a spoken explanation."
      }
    ],
    recommendedDiagrams: [
      "recursion",
      "loop",
      "stack",
      "queue",
      "sorting"
    ]
  },
  kinesthetic: {
    title: "Hands-On Learning Path",
    steps: [
      {
        title: "Interactive Exercise",
        description: "Let's learn {{concept}} by working through practical examples.",
        aiPrompt: "Create an interactive exercise about {{concept}} that involves coding, problem-solving, or step-by-step implementation. Focus on learning by doing."
      },
      {
        title: "Practical Application",
        description: "Let's apply {{concept}} to a real-world scenario with hands-on practice.",
        aiPrompt: "Provide a real-world scenario where {{concept}} is useful, and guide through the practical implementation with hands-on exercises."
      },
      {
        title: "Build Project",
        description: "Let's build a small project that demonstrates {{concept}} in action.",
        aiPrompt: "Guide through building a small project that demonstrates {{concept}}. Include specific tasks and code segments to implement."
      },
      {
        title: "Debugging Challenge",
        description: "Let's debug code related to {{concept}} to understand how it works.",
        aiPrompt: "Present a piece of code related to {{concept}} with bugs, and guide through the process of finding and fixing them. Explain the learning insights from each fix."
      },
      {
        title: "Performance Optimization",
        description: "Let's optimize implementations of {{concept}} for better performance.",
        aiPrompt: "Provide a working implementation of {{concept}} and guide through optimizing it step by step. Explain the improvements at each stage."
      }
    ],
    recommendedDiagrams: [
      "array",
      "linked list",
      "hash map",
      "graph",
      "recursion",
      "loop"
    ]
  }
};

// Process assessment answers and generate a learning path
export const processAssessmentResults = async (answers, tutorStyle, accessibility) => {
  try {
    console.log('Processing assessment with:', { answers, tutorStyle, accessibility });

    // Store assessment data for training
    await storeAssessmentData(tutorStyle, answers);

    // Calculate assessment scores
    const scores = Object.values(answers).reduce((acc, answer) => {
      console.log('Processing answer:', answer);
      return acc + (answer.score || 1);
    }, 0);

    console.log('Calculated total score:', scores);

    // Get learning path template based on tutor style
    const template = learningPathTemplates[tutorStyle.toLowerCase()];
    if (!template) {
      console.error('Invalid tutor style:', tutorStyle);
      throw new Error(`Invalid tutor style: ${tutorStyle}`);
    }

    console.log('Using template:', template);

    // Generate personalized learning path
    const learningPath = template.steps.map((step, index) => {
      return {
        id: index + 1,
        title: step.title,
        description: step.description,
        completed: false
      };
    });

    console.log('Generated learning path:', learningPath);

    return {
      learningPath,
      totalScore: scores,
      recommendedPath: learningPath.map(step => step.title),
      recommendedDiagrams: template.recommendedDiagrams || []
    };
  } catch (error) {
    console.error('Failed to process assessment:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      answers,
      tutorStyle,
      accessibility
    });
    throw error;
  }
};

// Generate additional learning path details
export const generateLearningPath = async (results, tutorStyle, userSettings) => {
  try {
    return {
      path: results.recommendedPath,
      style: tutorStyle,
      accessibility: userSettings.accessibility,
      recommendedDiagrams: results.recommendedDiagrams || []
    };
  } catch (error) {
    console.error('Failed to generate learning path:', error);
    throw error;
  }
};