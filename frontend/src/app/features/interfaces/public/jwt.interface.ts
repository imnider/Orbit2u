export interface JwtPayload {
    UserId: string;
    role: string;
    
    exp: number; //expiration
    iss: string; //issuer
    aud: string; //audience
}