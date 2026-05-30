export interface RegisterRequest {
    username: string;
    email: string;
    displayName: string;
    birthday: string;
    location: string;
}

export interface RegisterResponse {
    token: string;
    refreshToken: string;
}