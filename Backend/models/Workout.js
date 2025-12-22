const mongoose = require('mongoose');

const workoutExerciseSchema = new mongoose.Schema({
  exercise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true
  },
  sets: {
    type: Number,
    min: 1,
    default: 1
  },
  reps: {
    type: Number,
    min: 1
  },
  duration: {
    type: Number, // in minutes
    min: 0
  },
  weight: {
    type: Number, // in kg
    min: 0
  },
  restTime: {
    type: Number, // in seconds
    min: 0,
    default: 60
  },
  notes: {
    type: String,
    trim: true
  },
  order: {
    type: Number,
    default: 0
  }
}, { _id: false });

const workoutSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Workout name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['strength', 'cardio', 'hiit', 'yoga', 'pilates', 'crossfit', 'custom'],
    required: [true, 'Workout type is required']
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  duration: {
    type: Number, // total duration in minutes
    min: 0
  },
  exercises: {
    type: [workoutExerciseSchema],
    default: []
  },
  targetAudience: {
    type: String,
    enum: ['member', 'trainer', 'all'],
    default: 'all'
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
  estimatedCalories: {
    type: Number,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for search
workoutSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Workout', workoutSchema);

