import TraditionalFood from '../models/TraditionalFood.js';

// @desc    Get all traditional foods
// @route   GET /api/traditional-foods
// @access  Public
export const getTraditionalFoods = async (req, res) => {
  try {
    const { category, type, language } = req.query;
    const query = {};

    if (category) query.category = category;
    if (type) query.type = type;

    const foods = await TraditionalFood.find(query).sort({ isCommon: -1, name: 1 });

    // If language is specified, return localized names
    if (language && (language === 'si' || language === 'ta')) {
      const localizedFoods = foods.map((food) => ({
        ...food.toObject(),
        displayName: food.name[language] || food.name.en,
        displayDescription: food.description[language] || food.description.en,
      }));
      return res.json(localizedFoods);
    }

    res.json(foods);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single traditional food
// @route   GET /api/traditional-foods/:id
// @access  Public
export const getTraditionalFoodById = async (req, res) => {
  try {
    const { language } = req.query;
    const food = await TraditionalFood.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }

    if (language && (language === 'si' || language === 'ta')) {
      const localized = {
        ...food.toObject(),
        displayName: food.name[language] || food.name.en,
        displayDescription: food.description[language] || food.description.en,
      };
      return res.json(localized);
    }

    res.json(food);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create traditional food
// @route   POST /api/traditional-foods
// @access  Private/Admin
export const createTraditionalFood = async (req, res) => {
  try {
    const food = new TraditionalFood(req.body);
    const createdFood = await food.save();
    res.status(201).json(createdFood);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

