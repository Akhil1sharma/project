export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'member' | 'trainer' | 'admin';
  phone?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  membershipPlan?: 'basic' | 'premium' | 'vip';
  profileImage?: string;
  isActive: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
}
