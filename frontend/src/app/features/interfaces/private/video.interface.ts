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


export interface CreateVideoRequest {
  communityId: string | null;
  videoAccessibilityId: number;
  title: string;
  description: string | null;
  durationSeconds: number;
  thumbnailUrl: string;
  videoUrl: string;
  ageRestriction: boolean;
}

export interface UpdateVideoRequest {
  communityId?: string | null;
  videoAccessibilityId?: number | null;
  title?: string | null;
  description?: string | null;
  thumbnailUrl?: string | null;
  ageRestriction?: boolean | null;
}

export type VideoListResponse = ApiResponse<VideoDto[]>;
