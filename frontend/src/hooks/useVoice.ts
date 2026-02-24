import { useState, useCallback } from "react";

interface UseVoiceReturn {
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  hasRecognition: boolean;
}

export const useVoice = (onResult: (text: string) => void): UseVoiceReturn => {
  const [isListening, setIsListening] = useState(false);

  const hasRecognition = !!(
    (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
  );

  const startListening = useCallback(() => {
    if (!hasRecognition) return;

    const SpeechRecognition =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recognition.start();
  }, [onResult, hasRecognition]);

  const stopListening = useCallback(() => {
    // Note: stopping happens automatically for non-continuous,
    // but if we had a ref to recognition we could stop it manually.
    setIsListening(false);
  }, []);

  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) return;

    // Cancel previous speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Optional: Select a better voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) =>
        v.name.includes("Google US English") || v.name.includes("Samantha"),
    );
    if (preferredVoice) utterance.voice = preferredVoice;

    window.speechSynthesis.speak(utterance);
  }, []);

  const stopSpeaking = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  return {
    isListening,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    hasRecognition,
  };
};
