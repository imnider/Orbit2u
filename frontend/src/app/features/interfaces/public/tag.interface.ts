import { ApiResponse } from "../public/api-response.interface";

export interface TagDto {
    tagId:       string;
    displayName: string;
}

export type TagListResponse = ApiResponse<TagDto[]>;