import { CLAIMS } from "../../../shared/constants/claims.constants";

export interface JwtPayload {
    UserId: string;
    //role
    'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string;
    
    exp: number; //expiration
    iss: string; //issuer
    aud: string; //audience
}