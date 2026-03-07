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
        style={{ color: "#3db8ae", fontStyle: "italic" }}
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
        stroke="#3db8ae"
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
        background: "#100d1e",
        border: "1px solid #1c1730",
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
          background: "linear-gradient(90deg, transparent, #3db8ae, transparent)",
        }} />
        <div style={{
          fontFamily: "'DM Serif Display'",
          fontSize: "42px", color: "#3db8ae", lineHeight: 1,
        }}>
          {value}
        </div>
        <div style={{
          fontFamily: "'JetBrains Mono'",
          fontSize: "10px", color: "#3a2e60",
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
        animate={{ borderColor: hovered ? "rgba(61,184,174,0.3)" : "#1c1730" }}
        style={{
          background: accent ? "rgba(61,184,174,0.05)" : "#100d1e",
          border: "1px solid #1c1730",
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
            background: "rgba(61,184,174,0.08)",
            border: "1px solid rgba(61,184,174,0.18)",
            display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "22px",
          }}
        >
          {icon}
        </motion.div>
        <div>
          <div style={{
            fontFamily: "'Outfit'", fontSize: "16px",
            fontWeight: 600, color: "#e8e0f4", marginBottom: "6px",
          }}>
            {title}
          </div>
          <div style={{
            fontFamily: "'Outfit'", fontSize: "13px",
            color: "#6b5f84", lineHeight: 1.6,
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
      background: "#090614",
      color: "#e8e0f4",
      fontFamily: "'Outfit', sans-serif",
      overflowX: "hidden",
    }}>
      {/* Grid bg */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(61,184,174,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(61,184,174,0.025) 1px, transparent 1px)
        `,
        backgroundSize: "48px 48px",
        pointerEvents: "none",
      }} />

      {/* Top glow — violet */}
      <div style={{
        position: "fixed", top: "-300px", left: "50%",
        transform: "translateX(-50%)",
        width: "700px", height: "700px",
        background: "radial-gradient(circle, rgba(120,60,200,0.1) 0%, transparent 65%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* Subtle bottom-left crimson glow */}
      <div style={{
        position: "fixed", bottom: "-200px", left: "-100px",
        width: "500px", height: "500px",
        background: "radial-gradient(circle, rgba(192,41,58,0.06) 0%, transparent 65%)",
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
              background: "rgba(61,184,174,0.1)",
              border: "1px solid rgba(61,184,174,0.25)",
              display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "18px",
            }}>
              🩺
            </div>
            <span style={{
              fontFamily: "'DM Serif Display'",
              fontSize: "20px", color: "#e8e0f4",
            }}>
              Arogya<span style={{ color: "#3db8ae", fontStyle: "italic" }}>Bot</span>
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => router.push("/chat")}
            style={{
              background: "#3db8ae", border: "none",
              borderRadius: "10px", padding: "10px 22px",
              cursor: "pointer",
              fontFamily: "'JetBrains Mono'",
              fontSize: "11px", letterSpacing: "1px",
              color: "#090614", fontWeight: 700,
            }}
          >
            OPEN APP →
          </motion.button>
        </motion.nav>

        {/* CARD 1 — HERO */}
        <RevealCard delay={0} style={{ marginBottom: "16px" }}>
          <div style={{
            background: "#100d1e",
            border: "1px solid #1c1730",
            borderRadius: "24px",
            padding: "clamp(40px, 6vw, 72px)",
            position: "relative", overflow: "hidden",
          }}>
            {/* Violet corner glow */}
            <div style={{
              position: "absolute", top: 0, right: 0,
              width: "320px", height: "320px",
              background: "radial-gradient(circle at top right, rgba(120,60,200,0.1), transparent 70%)",
              pointerEvents: "none",
            }} />
            {/* Teal bottom-left glow */}
            <div style={{
              position: "absolute", bottom: 0, left: 0,
              width: "260px", height: "260px",
              background: "radial-gradient(circle at bottom left, rgba(61,184,174,0.07), transparent 70%)",
              pointerEvents: "none",
            }} />

            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "rgba(61,184,174,0.07)",
              border: "1px solid rgba(61,184,174,0.18)",
              borderRadius: "20px", padding: "6px 14px",
              marginBottom: "32px",
            }}>
              <motion.div
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{
                  width: "6px", height: "6px",
                  borderRadius: "50%", background: "#3db8ae",
                }}
              />
              <span style={{
                fontFamily: "'JetBrains Mono'",
                fontSize: "10px", color: "#3db8ae", letterSpacing: "1.5px",
              }}>
                LIVE · FREE · EASY TO USE
              </span>
            </div>

            <h1 style={{
              fontFamily: "'DM Serif Display'",
              fontSize: "clamp(32px, 6vw, 64px)",
              fontWeight: 400, lineHeight: 1.1,
              color: "#e8e0f4", marginBottom: "16px",
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
              fontSize: "16px", color: "#8a7aaa",
              maxWidth: "500px", lineHeight: 1.7,
              marginBottom: "40px",
            }}>
              An AI health-support bot built by Darpan. Describe your symptoms simply
              by voice or text in 9 languages — get instant assessment,
              nearby facilities, and generic medicine alternatives.
            </p>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 0 50px rgba(61,184,174,0.25)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push("/chat")}
                style={{
                  background: "#3db8ae", border: "none",
                  borderRadius: "12px", padding: "14px 36px",
                  cursor: "pointer",
                  fontFamily: "'JetBrains Mono'",
                  fontSize: "12px", letterSpacing: "1.5px",
                  color: "#090614", fontWeight: 700,
                  boxShadow: "0 0 30px rgba(61,184,174,0.15)",
                }}
              >
                START CHAT →
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => window.open("https://github.com/darpan-NITS/ArogyaBot", "_blank")}
                style={{
                  background: "transparent",
                  border: "1px solid #1c1730",
                  borderRadius: "12px", padding: "14px 36px",
                  cursor: "pointer",
                  fontFamily: "'JetBrains Mono'",
                  fontSize: "12px", letterSpacing: "1.5px",
                  color: "#6b5f84",
                }}
              >
                GITHUB REPO ↗
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
            background: "#100d1e",
            border: "1px solid #1c1730",
            borderRadius: "24px", padding: "40px",
          }}>
            <div style={{
              fontFamily: "'JetBrains Mono'",
              fontSize: "10px", color: "#3a2e60",
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
                    borderRight: i < STEPS.length - 1 ? "1px solid #1c1730" : "none",
                  }}
                >
                  <div style={{
                    fontFamily: "'JetBrains Mono'",
                    fontSize: "10px", color: "#2a2248",
                    letterSpacing: "1px", marginBottom: "12px",
                  }}>
                    {s.step}
                  </div>
                  <div style={{ fontSize: "24px", marginBottom: "10px" }}>{s.icon}</div>
                  <div style={{
                    fontFamily: "'Outfit'", fontSize: "15px",
                    fontWeight: 600, color: "#e8e0f4", marginBottom: "6px",
                  }}>
                    {s.title}
                  </div>
                  <div style={{
                    fontFamily: "'Outfit'", fontSize: "12px",
                    color: "#6b5f84", lineHeight: 1.6,
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
            background: "#100d1e",
            border: "1px solid #1c1730",
            borderRadius: "24px", padding: "40px",
            textAlign: "center",
          }}>
            <div style={{
              fontFamily: "'JetBrains Mono'",
              fontSize: "10px", color: "#3a2e60",
              letterSpacing: "2px", marginBottom: "28px",
            }}>
              VARIOUS SUPPORTED LANGUAGES
            </div>
            <div style={{
              display: "flex", flexWrap: "wrap",
              gap: "10px", justifyContent: "center",
            }}>
              {LANG_LIST.map((lang, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05, borderColor: "rgba(61,184,174,0.4)" }}
                  style={{
                    background: "rgba(61,184,174,0.04)",
                    border: "1px solid rgba(61,184,174,0.1)",
                    borderRadius: "10px", padding: "10px 18px",
                    cursor: "default",
                  }}
                >
                  <div style={{
                    fontFamily: "'Outfit'", fontSize: "16px",
                    color: "#e8e0f4", marginBottom: "2px",
                  }}>
                    {lang.name}
                  </div>
                  <div style={{
                    fontFamily: "'JetBrains Mono'",
                    fontSize: "9px", color: "#3a2e60", letterSpacing: "1px",
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
              background: "rgba(192,41,58,0.05)",
              border: "1px solid rgba(192,41,58,0.18)",
              borderRadius: "24px", padding: "32px",
              height: "100%",
              display: "flex", flexDirection: "column",
              justifyContent: "space-between",
            }}>
              <div style={{ fontSize: "32px" }}>🚨</div>
              <div>
                <div style={{
                  fontFamily: "'DM Serif Display'",
                  fontSize: "48px", color: "#d94058", lineHeight: 1,
                }}>
                  108
                </div>
                <div style={{
                  fontFamily: "'JetBrains Mono'",
                  fontSize: "10px", color: "rgba(217,64,88,0.55)",
                  letterSpacing: "1.5px", marginTop: "8px",
                }}>
                  EMERGENCY HELPLINE
                </div>
              </div>
              <p style={{
                fontFamily: "'Outfit'", fontSize: "12px",
                color: "rgba(217,64,88,0.55)", lineHeight: 1.6,
              }}>
                Always call 108 in a medical emergency. ArogyaBot is not a substitute for emergency care.
              </p>
            </div>
          </RevealCard>

          <RevealCard delay={0.1} style={{ height: "100%" }}>
            <div style={{
              background: "rgba(61,184,174,0.04)",
              border: "1px solid rgba(61,184,174,0.15)",
              borderRadius: "24px", padding: "40px",
              height: "100%",
              display: "flex", flexDirection: "column",
              justifyContent: "space-between",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", bottom: "-60px", right: "-60px",
                width: "200px", height: "200px",
                background: "radial-gradient(circle, rgba(61,184,174,0.08), transparent 70%)",
                pointerEvents: "none",
              }} />
              <div>
                <div style={{
                  fontFamily: "'DM Serif Display'",
                  fontSize: "clamp(22px, 3vw, 32px)",
                  color: "#e8e0f4", lineHeight: 1.2, marginBottom: "16px",
                }}>
                  Describe your symptoms.
                  <br />
                  <span style={{ color: "#3db8ae", fontStyle: "italic" }}>
                    Get help instantly.
                  </span>
                </div>
                <p style={{
                  fontFamily: "'Outfit'", fontSize: "14px",
                  color: "#6b5f84", lineHeight: 1.7,
                }}>
                  No registration. No cost. Works offline.
                  Built for rural India, usable by everyone.
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 0 50px rgba(61,184,174,0.2)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push("/chat")}
                style={{
                  background: "#3db8ae", border: "none",
                  borderRadius: "12px", padding: "16px 40px",
                  cursor: "pointer", alignSelf: "flex-start",
                  marginTop: "32px",
                  fontFamily: "'JetBrains Mono'",
                  fontSize: "12px", letterSpacing: "1.5px",
                  color: "#090614", fontWeight: 700,
                }}
              >
                START YOUR 1st CHAT →
              </motion.button>
            </div>
          </RevealCard>
        </div>

        {/* FOOTER */}
        <RevealCard delay={0.05}>
          <div style={{
            borderTop: "1px solid #1c1730",
            padding: "24px 0",
            display: "flex", alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap", gap: "12px",
          }}>
            <span style={{
              fontFamily: "'DM Serif Display'",
              fontSize: "16px", color: "#2a2248",
            }}>
              Arogya<span style={{ color: "#3a2e60", fontStyle: "italic" }}>Bot</span>
            </span>
            <span style={{
              fontFamily: "'JetBrains Mono'",
              fontSize: "9px", color: "#2a2248", letterSpacing: "1.5px",
            }}>
              NOT A SUBSTITUTE FOR MEDICAL ADVICE · BUILT FOR INDIA , BY DARPAN
            </span>
            <motion.button
              whileHover={{ color: "#3db8ae" }}
              onClick={() => router.push("/chat")}
              style={{
                background: "none", border: "none",
                fontFamily: "'JetBrains Mono'",
                fontSize: "10px", color: "#2a2248",
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
