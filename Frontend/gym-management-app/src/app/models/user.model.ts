export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'member' | 'trainer' | 'admin';
  gymId: string;
  invitedBy?: string;
  joinedGymAt?: Date;
  phone?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  membershipPlan?: 'basic' | 'premium' | 'vip';
  profileImage?: string;
  isActive: boolean;
}

export interface Gym {
  _id: string;
  gymName: string;
  gymCode: string;
  ownerId: string;
  email: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  subscriptionPlan: 'basic' | 'premium' | 'enterprise';
  subscriptionStatus: 'active' | 'suspended' | 'cancelled' | 'trial';
  settings?: {
    timezone?: string;
    currency?: string;
    maxMembers?: number;
    maxTrainers?: number;
    allowPublicSignup?: boolean;
    requireAdminApproval?: boolean;
  };
  isActive: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
    gymCode?: string;
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
  role: 'member' | 'trainer' | 'admin';
  phone?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  gymCode?: string;
  gymName?: string;
  gymAddress?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  gymPhone?: string;
  gymEmail?: string;
}

export interface GymValidationResponse {
  success: boolean;
  data: {
    gymName: string;
    gymCode: string;
    isValid: boolean;
  };
}
