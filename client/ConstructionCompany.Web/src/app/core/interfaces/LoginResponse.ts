export interface LoginResponse {
  token: string;
  role: string; // still useful for UI
  expires?: string;
}
