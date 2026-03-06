"use client";
import { useRef, useEffect, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

function RevealCard({
  children, delay = 0, style,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

const LANGUAGES = [
  "English", "हिन्दी", "বাংলা", "অসমীয়া",
  "తెలుగు", "தமிழ்", "मराठी", "ಕನ್ನಡ", "ગુજરાતી",
];

function LanguageTicker() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % LANGUAGES.length), 1600);
    return () => clearInterval(t);
  }, []);
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={i}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
        style={{ color: "#00c9a7", fontStyle: "italic" }}
      >
        {LANGUAGES[i]}
      </motion.span>
    </AnimatePresence>
  );
}

function HeartbeatLine() {
  return (
    <svg width="100%" height="40" viewBox="0 0 300 40" preserveAspectRatio="none">
      <motion.polyline
        points="0,20 40,20 55,5 65,35 75,20 90,20 105,20 115,8 125,32 135,20 160,20 300,20"
        fill="none"
        stroke="#00c9a7"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
      />
    </svg>
  );
}

function StatCard({ value, label, delay }: { value: string; label: string; delay: number }) {
  return (
    <RevealCard delay={delay} style={{ height: "100%" }}>
      <div style={{
        background: "#0c1a1f",
        border: "1px solid #0e2530",
        borderRadius: "20px",
        padding: "28px 24px",
        height: "100%",
        display: "flex", flexDirection: "column",
        justifyContent: "space-between",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: 0, left: 0,
          width: "100%", height: "2px",
          background: "linear-gradient(90deg, transparent, #00c9a7, transparent)",
        }} />
        <div style={{
          fontFamily: "'DM Serif Display'",
          fontSize: "42px", color: "#00c9a7", lineHeight: 1,
        }}>
          {value}
        </div>
        <div style={{
          fontFamily: "'JetBrains Mono'",
          fontSize: "10px", color: "#1e6050",
          letterSpacing: "1.5px", marginTop: "8px",
        }}>
          {label.toUpperCase()}
        </div>
      </div>
    </RevealCard>
  );
}

function FeatureCard({
  icon, title, desc, delay, accent = false,
}: {
  icon: string; title: string; desc: string;
  delay: number; accent?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <RevealCard delay={delay} style={{ height: "100%" }}>
      <motion.div
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        animate={{ borderColor: hovered ? "rgba(0,201,167,0.3)" : "#0e2530" }}
        style={{
          background: accent ? "rgba(0,201,167,0.05)" : "#0c1a1f",
          border: "1px solid #0e2530",
          borderRadius: "20px", padding: "28px",
          height: "100%", cursor: "default",
          display: "flex", flexDirection: "column", gap: "14px",
        }}
      >
        <motion.div
          animate={{ scale: hovered ? 1.1 : 1 }}
          style={{
            width: "48px", height: "48px",
            borderRadius: "12px",
            background: "rgba(0,201,167,0.08)",
            border: "1px solid rgba(0,201,167,0.15)",
            display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "22px",
          }}
        >
          {icon}
        </motion.div>
        <div>
          <div style={{
            fontFamily: "'Outfit'", fontSize: "16px",
            fontWeight: 600, color: "#dde8f0", marginBottom: "6px",
          }}>
            {title}
          </div>
          <div style={{
            fontFamily: "'Outfit'", fontSize: "13px",
            color: "#4a7a8a", lineHeight: 1.6,
          }}>
            {desc}
          </div>
        </div>
      </motion.div>
    </RevealCard>
  );
}

const STEPS = [
  { step: "01", icon: "🎙️", title: "Describe",  desc: "Type or speak symptoms in any Indian language" },
  { step: "02", icon: "🧠", title: "Analyse",   desc: "AI extracts symptoms and assesses severity" },
  { step: "03", icon: "📋", title: "Triage",    desc: "Get clear guidance — rest, PHC, or hospital ER" },
  { step: "04", icon: "🗺️", title: "Navigate",  desc: "Find nearest facility and get directions" },
];

const FEATURES = [
  { icon: "🤖", title: "Llama-3 AI Triage",     desc: "Real LLM responses — understands context and asks follow-up questions.",       accent: true  },
  { icon: "🎙️", title: "Voice in 9 Languages",  desc: "Web Speech API with Assamese, Hindi, Bengali, Tamil, Telugu and more.",        accent: false },
  { icon: "🧠", title: "Medical NER",           desc: "Extracts symptoms, duration, severity words and body parts from free text.",    accent: false },
  { icon: "🗺️", title: "Live Facility Finder",  desc: "OpenStreetMap powered. Shows real hospitals and PHCs near your GPS location.", accent: false },
  { icon: "💊", title: "Jan Aushadhi Generics", desc: "Generic medicine alternatives from PMBI database with savings up to 93%.",      accent: true  },
  { icon: "📄", title: "PDF Health Report",     desc: "Downloadable summary with symptoms, severity, medicines and disclaimer.",       accent: false },
];

