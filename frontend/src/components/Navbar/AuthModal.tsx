import { useState } from "react";
import type { FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, signup } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await signup(email, password, fullName);
      }
      onClose();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setFullName("");
    setError("");
  };

  const switchMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setError("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[200] p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-[400px] p-8 rounded-2xl relative glass"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 p-2 rounded-md text-text-muted hover:text-text-primary hover:bg-bg-tertiary transition-colors cursor-pointer"
              onClick={onClose}
            >
              <X size={20} />
            </button>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2 text-text-primary">
                {mode === "login" ? "Welcome back!" : "Create account"}
              </h2>
              <p className="text-text-secondary text-sm">
                {mode === "login"
                  ? "Sign in to book tickets and access your saved preferences"
                  : "Join us for a premium movie experience"}
              </p>
            </div>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              {mode === "signup" && (
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-text-secondary">
                    Full Name
                  </label>
                  <div className="flex items-center gap-3 px-4 py-2.5 bg-bg-secondary border border-border rounded-lg transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                    <User size={18} className="text-text-muted shrink-0" />
                    <input
                      type="text"
                      className="flex-1 bg-transparent border-none text-text-primary text-sm focus:outline-none placeholder:text-text-muted"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-text-secondary">
                  Email
                </label>
                <div className="flex items-center gap-3 px-4 py-2.5 bg-bg-secondary border border-border rounded-lg transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                  <Mail size={18} className="text-text-muted shrink-0" />
                  <input
                    type="email"
                    className="flex-1 bg-transparent border-none text-text-primary text-sm focus:outline-none placeholder:text-text-muted"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-text-secondary">
                  Password
                </label>
                <div className="flex items-center gap-3 px-4 py-2.5 bg-bg-secondary border border-border rounded-lg transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                  <Lock size={18} className="text-text-muted shrink-0" />
                  <input
                    type="password"
                    className="flex-1 bg-transparent border-none text-text-primary text-sm focus:outline-none placeholder:text-text-muted"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              </div>

              {error && (
                <p className="text-accent-red text-sm text-center">{error}</p>
              )}

              <button
                type="submit"
                className="w-full mt-2 btn btn-primary py-3 text-base"
                disabled={isLoading}
              >
                {isLoading
                  ? "Please wait..."
                  : mode === "login"
                    ? "Sign In"
                    : "Create Account"}
              </button>
            </form>

            <div className="flex items-center gap-4 my-6 text-text-muted text-xs">
              <div className="flex-1 h-px bg-border"></div>
              <span>or continue with</span>
              <div className="flex-1 h-px bg-border"></div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 btn btn-secondary py-3 text-base">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>

            <p className="text-center mt-6 text-sm text-text-secondary">
              {mode === "login"
                ? "Don't have an account?"
                : "Already have an account?"}
              <button
                type="button"
                onClick={switchMode}
                className="ml-1 text-primary font-medium hover:underline cursor-pointer"
              >
                {mode === "login" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
