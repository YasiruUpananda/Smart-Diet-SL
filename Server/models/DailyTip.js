import mongoose from 'mongoose';

const dailyTipSchema = new mongoose.Schema(
  {
    tip: {
      en: { type: String, required: true },
      si: { type: String, default: '' },
      ta: { type: String, default: '' },
    },
    category: {
      type: String,
      required: true,
      enum: [
        'weight-loss',
        'diabetes',
        'general-health',
        'portion-control',
        'cooking-tip',
        'substitution',
        'hydration',
      ],
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'easy',
    },
    culturalRelevance: {
      type: String,
      default: 'high', // high, medium, low
    },
    relatedFoods: [String], // Related traditional foods
    date: {
      type: Date,
      default: Date.now,
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

// Index for efficient daily tip retrieval
dailyTipSchema.index({ date: 1, isActive: 1 });

const DailyTip = mongoose.model('DailyTip', dailyTipSchema);

export default DailyTip;

