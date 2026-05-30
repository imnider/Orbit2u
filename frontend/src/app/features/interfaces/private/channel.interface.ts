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
}

export interface CreateChannelRequest {
    handle: string;
    displayName: string;
    description?: string;
    avatarUrl?: string;
    bannerUrl?: string;
}

export interface UpdateChannelRequest {
    handle?: string;
    displayName?: string;
    description?: string;
    avatarUrl?: string;
    bannerUrl?: string;
}

export type ChannelResponse = ApiResponse<ChannelDto>;
export type ChannelListResponse = ApiResponse<ChannelDto[]>;