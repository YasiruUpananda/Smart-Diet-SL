import DietPlan from '../models/DietPlan.js';

// @desc    Get all diet plans
// @route   GET /api/diet-plans
// @access  Public
export const getDietPlans = async (req, res) => {
  try {
    const { category } = req.query;
    const query = { isActive: true };

    if (category) {
      query.category = category;
    }

    const dietPlans = await DietPlan.find(query).sort({ createdAt: -1 });
    res.json(dietPlans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single diet plan
// @route   GET /api/diet-plans/:id
// @access  Public
export const getDietPlanById = async (req, res) => {
  try {
    const dietPlan = await DietPlan.findById(req.params.id);

    if (dietPlan) {
      res.json(dietPlan);
    } else {
      res.status(404).json({ message: 'Diet plan not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a diet plan
// @route   POST /api/diet-plans
// @access  Private/Admin
export const createDietPlan = async (req, res) => {
  try {
    const dietPlan = new DietPlan({
      ...req.body,
      image: req.file ? req.file.path : req.body.image,
    });

    const createdDietPlan = await dietPlan.save();
    res.status(201).json(createdDietPlan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a diet plan
// @route   PUT /api/diet-plans/:id
// @access  Private/Admin
export const updateDietPlan = async (req, res) => {
  try {
    const dietPlan = await DietPlan.findById(req.params.id);

    if (dietPlan) {
      Object.keys(req.body).forEach((key) => {
        if (req.body[key] !== undefined) {
          dietPlan[key] = req.body[key];
        }
      });

      if (req.file) {
        dietPlan.image = req.file.path;
      }

      const updatedDietPlan = await dietPlan.save();
      res.json(updatedDietPlan);
    } else {
      res.status(404).json({ message: 'Diet plan not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a diet plan
// @route   DELETE /api/diet-plans/:id
// @access  Private/Admin
export const deleteDietPlan = async (req, res) => {
  try {
    const dietPlan = await DietPlan.findById(req.params.id);

    if (dietPlan) {
      await dietPlan.deleteOne();
      res.json({ message: 'Diet plan removed' });
    } else {
      res.status(404).json({ message: 'Diet plan not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

