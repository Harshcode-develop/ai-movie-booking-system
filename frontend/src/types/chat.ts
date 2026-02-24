// Chat and AI related types
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

export interface ChatSession {
  sessionId: string;
  messages: ChatMessage[];
}

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  response: string;
  sessionId: string;
  userId?: string;
}
