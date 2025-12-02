export interface MealItem {
  name: string;
  quantity: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  notes?: string;
}

export interface Meal {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'pre_workout' | 'post_workout';
  time: string;
  items: MealItem[];
  totalCalories?: number;
}

export interface DietPlan {
  _id?: string;
  name: string;
  description?: string;
  goal: 'weight_loss' | 'weight_gain' | 'muscle_gain' | 'maintenance' | 'endurance' | 'general_health';
  duration: number;
  dailyCalories?: number;
  dailyMacros?: {
    protein?: number;
    carbs?: number;
    fats?: number;
  };
  meals: Meal[];
  restrictions?: string[];
  createdBy?: string;
  isPublic?: boolean;
  tags?: string[];
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

