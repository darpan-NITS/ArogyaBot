export type MessageRole = "user" | "bot";

export type SeverityLevel = "mild" | "moderate" | "urgent" | "emergency" | null;

export interface MedicalEntities {
  symptoms:           string[];
  duration:           string | null;
  severity_indicated: string;
  body_parts:         string[];
  age:                number | null;
  structured_summary: string;
}

export interface Message {
  id:        string;
  role:      MessageRole;
  text:      string;
  timestamp: Date;
  severity?: SeverityLevel;
  isTyping?: boolean;
  entities?: MedicalEntities;
}
