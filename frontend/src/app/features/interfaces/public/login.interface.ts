import { ApiResponse } from "./api-response.interface";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse{
    token: string;
    refreshToken: string;
}