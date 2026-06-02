import { ApiResponse } from './api-response.interface';

export interface Role {
  id: string;
  name: string;
  description: string | null;
}

export interface MembershipPlan {
  membershipPlanId: number;
  displayName: string;
  description: string | null;
  monthlyPrice: number;
  coinsReward: number;
  maxCommunities: number;
  maxVideosPerCommunity: number;
}

export interface CurrentUser {
  userId: string;
  userName: string;
  displayName: string;
  email: string;
  birthday: string;
  location: string;
  password: string;
  createdAt: string;
  deletedAt: string | null;
  role: Role | null;
  membershipPlan: MembershipPlan;
  coins: number;
}

export interface UpdateUserRequest {
  userName?: string | null;
  displayName?: string | null;
  email?: string | null;
  birthday?: string | null;
  location?: string | null;
  roleId?: string | null;
  membershipPlanId?: number | null; //?
}

export interface AddCoinsRequest {
  coinPackageId: number;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export type MeResponse = ApiResponse<CurrentUser>;
export type UserListResponse = ApiResponse<CurrentUser[]>;
