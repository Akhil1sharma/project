export interface Exercise {
  _id?: string;
  name: string;
  description?: string;
  category: 'cardio' | 'strength' | 'flexibility' | 'balance' | 'sports' | 'other';
  muscleGroups?: string[];
  equipment: 'bodyweight' | 'dumbbells' | 'barbell' | 'machine' | 'cable' | 'kettlebell' | 'resistance_band' | 'other';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions?: string[];
  imageUrl?: string;
  videoUrl?: string;
  caloriesPerMinute?: number;
  createdBy?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

