const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function sendMessage(
  message: string,
  sessionId: string,
  language: string
) {
  const res = await fetch(`${BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, session_id: sessionId, language }),
  });

  if (!res.ok) throw new Error("API call failed");
  return res.json();
}

export async function createSession(language: string) {
  const res = await fetch(`${BASE_URL}/api/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ language }),
  });

  if (!res.ok) throw new Error("Session creation failed");
  return res.json();
}

export async function getSession(sessionId: string) {
  const res = await fetch(`${BASE_URL}/api/session/${sessionId}`);
  if (!res.ok) throw new Error("Session fetch failed");
  return res.json();
}