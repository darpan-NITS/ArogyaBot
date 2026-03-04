"use client";
import { motion } from "framer-motion";
import { Message } from "@/types/chat";
import SeverityBadge from "./SeverityBadge";

export default function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: "16px",
        padding: "0 16px",
      }}
    >
      {/* Bot avatar */}
      {!isUser && (
        <div style={{
          width: "32px", height: "32px",
          borderRadius: "50%",
          background: "rgba(0,201,167,0.1)",
          border: "1px solid rgba(0,201,167,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "14px", marginRight: "10px", flexShrink: 0,
          marginTop: "4px",
        }}>🩺</div>
      )}

      <div style={{ maxWidth: "72%", display: "flex", flexDirection: "column", gap: "6px" }}>
        {/* Severity badge for bot messages */}
        {!isUser && message.severity && (
          <SeverityBadge level={message.severity} />
        )}

        {/* Bubble */}
        <div style={{
          background: isUser
            ? "rgba(0,201,167,0.12)"
            : "rgba(15, 32, 40, 0.9)",
          border: isUser
            ? "1px solid rgba(0,201,167,0.25)"
            : "1px solid #0e2530",
          borderRadius: isUser
            ? "18px 18px 4px 18px"
            : "18px 18px 18px 4px",
          padding: "12px 16px",
        }}>
          {/* Typing indicator */}
          {message.isTyping ? (
            <TypingDots />
          ) : (
            <p style={{
              fontFamily: "'Outfit'",
              fontSize: "14px",
              color: isUser ? "#dde8f0" : "#aac4d0",
              lineHeight: 1.65,
              margin: 0,
            }}>
              {message.text}
            </p>
          )}
        </div>

        {/* Timestamp */}
        <span style={{
          fontFamily: "'JetBrains Mono'",
          fontSize: "10px",
          color: "#1e4050",
          alignSelf: isUser ? "flex-end" : "flex-start",
        }}>
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit", minute: "2-digit"
          })}
        </span>
      </div>
    </motion.div>
  );
}

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: "5px", alignItems: "center", padding: "4px 2px" }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          style={{
            width: "6px", height: "6px",
            borderRadius: "50%",
            background: "#00c9a7",
          }}
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}