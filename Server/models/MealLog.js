import mongoose from 'mongoose';

const mealLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mealType: {
      type: String,
      required: true,
      enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    },
    image: {
      type: String, // URL to uploaded meal image
      default: '',
    },
    recognizedItems: [
      {
        name: String,
        confidence: Number, // 0-1
        estimatedPortion: String, // e.g., "1 cup", "medium portion"
      },
    ],
    manualItems: [
      {
        foodId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'TraditionalFood',
        },
        name: String,
        portion: String,
        calories: Number,
      },
    ],
    totalNutrition: {
      calories: { type: Number, default: 0 },
      protein: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
      fat: { type: Number, default: 0 },
      fiber: { type: Number, default: 0 },
    },
    notes: {
      type: String,
      default: '',
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
mealLogSchema.index({ user: 1, date: -1 });
mealLogSchema.index({ user: 1, mealType: 1, date: -1 });

const MealLog = mongoose.model('MealLog', mealLogSchema);

export default MealLog;

