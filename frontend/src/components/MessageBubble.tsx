"use client";
import { motion } from "framer-motion";
import { Message } from "@/types/chat";
import { MedicalEntities } from "@/types/chat";
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
        {/* Bot avatar */}
        {!isUser && (
          <div style={{
            width: "32px", height: "32px",
            borderRadius: "50%",
            background: "rgba(224,123,57,0.10)",
            border: "1px solid rgba(224,123,57,0.25)",
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

          {/* Bubble */}
          <div style={{
            background: isUser ? "#E07B39" : "#F2EDE6",
            border: isUser ? "none" : "1px solid #DDD4C4",
            borderRadius: isUser
              ? "18px 18px 4px 18px"
              : "18px 18px 18px 4px",
            padding: "12px 16px",
            boxShadow: isUser
              ? "0 2px 12px rgba(224,123,57,0.22)"
              : "0 1px 4px rgba(92,45,110,0.05)",
          }}>
            {message.isTyping ? (
              <TypingDots />
            ) : (
              <p style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "14px",
                color: isUser ? "#FAFAF7" : "#4A3728",
                lineHeight: 1.65, margin: 0,
              }}>
                {message.text}
              </p>
            )}
          </div>

          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "10px", color: "#9A8472",
            alignSelf: isUser ? "flex-end" : "flex-start",
          }}>
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit", minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      {/* Entity tags */}
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
            borderRadius: "50%", background: "#E07B39",
          }}
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}
