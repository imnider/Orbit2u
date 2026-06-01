import { ApiResponse } from "../public/api-response.interface";

export interface ChannelDto {
    channelId: string;
    userId: string;
    handle: string;
    displayName: string;
    verification: boolean;
    description: string | null;
    avatarURL: string | null;
    bannerURL: string | null;
    createdAt: string;
    updatedAt: string | null;
    deletedAt: string | null;
    subscriberCount: number;
}

export interface CreateChannelRequest {
    handle: string;
    displayName: string;
    description?: string | null;
    avatarUrl?: string | null;
    bannerUrl?: string | null;
}

export interface UpdateChannelRequest {
    handle?: string | null;
    displayName?: string | null;
    description?: string | null;
    avatarUrl?: string | null;
    bannerUrl?: string | null;
}

export type ChannelResponse = ApiResponse<ChannelDto>;
export type ChannelListResponse = ApiResponse<ChannelDto[]>;