import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { chatService } from "../../services/chatService";
import type { ChatMessage } from "../../types/chat";
import { useVoice } from "../../hooks/useVoice";

export default function ChatSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "🎬 Hi! I'm CineAI, your premium movie concierge. I can help you discover movies, check showtimes, find the best seats, and even recommend the perfect viewing experience. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuth();

  const handleVoiceResult = (text: string) => {
    setInput(text);
    // Optional: Auto-send
    // handleSend(text);
  };

  const { isListening, startListening, speak, stopSpeaking, hasRecognition } =
    useVoice(handleVoiceResult);

  useEffect(() => {
    const initSession = async () => {
      try {
        const id = await chatService.createSession();
        setSessionId(id);
      } catch (error) {
        console.error("Failed to create session:", error);
      }
    };
    initSession();
  }, []);

  useEffect(() => {
    const handleOpenAI = () => setIsOpen(true);
    window.addEventListener("open-cine-ai", handleOpenAI);
    return () => window.removeEventListener("open-cine-ai", handleOpenAI);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Stop speaking when window is closed or voice is toggled off
  useEffect(() => {
    if (!isOpen || !isSpeaking) {
      stopSpeaking();
    }
  }, [isOpen, isSpeaking, stopSpeaking]);

  // Handle initial greeting speech when first opened
  useEffect(() => {
    if (isOpen && isSpeaking && messages.length === 1) {
      // Much shorter delay to feel instantaneous but allow UI to settle
      const timer = setTimeout(() => {
        speak(messages[0].content);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isSpeaking]);

  const handleSend = async () => {
    if (!input.trim() || !sessionId || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = isAuthenticated
        ? await chatService.sendAuthenticatedMessage(
            sessionId,
            userMessage.content,
          )
        : await chatService.sendPublicMessage(sessionId, userMessage.content);

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      if (isSpeaking) {
        speak(response.response);
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I apologize, but I encountered an issue. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleListening = () => {
    if (!hasRecognition) {
      alert("Speech recognition not supported in this browser");
      return;
    }
    if (isListening) {
      // stopListening(); // useVoice handles auto-stop
    } else {
      startListening();
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed right-0 top-0 bottom-0 w-full md:w-[400px] border-l border-white/20 z-[150] flex flex-col shadow-2xl glass backdrop-blur-2xl bg-white/5"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-border shrink-0 glass">
              <div className="flex items-center gap-2 font-semibold text-primary">
                <MessageCircle size={20} />
                <span>CineAI Concierge</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className={`p-1.5 rounded-md text-text-muted transition-colors hover:text-text-primary hover:bg-bg-tertiary cursor-pointer ${isSpeaking ? "text-primary" : ""}`}
                  onClick={() => setIsSpeaking(!isSpeaking)}
                  title="Toggle voice responses"
                >
                  {isSpeaking ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </button>
                <button
                  className="p-1.5 rounded-md text-text-muted transition-colors hover:text-text-primary hover:bg-bg-tertiary cursor-pointer"
                  onClick={() => setIsOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 no-scrollbar">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`flex gap-3 max-w-[85%] ${message.role === "user" ? "self-end flex-row-reverse" : "self-start"}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-base shrink-0 shadow-lg border border-white/20">
                      🎬
                    </div>
                  )}
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm border ${
                      message.role === "user"
                        ? "bg-linear-to-br from-primary to-secondary text-white rounded-tr-none border-primary/20"
                        : "bg-white/10 backdrop-blur-md text-text-primary rounded-tl-none border-white/10"
                    }`}
                  >
                    {message.content}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <div className="flex gap-3 max-w-[85%] self-start">
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-base shrink-0 border border-white/20">
                    🎬
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md text-text-primary rounded-tl-none border border-white/10 flex gap-1 items-center h-9">
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 flex items-center gap-2 border-t border-border shrink-0 glass">
              <button
                className={`w-10 h-10 rounded-full flex items-center justify-center text-text-muted transition-colors shrink-0 hover:text-text-primary hover:bg-bg-tertiary cursor-pointer ${isListening ? "text-accent-red bg-red-500/10" : ""}`}
                onClick={toggleListening}
              >
                {isListening ? <Mic size={18} /> : <MicOff size={18} />}
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about movies, showtimes..."
                className="flex-1 py-2 px-4 bg-white/5 border border-white/10 rounded-full text-text-primary text-sm focus:outline-none focus:border-primary/50 placeholder:text-text-muted/70 backdrop-blur-sm"
                disabled={isLoading}
              />

              <button
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
                  !input.trim() || isLoading
                    ? "text-text-muted cursor-not-allowed opacity-50"
                    : "text-primary hover:bg-bg-tertiary"
                }`}
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
