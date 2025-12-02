export interface User {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'trainer' | 'member';
  phone?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  membershipPlan?: 'basic' | 'premium' | 'vip';
  membershipStartDate?: Date;
  membershipEndDate?: Date;
  isActive?: boolean;
  specialization?: string[];
  experience?: number;
  certification?: string[];
  profileImage?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: 'admin' | 'trainer' | 'member';
  phone?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
}

