import { ApiResponse } from "../public/api-response.interface";

export interface VideoDto {
    videoId: string;
    channelId: string;
    communityId: string | null;
    videoAccessibilityId: number;
    title: string;
    description: string | null;
    durationSeconds: number;
    thumbnailUrl: string;
    videoUrl: string;
    ageRestriction: boolean;
    isPinned: boolean;
    publishedAt: string;
    createdAt: string;
    updatedAt: string | null;
    deletedAt: string | null;
}

export type VideoListResponse = ApiResponse<VideoDto[]>;
