// paso 1 - devuelve email
export interface ValidateTokenResponse {
  email: string;
}
 
// paso 2 - body de post
export interface CompleteRegisterRequest {
  username: string;
  displayName: string;
  birthday: string;
  location: string;
}
 
// paso 3 - respuesta complete
export interface CompleteRegisterResponse {
  token: string;
  refreshToken: string;
}