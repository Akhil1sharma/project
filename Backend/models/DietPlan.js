const mongoose = require('mongoose');

const mealItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: String,
    required: true
  },
  calories: {
    type: Number,
    min: 0
  },
  protein: {
    type: Number, // in grams
    min: 0
  },
  carbs: {
    type: Number, // in grams
    min: 0
  },
  fats: {
    type: Number, // in grams
    min: 0
  },
  notes: {
    type: String,
    trim: true
  }
}, { _id: false });

const mealSchema = new mongoose.Schema({
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack', 'pre_workout', 'post_workout'],
    required: true
  },
  time: {
    type: String, // e.g., "08:00"
    required: true
  },
  items: {
    type: [mealItemSchema],
    default: []
  },
  totalCalories: {
    type: Number,
    min: 0,
    default: 0
  }
}, { _id: false });

const dietPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Diet plan name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  goal: {
    type: String,
    enum: ['weight_loss', 'weight_gain', 'muscle_gain', 'maintenance', 'endurance', 'general_health'],
    required: [true, 'Diet plan goal is required']
  },
  duration: {
    type: Number, // in days
    min: 1,
    default: 7
  },
  dailyCalories: {
    type: Number,
    min: 0
  },
  dailyMacros: {
    protein: {
      type: Number, // in grams
      min: 0
    },
    carbs: {
      type: Number, // in grams
      min: 0
    },
    fats: {
      type: Number, // in grams
      min: 0
    }
  },
  meals: {
    type: [mealSchema],
    default: []
  },
  restrictions: {
    type: [String], // e.g., ['vegetarian', 'vegan', 'gluten-free', 'dairy-free']
    default: []
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gymId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gym',
    required: [true, 'Gym ID is required']
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  tags: {
    type: [String],
    default: []
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for search
dietPlanSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('DietPlan', dietPlanSchema);

