import mongoose from 'mongoose';

const plateItemSchema = new mongoose.Schema({
  foodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TraditionalFood',
    required: true,
  },
  name: String,
  portion: String, // e.g., "1 cup rice", "medium portion"
  nutrition: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number,
  },
});

const sriLankanPlateSchema = new mongoose.Schema(
  {
    name: {
      en: { type: String, required: true },
      si: { type: String, default: '' },
      ta: { type: String, default: '' },
    },
    goal: {
      type: String,
      required: true,
      enum: ['weight-loss', 'weight-gain', 'diabetes', 'general-health'],
    },
    items: [plateItemSchema],
    totalNutrition: {
      calories: { type: Number, required: true },
      protein: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
      fat: { type: Number, default: 0 },
      fiber: { type: Number, default: 0 },
    },
    description: {
      en: { type: String, default: '' },
      si: { type: String, default: '' },
      ta: { type: String, default: '' },
    },
    substitutions: [
      {
        original: String,
        substitute: String,
        reason: String,
      },
    ],
    isBusyLifeFriendly: {
      type: Boolean,
      default: false, // Can be batch-cooked or prepped ahead
    },
    prepTime: {
      type: Number, // minutes
      default: 0,
    },
    image: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const SriLankanPlate = mongoose.model('SriLankanPlate', sriLankanPlateSchema);

export default SriLankanPlate;

