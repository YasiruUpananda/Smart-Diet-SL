import SriLankanPlate from '../models/SriLankanPlate.js';
import TraditionalFood from '../models/TraditionalFood.js';

// @desc    Generate goal-specific plate
// @route   GET /api/sri-lankan-plates/generate
// @access  Public
export const generatePlate = async (req, res) => {
  try {
    const { goal, calories, language } = req.query;
    const targetCalories = parseInt(calories) || 2000;

    // Get existing plates for the goal
    let plates = await SriLankanPlate.find({ goal }).sort({ createdAt: -1 });

    if (plates.length === 0) {
      // Generate a new plate based on goal
      plates = await generateNewPlate(goal, targetCalories);
    }

    // Select a plate (could be random or based on user preferences)
    const selectedPlate = plates[Math.floor(Math.random() * plates.length)];

    if (language && (language === 'si' || language === 'ta')) {
      const localized = {
        ...selectedPlate.toObject(),
        displayName: selectedPlate.name[language] || selectedPlate.name.en,
        displayDescription: selectedPlate.description[language] || selectedPlate.description.en,
      };
      return res.json(localized);
    }

    res.json(selectedPlate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper function to generate a new plate
const generateNewPlate = async (goal, targetCalories) => {
  const plates = [];

  // Get foods based on goal
  let foodQuery = {};
  if (goal === 'diabetes') {
    foodQuery = { 'nutrition.glycemicIndex': { $lt: 55 } }; // Low GI foods
  } else if (goal === 'weight-loss') {
    foodQuery = { 'nutrition.calories': { $lt: 200 } }; // Lower calorie foods
  }

  const availableFoods = await TraditionalFood.find(foodQuery).limit(20);

  // Simple plate generation logic
  // This is a basic implementation - can be enhanced with ML/AI
  const plate = {
    name: {
      en: `${goal.charAt(0).toUpperCase() + goal.slice(1)} Friendly Plate`,
      si: '',
      ta: '',
    },
    goal,
    items: [],
    totalNutrition: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
    },
    isBusyLifeFriendly: goal === 'weight-loss', // Example
    prepTime: 30,
  };

  // Add items until we reach target calories
  let currentCalories = 0;
  const selectedFoods = [];

  // Prioritize common, affordable foods
  const commonFoods = availableFoods.filter((f) => f.isCommon && f.isAffordable);

  for (const food of commonFoods) {
    if (currentCalories >= targetCalories * 0.9) break; // 90% of target

    const portion = calculatePortion(food, targetCalories - currentCalories);
    const nutrition = calculateNutrition(food, portion);

    selectedFoods.push({
      foodId: food._id,
      name: food.name.en,
      portion,
      nutrition,
    });

    currentCalories += nutrition.calories;
    plate.totalNutrition.calories += nutrition.calories;
    plate.totalNutrition.protein += nutrition.protein;
    plate.totalNutrition.carbs += nutrition.carbs;
    plate.totalNutrition.fat += nutrition.fat;
    plate.totalNutrition.fiber += nutrition.fiber;
  }

  plate.items = selectedFoods;
  plates.push(plate);

  return plates;
};

const calculatePortion = (food, remainingCalories) => {
  const caloriesPer100g = food.nutrition.calories || 100;
  const maxGrams = (remainingCalories / caloriesPer100g) * 100;
  return `${Math.round(maxGrams)}g`;
};

const calculateNutrition = (food, portion) => {
  const portionMatch = portion.match(/(\d+)/);
  const grams = portionMatch ? parseInt(portionMatch[1]) : 100;
  const multiplier = grams / 100;

  return {
    calories: (food.nutrition.calories || 0) * multiplier,
    protein: (food.nutrition.protein || 0) * multiplier,
    carbs: (food.nutrition.carbs || 0) * multiplier,
    fat: (food.nutrition.fat || 0) * multiplier,
    fiber: (food.nutrition.fiber || 0) * multiplier,
  };
};

// @desc    Get all plates
// @route   GET /api/sri-lankan-plates
// @access  Public
export const getPlates = async (req, res) => {
  try {
    const { goal, language, busyLife } = req.query;
    const query = {};

    if (goal) query.goal = goal;
    if (busyLife === 'true') query.isBusyLifeFriendly = true;

    const plates = await SriLankanPlate.find(query).sort({ createdAt: -1 });

    if (language && (language === 'si' || language === 'ta')) {
      const localized = plates.map((plate) => ({
        ...plate.toObject(),
        displayName: plate.name[language] || plate.name.en,
        displayDescription: plate.description[language] || plate.description.en,
      }));
      return res.json(localized);
    }

    res.json(plates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create plate
// @route   POST /api/sri-lankan-plates
// @access  Private/Admin
export const createPlate = async (req, res) => {
  try {
    const plate = new SriLankanPlate(req.body);
    const createdPlate = await plate.save();
    res.status(201).json(createdPlate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

