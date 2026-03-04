export type MessageRole = "user" | "bot";

export type SeverityLevel = "mild" | "moderate" | "urgent" | "emergency" | null;

export interface Message {
  id: string;
  role: MessageRole;
  text: string;
  timestamp: Date;
  severity?: SeverityLevel;
  isTyping?: boolean;
}