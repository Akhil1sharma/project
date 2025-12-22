const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Exercise name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['cardio', 'strength', 'flexibility', 'balance', 'sports', 'other'],
    required: [true, 'Exercise category is required']
  },
  muscleGroups: {
    type: [String],
    default: []
  },
  equipment: {
    type: String,
    enum: ['bodyweight', 'dumbbells', 'barbell', 'machine', 'cable', 'kettlebell', 'resistance_band', 'other'],
    default: 'bodyweight'
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  instructions: {
    type: [String],
    default: []
  },
  imageUrl: {
    type: String
  },
  videoUrl: {
    type: String
  },
  caloriesPerMinute: {
    type: Number,
    min: 0
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
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for search
exerciseSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Exercise', exerciseSchema);

