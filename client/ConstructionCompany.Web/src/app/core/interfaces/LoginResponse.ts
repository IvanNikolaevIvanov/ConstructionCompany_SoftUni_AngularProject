export interface LoginResponse {
  token: string;
  role: string; // still useful for UI
  userId: string;
  expires?: string;
}
