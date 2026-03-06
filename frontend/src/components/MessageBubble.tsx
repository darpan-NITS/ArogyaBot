"use client";
import { motion } from "framer-motion";
import { Message, MedicalEntities } from "@/types/chat";
import SeverityBadge from "./SeverityBadge";
import EntityTags from "./EntityTags";

export default function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{
        display: "flex", flexDirection: "column",
        alignItems: isUser ? "flex-end" : "flex-start",
        marginBottom: "16px", padding: "0 16px",
      }}
    >
      <div style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        width: "100%",
      }}>
        {!isUser && (
          <div style={{
            width: "32px", height: "32px", borderRadius: "50%",
            background: "rgba(91,168,160,0.1)",
            border: "1px solid rgba(91,168,160,0.25)",
            display: "flex", alignItems: "center",
            justifyContent: "center",
            fontSize: "14px", marginRight: "10px",
            flexShrink: 0, marginTop: "4px",
          }}>🩺</div>
        )}

        <div style={{
          maxWidth: "72%", display: "flex",
          flexDirection: "column", gap: "6px",
        }}>
          {!isUser && message.severity && (
            <SeverityBadge level={message.severity} />
          )}

          <div style={{
            background: isUser
              ? "rgba(91,168,160,0.1)"
              : "rgba(17,30,30,0.95)",
            border: isUser
              ? "1px solid rgba(91,168,160,0.22)"
              : "1px solid var(--border)",
            borderRadius: isUser
              ? "18px 18px 4px 18px"
              : "18px 18px 18px 4px",
            padding: "12px 16px",
          }}>
            {message.isTyping ? (
              <TypingDots />
            ) : (
              <p style={{
                fontFamily: "'Outfit'",
                fontSize: "14px",
                color: isUser
                  ? "var(--text-primary)"
                  : "var(--text-secondary)",
                lineHeight: 1.65, margin: 0,
              }}>
                {message.text}
              </p>
            )}
          </div>

          <span style={{
            fontFamily: "'JetBrains Mono'", fontSize: "10px",
            color: "var(--text-muted)",
            alignSelf: isUser ? "flex-end" : "flex-start",
          }}>
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit", minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      {isUser && message.entities &&
        (message.entities as MedicalEntities).symptoms?.length > 0 && (
          <div style={{
            width: "100%", display: "flex",
            justifyContent: "flex-end", marginTop: "4px",
          }}>
            <EntityTags entities={message.entities as MedicalEntities} />
          </div>
      )}
    </motion.div>
  );
}

function TypingDots() {
  return (
    <div style={{
      display: "flex", gap: "5px",
      alignItems: "center", padding: "4px 2px",
    }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          style={{
            width: "6px", height: "6px",
            borderRadius: "50%",
            background: "var(--accent-teal)",
          }}
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}
