import api from "./api";
import type { AuthResponse, LoginRequest, SignupRequest, User } from "../types";

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", data);
    return response.data;
  },

  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/signup", data);
    return response.data;
  },

  googleSignIn: async (
    googleId: string,
    email: string,
    name: string,
  ): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/google", null, {
      params: { googleId, email, name },
    });
    return response.data;
  },

  getProfile: async (token: string): Promise<User> => {
    const response = await api.get<User>("/user/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.put<User>("/user/profile", data);
    return response.data;
  },
};
