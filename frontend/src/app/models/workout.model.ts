import { Exercise } from './exercise.model';

export interface WorkoutExercise {
  exercise: string | Exercise;
  sets: number;
  reps?: number;
  duration?: number;
  weight?: number;
  restTime?: number;
  notes?: string;
  order: number;
}

export interface Workout {
  _id?: string;
  name: string;
  description?: string;
  type: 'strength' | 'cardio' | 'hiit' | 'yoga' | 'pilates' | 'crossfit' | 'custom';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration?: number;
  exercises: WorkoutExercise[];
  targetAudience?: 'member' | 'trainer' | 'all';
  createdBy?: string;
  isPublic?: boolean;
  tags?: string[];
  estimatedCalories?: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

