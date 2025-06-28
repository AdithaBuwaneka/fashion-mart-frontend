// src/lib/types/auth.ts
export interface User {
  id: string;
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'admin' | 'customer' | 'designer' | 'staff' | 'inventory_manager';

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isSignedIn: boolean;
}