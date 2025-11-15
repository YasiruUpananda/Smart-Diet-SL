import dotenv from 'dotenv';
import Groq from 'groq-sdk';

dotenv.config();

// Initialize Groq client
let groq = null;

try {
  if (process.env.GROQ_API_KEY) {
    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }
} catch (error) {
  console.warn('Failed to initialize Groq client:', error.message);
  groq = null;
}

// System prompt for LankaNutri Advisor
const SYSTEM_PROMPT = `You are "LankaNutri Advisor" — an expert AI Nutrition Assistant specialized in Sri Lankan dietary patterns, traditional meals, health conditions, and culturally grounded nutrition science. Your primary goal is to guide users toward healthier eating using foods commonly consumed in Sri Lanka.

CORE OBJECTIVES:

1. Provide accurate nutritional information for Sri Lankan foods such as:
   - rice (white, red, basmati), parippu (dhal), pol sambol, mallum, fish curries,
     chicken curries, hoppers, string hoppers, pittu, kottu, jackfruit (kos),
     breadfruit (del), yams, sambols, and short eats.

2. Generate personalized meal plans for:
   - Weight loss / weight management
   - Diabetes management (low-GI Sri Lankan diets)
   - Heart health (low-salt, low-fat)
   - Student energy-boost diets
   - Fitness/active users

3. Analyze meals when users tell you what they ate, and:
   - Estimate calories (approximate)
   - Highlight nutritional strengths
   - Point out weaknesses (excess carbs, oil, sugar)
   - Suggest culturally relevant improvements

4. Provide daily habit improvement tips such as portion control, hydration,
   balanced plate method, meal timing, and practical substitutions.

5. Stay strictly within Sri Lankan food context unless the user requests otherwise.

COMMUNICATION STYLE:

- Friendly, encouraging, non-judgmental.
- Speak in simple, clear language suitable for all education levels.
- Adapt to Sinhala/English/Tamil vocabulary if user switches language.
- Always be supportive, not strict or negative.

REASONING RULES (INTERNAL):

- Base advice on general nutrition science (protein/carb/fat balance, GI index).
- Prioritize culturally relevant alternatives (e.g., red rice > white rice).
- Control portion suggestions based on Sri Lankan plate sizes.
- Give balanced suggestions rather than extreme diets.
- Never give medical diagnoses; provide lifestyle guidance only.

RESPONSE FORMATS:

When answering, structure responses clearly using:
- Headings
- Bullet points
- Tables (if useful)
- Short, direct sentences

FEATURES YOU MUST SUPPORT:

1. **Nutrition Breakdown**
   Provide calories + macronutrient explanation for Sri Lankan dishes.
   Example outputs:
   - "1 cup cooked red rice ≈ 215 kcal, low GI"
   - "1 hopper ≈ 120 kcal, mostly carbs"

2. **Custom Meal Plans**
   Provide full-day meal plans or weekly plans with:
   - Breakfast / Lunch / Dinner
   - Healthy snacks
   - Portion guidelines
   - Sri Lankan food alternatives

3. **Meal Tracking**
   When user says what they ate:
   - Summarize
   - Analyze
   - Suggest healthier adjustments

4. **Goal-Specific Guidance**
   Adjust advice for different goals:
   - For weight loss → lower rice portions, more veggies, protein focus
   - For diabetes → low-GI foods, avoid sugar-based drinks
   - For students → energy-sustaining meals for concentration

5. **Healthy Substitutions**
   Always provide **local** substitutions:
   - Replace maalu paan with boiled egg + brown bread
   - Replace white rice with red rice or small portion basmati
   - Replace high-oil curries with tempered or boiled versions

6. **Lifestyle Tips**
   Include hydration reminders, balanced plate method, meal timing advice.

SAFETY & LIMITATIONS:

- Do NOT give medical diagnoses.
- For serious medical conditions, advise users to consult a doctor.
- Do not claim 100% accuracy of calorie counts — always say "approx."
- Avoid extreme diets, fasting regimens, or unsafe restrictions.

FIRST MESSAGE:

When the chatbot starts, it must say:

"Hello! I'm LankaNutri Advisor 🍽️  

I help you understand nutrition in Sri Lankan foods, create meal plans, and build healthier habits.  

How can I support your diet today?"`;

// Store conversation history per user (in production, use Redis or database)
const conversationHistory = new Map();

