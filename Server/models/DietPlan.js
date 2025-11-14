import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  ingredients: [String],
  calories: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    default: '',
  },
});

const dietPlanSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a diet plan title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    category: {
      type: String,
      required: true,
      enum: ['weight-loss', 'weight-gain', 'diabetic', 'vegetarian', 'general', 'athletic'],
    },
    duration: {
      type: Number,
      required: true,
      default: 7, // days
    },
    meals: {
      breakfast: mealSchema,
      lunch: mealSchema,
      dinner: mealSchema,
      snacks: [mealSchema],
    },
    totalCalories: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const DietPlan = mongoose.model('DietPlan', dietPlanSchema);

export default DietPlan;

