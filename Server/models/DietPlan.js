// Server/models/DietPlan.js
import mongoose from 'mongoose';

const DietPlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  input: {
    weight: Number,
    height: Number,
    age: Number,
    bloodPressure: String,
    sugar: String,
    bodyType: String,
    activityLevel: String
  },
  planText: { type: String, required: true },
  metadata: { type: Object },
}, { timestamps: true });

export default mongoose.model('DietPlan', DietPlanSchema);
