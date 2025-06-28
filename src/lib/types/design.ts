// src/lib/types/design.ts
import type { User } from './user';

export interface Design {
  id: string;
  designerId: string;
  designer: User;
  title: string;
  description: string;
  images: string[];
  files: string[];
  status: DesignStatus;
  approvedBy?: string;
  approver?: User;
  rejectionReason?: string;
  price?: number;
  royaltyPercentage?: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type DesignStatus = 'pending' | 'approved' | 'rejected' | 'in_production';