"use client";
import { useRef, useEffect, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

// ==========================================
// 1. SPLASH CURSOR EFFECT
// ==========================================
function SplashCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [splashes, setSplashes] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    const handleClick = (e: MouseEvent) => {
      const newSplash = { id: Date.now(), x: e.clientX, y: e.clientY };
      setSplashes((prev) => [...prev, newSplash]);
      setTimeout(() => {
        setSplashes((prev) => prev.filter((s) => s.id !== newSplash.id));
      }, 600);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <>
      {/* Main Cursor Tracker */}
      <motion.div
        className="pointer-events-none fixed z-[9999] rounded-full mix-blend-screen"
        animate={{ x: mousePosition.x - 10, y: mousePosition.y - 10 }}
        transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
        style={{
          width: "20px",
          height: "20px",
          background: "radial-gradient(circle, rgba(61,184,174,0.8) 0%, transparent 80%)",
          boxShadow: "0 0 20px rgba(61,184,174,0.5)",
        }}
      />
      {/* Click Splashes */}
      <AnimatePresence>
        {splashes.map((splash) => (
          <motion.div
            key={splash.id}
            initial={{ opacity: 1, scale: 0, x: splash.x - 40, y: splash.y - 40 }}
            animate={{ opacity: 0, scale: 2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="pointer-events-none fixed z-[9998] rounded-full border-2 border-[#3db8ae]"
            style={{ width: "80px", height: "80px" }}
          />
        ))}
      </AnimatePresence>
    </>
  );
}

// ==========================================
// 2. LIGHT PILLAR BACKGROUND
// ==========================================
function LightPillars() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div
        style={{
          position: "absolute",
          top: "-10%", left: "15%",
          width: "120px", height: "120%",
          background: "linear-gradient(180deg, rgba(61,184,174,0.15) 0%, transparent 100%)",
          filter: "blur(60px)",
          transform: "rotate(-15deg)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "-20%", right: "20%",
          width: "150px", height: "140%",
          background: "linear-gradient(180deg, rgba(120,60,200,0.12) 0%, transparent 100%)",
          filter: "blur(70px)",
          transform: "rotate(10deg)",
        }}
      />
      <div
        style={{
          position: "absolute", bottom: "-10%", left: "40%",
          width: "200px", height: "60%",
          background: "radial-gradient(circle, rgba(192,41,58,0.08) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />
    </div>
  );
}

// ==========================================
// 3. TRUE FOCUS TEXT HEADING
// ==========================================
function TrueFocusText({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" }}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ filter: "blur(12px)", opacity: 0, y: 10 }}
          animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "inline-block" }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}

// ==========================================
// DATA CONFIG
// ==========================================
const LANGUAGES = ["English", "हिन्दी", "বাংলা", "অসমীয়া", "తెలుగు", "தமிழ்", "मराठी", "ಕನ್ನಡ", "ગુજરાતી"];

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
        initial={{ opacity: 0, filter: "blur(8px)", y: 10 }}
        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        exit={{ opacity: 0, filter: "blur(8px)", y: -10 }}
        transition={{ duration: 0.3 }}
        style={{ color: "#3db8ae", fontStyle: "italic", display: "inline-block" }}
      >
        {LANGUAGES[i]}
      </motion.span>
    </AnimatePresence>
  );
}

const STEPS = [
  { step: "01", icon: "🎙️", title: "Describe", desc: "Type or speak symptoms in any Indian language" },
  { step: "02", icon: "🧠", title: "Analyse", desc: "AI extracts symptoms and assesses severity" },
  { step: "03", icon: "📋", title: "Triage", desc: "Get clear guidance — rest, PHC, or hospital ER" },
  { step: "04", icon: "🗺️", title: "Navigate", desc: "Find nearest facility and get directions" },
];

const FEATURES = [
  { icon: "🤖", title: "Llama-3 AI Triage", desc: "Real LLM responses — understands context.", accent: true },
  { icon: "🎙️", title: "Voice in 9 Languages", desc: "Web Speech API with Assamese, Hindi, Bengali, etc.", accent: false },
  { icon: "🧠", title: "Medical NER", desc: "Extracts symptoms, severity and body parts.", accent: false },
  { icon: "🗺️", title: "Live Facility Finder", desc: "OpenStreetMap powered real hospitals near you.", accent: false },
  { icon: "💊", title: "Jan Aushadhi", desc: "Generic medicine alternatives with savings up to 93%.", accent: true },
  { icon: "📄", title: "PDF Health Report", desc: "Downloadable summary with symptoms and severity.", accent: false },
];

