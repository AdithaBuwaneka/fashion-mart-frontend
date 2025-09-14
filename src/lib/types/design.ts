// src/lib/types/design.ts
import type { User } from './user';

export interface Design {
  id: string;
  designerId: string;
  designer?: User;
  name: string; // Backend uses 'name', not 'title'
  description: string;
  images: string[];
  status: DesignStatus;
  categoryId?: string | number;
  category?: {
    id: number;
    name: string;
    description?: string;
    image?: string;
    active: boolean;
    parentId?: number;
    createdAt: string;
    updatedAt: string;
  };
  approvedBy?: string;
  approver?: User;
  rejectionReason?: string;
  price?: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export type DesignStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'in_production';