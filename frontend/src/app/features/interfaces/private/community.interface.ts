export interface CommunityDto {
    communityId: string;
    name: string;
    description: string | null;
    avatarUrl: string | null;
    bannerUrl: string | null;
    isPrivate: boolean;
    memberCount: number;
    userId: string;
    createdAt: string;
}

export interface CommunityListResponse {
    data: CommunityDto[];
}

export interface CommunityResponse {
    data: CommunityDto;
}

export interface CreateCommunityRequest {
    name: string;
    description?: string | null;
    avatarUrl?: string | null;
    bannerUrl?: string | null;
    isPrivate: boolean;
}

export interface UpdateCommunityRequest {
    name?: string | null;
    description?: string | null;
    avatarUrl?: string | null;
    bannerUrl?: string | null;
    isPrivate?: boolean | null;
}