// @desc    Chat with LankaNutri Advisor
// @route   POST /api/chatbot/chat
// @access  Public (can be made protected if needed)
export const chatWithBot = async (req, res) => {
  try {
    const { message, conversationId } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check if Groq is available
    if (!groq) {
      return res.status(503).json({ 
        error: 'Chatbot service is not available. Please configure GROQ_API_KEY in your .env file.' 
      });
    }

    // Get or create conversation history
    const conversationKey = conversationId || 'default';
    let messages = conversationHistory.get(conversationKey) || [];

    // If this is the first message in conversation, initialize with system prompt
    if (messages.length === 0) {
      messages.push({
        role: 'system',
        content: SYSTEM_PROMPT,
      });
    }

    // Add user message
    messages.push({
      role: 'user',
      content: message.trim(),
    });

    // Call Groq API
    let response;
    try {
      response = await groq.chat.completions.create({
        // Default to an actively supported Groq model. 'llama-3.3-70b-versatile' is
        // the recommended upgrade for 'llama-3.1-70b-versatile' (see Groq deprecations).
        model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1024,
      });
    } catch (groqError) {
      console.error('Groq API Error:', groqError);
      console.error('Error details:', {
        message: groqError.message,
        status: groqError.status || groqError.statusCode,
        type: groqError.constructor.name
      });
      
      // Handle specific Groq errors
      const errorStatus = groqError.status || groqError.statusCode || groqError.response?.status;
      
      if (errorStatus === 401 || groqError.message?.includes('401') || groqError.message?.includes('Unauthorized')) {
        return res.status(401).json({ 
          error: 'Invalid Groq API key. Please check your GROQ_API_KEY in .env file.' 
        });
      }
      
      if (errorStatus === 429 || groqError.message?.includes('429') || groqError.message?.includes('rate limit')) {
        return res.status(429).json({ 
          error: 'Rate limit exceeded. Please try again later.' 
        });
      }

      // More detailed error for development
      const errorMessage = process.env.NODE_ENV === 'development' 
        ? `Failed to get response from AI: ${groqError.message || 'Unknown error'}`
        : 'Failed to get response from AI. Please try again.';

      return res.status(500).json({ 
        error: errorMessage 
      });
    }

    const aiMessage = response.choices[0]?.message?.content;

    if (!aiMessage) {
      return res.status(500).json({ error: 'No response from AI' });
    }

    // Add assistant response to conversation history
    messages.push({
      role: 'assistant',
      content: aiMessage,
    });

    // Store updated conversation history (limit to last 20 messages to avoid token limits)
    if (messages.length > 20) {
      messages = [
        messages[0], // Keep system prompt
        ...messages.slice(-19), // Keep last 19 messages
      ];
    }
    
    conversationHistory.set(conversationKey, messages);

    // Return response
    res.json({
      message: aiMessage,
      conversationId: conversationKey,
    });
  } catch (error) {
    console.error('Chatbot Controller Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
};

// @desc    Start new conversation
// @route   POST /api/chatbot/new
// @access  Public
export const startNewConversation = async (req, res) => {
  try {
    // Check if Groq is available
    if (!groq) {
      return res.status(503).json({ 
        error: 'Chatbot service is not available. Please install groq-sdk package: npm install groq-sdk' 
      });
    }

    // Check if Groq API key is configured
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ 
        error: 'Groq API key is not configured. Please set GROQ_API_KEY in your .env file.' 
      });
    }

    // Generate unique conversation ID
    const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Initialize conversation with system prompt and first message
    const messages = [
      {
        role: 'system',
        content: SYSTEM_PROMPT,
      },
    ];

    conversationHistory.set(conversationId, messages);

    // Get the first greeting message
    const firstMessage = "Hello! I'm LankaNutri Advisor 🍽️\n\nI help you understand nutrition in Sri Lankan foods, create meal plans, and build healthier habits.\n\nHow can I support your diet today?";

    res.json({
      conversationId,
      message: firstMessage,
    });
  } catch (error) {
    console.error('Start Conversation Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
};

// @desc    Clear conversation history
// @route   POST /api/chatbot/clear
// @access  Public
export const clearConversation = async (req, res) => {
  try {
    const { conversationId } = req.body;

    if (conversationId) {
      conversationHistory.delete(conversationId);
      res.json({ message: 'Conversation cleared successfully' });
    } else {
      // Clear all conversations (optional - for admin use)
      conversationHistory.clear();
      res.json({ message: 'All conversations cleared successfully' });
    }
  } catch (error) {
    console.error('Clear Conversation Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
};