const LANG_LIST = [
  { name: "English",  script: "English"  },
  { name: "हिन्दी",   script: "Hindi"    },
  { name: "অসমীয়া", script: "Assamese" },
  { name: "বাংলা",   script: "Bengali"  },
  { name: "తెలుగు",  script: "Telugu"   },
  { name: "தமிழ்",   script: "Tamil"    },
  { name: "मराठी",   script: "Marathi"  },
  { name: "ಕನ್ನಡ",   script: "Kannada"  },
  { name: "ગુજરાતી", script: "Gujarati" },
];

export default function LandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // ← THE SCROLL FIX
  useEffect(() => {
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
    return () => {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    };
  }, []);

  if (!mounted) return null;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#070d0f",
      color: "#dde8f0",
      fontFamily: "'Outfit', sans-serif",
      overflowX: "hidden",
    }}>
      {/* Grid bg */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(0,201,167,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,201,167,0.025) 1px, transparent 1px)
        `,
        backgroundSize: "48px 48px",
        pointerEvents: "none",
      }} />

      {/* Top glow */}
      <div style={{
        position: "fixed", top: "-300px", left: "50%",
        transform: "translateX(-50%)",
        width: "700px", height: "700px",
        background: "radial-gradient(circle, rgba(0,201,167,0.07) 0%, transparent 65%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      <div style={{
        position: "relative", zIndex: 1,
        maxWidth: "1000px", margin: "0 auto",
        padding: "0 20px 80px",
      }}>

        {/* NAV */}
        <motion.nav
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            padding: "20px 0",
            display: "flex", alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "40px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "10px",
              background: "rgba(0,201,167,0.1)",
              border: "1px solid rgba(0,201,167,0.25)",
              display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "18px",
            }}>
              🩺
            </div>
            <span style={{
              fontFamily: "'DM Serif Display'",
              fontSize: "20px", color: "#dde8f0",
            }}>
              Arogya<span style={{ color: "#00c9a7", fontStyle: "italic" }}>Bot</span>
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => router.push("/chat")}
            style={{
              background: "#00c9a7", border: "none",
              borderRadius: "10px", padding: "10px 22px",
              cursor: "pointer",
              fontFamily: "'JetBrains Mono'",
              fontSize: "11px", letterSpacing: "1px",
              color: "#070d0f", fontWeight: 700,
            }}
          >
            OPEN APP →
          </motion.button>
        </motion.nav>

        {/* CARD 1 — HERO */}
        <RevealCard delay={0} style={{ marginBottom: "16px" }}>
          <div style={{
            background: "#0c1a1f",
            border: "1px solid #0e2530",
            borderRadius: "24px",
            padding: "clamp(40px, 6vw, 72px)",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: 0, right: 0,
              width: "300px", height: "300px",
              background: "radial-gradient(circle at top right, rgba(0,201,167,0.07), transparent 70%)",
              pointerEvents: "none",
            }} />

            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "rgba(0,201,167,0.06)",
              border: "1px solid rgba(0,201,167,0.15)",
              borderRadius: "20px", padding: "6px 14px",
              marginBottom: "32px",
            }}>
              <motion.div
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{
                  width: "6px", height: "6px",
                  borderRadius: "50%", background: "#00c9a7",
                }}
              />
              <span style={{
                fontFamily: "'JetBrains Mono'",
                fontSize: "10px", color: "#00c9a7", letterSpacing: "1.5px",
              }}>
                LIVE · FREE · OPEN SOURCE
              </span>
            </div>

            <h1 style={{
              fontFamily: "'DM Serif Display'",
              fontSize: "clamp(32px, 6vw, 64px)",
              fontWeight: 400, lineHeight: 1.1,
              color: "#dde8f0", marginBottom: "16px",
              letterSpacing: "-1px",
            }}>
              Healthcare guidance
              <br />
              in{" "}
              <span style={{ display: "inline-block", minWidth: "200px" }}>
                <LanguageTicker />
              </span>
            </h1>

            <div style={{ margin: "24px 0", opacity: 0.7 }}>
              <HeartbeatLine />
            </div>

            <p style={{
              fontSize: "16px", color: "#4a7a8a",
              maxWidth: "500px", lineHeight: 1.7,
              marginBottom: "40px",
            }}>
              AI triage for India&apos;s 900M underserved. Describe symptoms
              by voice or text in 9 languages — get instant assessment,
              nearby facilities, and generic medicine alternatives.
            </p>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 0 50px rgba(0,201,167,0.25)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push("/chat")}
                style={{
                  background: "#00c9a7", border: "none",
                  borderRadius: "12px", padding: "14px 36px",
                  cursor: "pointer",
                  fontFamily: "'JetBrains Mono'",
                  fontSize: "12px", letterSpacing: "1.5px",
                  color: "#070d0f", fontWeight: 700,
                  boxShadow: "0 0 30px rgba(0,201,167,0.15)",
                }}
              >
                START TRIAGE →
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => window.open("https://github.com/darpan-NITS/ArogyaBot", "_blank")}
                style={{
                  background: "transparent",
                  border: "1px solid #0e2530",
                  borderRadius: "12px", padding: "14px 36px",
                  cursor: "pointer",
                  fontFamily: "'JetBrains Mono'",
                  fontSize: "12px", letterSpacing: "1.5px",
                  color: "#4a7a8a",
                }}
              >
                GITHUB ↗
              </motion.button>
            </div>
          </div>
        </RevealCard>

        {/* CARD ROW 2 — STATS */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px", marginBottom: "16px",
        }}>
          <StatCard value="900M+" label="Underserved Indians" delay={0.05} />
          <StatCard value="9"     label="Indian Languages"    delay={0.10} />
          <StatCard value="500+"  label="Disease Profiles"    delay={0.15} />
          <StatCard value="108"   label="Emergency Number"    delay={0.20} />
        </div>

        {/* CARD 3 — HOW IT WORKS */}
        <RevealCard delay={0.05} style={{ marginBottom: "16px" }}>
          <div style={{
            background: "#0c1a1f",
            border: "1px solid #0e2530",
            borderRadius: "24px", padding: "40px",
          }}>
            <div style={{
              fontFamily: "'JetBrains Mono'",
              fontSize: "10px", color: "#1e6050",
              letterSpacing: "2px", marginBottom: "32px",
            }}>
              HOW IT WORKS
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            }}>
              {STEPS.map((s, i) => (
                <div
                  key={i}
                  style={{
                    padding: "24px",
                    borderRight: i < STEPS.length - 1 ? "1px solid #0e2530" : "none",
                  }}
                >
                  <div style={{
                    fontFamily: "'JetBrains Mono'",
                    fontSize: "10px", color: "#1e3a4a",
                    letterSpacing: "1px", marginBottom: "12px",
                  }}>
                    {s.step}
                  </div>
                  <div style={{ fontSize: "24px", marginBottom: "10px" }}>{s.icon}</div>
                  <div style={{
                    fontFamily: "'Outfit'", fontSize: "15px",
                    fontWeight: 600, color: "#dde8f0", marginBottom: "6px",
                  }}>
                    {s.title}
                  </div>
                  <div style={{
                    fontFamily: "'Outfit'", fontSize: "12px",
                    color: "#4a7a8a", lineHeight: 1.6,
                  }}>
                    {s.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RevealCard>

        {/* CARD ROW 4 — FEATURES */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "16px", marginBottom: "16px",
        }}>
          {FEATURES.map((f, i) => (
            <FeatureCard
              key={i}
              icon={f.icon}
              title={f.title}
              desc={f.desc}
              delay={0.05 + (i % 3) * 0.05}
              accent={f.accent}
            />
          ))}
        </div>

        {/* CARD 5 — LANGUAGES */}
        <RevealCard delay={0.05} style={{ marginBottom: "16px" }}>
          <div style={{
            background: "#0c1a1f",
            border: "1px solid #0e2530",
            borderRadius: "24px", padding: "40px",
            textAlign: "center",
          }}>
            <div style={{
              fontFamily: "'JetBrains Mono'",
              fontSize: "10px", color: "#1e6050",
              letterSpacing: "2px", marginBottom: "28px",
            }}>
              SUPPORTED LANGUAGES
            </div>
            <div style={{
              display: "flex", flexWrap: "wrap",
              gap: "10px", justifyContent: "center",
            }}>
              {LANG_LIST.map((lang, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05, borderColor: "rgba(0,201,167,0.4)" }}
                  style={{
                    background: "rgba(0,201,167,0.04)",
                    border: "1px solid rgba(0,201,167,0.1)",
                    borderRadius: "10px", padding: "10px 18px",
                    cursor: "default",
                  }}
                >
                  <div style={{
                    fontFamily: "'Outfit'", fontSize: "16px",
                    color: "#dde8f0", marginBottom: "2px",
                  }}>
                    {lang.name}
                  </div>
                  <div style={{
                    fontFamily: "'JetBrains Mono'",
                    fontSize: "9px", color: "#1e6050", letterSpacing: "1px",
                  }}>
                    {lang.script.toUpperCase()}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </RevealCard>

        {/* CARD 6 — EMERGENCY + CTA */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: "16px", marginBottom: "16px",
        }}>
          <RevealCard delay={0.05} style={{ height: "100%" }}>
            <div style={{
              background: "rgba(255,107,107,0.04)",
              border: "1px solid rgba(255,107,107,0.15)",
              borderRadius: "24px", padding: "32px",
              height: "100%",
              display: "flex", flexDirection: "column",
              justifyContent: "space-between",
            }}>
              <div style={{ fontSize: "32px" }}>🚨</div>
              <div>
                <div style={{
                  fontFamily: "'DM Serif Display'",
                  fontSize: "48px", color: "#ff6b6b", lineHeight: 1,
                }}>
                  108
                </div>
                <div style={{
                  fontFamily: "'JetBrains Mono'",
                  fontSize: "10px", color: "rgba(255,107,107,0.5)",
                  letterSpacing: "1.5px", marginTop: "8px",
                }}>
                  EMERGENCY HELPLINE
                </div>
              </div>
              <p style={{
                fontFamily: "'Outfit'", fontSize: "12px",
                color: "rgba(255,107,107,0.5)", lineHeight: 1.6,
              }}>
                Always call 108 in a medical emergency. ArogyaBot is not a substitute for emergency care.
              </p>
            </div>
          </RevealCard>

          <RevealCard delay={0.1} style={{ height: "100%" }}>
            <div style={{
              background: "rgba(0,201,167,0.04)",
              border: "1px solid rgba(0,201,167,0.15)",
              borderRadius: "24px", padding: "40px",
              height: "100%",
              display: "flex", flexDirection: "column",
              justifyContent: "space-between",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", bottom: "-60px", right: "-60px",
                width: "200px", height: "200px",
                background: "radial-gradient(circle, rgba(0,201,167,0.08), transparent 70%)",
                pointerEvents: "none",
              }} />
              <div>
                <div style={{
                  fontFamily: "'DM Serif Display'",
                  fontSize: "clamp(22px, 3vw, 32px)",
                  color: "#dde8f0", lineHeight: 1.2, marginBottom: "16px",
                }}>
                  Describe your symptoms.
                  <br />
                  <span style={{ color: "#00c9a7", fontStyle: "italic" }}>
                    Get help instantly.
                  </span>
                </div>
                <p style={{
                  fontFamily: "'Outfit'", fontSize: "14px",
                  color: "#4a7a8a", lineHeight: 1.7,
                }}>
                  No registration. No cost. Works offline.
                  Built for rural India, usable by everyone.
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 0 50px rgba(0,201,167,0.2)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push("/chat")}
                style={{
                  background: "#00c9a7", border: "none",
                  borderRadius: "12px", padding: "16px 40px",
                  cursor: "pointer", alignSelf: "flex-start",
                  marginTop: "32px",
                  fontFamily: "'JetBrains Mono'",
                  fontSize: "12px", letterSpacing: "1.5px",
                  color: "#070d0f", fontWeight: 700,
                }}
              >
                START TRIAGE →
              </motion.button>
            </div>
          </RevealCard>
        </div>

        {/* FOOTER */}
        <RevealCard delay={0.05}>
          <div style={{
            borderTop: "1px solid #0e2530",
            padding: "24px 0",
            display: "flex", alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap", gap: "12px",
          }}>
            <span style={{
              fontFamily: "'DM Serif Display'",
              fontSize: "16px", color: "#1e4050",
            }}>
              Arogya<span style={{ color: "#1e6050", fontStyle: "italic" }}>Bot</span>
            </span>
            <span style={{
              fontFamily: "'JetBrains Mono'",
              fontSize: "9px", color: "#1e3a4a", letterSpacing: "1.5px",
            }}>
              NOT A SUBSTITUTE FOR MEDICAL ADVICE · BUILT FOR INDIA
            </span>
            <motion.button
              whileHover={{ color: "#00c9a7" }}
              onClick={() => router.push("/chat")}
              style={{
                background: "none", border: "none",
                fontFamily: "'JetBrains Mono'",
                fontSize: "10px", color: "#1e4050",
                cursor: "pointer", letterSpacing: "1px",
                transition: "color 0.2s",
              }}
            >
              OPEN APP →
            </motion.button>
          </div>
        </RevealCard>

      </div>
    </div>
  );
}
