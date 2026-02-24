import api from "./api";
import type { ChatResponse } from "../types";

export const chatService = {
  createSession: async (): Promise<string> => {
    const response = await api.get<{ sessionId: string }>("/chat/session");
    return response.data.sessionId;
  },

  sendPublicMessage: async (
    sessionId: string,
    message: string,
  ): Promise<ChatResponse> => {
    const response = await api.post<ChatResponse>(
      "/chat/public",
      { message },
      { params: { sessionId } },
    );
    return response.data;
  },

  sendAuthenticatedMessage: async (
    sessionId: string,
    message: string,
  ): Promise<ChatResponse> => {
    const response = await api.post<ChatResponse>(
      "/chat/authenticated",
      { message },
      { params: { sessionId } },
    );
    return response.data;
  },
};