// ==========================================
// UTILITY COMPONENTS
// ==========================================
function RevealCard({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

function HeartbeatLine() {
  return (
    <svg width="100%" height="40" viewBox="0 0 300 40" preserveAspectRatio="none">
      <motion.polyline
        points="0,20 40,20 55,5 65,35 75,20 90,20 105,20 115,8 125,32 135,20 160,20 300,20"
        fill="none" stroke="#3db8ae" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ filter: "drop-shadow(0px 0px 6px rgba(61,184,174,0.6))" }}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
      />
    </svg>
  );
}

// ==========================================
// MAIN PAGE
// ==========================================
export default function LandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // RESTORED SCROLL FIX
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#090614",
        color: "#e8e0f4",
        fontFamily: "'Outfit', sans-serif",
        overflowX: "hidden", // Changed to safe horizontal clamping
        overflowY: "auto",   // Explicitly allow vertical scrolling
        cursor: "none",
        position: "relative"
      }}
    >
      <SplashCursor />
      <LightPillars />

      {/* SVG Filters for Gooey Effect - Made pointer-events-none so it doesn't block clicks/scrolls */}
      <svg width="0" height="0" style={{ position: "absolute", pointerEvents: "none" }}>
        <defs>
          <filter id="gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* ==========================================
          4. GLASS SURFACE NAV & GOOEY EFFECT
          ========================================== */}
      <div
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          display: "flex", justifyContent: "center", padding: "16px",
          pointerEvents: "none", // Prevent full wrapper from blocking scrolls
          transition: "all 0.3s ease",
        }}
      >
        <motion.nav
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            pointerEvents: "auto", // Re-enable clicks only on the actual nav bar
            display: "flex", alignItems: "center", justifyContent: "space-between",
            width: "100%", maxWidth: "1000px",
            padding: "12px 24px",
            borderRadius: "24px",
            background: scrolled ? "rgba(16, 13, 30, 0.6)" : "transparent",
            backdropFilter: scrolled ? "blur(16px)" : "none",
            border: scrolled ? "1px solid rgba(61,184,174,0.15)" : "1px solid transparent",
            boxShadow: scrolled ? "0 10px 30px rgba(0,0,0,0.3)" : "none",
            filter: "url(#gooey)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px", height: "36px", borderRadius: "50%",
                background: "rgba(61,184,174,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "18px", border: "1px solid rgba(61,184,174,0.3)",
              }}
            >
              🩺
            </div>
            <span style={{ fontFamily: "'DM Serif Display'", fontSize: "20px" }}>
              Arogya<span style={{ color: "#3db8ae", fontStyle: "italic" }}>Bot</span>
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "#4ce0d4" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/chat")}
            style={{
              background: "#3db8ae", border: "none", borderRadius: "20px",
              padding: "10px 24px", cursor: "none",
              fontFamily: "'JetBrains Mono'", fontSize: "11px", fontWeight: 700,
              color: "#090614", letterSpacing: "1px",
              boxShadow: "0 0 15px rgba(61,184,174,0.4)",
            }}
          >
            OPEN APP →
          </motion.button>
        </motion.nav>
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: "1000px", margin: "0 auto", padding: "120px 20px 80px" }}>
        {/* HERO SECTION */}
        <RevealCard delay={0} style={{ marginBottom: "24px" }}>
          <div
            style={{
              background: "linear-gradient(145deg, rgba(16,13,30,0.8), rgba(9,6,20,0.9))",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(61,184,174,0.15)",
              borderRadius: "32px",
              padding: "clamp(40px, 6vw, 72px)",
              textAlign: "center",
              boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
              <div
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  background: "rgba(61,184,174,0.1)",
                  border: "1px solid rgba(61,184,174,0.3)",
                  borderRadius: "20px", padding: "6px 16px",
                }}
              >
                <motion.div
                  animate={{ opacity: [1, 0.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#3db8ae", boxShadow: "0 0 8px #3db8ae" }}
                />
                <span style={{ fontFamily: "'JetBrains Mono'", fontSize: "10px", color: "#3db8ae", letterSpacing: "1.5px" }}>
                  LIVE · FREE · EASY TO USE
                </span>
              </div>
            </div>

            <div style={{ fontFamily: "'DM Serif Display'", fontSize: "clamp(32px, 6vw, 64px)", lineHeight: 1.2, marginBottom: "16px" }}>
              <TrueFocusText text="Intelligent Healthcare Guidance" />
              <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap", marginTop: "12px" }}>
                <span style={{ opacity: 0.8 }}>delivered in</span>
                <span style={{ minWidth: "160px", textAlign: "left" }}>
                  <LanguageTicker />
                </span>
              </div>
            </div>

            <div style={{ margin: "32px auto", maxWidth: "400px", opacity: 0.8 }}>
              <HeartbeatLine />
            </div>

            <p style={{ fontSize: "16px", color: "#8a7aaa", maxWidth: "600px", margin: "0 auto 40px", lineHeight: 1.7 }}>
              An AI health-support bot. Describe your symptoms simply by voice or text in 9 languages — get instant assessment, nearby facilities, and generic medicine alternatives.
            </p>

            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(61,184,174,0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/chat")}
                style={{
                  background: "#3db8ae", border: "none", borderRadius: "16px", padding: "16px 40px", cursor: "none",
                  fontFamily: "'JetBrains Mono'", fontSize: "12px", letterSpacing: "1.5px", color: "#090614", fontWeight: 700,
                }}
              >
                START CHAT →
              </motion.button>
            </div>
          </div>
        </RevealCard>

        {/* HOW IT WORKS */}
        <RevealCard delay={0.1} style={{ marginBottom: "24px" }}>
          <div style={{ background: "rgba(16,13,30,0.6)", backdropFilter: "blur(10px)", border: "1px solid rgba(61,184,174,0.1)", borderRadius: "24px", padding: "40px" }}>
            <div style={{ fontFamily: "'JetBrains Mono'", fontSize: "10px", color: "#6b5f84", letterSpacing: "2px", marginBottom: "32px", textAlign: "center" }}>
              HOW IT WORKS
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px" }}>
              {STEPS.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.2 }}
                  style={{
                    padding: "24px", background: "rgba(9,6,20,0.5)", borderRadius: "16px",
                    border: "1px solid rgba(28,23,48,0.8)",
                  }}
                >
                  <div style={{ fontSize: "28px", marginBottom: "16px", filter: "drop-shadow(0 0 10px rgba(255,255,255,0.2))" }}>{s.icon}</div>
                  <div style={{ fontFamily: "'Outfit'", fontSize: "16px", fontWeight: 600, color: "#e8e0f4", marginBottom: "8px" }}>
                    {s.title}
                  </div>
                  <div style={{ fontFamily: "'Outfit'", fontSize: "13px", color: "#8a7aaa", lineHeight: 1.6 }}>
                    {s.desc}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </RevealCard>

        {/* FEATURES GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", marginBottom: "24px" }}>
          {FEATURES.map((f, i) => (
            <RevealCard key={i} delay={0.1 + (i % 3) * 0.1} style={{ height: "100%" }}>
              <motion.div
                whileHover={{ y: -5, borderColor: f.accent ? "rgba(61,184,174,0.4)" : "rgba(120,60,200,0.3)" }}
                style={{
                  background: f.accent ? "linear-gradient(180deg, rgba(61,184,174,0.08), rgba(16,13,30,0.8))" : "rgba(16,13,30,0.6)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(61,184,174,0.1)", borderRadius: "24px", padding: "32px", height: "100%",
                  display: "flex", flexDirection: "column", gap: "16px",
                }}
              >
                <div
                  style={{
                    width: "56px", height: "56px", borderRadius: "16px",
                    background: f.accent ? "rgba(61,184,174,0.15)" : "rgba(255,255,255,0.05)",
                    border: f.accent ? "1px solid rgba(61,184,174,0.3)" : "1px solid rgba(255,255,255,0.1)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px",
                  }}
                >
                  {f.icon}
                </div>
                <div>
                  <div style={{ fontFamily: "'Outfit'", fontSize: "18px", fontWeight: 600, color: "#e8e0f4", marginBottom: "8px" }}>
                    {f.title}
                  </div>
                  <div style={{ fontFamily: "'Outfit'", fontSize: "14px", color: "#8a7aaa", lineHeight: 1.6 }}>
                    {f.desc}
                  </div>
                </div>
              </motion.div>
            </RevealCard>
          ))}
        </div>

        {/* FOOTER */}
        <RevealCard delay={0.2}>
          <div style={{ borderTop: "1px solid rgba(61,184,174,0.1)", padding: "32px 0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <span style={{ fontFamily: "'DM Serif Display'", fontSize: "18px", color: "#6b5f84" }}>
              Arogya<span style={{ color: "#3db8ae", fontStyle: "italic" }}>Bot</span>
            </span>
            <span style={{ fontFamily: "'JetBrains Mono'", fontSize: "10px", color: "#6b5f84", letterSpacing: "1.5px" }}>
              NOT A SUBSTITUTE FOR MEDICAL ADVICE
            </span>
          </div>
        </RevealCard>
      </div>
    </div>
  );
}
