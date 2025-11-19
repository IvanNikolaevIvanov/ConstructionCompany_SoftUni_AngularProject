export interface LoginResponse {
  token: string;
  role: string;
  userId: string;
  expires?: string;
}
