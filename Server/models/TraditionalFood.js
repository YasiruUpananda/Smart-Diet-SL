import mongoose from 'mongoose';

const traditionalFoodSchema = new mongoose.Schema(
  {
    name: {
      en: { type: String, required: true },
      si: { type: String, default: '' }, // Sinhala
      ta: { type: String, default: '' }, // Tamil
    },
    type: {
      type: String,
      required: true,
      enum: ['ingredient', 'dish', 'beverage'],
    },
    category: {
      type: String,
      required: true,
      enum: [
        'rice', // Suwandel, Kekulu, Kurakkan
        'grains', // Kurakkan, Mung, Kadala
        'vegetables', // Gotukola, Murunga, Manioc
        'fruits',
        'proteins', // Fish, Chicken, Dhal
        'spices',
        'beverages', // Beli Mal, King Coconut
        'other',
      ],
    },
    nutrition: {
      calories: { type: Number, default: 0 },
      protein: { type: Number, default: 0 }, // grams
      carbs: { type: Number, default: 0 }, // grams
      fat: { type: Number, default: 0 }, // grams
      fiber: { type: Number, default: 0 }, // grams
      iron: { type: Number, default: 0 }, // mg
      calcium: { type: Number, default: 0 }, // mg
      glycemicIndex: { type: Number, default: 0 }, // For diabetes management
    },
    servingSize: {
      amount: { type: Number, default: 100 }, // grams or ml
      unit: { type: String, default: 'g' }, // g, ml, cup, etc.
    },
    description: {
      en: { type: String, default: '' },
      si: { type: String, default: '' },
      ta: { type: String, default: '' },
    },
    traditionalUses: [String], // How it's traditionally used
    healthBenefits: [String], // Health benefits
    image: {
      type: String,
      default: '',
    },
    isCommon: {
      type: Boolean,
      default: true, // Common in Sri Lankan households
    },
    isAffordable: {
      type: Boolean,
      default: true,
    },
    preparationMethods: [String], // Common ways to prepare
  },
  {
    timestamps: true,
  }
);

const TraditionalFood = mongoose.model('TraditionalFood', traditionalFoodSchema);

export default TraditionalFood;

