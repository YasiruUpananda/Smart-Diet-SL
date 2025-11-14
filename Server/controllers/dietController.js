// Server/controllers/dietController.js
import dotenv from 'dotenv';
dotenv.config();
import OpenAI from 'openai';
import DietPlan from '../models/DietPlan.js';

// Initialize OpenAI only when needed (lazy initialization)
let openai = null;
function getOpenAI() {
  if (!openai) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set in environment variables');
    }
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

function buildPrompt(input) {
  // Calculate BMI
  const heightInMeters = input.height / 100;
  const bmi = (input.weight / (heightInMeters * heightInMeters)).toFixed(1);
  const bmiCategory = bmi < 18.5 ? 'Underweight' : 
                      bmi < 25 ? 'Normal' : 
                      bmi < 30 ? 'Overweight' : 'Obese';

  return `
You are an expert Sri Lankan nutritionist and dietitian with specialized knowledge in managing medical conditions through diet.

USER PROFILE:
- Age: ${input.age} years
- Weight: ${input.weight} kg
- Height: ${input.height} cm
- BMI: ${bmi} (${bmiCategory})
- Body Type: ${input.bodyType || 'Not specified'}
- Activity Level: ${input.activityLevel || 'moderate'}

MEDICAL CONDITIONS:
- Blood Pressure: ${input.bloodPressure || 'Not specified'}
- Blood Sugar Level / Diabetes: ${input.sugar || 'Not specified'}

CRITICAL REQUIREMENTS:
1. Generate a personalized 7-day diet plan using ONLY common, affordable Sri Lankan foods and ingredients.
2. The plan MUST be medically appropriate for their conditions:
   ${input.bloodPressure ? `- For Blood Pressure (${input.bloodPressure}): Include foods that help manage BP (low sodium, potassium-rich foods like gotukola, murunga, kankun, etc.)` : ''}
   ${input.sugar ? `- For Blood Sugar (${input.sugar}): Include low glycemic index foods, avoid high sugar, use whole grains like kurakkan, brown rice, avoid refined sugars` : ''}
3. Consider their BMI (${bmi} - ${bmiCategory}) and body type (${input.bodyType || 'Not specified'}).
4. Use traditional Sri Lankan meals: rice, curry, sambol, mallum, etc.
5. Include portion sizes appropriate for their needs.
6. Provide specific meal recommendations with Sri Lankan dish names.

IMPORTANT MEDICAL CONSIDERATIONS:
- If blood pressure is high: Low sodium, include potassium-rich vegetables (gotukola, murunga, kankun)
- If blood sugar is high or diabetes: Low glycemic index foods, avoid refined sugars, use natural sweeteners sparingly, include whole grains
- Always prioritize whole, unprocessed Sri Lankan foods
- Include water intake recommendations (2-3 liters per day)
- Add simple lifestyle tips (walking, portion control, meal timing)

FORMAT:
For each of the 7 days, provide:
- Day X (e.g., Day 1, Day 2, etc.)
- Breakfast: [Meal name and description with portion size]
- Mid-morning Snack: [Healthy snack option]
- Lunch: [Meal name and description with portion size]
- Afternoon Snack: [Healthy snack option]
- Dinner: [Meal name and description with portion size]
- Water Intake: [Recommended amount]
- Notes: [Any specific considerations for that day]

At the end, include:
- General Lifestyle Tips
- Important Reminders (consult healthcare professional if needed)

Format output as clear, readable text with day headings and organized sections. Use Sri Lankan food names and measurements.
`;
}

export const generateDietPlan = async (req, res) => {
  try {
    // Get user ID from authenticated user
    const userId = req.user?._id || req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { weight, height, age, bloodPressure, sugar, bodyType, activityLevel } = req.body;

    // Validate required fields
    if (!weight || !height || !age) {
      return res.status(400).json({ error: 'weight, height and age are required' });
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set in environment variables');
      return res.status(500).json({ 
        error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your .env file.' 
      });
    }

    const input = { weight, height, age, bloodPressure, sugar, bodyType, activityLevel };
    const prompt = buildPrompt(input);

    console.log('Generating diet plan for user:', userId);
    console.log('Input data:', input);

    const client = getOpenAI();
    const resp = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an expert Sri Lankan nutritionist and dietitian. Provide detailed, medically appropriate diet plans using traditional Sri Lankan foods.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 3000
    });

    const planText = resp.choices?.[0]?.message?.content?.trim() || 'No plan generated';

    if (!planText || planText === 'No plan generated') {
      return res.status(500).json({ error: 'Failed to generate diet plan content from AI' });
    }

    const created = await DietPlan.create({
      user: userId,
      input,
      planText,
      metadata: { model: process.env.OPENAI_MODEL || 'gpt-4o-mini', usage: resp.usage || null }
    });

    console.log('Diet plan created successfully:', created._id);

    res.json({ planId: created._id, planText });
  } catch (err) {
    console.error('generateDietPlan error:', err);
    console.error('Error details:', {
      message: err.message,
      stack: err.stack,
      response: err.response?.data
    });

    // Provide more specific error messages
    let errorMessage = 'Failed to generate diet plan';
    
    if (err.message?.includes('OPENAI_API_KEY')) {
      errorMessage = 'OpenAI API key not configured. Please contact administrator.';
    } else if (err.response?.status === 401) {
      errorMessage = 'Invalid OpenAI API key. Please check your API key.';
    } else if (err.response?.status === 429) {
      errorMessage = 'OpenAI API rate limit exceeded. Please try again later.';
    } else if (err.message) {
      errorMessage = err.message;
    }

    res.status(500).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

export const getUserPlans = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const plans = await DietPlan.find({ user: userId }).sort({ createdAt: -1 });
    res.json(plans);
  } catch (err) {
    console.error('getUserPlans error:', err);
    res.status(500).json({ error: 'Failed to fetch diet plans' });
  }
};
