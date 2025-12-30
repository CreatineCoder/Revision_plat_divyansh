import dotenv from 'dotenv';
import { SessionsClient } from '@google-cloud/dialogflow-cx';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

// Initialize Dialogflow CX client
const sessionsClient = new SessionsClient();

/**
 * Call Dialogflow CX Agent to generate initial content
 * @param {Object} params - { mode, subject, chapter, request }
 * @returns {Promise<string>} - AI generated content
 */
export async function callVertexAI({ mode, subject, chapter, request }) {
  // Check if Vertex AI is configured
  const isConfigured = process.env.GOOGLE_CLOUD_PROJECT && 
                       process.env.VERTEX_AGENT_ID;

  if (!isConfigured) {
    console.warn('⚠️ Dialogflow CX not configured, using mock response');
    return getMockResponse(mode, subject, chapter);
  }

  try {
    const projectId = process.env.GOOGLE_CLOUD_PROJECT.replace(/"/g, '');
    const location = process.env.GOOGLE_CLOUD_LOCATION.replace(/"/g, '') || 'global';
    const agentId = process.env.VERTEX_AGENT_ID.replace(/"/g, '');
    
    // Create a unique session ID
    const sessionId = uuidv4();
    const sessionPath = sessionsClient.projectLocationAgentSessionPath(
      projectId,
      location,
      agentId,
      sessionId
    );

    // Build the prompt with context
    const prompt = buildPrompt(mode, subject, chapter, request);
    
    console.log('🤖 Calling Dialogflow CX Agent...');
    
    // Make the request to Dialogflow CX
    const requestPayload = {
      session: sessionPath,
      queryInput: {
        text: {
          text: prompt,
        },
        languageCode: 'en',
      },
    };

    const [response] = await sessionsClient.detectIntent(requestPayload);
    
    // Extract response text
    const responseMessages = response.queryResult.responseMessages;
    let aiResponse = '';
    
    for (const message of responseMessages) {
      if (message.text && message.text.text && message.text.text.length > 0) {
        aiResponse += message.text.text.join(' ') + '\n';
      }
    }

    if (!aiResponse) {
      console.warn('⚠️ Empty response from agent, using mock response');
      return getMockResponse(mode, subject, chapter);
    }

    console.log('✅ Received response from Dialogflow CX');
    return aiResponse.trim();

  } catch (error) {
    console.error('❌ Dialogflow CX API Error:', error.message);
    console.warn('⚠️ Falling back to mock response');
    return getMockResponse(mode, subject, chapter);
  }
}

/**
 * Call Dialogflow CX Agent for chat interaction
 * @param {Object} params - { mode, subject, chapter, message, history }
 * @returns {Promise<string>} - AI chat response
 */
export async function callVertexAIChat({ mode, subject, chapter, message, history }) {
  const isConfigured = process.env.GOOGLE_CLOUD_PROJECT && 
                       process.env.VERTEX_AGENT_ID;

  if (!isConfigured) {
    console.warn('⚠️ Dialogflow CX not configured, using mock chat response');
    return getMockChatResponse(message, subject, chapter);
  }

  try {
    const projectId = process.env.GOOGLE_CLOUD_PROJECT.replace(/"/g, '');
    const location = process.env.GOOGLE_CLOUD_LOCATION.replace(/"/g, '') || 'global';
    const agentId = process.env.VERTEX_AGENT_ID.replace(/"/g, '');
    
    // Use consistent session for conversation
    const sessionId = uuidv4();
    const sessionPath = sessionsClient.projectLocationAgentSessionPath(
      projectId,
      location,
      agentId,
      sessionId
    );

    // Build context-aware message
    const contextualMessage = `Context: ${mode} mode for ${subject} - ${chapter}\n\nStudent Question: ${message}`;
    
    console.log('💬 Sending chat message to Dialogflow CX...');
    
    const requestPayload = {
      session: sessionPath,
      queryInput: {
        text: {
          text: contextualMessage,
        },
        languageCode: 'en',
      },
    };

    const [response] = await sessionsClient.detectIntent(requestPayload);
    
    const responseMessages = response.queryResult.responseMessages;
    let aiResponse = '';
    
    for (const message of responseMessages) {
      if (message.text && message.text.text && message.text.text.length > 0) {
        aiResponse += message.text.text.join(' ') + '\n';
      }
    }

    if (!aiResponse) {
      console.warn('⚠️ Empty chat response, using mock response');
      return getMockChatResponse(message, subject, chapter);
    }

    console.log('✅ Received chat response from Dialogflow CX');
    return aiResponse.trim();

  } catch (error) {
    console.error('❌ Dialogflow CX Chat Error:', error.message);
    console.warn('⚠️ Falling back to mock chat response');
    return getMockChatResponse(message, subject, chapter);
  }
}

/**
 * Build a structured prompt for Vertex AI
 */
function buildPrompt(mode, subject, chapter, request) {
  const modeInstructions = {
    revision: 'You are an expert tutor. Generate comprehensive revision notes with key concepts, definitions, formulas, and important points. Structure the content clearly with headings and bullet points.',
    assessment: 'You are an exam preparation expert. Generate practice questions including MCQs, short answer questions, and problem-solving exercises with varying difficulty levels.',
    chat: 'You are a helpful educational assistant. Provide clear explanations and be ready to answer follow-up questions about the topic.'
  };

  return `
Context:
- Mode: ${mode}
- Subject: ${subject}
- Chapter: ${chapter}

Instructions: ${modeInstructions[mode]}

Request: ${request}

Please provide educational content appropriate for students studying this topic.
  `.trim();
}

/**
 * Generate mock responses for development/testing
 */
function getMockResponse(mode, subject, chapter) {
  const responses = {
    revision: `
# ${chapter} - Revision Notes

## Key Concepts

### Introduction
${chapter} is a fundamental topic in ${subject} that forms the basis for advanced concepts. Understanding this chapter is crucial for exam preparation.

### Important Definitions
• **Key Term 1**: A fundamental concept that describes the basic principles
• **Key Term 2**: An advanced concept building upon the basics
• **Key Term 3**: A practical application of the theoretical knowledge

### Main Topics

#### Topic 1: Fundamental Principles
The fundamental principles of ${chapter} include several key aspects:
- Basic understanding of core concepts
- Relationship between different elements
- Practical applications in real-world scenarios

#### Topic 2: Advanced Concepts
Building upon the basics, we explore:
- Complex interactions and relationships
- Problem-solving techniques
- Common misconceptions to avoid

### Formulas and Equations
1. **Formula 1**: Basic equation for calculations
2. **Formula 2**: Advanced equation for complex problems
3. **Formula 3**: Practical application formula

### Important Points to Remember
✓ Always start with fundamental understanding
✓ Practice problems regularly
✓ Connect concepts to real-world examples
✓ Review formulas and their applications

### Common Exam Questions
This topic frequently appears in exams as:
- Conceptual understanding questions
- Problem-solving exercises
- Application-based scenarios

### Quick Revision Tips
1. Review key definitions daily
2. Practice numerical problems
3. Create concept maps
4. Solve previous year questions
    `.trim(),

    assessment: `
# ${chapter} - Practice Assessment

## Multiple Choice Questions (MCQs)

**Question 1**: What is the primary concept in ${chapter}?
A) Option A - Basic concept
B) Option B - Intermediate concept
C) Option C - Advanced concept
D) Option D - Application concept

**Correct Answer**: B
**Explanation**: The intermediate concept forms the foundation for understanding this topic.

---

**Question 2**: Which of the following is an application of ${chapter}?
A) Real-world scenario 1
B) Real-world scenario 2
C) Real-world scenario 3
D) All of the above

**Correct Answer**: D
**Explanation**: All scenarios demonstrate practical applications.

---

**Question 3**: In ${subject}, ${chapter} is most closely related to:
A) Previous chapter concept
B) Current chapter focus
C) Future chapter preview
D) Unrelated concept

**Correct Answer**: B

---

## Short Answer Questions

**Question 4**: Define the key terms in ${chapter} and explain their significance.
**Expected Answer**: Should include 3-4 key definitions with brief explanations and their importance in the subject.

---

**Question 5**: Explain the main principle of ${chapter} with an example.
**Expected Answer**: Clear explanation of the principle followed by a relevant real-world or theoretical example.

---

## Problem-Solving Questions

**Question 6**: 
Given: [Initial conditions related to ${chapter}]
Find: [What needs to be calculated or proven]

**Solution Approach**:
1. Identify the given information
2. Apply relevant formula/concept
3. Calculate step by step
4. Verify the answer

---

**Question 7**: Application Problem
A practical scenario requires understanding of ${chapter}. Solve the following:
[Problem statement]

**Hints**:
- Start with basic principles
- Use the formula correctly
- Check units and dimensions
- Verify the final answer

---

## Bonus Challenge Question

**Question 8**: Advanced Application
This question combines concepts from ${chapter} with other topics in ${subject}.
[Complex problem statement]

**Difficulty Level**: High
**Time Required**: 10-15 minutes
**Skills Tested**: Analytical thinking, concept integration, problem-solving
    `.trim(),

    chat: `
Hello! I'm here to help you learn about **${chapter}** in ${subject}. 

This is an important topic that covers several key concepts. I can help you with:

✓ Understanding fundamental concepts
✓ Clarifying doubts and questions
✓ Explaining difficult topics
✓ Providing examples and applications
✓ Suggesting practice problems

**What would you like to know about ${chapter}?**

Some common questions students ask:
• What are the basics I should know?
• Can you explain [specific concept]?
• How does this apply in real life?
• What are common mistakes to avoid?

Feel free to ask me anything related to this topic!
    `.trim()
  };

  return responses[mode] || responses.revision;
}

/**
 * Generate mock chat responses
 */
function getMockChatResponse(message, subject, chapter) {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('formula') || lowerMessage.includes('equation')) {
    return `Great question about formulas in ${chapter}! Here are the key formulas you need to know:\n\n1. **Basic Formula**: [Formula description and when to use it]\n2. **Advanced Formula**: [Formula description and applications]\n\nWould you like me to explain how to apply any of these formulas with an example?`;
  }

  if (lowerMessage.includes('example') || lowerMessage.includes('explain')) {
    return `Let me explain that concept with a clear example:\n\nConsider this scenario in ${subject}:\n[Detailed example explanation]\n\nThis demonstrates how the concept works in practice. Does this make sense? Would you like another example or have any questions?`;
  }

  if (lowerMessage.includes('difference') || lowerMessage.includes('compare')) {
    return `Excellent question! Let me clarify the differences:\n\n**Concept A:**\n• Characteristic 1\n• Characteristic 2\n• Use case\n\n**Concept B:**\n• Characteristic 1\n• Characteristic 2\n• Use case\n\nThe main distinction is... [explanation]\n\nIs there a specific aspect you'd like me to elaborate on?`;
  }

  if (lowerMessage.includes('why') || lowerMessage.includes('how')) {
    return `That's a thoughtful question! Here's the reasoning:\n\n${chapter} works this way because:\n1. [Reason 1 with explanation]\n2. [Reason 2 with explanation]\n3. [Reason 3 with explanation]\n\nThis is important in ${subject} because it helps us understand [application].\n\nDoes this answer your question, or would you like me to go deeper into any part?`;
  }

  // Default response
  return `Thank you for your question about ${chapter}! Based on what you're asking, here's what you should know:\n\n${message} relates to several key concepts in this chapter. The fundamental idea is that [explanation relevant to the question].\n\nIn ${subject}, this is particularly important because [significance].\n\nWould you like me to:\n• Provide more details about this concept\n• Give you a practical example\n• Explain related topics\n• Suggest practice problems\n\nWhat would be most helpful for you?`;
}

export default {
  callVertexAI,
  callVertexAIChat
};
