import DailyTip from '../models/DailyTip.js';

// @desc    Get today's tip
// @route   GET /api/daily-tips/today
// @access  Public
export const getTodayTip = async (req, res) => {
  try {
    const { language, category } = req.query;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const query = { isActive: true, date: { $lte: today } };
    if (category) query.category = category;

    // Get a tip based on day of year for variety
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const tips = await DailyTip.find(query).sort({ date: -1 });
    
    if (tips.length === 0) {
      return res.status(404).json({ message: 'No tips available' });
    }

    // Select tip based on day of year for variety
    const selectedTip = tips[dayOfYear % tips.length];

    if (language && (language === 'si' || language === 'ta')) {
      const localized = {
        ...selectedTip.toObject(),
        displayTip: selectedTip.tip[language] || selectedTip.tip.en,
      };
      return res.json(localized);
    }

    res.json(selectedTip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all tips
// @route   GET /api/daily-tips
// @access  Public
export const getDailyTips = async (req, res) => {
  try {
    const { language, category } = req.query;
    const query = { isActive: true };
    if (category) query.category = category;

    const tips = await DailyTip.find(query).sort({ date: -1 });

    if (language && (language === 'si' || language === 'ta')) {
      const localized = tips.map((tip) => ({
        ...tip.toObject(),
        displayTip: tip.tip[language] || tip.tip.en,
      }));
      return res.json(localized);
    }

    res.json(tips);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create daily tip
// @route   POST /api/daily-tips
// @access  Private/Admin
export const createDailyTip = async (req, res) => {
  try {
    const tip = new DailyTip(req.body);
    const createdTip = await tip.save();
    res.status(201).json(createdTip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

