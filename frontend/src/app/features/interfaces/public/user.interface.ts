import { ApiResponse } from "./api-response.interface";

export interface Role {
    id: string;
    name: string;
    description: string;
}

export interface MembershipPlan{
    membershipPlanId: number;
    displayName: string;
    description: string;
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
    deletedAt: string;
    role: Role;
    membershipPlan: MembershipPlan;
}

export interface UpdateUserRequest {
  userName?:    string;
  displayName?: string;
  email?:       string;
  birthday?:    string;
  location?:    string;
}

export type MeResponse = ApiResponse<CurrentUser>;