"use client";
import { useState, useRef, useCallback } from "react";

export type VoiceStatus =
  | "idle"
  | "listening"
  | "processing"
  | "error"
  | "unsupported";

interface UseVoiceInputProps {
  onTranscript: (text: string) => void;
  language?: string;
  onRecordingChange?: (isRecording: boolean) => void;
}

export function useVoiceInput({
  onTranscript,
  language = "en-IN",
  onRecordingChange,
}: UseVoiceInputProps) {
  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const recognitionRef = useRef<any>(null);

  const startListening = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setStatus("unsupported");
      setErrorMsg("Voice not supported. Use Chrome browser.");
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setStatus("listening");
      setErrorMsg("");
      onRecordingChange?.(true);
    };

    recognition.onresult = (event: any) => {
      setStatus("processing");
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
      setStatus("idle");
      onRecordingChange?.(false);
    };

    recognition.onerror = (event: any) => {
      setStatus("error");
      switch (event.error) {
        case "not-allowed":
          setErrorMsg("Microphone access denied. Please allow mic access.");
          break;
        case "no-speech":
          setErrorMsg("No speech detected. Please try again.");
          break;
        case "network":
          setErrorMsg("Network error. Check your connection.");
          break;
        default:
          setErrorMsg("Voice error. Please try again.");
      }
      recognitionRef.current = null;
      onRecordingChange?.(false);
      setTimeout(() => setStatus("idle"), 3000);
    };

    recognition.onend = () => {
      recognitionRef.current = null;
      setStatus("idle");
      onRecordingChange?.(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [language, onTranscript, onRecordingChange]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setStatus("idle");
    onRecordingChange?.(false);
  }, [onRecordingChange]);

  return { status, errorMsg, startListening, stopListening };
}
