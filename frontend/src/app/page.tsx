"use client";

import { useRef, useEffect, useState, useId } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

/* ══════════════════════════════════════════════════════════════════
   GLOBAL CSS — all component styles injected once on mount
══════════════════════════════════════════════════════════════════ */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=JetBrains+Mono:wght@400;700&family=Outfit:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; }
  a { text-decoration: none; color: inherit; }

  /* ── CSS Variables ─────────────────────────────────────────── */
  :root {
    --teal:   #3db8ae;
    --violet: #7c3ced;
    --crimson:#c0293a;
    --bg:     #090614;
    --card:   #100d1e;
    --border: #1c1730;
    --text:   #e8e0f4;
    --muted:  #6b5f84;
    --dim:    #3a2e60;
    /* GooeyNav particle colours */
    --color-1: #3db8ae;
    --color-2: #7c3ced;
    --color-3: #e8e0f4;
    --color-4: #c0293a;
    --linear-ease: linear(0,0.068,0.19 2.7%,0.804 8.1%,1.037,1.199 13.2%,
      1.245,1.27 15.8%,1.274,1.272 17.4%,1.249 19.1%,0.996 28%,0.949,
      0.928 33.3%,0.926,0.933 36.8%,1.001 45.6%,1.013,1.019 50.8%,
      1.018 54.4%,1 63.1%,0.995 68%,1.001 85%,1);
  }

  /* ── GooeyNav ──────────────────────────────────────────────── */
  .gn-wrap { position: relative; display: flex; align-items: center; }
  .gn-wrap nav { display: flex; position: relative; transform: translate3d(0,0,.01px); }
  .gn-wrap nav ul {
    display: flex; gap: .2em; list-style: none; padding: 0 .4em; margin: 0;
    position: relative; z-index: 3;
  }
  .gn-wrap nav ul li {
    border-radius: 100vw; position: relative; cursor: pointer;
    font-family: 'JetBrains Mono', monospace; font-size: 10px;
    letter-spacing: 1.3px; color: var(--muted);
    transition: color .3s ease;
  }
  .gn-wrap nav ul li a {
    display: inline-block; padding: .55em 1em; color: inherit;
  }
  .gn-wrap nav ul li::after {
    content:''; position:absolute; inset:0; border-radius:100vw;
    background: var(--teal); opacity:0; transform:scale(0);
    transition: all .3s ease; z-index:-1;
  }
  .gn-wrap nav ul li.gn-active { color: var(--bg); }
  .gn-wrap nav ul li.gn-active::after { opacity:1; transform:scale(1); }
  .gn-effect {
    position:absolute; left:0; top:0; width:0; height:0;
    pointer-events:none; display:grid; place-items:center; z-index:1;
  }
  .gn-effect.gn-text {
    color: var(--muted); transition: color .3s ease;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; letter-spacing: 1.3px;
  }
  .gn-effect.gn-text.gn-on { color: var(--bg); }
  .gn-effect.gn-filter {
    filter: blur(7px) contrast(100) blur(0);
    mix-blend-mode: lighten;
  }
  .gn-effect.gn-filter::before {
    content:''; position:absolute; inset:-75px; z-index:-2; background:black;
  }
  .gn-effect.gn-filter::after {
    content:''; position:absolute; inset:0; background: var(--teal);
    transform:scale(0); opacity:0; z-index:-1; border-radius:100vw;
  }
  .gn-effect.gn-on::after { animation: gn-pill .3s ease both; }
  @keyframes gn-pill { to { transform:scale(1); opacity:1; } }

  .gn-ptcl, .gn-dot {
    display:block; opacity:0; width:20px; height:20px;
    border-radius:100%; transform-origin:center;
  }
  .gn-ptcl {
    --time:5s; position:absolute;
    top:calc(50% - 8px); left:calc(50% - 8px);
    animation: gn-particle calc(var(--time)) ease 1 -350ms;
  }
  .gn-dot {
    background: var(--color);
    opacity:1; animation: gn-point calc(var(--time)) ease 1 -350ms;
  }
  @keyframes gn-particle {
    0%  { transform:rotate(0deg) translate(var(--start-x),var(--start-y)); opacity:1;
          animation-timing-function:cubic-bezier(.55,0,1,.45); }
    70% { transform:rotate(calc(var(--rotate)*.5))
          translate(calc(var(--end-x)*1.2),calc(var(--end-y)*1.2)); opacity:1;
          animation-timing-function:ease; }
    85% { transform:rotate(calc(var(--rotate)*.66))
          translate(var(--end-x),var(--end-y)); opacity:1; }
    100%{ transform:rotate(calc(var(--rotate)*1.2))
          translate(calc(var(--end-x)*.5),calc(var(--end-y)*.5)); opacity:1; }
  }
  @keyframes gn-point {
    0%  { transform:scale(0); opacity:0;
          animation-timing-function:cubic-bezier(.55,0,1,.45); }
    25% { transform:scale(calc(var(--scale)*.25)); }
    38% { opacity:1; }
    65% { transform:scale(var(--scale)); opacity:1; animation-timing-function:ease; }
    85% { transform:scale(var(--scale)); opacity:1; }
    100%{ transform:scale(0); opacity:0; }
  }

  /* ── GlassSurface ──────────────────────────────────────────── */
  .gs-outer {
    position:relative; overflow:hidden;
    transition: opacity .26s ease-out;
  }
  .gs-svg-el {
    width:100%; height:100%; pointer-events:none;
    position:absolute; inset:0; opacity:0; z-index:0;
  }
  .gs-inner { width:100%; position:relative; z-index:1; }
  .gs-mode-svg {
    background: hsl(0 0% 0% / var(--glass-frost,0));
    backdrop-filter: var(--filter-id) saturate(var(--glass-sat,1));
    box-shadow:
      0 0 2px 1px color-mix(in oklch,white,transparent 65%) inset,
      0 0 10px 4px color-mix(in oklch,white,transparent 85%) inset,
      0 4px 24px rgba(17,17,26,.04);
  }
  .gs-mode-fallback {
    background: rgba(12,9,24,.68);
    backdrop-filter: blur(18px) saturate(1.35) brightness(.88);
    -webkit-backdrop-filter: blur(18px) saturate(1.35) brightness(.88);
    border: 1px solid rgba(61,184,174,.10);
  }

  /* ── TrueFocus ─────────────────────────────────────────────── */
  .tf-wrap {
    position:relative; display:flex; flex-wrap:wrap;
    align-items:baseline; user-select:none;
    gap: .3em;
  }
  .tf-word {
    position:relative; user-select:none;
    font-family:'DM Serif Display',serif; font-weight:400;
    color: var(--text); letter-spacing:-1.5px; line-height:1.05;
  }
  .tf-frame {
    position:absolute; top:0; left:0;
    pointer-events:none; box-sizing:content-box;
  }
  .tf-c {
    position:absolute; width:14px; height:14px;
    border:2px solid var(--bc,var(--teal));
    filter: drop-shadow(0 0 6px var(--gc,rgba(61,184,174,.7)));
    border-radius:2px;
  }
  .tf-tl { top:-8px; left:-8px; border-right:none; border-bottom:none; }
  .tf-tr { top:-8px; right:-8px; border-left:none; border-bottom:none; }
  .tf-bl { bottom:-8px; left:-8px; border-right:none; border-top:none; }
  .tf-br { bottom:-8px; right:-8px; border-left:none; border-top:none; }

  /* ── LightPillar ───────────────────────────────────────────── */
  .lp-host { width:100%; height:100%; position:absolute; top:0; left:0; pointer-events:none; }

  /* ── Scrollbar ─────────────────────────────────────────────── */
  ::-webkit-scrollbar { width:6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--dim); border-radius:3px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--teal); }
`;

function useInjectCSS() {
  useEffect(() => {
    if (document.getElementById("__ab_styles__")) return;
    const el = document.createElement("style");
    el.id = "__ab_styles__";
    el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);
    return () => { document.getElementById("__ab_styles__")?.remove(); };
  }, []);
}

/* ══════════════════════════════════════════════════════════════════
   COMPONENT 1 — GOOEY NAV
══════════════════════════════════════════════════════════════════ */
function GooeyNav({
  items,
  animationTime  = 600,
  particleCount  = 15,
  particleDistances = [90, 10],
  particleR      = 100,
  timeVariance   = 300,
  colors         = [1, 2, 3, 1, 2, 3, 1, 4],
  initialActiveIndex = 0,
}) {
  const containerRef = useRef(null);
  const navRef       = useRef(null);
  const filterRef    = useRef(null);
  const textRef      = useRef(null);
  const [active, setActive] = useState(initialActiveIndex);

  const noise  = (n = 1) => n / 2 - Math.random() * n;
  const getXY  = (dist, idx, total) => {
    const a = ((360 + noise(8)) / total) * idx * (Math.PI / 180);
    return [dist * Math.cos(a), dist * Math.sin(a)];
  };
  const mkPart = (i, t, d, r) => {
    const rotate = noise(r / 10);
    return {
      start: getXY(d[0], particleCount - i, particleCount),
      end:   getXY(d[1] + noise(7), particleCount - i, particleCount),
      time:  t,
      scale: 1 + noise(0.2),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10,
    };
  };

  const makeParticles = (el) => {
    const d = particleDistances, r = particleR;
    el.style.setProperty("--time", `${animationTime * 2 + timeVariance}ms`);
    for (let i = 0; i < particleCount; i++) {
      const t = animationTime * 2 + noise(timeVariance * 2);
      const p = mkPart(i, t, d, r);
      el.classList.remove("gn-on");
      setTimeout(() => {
        const ptcl = document.createElement("span");
        const dot  = document.createElement("span");
        ptcl.classList.add("gn-ptcl");
        ptcl.style.setProperty("--start-x", `${p.start[0]}px`);
        ptcl.style.setProperty("--start-y", `${p.start[1]}px`);
        ptcl.style.setProperty("--end-x",   `${p.end[0]}px`);
        ptcl.style.setProperty("--end-y",   `${p.end[1]}px`);
        ptcl.style.setProperty("--time",    `${p.time}ms`);
        ptcl.style.setProperty("--scale",   `${p.scale}`);
        ptcl.style.setProperty("--color",   `var(--color-${p.color},#3db8ae)`);
        ptcl.style.setProperty("--rotate",  `${p.rotate}deg`);
        dot.classList.add("gn-dot");
        ptcl.appendChild(dot);
        el.appendChild(ptcl);
        requestAnimationFrame(() => el.classList.add("gn-on"));
        setTimeout(() => { try { el.removeChild(ptcl); } catch {} }, t);
      }, 30);
    }
  };

  const updatePos = (li) => {
    if (!containerRef.current || !filterRef.current || !textRef.current) return;
    const cr  = containerRef.current.getBoundingClientRect();
    const pos = li.getBoundingClientRect();
    const s   = { left:`${pos.x-cr.x}px`, top:`${pos.y-cr.y}px`, width:`${pos.width}px`, height:`${pos.height}px` };
    Object.assign(filterRef.current.style, s);
    Object.assign(textRef.current.style,   s);
    textRef.current.innerText = li.innerText;
  };

  const handleClick = (e, idx) => {
    const li = e.currentTarget;
    if (active === idx) return;
    setActive(idx);
    updatePos(li);
    filterRef.current?.querySelectorAll(".gn-ptcl").forEach(p => filterRef.current.removeChild(p));
    if (textRef.current) {
      textRef.current.classList.remove("gn-on");
      void textRef.current.offsetWidth;
      textRef.current.classList.add("gn-on");
    }
    makeParticles(filterRef.current);
  };

  useEffect(() => {
    if (!navRef.current || !containerRef.current) return;
    const li = navRef.current.querySelectorAll("li")[active];
    if (li) { updatePos(li); textRef.current?.classList.add("gn-on"); }
    const ro = new ResizeObserver(() => {
      const cur = navRef.current?.querySelectorAll("li")[active];
      if (cur) updatePos(cur);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [active]);

  return (
    <div className="gn-wrap" ref={containerRef}>
      <nav>
        <ul ref={navRef}>
          {items.map((item, i) => (
            <li key={i} className={active === i ? "gn-active" : ""}>
              <a href={item.href} onClick={e => handleClick(e, i)}>{item.label}</a>
            </li>
          ))}
        </ul>
      </nav>
      <span className="gn-effect gn-filter" ref={filterRef} />
      <span className="gn-effect gn-text"   ref={textRef} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   COMPONENT 2 — GLASS SURFACE
══════════════════════════════════════════════════════════════════ */
function GlassSurface({
  children,
  width          = "100%",
  height         = "auto",
  borderRadius   = 20,
  borderWidth    = 0.07,
  brightness     = 28,
  opacity        = 0.86,
  blur           = 10,
  displace       = 0,
  backgroundOpacity = 0.1,
  saturation     = 1.15,
  distortionScale = -140,
  redOffset      = 0,
  greenOffset    = 10,
  blueOffset     = 20,
  xChannel       = "R",
  yChannel       = "G",
  mixBlendMode   = "difference",
  className      = "",
  style          = {},
}) {
  const uid       = useId().replace(/:/g, "-");
  const filterId  = `gsf-${uid}`;
  const redGid    = `gsr-${uid}`;
  const blueGid   = `gsb-${uid}`;
  const [svgOk, setSvgOk] = useState(false);
  const containerRef = useRef(null);
  const feImgRef     = useRef(null);
  const redRef       = useRef(null);
  const greenRef     = useRef(null);
  const blueRef      = useRef(null);
  const gaussRef     = useRef(null);

  const genMap = () => {
    const rect = containerRef.current?.getBoundingClientRect();
    const w = rect?.width  || 600;
    const h = rect?.height || 300;
    const e = Math.min(w, h) * (borderWidth * 0.5);
    const svg = `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="${redGid}" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#0000"/><stop offset="100%" stop-color="red"/>
        </linearGradient>
        <linearGradient id="${blueGid}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#0000"/><stop offset="100%" stop-color="blue"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="${w}" height="${h}" fill="black"/>
      <rect x="0" y="0" width="${w}" height="${h}" rx="${borderRadius}" fill="url(#${redGid})"/>
      <rect x="0" y="0" width="${w}" height="${h}" rx="${borderRadius}" fill="url(#${blueGid})"
            style="mix-blend-mode:${mixBlendMode}"/>
      <rect x="${e}" y="${e}" width="${w-e*2}" height="${h-e*2}" rx="${borderRadius}"
            fill="hsl(0 0% ${brightness}% / ${opacity})"
            style="filter:blur(${blur}px)"/>
    </svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  };

  const upd = () => {
    feImgRef.current?.setAttribute("href", genMap());
    [{ref:redRef,off:redOffset},{ref:greenRef,off:greenOffset},{ref:blueRef,off:blueOffset}]
      .forEach(({ref,off}) => {
        if (!ref.current) return;
        ref.current.setAttribute("scale", (distortionScale+off).toString());
        ref.current.setAttribute("xChannelSelector", xChannel);
        ref.current.setAttribute("yChannelSelector", yChannel);
      });
    gaussRef.current?.setAttribute("stdDeviation", displace.toString());
  };

  useEffect(() => {
    upd();
    if (!containerRef.current) return;
    const ro = new ResizeObserver(() => setTimeout(upd, 0));
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brightness,opacity,blur,distortionScale,redOffset,greenOffset,blueOffset,xChannel,yChannel,mixBlendMode]);

  useEffect(() => {
    const isWk = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    const isFF = /Firefox/.test(navigator.userAgent);
    if (isWk || isFF) return;
    const div = document.createElement("div");
    div.style.backdropFilter = `url(#${filterId})`;
    setSvgOk(div.style.backdropFilter !== "");
  }, [filterId]);

  const cs = {
    ...style,
    width:  typeof width  === "number" ? `${width}px`  : width,
    height: typeof height === "number" ? `${height}px` : height,
    borderRadius: `${borderRadius}px`,
    "--glass-frost": backgroundOpacity,
    "--glass-sat":   saturation,
    "--filter-id":   `url(#${filterId})`,
  };

  return (
    <div ref={containerRef}
         className={`gs-outer ${svgOk ? "gs-mode-svg" : "gs-mode-fallback"} ${className}`}
         style={cs}>
      <svg className="gs-svg-el" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB"
                  x="0%" y="0%" width="100%" height="100%">
            <feImage ref={feImgRef} x="0" y="0" width="100%" height="100%"
                     preserveAspectRatio="none" result="map"/>
            <feDisplacementMap ref={redRef}   in="SourceGraphic" in2="map" result="dr"/>
            <feColorMatrix in="dr" type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red"/>
            <feDisplacementMap ref={greenRef} in="SourceGraphic" in2="map" result="dg"/>
            <feColorMatrix in="dg" type="matrix"
              values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green"/>
            <feDisplacementMap ref={blueRef}  in="SourceGraphic" in2="map" result="db"/>
            <feColorMatrix in="db" type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue"/>
            <feBlend in="red" in2="green" mode="screen" result="rg"/>
            <feBlend in="rg"  in2="blue"  mode="screen" result="out"/>
            <feGaussianBlur ref={gaussRef} in="out" stdDeviation="0.7"/>
          </filter>
        </defs>
      </svg>
      <div className="gs-inner">{children}</div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   COMPONENT 3 — TRUE FOCUS
══════════════════════════════════════════════════════════════════ */
function TrueFocus({
  sentence   = "Healthcare Guidance",
  separator  = " ",
  manualMode = false,
  blurAmount = 4,
  borderColor= "#3db8ae",
  glowColor  = "rgba(61,184,174,0.75)",
  duration   = 0.55,
  pause      = 1.4,
  fontSize   = "clamp(32px,6vw,64px)",
}) {
  const words   = sentence.split(separator);
  const [idx, setIdx] = useState(0);
  const [last, setLast] = useState(null);
  const wrapRef = useRef(null);
  const wRefs   = useRef([]);
  const [rect, setRect] = useState({ x:0, y:0, w:0, h:0 });

  useEffect(() => {
    if (manualMode) return;
    const t = setInterval(() => setIdx(p => (p+1) % words.length),
                          (duration + pause) * 1000);
    return () => clearInterval(t);
  }, [manualMode, duration, pause, words.length]);

  useEffect(() => {
    if (!wRefs.current[idx] || !wrapRef.current) return;
    const pr = wrapRef.current.getBoundingClientRect();
    const ar = wRefs.current[idx].getBoundingClientRect();
    setRect({ x: ar.left-pr.left, y: ar.top-pr.top, w: ar.width, h: ar.height });
  }, [idx]);

  return (
    <div className="tf-wrap" ref={wrapRef}>
      {words.map((w, i) => (
        <span key={i}
              ref={el => wRefs.current[i] = el}
              className="tf-word"
              style={{
                fontSize,
                filter: i===idx ? "blur(0)" : `blur(${blurAmount}px)`,
                transition: `filter ${duration}s ease`,
                "--bc": borderColor, "--gc": glowColor,
              }}
              onMouseEnter={() => manualMode && (setLast(i), setIdx(i))}
              onMouseLeave={() => manualMode && setIdx(last)}>
          {w}
        </span>
      ))}
      <motion.div className="tf-frame"
        animate={{ x:rect.x, y:rect.y, width:rect.w, height:rect.h, opacity:1 }}
        transition={{ duration }}
        style={{ "--bc": borderColor, "--gc": glowColor }}>
        <span className="tf-c tf-tl"/><span className="tf-c tf-tr"/>
        <span className="tf-c tf-bl"/><span className="tf-c tf-br"/>
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   COMPONENT 4 — SPLASH CURSOR (WebGL fluid)
══════════════════════════════════════════════════════════════════ */
function SplashCursor({
  SIM_RESOLUTION     = 128,
  DYE_RESOLUTION     = 1440,
  CAPTURE_RESOLUTION = 512,
  DENSITY_DISSIPATION= 3.5,
  VELOCITY_DISSIPATION=2,
  PRESSURE           = 0.1,
  PRESSURE_ITERATIONS= 20,
  CURL               = 3,
  SPLAT_RADIUS       = 0.2,
  SPLAT_FORCE        = 6000,
  SHADING            = true,
  COLOR_UPDATE_SPEED = 10,
  BACK_COLOR         = { r:0.5, g:0, b:0 },
  TRANSPARENT        = true,
  RAINBOW_MODE       = true,
  COLOR              = "#3db8ae",
}) {
  const canvasRef    = useRef(null);
  const frameIdRef   = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let isActive = true;

    function PP() {
      this.id=-1; this.texcoordX=0; this.texcoordY=0;
      this.prevTexcoordX=0; this.prevTexcoordY=0;
      this.deltaX=0; this.deltaY=0;
      this.down=false; this.moved=false; this.color=[0,0,0];
    }

    let config = {
      SIM_RESOLUTION,DYE_RESOLUTION,CAPTURE_RESOLUTION,
      DENSITY_DISSIPATION,VELOCITY_DISSIPATION,PRESSURE,
      PRESSURE_ITERATIONS,CURL,SPLAT_RADIUS,SPLAT_FORCE,
      SHADING,COLOR_UPDATE_SPEED,PAUSED:false,
      BACK_COLOR,TRANSPARENT,RAINBOW_MODE,COLOR
    };
    let pointers = [new PP()];

    const {gl,ext} = (function getCtx(c) {
      const p = {alpha:true,depth:false,stencil:false,antialias:false,preserveDrawingBuffer:false};
      let g = c.getContext("webgl2",p);
      const isGL2 = !!g;
      if (!isGL2) g = c.getContext("webgl",p)||c.getContext("experimental-webgl",p);
      let hf, lf;
      if (isGL2){ g.getExtension("EXT_color_buffer_float"); lf=g.getExtension("OES_texture_float_linear"); }
      else { hf=g.getExtension("OES_texture_half_float"); lf=g.getExtension("OES_texture_half_float_linear"); }
      g.clearColor(0,0,0,1);
      const ht = isGL2 ? g.HALF_FLOAT : hf&&hf.HALF_FLOAT_OES;
      const gSF=(g,i,f,t)=>{
        if (!((x,i,f,t)=>{
          const tx=g.createTexture(); g.bindTexture(g.TEXTURE_2D,tx);
          g.texParameteri(g.TEXTURE_2D,g.TEXTURE_MIN_FILTER,g.NEAREST);
          g.texParameteri(g.TEXTURE_2D,g.TEXTURE_MAG_FILTER,g.NEAREST);
          g.texParameteri(g.TEXTURE_2D,g.TEXTURE_WRAP_S,g.CLAMP_TO_EDGE);
          g.texParameteri(g.TEXTURE_2D,g.TEXTURE_WRAP_T,g.CLAMP_TO_EDGE);
          g.texImage2D(g.TEXTURE_2D,0,i,4,4,0,f,t,null);
          const fb=g.createFramebuffer(); g.bindFramebuffer(g.FRAMEBUFFER,fb);
          g.framebufferTexture2D(g.FRAMEBUFFER,g.COLOR_ATTACHMENT0,g.TEXTURE_2D,tx,0);
          return g.checkFramebufferStatus(g.FRAMEBUFFER)===g.FRAMEBUFFER_COMPLETE;
        })(g,i,f,t)){
          if(i===g.R16F)   return gSF(g,g.RG16F,g.RG,t);
          if(i===g.RG16F)  return gSF(g,g.RGBA16F,g.RGBA,t);
          return null;
        }
        return {internalFormat:i,format:f};
      };
      let fRGBA,fRG,fR;
      if(isGL2){
        fRGBA=gSF(g,g.RGBA16F,g.RGBA,ht);
        fRG  =gSF(g,g.RG16F,  g.RG,  ht);
        fR   =gSF(g,g.R16F,   g.RED, ht);
      } else {
        fRGBA=gSF(g,g.RGBA,g.RGBA,ht);
        fRG  =gSF(g,g.RGBA,g.RGBA,ht);
        fR   =gSF(g,g.RGBA,g.RGBA,ht);
      }
      return {gl:g,ext:{formatRGBA:fRGBA,formatRG:fRG,formatR:fR,halfFloatTexType:ht,supportLinearFiltering:lf}};
    })(canvas);

    if (!gl) return;
    if (!ext.supportLinearFiltering){ config.DYE_RESOLUTION=256; config.SHADING=false; }

    class Material {
      constructor(vs,fs){ this.vs=vs; this.fsrc=fs; this.programs=[]; this.active=null; this.uniforms=[]; }
      setKeywords(kw){
        let h=0; for(let i=0;i<kw.length;i++) h+=hc(kw[i]);
        let pr=this.programs[h];
        if(!pr){ pr=mkProg(this.vs,compSh(gl.FRAGMENT_SHADER,this.fsrc,kw)); this.programs[h]=pr; }
        if(pr===this.active) return;
        this.uniforms=getU(pr); this.active=pr;
      }
      bind(){ gl.useProgram(this.active); }
    }
    class Program {
      constructor(vs,fs){ this.uniforms={}; this.program=mkProg(vs,fs); this.uniforms=getU(this.program); }
      bind(){ gl.useProgram(this.program); }
    }
    const mkProg=(vs,fs)=>{ const p=gl.createProgram(); gl.attachShader(p,vs); gl.attachShader(p,fs); gl.linkProgram(p); return p; };
    const getU=(p)=>{ const u=[],n=gl.getProgramParameter(p,gl.ACTIVE_UNIFORMS); for(let i=0;i<n;i++){const nm=gl.getActiveUniform(p,i).name; u[nm]=gl.getUniformLocation(p,nm);} return u; };
    const compSh=(t,src,kw)=>{ if(kw){let ks=""; kw.forEach(k=>ks+="#define "+k+"\n"); src=ks+src;} const s=gl.createShader(t); gl.shaderSource(s,src); gl.compileShader(s); return s; };
    const hc=(s)=>{ if(!s.length)return 0; let h=0; for(let i=0;i<s.length;i++){h=(h<<5)-h+s.charCodeAt(i);h|=0;} return h; };

    const baseVS=compSh(gl.VERTEX_SHADER,`precision highp float;attribute vec2 aPosition;varying vec2 vUv;varying vec2 vL;varying vec2 vR;varying vec2 vT;varying vec2 vB;uniform vec2 texelSize;void main(){vUv=aPosition*.5+.5;vL=vUv-vec2(texelSize.x,0.);vR=vUv+vec2(texelSize.x,0.);vT=vUv+vec2(0.,texelSize.y);vB=vUv-vec2(0.,texelSize.y);gl_Position=vec4(aPosition,0.,1.);}`);
    const copySh=compSh(gl.FRAGMENT_SHADER,`precision mediump float;precision mediump sampler2D;varying highp vec2 vUv;uniform sampler2D uTexture;void main(){gl_FragColor=texture2D(uTexture,vUv);}`);
    const clrSh=compSh(gl.FRAGMENT_SHADER,`precision mediump float;precision mediump sampler2D;varying highp vec2 vUv;uniform sampler2D uTexture;uniform float value;void main(){gl_FragColor=value*texture2D(uTexture,vUv);}`);
    const dispFS=`precision highp float;precision highp sampler2D;varying vec2 vUv;varying vec2 vL;varying vec2 vR;varying vec2 vT;varying vec2 vB;uniform sampler2D uTexture;uniform sampler2D uDithering;uniform vec2 ditherScale;uniform vec2 texelSize;vec3 ltg(vec3 c){c=max(c,vec3(0));return max(1.055*pow(c,vec3(.4166))-.055,vec3(0));}void main(){vec3 c=texture2D(uTexture,vUv).rgb;#ifdef SHADING vec3 lc=texture2D(uTexture,vL).rgb;vec3 rc=texture2D(uTexture,vR).rgb;vec3 tc=texture2D(uTexture,vT).rgb;vec3 bc=texture2D(uTexture,vB).rgb;float dx=length(rc)-length(lc);float dy=length(tc)-length(bc);vec3 n=normalize(vec3(dx,dy,length(texelSize)));vec3 l=vec3(0.,0.,1.);float d=clamp(dot(n,l)+.7,.7,1.);c*=d;#endif float a=max(c.r,max(c.g,c.b));gl_FragColor=vec4(c,a);}`;
    const splatSh=compSh(gl.FRAGMENT_SHADER,`precision highp float;precision highp sampler2D;varying vec2 vUv;uniform sampler2D uTarget;uniform float aspectRatio;uniform vec3 color;uniform vec2 point;uniform float radius;void main(){vec2 p=vUv-point.xy;p.x*=aspectRatio;vec3 sp=exp(-dot(p,p)/radius)*color;vec3 b=texture2D(uTarget,vUv).xyz;gl_FragColor=vec4(b+sp,1.);}`);
    const advSh=compSh(gl.FRAGMENT_SHADER,`precision highp float;precision highp sampler2D;varying vec2 vUv;uniform sampler2D uVelocity;uniform sampler2D uSource;uniform vec2 texelSize;uniform vec2 dyeTexelSize;uniform float dt;uniform float dissipation;vec4 bilerp(sampler2D s,vec2 uv,vec2 ts){vec2 st=uv/ts-.5;vec2 iuv=floor(st);vec2 fuv=fract(st);vec4 a=texture2D(s,(iuv+vec2(.5,.5))*ts);vec4 b=texture2D(s,(iuv+vec2(1.5,.5))*ts);vec4 c=texture2D(s,(iuv+vec2(.5,1.5))*ts);vec4 d=texture2D(s,(iuv+vec2(1.5,1.5))*ts);return mix(mix(a,b,fuv.x),mix(c,d,fuv.x),fuv.y);}void main(){#ifdef MANUAL_FILTERING vec2 coord=vUv-dt*bilerp(uVelocity,vUv,texelSize).xy*texelSize;vec4 res=bilerp(uSource,coord,dyeTexelSize);#else vec2 coord=vUv-dt*texture2D(uVelocity,vUv).xy*texelSize;vec4 res=texture2D(uSource,coord);#endif float decay=1.+dissipation*dt;gl_FragColor=res/decay;}`,ext.supportLinearFiltering?null:["MANUAL_FILTERING"]);
    const divSh=compSh(gl.FRAGMENT_SHADER,`precision mediump float;precision mediump sampler2D;varying highp vec2 vUv;varying highp vec2 vL;varying highp vec2 vR;varying highp vec2 vT;varying highp vec2 vB;uniform sampler2D uVelocity;void main(){float L=texture2D(uVelocity,vL).x;float R=texture2D(uVelocity,vR).x;float T=texture2D(uVelocity,vT).y;float B=texture2D(uVelocity,vB).y;vec2 C=texture2D(uVelocity,vUv).xy;if(vL.x<0.){L=-C.x;}if(vR.x>1.){R=-C.x;}if(vT.y>1.){T=-C.y;}if(vB.y<0.){B=-C.y;}float div=.5*(R-L+T-B);gl_FragColor=vec4(div,0.,0.,1.);}`);
    const curlSh=compSh(gl.FRAGMENT_SHADER,`precision mediump float;precision mediump sampler2D;varying highp vec2 vUv;varying highp vec2 vL;varying highp vec2 vR;varying highp vec2 vT;varying highp vec2 vB;uniform sampler2D uVelocity;void main(){float L=texture2D(uVelocity,vL).y;float R=texture2D(uVelocity,vR).y;float T=texture2D(uVelocity,vT).x;float B=texture2D(uVelocity,vB).x;float v=R-L-T+B;gl_FragColor=vec4(.5*v,0.,0.,1.);}`);
    const vortSh=compSh(gl.FRAGMENT_SHADER,`precision highp float;precision highp sampler2D;varying vec2 vUv;varying vec2 vL;varying vec2 vR;varying vec2 vT;varying vec2 vB;uniform sampler2D uVelocity;uniform sampler2D uCurl;uniform float curl;uniform float dt;void main(){float L=texture2D(uCurl,vL).x;float R=texture2D(uCurl,vR).x;float T=texture2D(uCurl,vT).x;float B=texture2D(uCurl,vB).x;float C=texture2D(uCurl,vUv).x;vec2 f=.5*vec2(abs(T)-abs(B),abs(R)-abs(L));f/=length(f)+.0001;f*=curl*C;f.y*=-1.;vec2 v=texture2D(uVelocity,vUv).xy;v+=f*dt;v=min(max(v,-1000.),1000.);gl_FragColor=vec4(v,0.,1.);}`);
    const presSh=compSh(gl.FRAGMENT_SHADER,`precision mediump float;precision mediump sampler2D;varying highp vec2 vUv;varying highp vec2 vL;varying highp vec2 vR;varying highp vec2 vT;varying highp vec2 vB;uniform sampler2D uPressure;uniform sampler2D uDivergence;void main(){float L=texture2D(uPressure,vL).x;float R=texture2D(uPressure,vR).x;float T=texture2D(uPressure,vT).x;float B=texture2D(uPressure,vB).x;float C=texture2D(uPressure,vUv).x;float d=texture2D(uDivergence,vUv).x;float p=(L+R+B+T-d)*.25;gl_FragColor=vec4(p,0.,0.,1.);}`);
    const gradSh=compSh(gl.FRAGMENT_SHADER,`precision mediump float;precision mediump sampler2D;varying highp vec2 vUv;varying highp vec2 vL;varying highp vec2 vR;varying highp vec2 vT;varying highp vec2 vB;uniform sampler2D uPressure;uniform sampler2D uVelocity;void main(){float L=texture2D(uPressure,vL).x;float R=texture2D(uPressure,vR).x;float T=texture2D(uPressure,vT).x;float B=texture2D(uPressure,vB).x;vec2 v=texture2D(uVelocity,vUv).xy;v.xy-=vec2(R-L,T-B);gl_FragColor=vec4(v,0.,1.);}`);

    const blit = (() => {
      gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),gl.STATIC_DRAW);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,gl.createBuffer());
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3]),gl.STATIC_DRAW);
      gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
      gl.enableVertexAttribArray(0);
      return (t,clear=false) => {
        if(t==null){ gl.viewport(0,0,gl.drawingBufferWidth,gl.drawingBufferHeight); gl.bindFramebuffer(gl.FRAMEBUFFER,null); }
        else{ gl.viewport(0,0,t.width,t.height); gl.bindFramebuffer(gl.FRAMEBUFFER,t.fbo); }
        if(clear){gl.clearColor(0,0,0,1);gl.clear(gl.COLOR_BUFFER_BIT);}
        gl.drawElements(gl.TRIANGLES,6,gl.UNSIGNED_SHORT,0);
      };
    })();

    const mkFBO=(w,h,iF,f,t,p)=>{
      gl.activeTexture(gl.TEXTURE0); const tx=gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D,tx);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,p);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,p);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D,0,iF,w,h,0,f,t,null);
      const fb=gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER,fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,tx,0);
      gl.viewport(0,0,w,h); gl.clear(gl.COLOR_BUFFER_BIT);
      return {texture:tx,fbo:fb,width:w,height:h,texelSizeX:1/w,texelSizeY:1/h,attach(id){gl.activeTexture(gl.TEXTURE0+id);gl.bindTexture(gl.TEXTURE_2D,tx);return id;}};
    };
    const mkDFBO=(w,h,iF,f,t,p)=>{
      let a=mkFBO(w,h,iF,f,t,p),b=mkFBO(w,h,iF,f,t,p);
      return {width:w,height:h,texelSizeX:a.texelSizeX,texelSizeY:a.texelSizeY,get read(){return a;},set read(v){a=v;},get write(){return b;},set write(v){b=v;},swap(){let tmp=a;a=b;b=tmp;}};
    };
    const resFBO=(t,w,h,iF,f,tp,p)=>{
      const n=mkFBO(w,h,iF,f,tp,p);
      copyP.bind(); gl.uniform1i(copyP.uniforms.uTexture,t.attach(0)); blit(n); return n;
    };
    const resDFBO=(t,w,h,iF,f,tp,p)=>{
      if(t.width===w&&t.height===h) return t;
      t.read=resFBO(t.read,w,h,iF,f,tp,p);
      t.write=mkFBO(w,h,iF,f,tp,p);
      t.width=w;t.height=h;t.texelSizeX=1/w;t.texelSizeY=1/h; return t;
    };

    const copyP   = new Program(baseVS,copySh);
    const clearP  = new Program(baseVS,clrSh);
    const splatP  = new Program(baseVS,splatSh);
    const advP    = new Program(baseVS,advSh);
    const divP    = new Program(baseVS,divSh);
    const curlP   = new Program(baseVS,curlSh);
    const vortP   = new Program(baseVS,vortSh);
    const presP   = new Program(baseVS,presSh);
    const gradP   = new Program(baseVS,gradSh);
    const dispM   = new Material(baseVS,dispFS);

    let dye,vel,divergence,curl2,pressure;
    const getRes=(r)=>{
      let ar=gl.drawingBufferWidth/gl.drawingBufferHeight;
      if(ar<1)ar=1/ar;
      const mn=Math.round(r),mx=Math.round(r*ar);
      return gl.drawingBufferWidth>gl.drawingBufferHeight?{width:mx,height:mn}:{width:mn,height:mx};
    };
    const scaleByPR=(n)=>Math.floor(n*(window.devicePixelRatio||1));

    const initFBOs=()=>{
      const sr=getRes(config.SIM_RESOLUTION),dr=getRes(config.DYE_RESOLUTION);
      const tt=ext.halfFloatTexType,rgba=ext.formatRGBA,rg=ext.formatRG,r=ext.formatR;
      const flt=ext.supportLinearFiltering?gl.LINEAR:gl.NEAREST;
      gl.disable(gl.BLEND);
      dye      = dye      ? resDFBO(dye,dr.width,dr.height,rgba.internalFormat,rgba.format,tt,flt) : mkDFBO(dr.width,dr.height,rgba.internalFormat,rgba.format,tt,flt);
      vel      = vel      ? resDFBO(vel,sr.width,sr.height,rg.internalFormat,rg.format,tt,flt) : mkDFBO(sr.width,sr.height,rg.internalFormat,rg.format,tt,flt);
      divergence= mkFBO(sr.width,sr.height,r.internalFormat,r.format,tt,gl.NEAREST);
      curl2    = mkFBO(sr.width,sr.height,r.internalFormat,r.format,tt,gl.NEAREST);
      pressure = mkDFBO(sr.width,sr.height,r.internalFormat,r.format,tt,gl.NEAREST);
    };

    const genColor=()=>{
      if(!config.RAINBOW_MODE){
        const v=config.COLOR.replace("#","");
        const R=parseInt(v.slice(0,2),16)/255,G=parseInt(v.slice(2,4),16)/255,B=parseInt(v.slice(4,6),16)/255;
        return {r:R*.15,g:G*.15,b:B*.15};
      }
      const c=(h,s,v)=>{
        let r,g,b,i=Math.floor(h*6),f=h*6-i,p=v*(1-s),q=v*(1-f*s),t2=v*(1-(1-f)*s);
        switch(i%6){case 0:r=v;g=t2;b=p;break;case 1:r=q;g=v;b=p;break;case 2:r=p;g=v;b=t2;break;case 3:r=p;g=q;b=v;break;case 4:r=t2;g=p;b=v;break;default:r=v;g=p;b=q;}
        return {r:r*.15,g:g*.15,b:b*.15};
      };
      return c(Math.random(),1,1);
    };

    const splat=(x,y,dx,dy,color)=>{
      splatP.bind();
      gl.uniform1i(splatP.uniforms.uTarget,vel.read.attach(0));
      gl.uniform1f(splatP.uniforms.aspectRatio,canvas.width/canvas.height);
      gl.uniform2f(splatP.uniforms.point,x,y);
      gl.uniform3f(splatP.uniforms.color,dx,dy,0);
      gl.uniform1f(splatP.uniforms.radius,(r=>{let ar=canvas.width/canvas.height;if(ar>1)r*=ar;return r;})(config.SPLAT_RADIUS/100));
      blit(vel.write); vel.swap();
      gl.uniform1i(splatP.uniforms.uTarget,dye.read.attach(0));
      gl.uniform3f(splatP.uniforms.color,color.r,color.g,color.b);
      blit(dye.write); dye.swap();
    };

    let colorTimer=0,lastT=Date.now();
    const resizeCanvas=()=>{
      const w=scaleByPR(canvas.clientWidth),h=scaleByPR(canvas.clientHeight);
      if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;return true;}
      return false;
    };

    const step=(dt)=>{
      gl.disable(gl.BLEND);
      curlP.bind(); gl.uniform2f(curlP.uniforms.texelSize,vel.texelSizeX,vel.texelSizeY); gl.uniform1i(curlP.uniforms.uVelocity,vel.read.attach(0)); blit(curl2);
      vortP.bind(); gl.uniform2f(vortP.uniforms.texelSize,vel.texelSizeX,vel.texelSizeY); gl.uniform1i(vortP.uniforms.uVelocity,vel.read.attach(0)); gl.uniform1i(vortP.uniforms.uCurl,curl2.attach(1)); gl.uniform1f(vortP.uniforms.curl,config.CURL); gl.uniform1f(vortP.uniforms.dt,dt); blit(vel.write); vel.swap();
      divP.bind();  gl.uniform2f(divP.uniforms.texelSize,vel.texelSizeX,vel.texelSizeY); gl.uniform1i(divP.uniforms.uVelocity,vel.read.attach(0)); blit(divergence);
      clearP.bind();gl.uniform1i(clearP.uniforms.uTexture,pressure.read.attach(0)); gl.uniform1f(clearP.uniforms.value,config.PRESSURE); blit(pressure.write); pressure.swap();
      presP.bind(); gl.uniform2f(presP.uniforms.texelSize,vel.texelSizeX,vel.texelSizeY); gl.uniform1i(presP.uniforms.uDivergence,divergence.attach(0));
      for(let i=0;i<config.PRESSURE_ITERATIONS;i++){gl.uniform1i(presP.uniforms.uPressure,pressure.read.attach(1));blit(pressure.write);pressure.swap();}
      gradP.bind(); gl.uniform2f(gradP.uniforms.texelSize,vel.texelSizeX,vel.texelSizeY); gl.uniform1i(gradP.uniforms.uPressure,pressure.read.attach(0)); gl.uniform1i(gradP.uniforms.uVelocity,vel.read.attach(1)); blit(vel.write); vel.swap();
      advP.bind();  gl.uniform2f(advP.uniforms.texelSize,vel.texelSizeX,vel.texelSizeY);
      if(!ext.supportLinearFiltering)gl.uniform2f(advP.uniforms.dyeTexelSize,vel.texelSizeX,vel.texelSizeY);
      const vi=vel.read.attach(0); gl.uniform1i(advP.uniforms.uVelocity,vi); gl.uniform1i(advP.uniforms.uSource,vi); gl.uniform1f(advP.uniforms.dt,dt); gl.uniform1f(advP.uniforms.dissipation,config.VELOCITY_DISSIPATION); blit(vel.write); vel.swap();
      if(!ext.supportLinearFiltering)gl.uniform2f(advP.uniforms.dyeTexelSize,dye.texelSizeX,dye.texelSizeY);
      gl.uniform1i(advP.uniforms.uVelocity,vel.read.attach(0)); gl.uniform1i(advP.uniforms.uSource,dye.read.attach(1)); gl.uniform1f(advP.uniforms.dissipation,config.DENSITY_DISSIPATION); blit(dye.write); dye.swap();
    };

    dispM.setKeywords(config.SHADING?["SHADING"]:[]);
    initFBOs();

    const frame=()=>{
      if(!isActive) return;
      const now=Date.now(),dt=Math.min((now-lastT)/1000,.01667); lastT=now;
      if(resizeCanvas()) initFBOs();
      colorTimer+=dt*config.COLOR_UPDATE_SPEED;
      if(colorTimer>=1){colorTimer=0;pointers.forEach(p=>{p.color=genColor();});}
      pointers.forEach(p=>{if(p.moved){p.moved=false;splat(p.texcoordX,p.texcoordY,p.deltaX*config.SPLAT_FORCE,p.deltaY*config.SPLAT_FORCE,p.color);}});
      step(dt);
      gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA); gl.enable(gl.BLEND);
      const w=gl.drawingBufferWidth,h=gl.drawingBufferHeight;
      dispM.bind();
      if(config.SHADING)gl.uniform2f(dispM.uniforms.texelSize,1/w,1/h);
      gl.uniform1i(dispM.uniforms.uTexture,dye.read.attach(0));
      gl.viewport(0,0,w,h); gl.bindFramebuffer(gl.FRAMEBUFFER,null);
      gl.drawElements(gl.TRIANGLES,6,gl.UNSIGNED_SHORT,0);
      frameIdRef.current=requestAnimationFrame(frame);
    };
    frameIdRef.current=requestAnimationFrame(frame);

    const upd=(ptr,x,y)=>{
      ptr.prevTexcoordX=ptr.texcoordX; ptr.prevTexcoordY=ptr.texcoordY;
      ptr.texcoordX=x/canvas.width; ptr.texcoordY=1-(y/canvas.height);
      const dx=(ptr.texcoordX-ptr.prevTexcoordX)*(canvas.width/canvas.height>1?1:canvas.width/canvas.height);
      const dy=(ptr.texcoordY-ptr.prevTexcoordY)*(canvas.width/canvas.height>1?1/canvas.width*canvas.height:1);
      ptr.deltaX=dx; ptr.deltaY=dy;
      ptr.moved=Math.abs(dx)>0||Math.abs(dy)>0;
    };

    let firstMove=false;
    const onMM=(e)=>{
      const p=pointers[0],x=scaleByPR(e.clientX),y=scaleByPR(e.clientY);
      if(!firstMove){p.color=genColor();firstMove=true;}
      upd(p,x,y);
    };
    const onMD=(e)=>{
      const p=pointers[0]; const c=genColor(); c.r*=10;c.g*=10;c.b*=10;
      splat(scaleByPR(e.clientX)/canvas.width,1-scaleByPR(e.clientY)/canvas.height,10*(Math.random()-.5),30*(Math.random()-.5),c);
    };
    const onTS=(e)=>{const p=pointers[0];const t=e.targetTouches[0];upd(p,scaleByPR(t.clientX),scaleByPR(t.clientY));};
    const onTM=(e)=>{const p=pointers[0];const t=e.targetTouches[0];upd(p,scaleByPR(t.clientX),scaleByPR(t.clientY));};

    window.addEventListener("mousemove",onMM);
    window.addEventListener("mousedown",onMD);
    window.addEventListener("touchstart",onTS);
    window.addEventListener("touchmove",onTM,{passive:true});

    return () => {
      isActive=false;
      if(frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
      window.removeEventListener("mousemove",onMM);
      window.removeEventListener("mousedown",onMD);
      window.removeEventListener("touchstart",onTS);
      window.removeEventListener("touchmove",onTM);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ position:"fixed",top:0,left:0,zIndex:50,pointerEvents:"none",width:"100%",height:"100%" }}>
      <canvas ref={canvasRef} style={{ width:"100vw",height:"100vh",display:"block" }} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   COMPONENT 5 — LIGHT PILLAR (THREE.js via dynamic import)
══════════════════════════════════════════════════════════════════ */
function LightPillar({
  topColor     = "#3db8ae",
  bottomColor  = "#7c3ced",
  intensity    = 0.65,
  rotationSpeed= 0.18,
  glowAmount   = 0.004,
  pillarWidth  = 3.5,
  pillarHeight = 0.35,
  noiseIntensity=0.4,
  pillarRotation=0,
  mixBlendMode = "screen",
  quality      = "high",
}) {
  const containerRef = useRef(null);
  const [ok, setOk]  = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    let isActive=true, rafId, renderer, material, geometry, scene, camera, timeRef=0;
    const rotSpeedRef = { v: rotationSpeed };

    const init = async () => {
      const THREE = await import("three");
      if (!isActive) return;

      const w=container.clientWidth, h=container.clientHeight;
      const isMobile=/iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      let eq = quality;
      if(isMobile && eq==="high") eq="medium";

      const qs = {
        low:   {iter:24,witer:1, pr:.5,   prec:"mediump",sm:1.5},
        medium:{iter:40,witer:2, pr:.65,  prec:"mediump",sm:1.2},
        high:  {iter:80,witer:4, pr:Math.min(window.devicePixelRatio,2),prec:"highp",sm:1.0},
      };
      const s = qs[eq]||qs.medium;

      try {
        renderer = new THREE.WebGLRenderer({ antialias:false,alpha:true,powerPreference:eq==="high"?"high-performance":"low-power",precision:s.prec,stencil:false,depth:false });
      } catch { setOk(false); return; }
      renderer.setSize(w,h); renderer.setPixelRatio(s.pr);
      container.appendChild(renderer.domElement);

      scene  = new THREE.Scene();
      camera = new THREE.OrthographicCamera(-1,1,1,-1,0,1);
      const pC=(hex)=>{const c=new THREE.Color(hex);return new THREE.Vector3(c.r,c.g,c.b);};
      const pr=(Math.PI/180)*pillarRotation;
      const wSin=Math.sin(0.4), wCos=Math.cos(0.4);

      const vs=`varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position,1.);}`;
      const fs=`
        precision ${s.prec} float;
        uniform float uTime;uniform vec2 uRes;uniform vec3 uTop;uniform vec3 uBot;
        uniform float uInt;uniform float uGlow;uniform float uPW;uniform float uPH;
        uniform float uNoise;uniform float uRC;uniform float uRS;
        uniform float uPRC;uniform float uPRS;uniform float uWS;uniform float uWC;
        varying vec2 vUv;
        const float SM=${s.sm.toFixed(1)};const int MI=${s.iter};const int WI=${s.witer};
        void main(){
          vec2 uv=(vUv*2.-1.)*vec2(uRes.x/uRes.y,1.);
          uv=vec2(uPRC*uv.x-uPRS*uv.y,uPRS*uv.x+uPRC*uv.y);
          vec3 ro=vec3(0.,0.,-10.);vec3 rd=normalize(vec3(uv,1.));
          vec3 col=vec3(0.);float t=.1;
          for(int i=0;i<MI;i++){
            vec3 p=ro+rd*t;
            p.xz=vec2(uRC*p.x-uRS*p.z,uRS*p.x+uRC*p.z);
            vec3 q=p;q.y=p.y*uPH+uTime;
            float freq=1.;float amp=1.;
            for(int j=0;j<WI;j++){
              q.xz=vec2(uWC*q.x-uWS*q.z,uWS*q.x+uWC*q.z);
              q+=cos(q.zxy*freq-uTime*float(j)*2.)*amp;
              freq*=2.;amp*=.5;
            }
            float d=length(cos(q.xz))-.2;
            float b=length(p.xz)-uPW;
            float k=4.;float h=max(k-abs(d-b),0.);
            d=max(d,b)+h*h*.0625/k;d=abs(d)*.15+.01;
            float g=clamp((15.-p.y)/30.,0.,1.);
            col+=mix(uBot,uTop,g)/d;
            t+=d*SM;if(t>50.)break;
          }
          float wn=uPW/3.;col=tanh(col*uGlow/wn);
          col-=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453)/15.*uNoise;
          gl_FragColor=vec4(col*uInt,1.);
        }`;

      material = new THREE.ShaderMaterial({
        vertexShader:vs, fragmentShader:fs,
        uniforms:{
          uTime:{value:0},uRes:{value:new THREE.Vector2(w,h)},
          uTop:{value:pC(topColor)},uBot:{value:pC(bottomColor)},
          uInt:{value:intensity},uGlow:{value:glowAmount},
          uPW:{value:pillarWidth},uPH:{value:pillarHeight},
          uNoise:{value:noiseIntensity},
          uRC:{value:1},uRS:{value:0},
          uPRC:{value:Math.cos(pr)},uPRS:{value:Math.sin(pr)},
          uWS:{value:wSin},uWC:{value:wCos},
        },
        transparent:true,depthWrite:false,depthTest:false,
      });

      geometry = new THREE.PlaneGeometry(2,2);
      scene.add(new THREE.Mesh(geometry,material));

      let lastFrame=performance.now();
      const fps=eq==="low"?30:60, ft=1000/fps;
      const animate=(ct)=>{
        if(!material||!renderer||!scene||!camera) return;
        if(ct-lastFrame>=ft){
          timeRef+=.016*rotSpeedRef.v;
          material.uniforms.uTime.value=timeRef;
          material.uniforms.uRC.value=Math.cos(timeRef*.3);
          material.uniforms.uRS.value=Math.sin(timeRef*.3);
          renderer.render(scene,camera);
          lastFrame=ct-(ct-lastFrame)%ft;
        }
        rafId=requestAnimationFrame(animate);
      };
      rafId=requestAnimationFrame(animate);

      let resT;
      const onResize=()=>{
        clearTimeout(resT);
        resT=setTimeout(()=>{
          if(!renderer||!material||!container) return;
          const nw=container.clientWidth,nh=container.clientHeight;
          renderer.setSize(nw,nh);
          material.uniforms.uRes.value.set(nw,nh);
        },150);
      };
      window.addEventListener("resize",onResize,{passive:true});
      return ()=>window.removeEventListener("resize",onResize);
    };

    init().catch(()=>setOk(false));

    return ()=>{
      isActive=false;
      if(rafId) cancelAnimationFrame(rafId);
      if(renderer){
        renderer.dispose(); renderer.forceContextLoss();
        if(container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      }
      material?.dispose(); geometry?.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  if(!ok) return null;
  return <div ref={containerRef} className="lp-host" style={{ mixBlendMode }} />;
}

/* ══════════════════════════════════════════════════════════════════
   PAGE HELPERS
══════════════════════════════════════════════════════════════════ */
function RevealCard({ children, delay = 0, style }) {
  const ref   = useRef(null);
  const inView= useInView(ref, { once:true, margin:"-50px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity:0, y:36, scale:.97 }}
      animate={inView ? { opacity:1, y:0, scale:1 } : {}}
      transition={{ duration:.6, delay, ease:[.22,1,.36,1] }}
      style={style}>
      {children}
    </motion.div>
  );
}

/* Glass card — GlassSurface + RevealCard combined */
function GlassCard({ children, delay=0, style, padding="clamp(32px,5vw,56px)", borderRadius=24 }) {
  return (
    <RevealCard delay={delay} style={{ borderRadius, ...style }}>
      <GlassSurface
        width="100%" height="auto"
        borderRadius={borderRadius}
        backgroundOpacity={0.08}
        brightness={22}
        opacity={0.82}
        blur={9}
        saturation={1.2}
        distortionScale={-130}
        style={{ width:"100%", border:"1px solid rgba(61,184,174,0.1)" }}>
        <div style={{ width:"100%", padding, borderRadius:borderRadius-1, boxSizing:"border-box" }}>
          {children}
        </div>
      </GlassSurface>
    </RevealCard>
  );
}

const LANGUAGES = ["English","हिन्दी","বাংলা","অসমীয়া","తెలుగు","தமிழ்","मराठी","ಕನ್ನಡ","ગુજરાતી"];

function LanguageTicker() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI(x => (x+1)%LANGUAGES.length), 1600);
    return () => clearInterval(t);
  }, []);
  return (
    <AnimatePresence mode="wait">
      <motion.span key={i}
        initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
        transition={{ duration:.25 }}
        style={{ color:"#3db8ae", fontStyle:"italic" }}>
        {LANGUAGES[i]}
      </motion.span>
    </AnimatePresence>
  );
}

function HeartbeatLine() {
  return (
    <svg width="100%" height="38" viewBox="0 0 300 38" preserveAspectRatio="none">
      <motion.polyline
        points="0,19 40,19 55,4 65,34 75,19 90,19 105,19 115,7 125,31 135,19 160,19 300,19"
        fill="none" stroke="#3db8ae" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength:0, opacity:0 }}
        animate={{ pathLength:1, opacity:1 }}
        transition={{ duration:2, repeat:Infinity, repeatDelay:1.5, ease:"easeInOut" }}
      />
    </svg>
  );
}

function StatCard({ value, label, delay }) {
  return (
    <RevealCard delay={delay} style={{ height:"100%" }}>
      <div style={{
        background:"rgba(16,13,30,0.7)", backdropFilter:"blur(12px)",
        border:"1px solid #1c1730", borderRadius:20,
        padding:"28px 24px", height:"100%",
        display:"flex", flexDirection:"column", justifyContent:"space-between",
        position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute",top:0,left:0,width:"100%",height:"2px",
          background:"linear-gradient(90deg,transparent,#3db8ae,transparent)" }}/>
        <div style={{ fontFamily:"'DM Serif Display'",fontSize:42,color:"#3db8ae",lineHeight:1 }}>
          {value}
        </div>
        <div style={{ fontFamily:"'JetBrains Mono'",fontSize:10,color:"#3a2e60",letterSpacing:"1.5px",marginTop:8 }}>
          {label.toUpperCase()}
        </div>
      </div>
    </RevealCard>
  );
}

function FeatureCard({ icon, title, desc, delay, accent=false }) {
  const [hov, setHov] = useState(false);
  return (
    <RevealCard delay={delay} style={{ height:"100%" }}>
      <motion.div
        onHoverStart={()=>setHov(true)} onHoverEnd={()=>setHov(false)}
        animate={{ borderColor: hov ? "rgba(61,184,174,0.32)" : "rgba(28,23,48,1)" }}
        style={{
          background: accent ? "rgba(61,184,174,0.05)" : "rgba(16,13,30,0.8)",
          backdropFilter:"blur(10px)",
          border:"1px solid #1c1730", borderRadius:20, padding:28,
          height:"100%", cursor:"default",
          display:"flex", flexDirection:"column", gap:14,
        }}>
        <motion.div animate={{ scale: hov?1.1:1 }} style={{
          width:48,height:48,borderRadius:12,
          background:"rgba(61,184,174,0.08)",border:"1px solid rgba(61,184,174,0.18)",
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,
        }}>{icon}</motion.div>
        <div>
          <div style={{ fontFamily:"'Outfit'",fontSize:16,fontWeight:600,color:"#e8e0f4",marginBottom:6 }}>
            {title}
          </div>
          <div style={{ fontFamily:"'Outfit'",fontSize:13,color:"#6b5f84",lineHeight:1.6 }}>
            {desc}
          </div>
        </div>
      </motion.div>
    </RevealCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════════════════ */
const NAV_ITEMS = [
  { label:"HOME",         href:"#hero" },
  { label:"HOW IT WORKS", href:"#how" },
  { label:"FEATURES",     href:"#features" },
  { label:"LANGUAGES",    href:"#languages" },
];

const STEPS = [
  { step:"01", icon:"🎙️", title:"Describe",  desc:"Type or speak symptoms in any Indian language" },
  { step:"02", icon:"🧠", title:"Analyse",   desc:"AI extracts symptoms and assesses severity" },
  { step:"03", icon:"📋", title:"Triage",    desc:"Get clear guidance — rest, PHC, or hospital ER" },
  { step:"04", icon:"🗺️", title:"Navigate",  desc:"Find nearest facility and get directions" },
];

const FEATURES = [
  { icon:"🤖", title:"Llama-3 AI Triage",     desc:"Real LLM responses — understands context and asks follow-up questions.",       accent:true  },
  { icon:"🎙️", title:"Voice in 9 Languages",  desc:"Web Speech API with Assamese, Hindi, Bengali, Tamil, Telugu and more.",        accent:false },
  { icon:"🧠", title:"Medical NER",           desc:"Extracts symptoms, duration, severity words and body parts from free text.",    accent:false },
  { icon:"🗺️", title:"Live Facility Finder",  desc:"OpenStreetMap powered. Shows real hospitals and PHCs near your GPS location.", accent:false },
  { icon:"💊", title:"Jan Aushadhi Generics", desc:"Generic medicine alternatives from PMBI database with savings up to 93%.",      accent:true  },
  { icon:"📄", title:"PDF Health Report",     desc:"Downloadable summary with symptoms, severity, medicines and disclaimer.",       accent:false },
];

const LANG_LIST = [
  { name:"English",  script:"English"  },
  { name:"हिन्दी",   script:"Hindi"    },
  { name:"অসমীয়া", script:"Assamese" },
  { name:"বাংলা",   script:"Bengali"  },
  { name:"తెలుగు",  script:"Telugu"   },
  { name:"தமிழ்",   script:"Tamil"    },
  { name:"मराठी",   script:"Marathi"  },
  { name:"ಕನ್ನಡ",   script:"Kannada"  },
  { name:"ગુજરાતી", script:"Gujarati" },
];

/* ══════════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const router   = useRouter();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useInjectCSS();

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow   = "auto";
    document.documentElement.style.overflow = "auto";
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive:true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.body.style.overflow   = "hidden";
      document.documentElement.style.overflow = "hidden";
    };
  }, []);

  if (!mounted) return null;

  return (
    <div style={{ minHeight:"100vh", background:"#090614", color:"#e8e0f4",
                  fontFamily:"'Outfit',sans-serif", overflowX:"hidden" }}>

      {/* ── WebGL Fluid Cursor ────────────────────────────────── */}
      <SplashCursor RAINBOW_MODE={true} DENSITY_DISSIPATION={3.2} VELOCITY_DISSIPATION={1.8}
                    SPLAT_RADIUS={0.18} SPLAT_FORCE={5500} />

      {/* ── Animated Background: LightPillar ─────────────────── */}
      <div style={{ position:"fixed",inset:0,zIndex:0,pointerEvents:"none",overflow:"hidden" }}>
        <LightPillar
          topColor="#3db8ae" bottomColor="#5c1fc4"
          intensity={0.55} rotationSpeed={0.15}
          glowAmount={0.0035} pillarWidth={4.2}
          pillarHeight={0.32} noiseIntensity={0.38}
          mixBlendMode="screen" quality="high"
        />
      </div>

      {/* ── Subtle grid overlay ───────────────────────────────── */}
      <div style={{ position:"fixed",inset:0,zIndex:0,pointerEvents:"none",
        backgroundImage:`
          linear-gradient(rgba(61,184,174,0.022) 1px,transparent 1px),
          linear-gradient(90deg,rgba(61,184,174,0.022) 1px,transparent 1px)`,
        backgroundSize:"48px 48px" }} />

      {/* ══════════════════════════════════════════════════════════
          NAVBAR — GooeyNav + GlassSurface sticky bar
      ══════════════════════════════════════════════════════════ */}
      <motion.header
        initial={{ opacity:0, y:-20 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration:.5 }}
        style={{
          position:"sticky", top:0, zIndex:40,
          transition:"all .3s ease",
        }}>
        <GlassSurface
          width="100%" height="auto"
          borderRadius={0}
          backgroundOpacity={scrolled ? 0.18 : 0.06}
          brightness={scrolled ? 20 : 15}
          opacity={0.9}
          blur={scrolled ? 14 : 8}
          saturation={1.3}
          distortionScale={-100}
          style={{ borderBottom: scrolled ? "1px solid rgba(61,184,174,0.12)" : "1px solid transparent" }}>
          <div style={{
            maxWidth:1000, margin:"0 auto", padding:"0 20px",
            width:"100%",
          }}>
            <div style={{
              padding:"14px 0",
              display:"flex", alignItems:"center", justifyContent:"space-between",
              gap:16,
            }}>
              {/* Logo */}
              <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
                <div style={{
                  width:34, height:34, borderRadius:9,
                  background:"rgba(61,184,174,0.1)",
                  border:"1px solid rgba(61,184,174,0.25)",
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:17,
                }}>🩺</div>
                <span style={{ fontFamily:"'DM Serif Display'", fontSize:19, color:"#e8e0f4", whiteSpace:"nowrap" }}>
                  Arogya<span style={{ color:"#3db8ae", fontStyle:"italic" }}>Bot</span>
                </span>
              </div>

              {/* GooeyNav — centre links */}
              <GooeyNav
                items={NAV_ITEMS}
                particleCount={12}
                particleDistances={[80, 8]}
                particleR={80}
                animationTime={500}
                initialActiveIndex={0}
              />

              {/* CTA button */}
              <motion.button
                whileHover={{ scale:1.04, boxShadow:"0 0 24px rgba(61,184,174,0.3)" }}
                whileTap={{ scale:.95 }}
                onClick={() => router.push("/chat")}
                style={{
                  background:"#3db8ae", border:"none", borderRadius:9,
                  padding:"9px 20px", cursor:"pointer",
                  fontFamily:"'JetBrains Mono'", fontSize:10, letterSpacing:"1px",
                  color:"#090614", fontWeight:700, flexShrink:0,
                  boxShadow:"0 0 16px rgba(61,184,174,0.15)",
                }}>
                OPEN APP →
              </motion.button>
            </div>
          </div>
        </GlassSurface>
      </motion.header>

      {/* ── Page body ─────────────────────────────────────────── */}
      <div style={{ position:"relative", zIndex:1, maxWidth:1000, margin:"0 auto",
                    padding:"0 20px 80px" }}>

        {/* ══════════════════════════════════════════════════════
            HERO — GlassCard + TrueFocus heading
        ══════════════════════════════════════════════════════ */}
        <section id="hero" style={{ marginTop:48, marginBottom:16 }}>
          <GlassCard delay={0} padding="clamp(40px,6vw,72px)" borderRadius={28}>

            {/* Corner glows (decorative) */}
            <div style={{ position:"absolute",top:0,right:0,width:300,height:300,pointerEvents:"none",
              background:"radial-gradient(circle at top right,rgba(120,60,200,0.12),transparent 70%)" }}/>
            <div style={{ position:"absolute",bottom:0,left:0,width:240,height:240,pointerEvents:"none",
              background:"radial-gradient(circle at bottom left,rgba(61,184,174,0.08),transparent 70%)" }}/>

            {/* Live badge */}
            <div style={{
              display:"inline-flex", alignItems:"center", gap:8,
              background:"rgba(61,184,174,0.07)", border:"1px solid rgba(61,184,174,0.18)",
              borderRadius:20, padding:"6px 14px", marginBottom:32,
            }}>
              <motion.div
                animate={{ opacity:[1,.2,1] }} transition={{ duration:1.5, repeat:Infinity }}
                style={{ width:6, height:6, borderRadius:"50%", background:"#3db8ae" }}/>
              <span style={{ fontFamily:"'JetBrains Mono'",fontSize:10,color:"#3db8ae",letterSpacing:"1.5px" }}>
                LIVE · FREE · EASY TO USE
              </span>
            </div>

            {/* TrueFocus heading */}
            <TrueFocus
              sentence="Healthcare Guidance"
              separator=" "
              blurAmount={4}
              borderColor="#3db8ae"
              glowColor="rgba(61,184,174,0.75)"
              duration={0.6}
              pause={1.6}
              fontSize="clamp(32px,6vw,64px)"
            />

            {/* Language ticker sub-line */}
            <div style={{ fontFamily:"'DM Serif Display'",
              fontSize:"clamp(28px,5vw,56px)", lineHeight:1.1,
              color:"#e8e0f4", letterSpacing:"-1px",
              marginTop:8, marginBottom:16 }}>
              in{" "}
              <span style={{ display:"inline-block", minWidth:200 }}>
                <LanguageTicker />
              </span>
            </div>

            <div style={{ margin:"20px 0", opacity:.7 }}>
              <HeartbeatLine />
            </div>

            <p style={{ fontSize:16, color:"#8a7aaa", maxWidth:500, lineHeight:1.7, marginBottom:40 }}>
              An AI health-support bot built by Darpan. Describe your symptoms simply by voice or
              text in 9 languages — get instant assessment, nearby facilities, and generic medicine alternatives.
            </p>

            <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
              <motion.button
                whileHover={{ scale:1.03, boxShadow:"0 0 48px rgba(61,184,174,0.28)" }}
                whileTap={{ scale:.97 }}
                onClick={() => router.push("/chat")}
                style={{
                  background:"#3db8ae", border:"none", borderRadius:12,
                  padding:"14px 36px", cursor:"pointer",
                  fontFamily:"'JetBrains Mono'", fontSize:12, letterSpacing:"1.5px",
                  color:"#090614", fontWeight:700,
                  boxShadow:"0 0 28px rgba(61,184,174,0.18)",
                }}>
                START CHAT →
              </motion.button>
              <motion.button
                whileHover={{ scale:1.03 }} whileTap={{ scale:.97 }}
                onClick={() => window.open("https://github.com/darpan-NITS/ArogyaBot","_blank")}
                style={{
                  background:"transparent", border:"1px solid #1c1730",
                  borderRadius:12, padding:"14px 36px", cursor:"pointer",
                  fontFamily:"'JetBrains Mono'", fontSize:12,
                  letterSpacing:"1.5px", color:"#6b5f84",
                }}>
                GITHUB REPO ↗
              </motion.button>
            </div>
          </GlassCard>
        </section>

        {/* ══════════════════════════════════════════════════════
            STATS ROW
        ══════════════════════════════════════════════════════ */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",
                      gap:16, marginBottom:16 }}>
          <StatCard value="900M+" label="Underserved Indians" delay={.05} />
          <StatCard value="9"     label="Indian Languages"    delay={.10} />
          <StatCard value="500+"  label="Disease Profiles"    delay={.15} />
          <StatCard value="108"   label="Emergency Number"    delay={.20} />
        </div>

        {/* ══════════════════════════════════════════════════════
            HOW IT WORKS — GlassCard
        ══════════════════════════════════════════════════════ */}
        <section id="how" style={{ marginBottom:16 }}>
          <GlassCard delay={.05} padding="40px" borderRadius={24}>
            <div style={{ fontFamily:"'JetBrains Mono'",fontSize:10,color:"#3a2e60",
                          letterSpacing:"2px",marginBottom:32 }}>
              HOW IT WORKS
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))" }}>
              {STEPS.map((s,i) => (
                <div key={i} style={{ padding:24,
                  borderRight: i<STEPS.length-1 ? "1px solid #1c1730" : "none" }}>
                  <div style={{ fontFamily:"'JetBrains Mono'",fontSize:10,color:"#2a2248",
                                letterSpacing:"1px",marginBottom:12 }}>{s.step}</div>
                  <div style={{ fontSize:24,marginBottom:10 }}>{s.icon}</div>
                  <div style={{ fontFamily:"'Outfit'",fontSize:15,fontWeight:600,
                                color:"#e8e0f4",marginBottom:6 }}>{s.title}</div>
                  <div style={{ fontFamily:"'Outfit'",fontSize:12,color:"#6b5f84",lineHeight:1.6 }}>
                    {s.desc}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </section>

        {/* ══════════════════════════════════════════════════════
            FEATURES GRID
        ══════════════════════════════════════════════════════ */}
        <section id="features">
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",
                        gap:16, marginBottom:16 }}>
            {FEATURES.map((f,i) => (
              <FeatureCard key={i} icon={f.icon} title={f.title} desc={f.desc}
                           delay={.05+(i%3)*.05} accent={f.accent} />
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            LANGUAGES — GlassCard
        ══════════════════════════════════════════════════════ */}
        <section id="languages" style={{ marginBottom:16 }}>
          <GlassCard delay={.05} padding="40px" borderRadius={24}>
            <div style={{ fontFamily:"'JetBrains Mono'",fontSize:10,color:"#3a2e60",
                          letterSpacing:"2px",marginBottom:28,textAlign:"center" }}>
              SUPPORTED LANGUAGES
            </div>
            <div style={{ display:"flex",flexWrap:"wrap",gap:10,justifyContent:"center" }}>
              {LANG_LIST.map((lang,i) => (
                <motion.div key={i}
                  whileHover={{ scale:1.06, borderColor:"rgba(61,184,174,0.45)" }}
                  style={{ background:"rgba(61,184,174,0.04)",
                           border:"1px solid rgba(61,184,174,0.1)",
                           borderRadius:10, padding:"10px 18px", cursor:"default" }}>
                  <div style={{ fontFamily:"'Outfit'",fontSize:16,color:"#e8e0f4",marginBottom:2 }}>
                    {lang.name}
                  </div>
                  <div style={{ fontFamily:"'JetBrains Mono'",fontSize:9,
                                color:"#3a2e60",letterSpacing:"1px" }}>
                    {lang.script.toUpperCase()}
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </section>

        {/* ══════════════════════════════════════════════════════
            EMERGENCY + CTA
        ══════════════════════════════════════════════════════ */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:16, marginBottom:16 }}>
          <RevealCard delay={.05} style={{ height:"100%" }}>
            <div style={{
              background:"rgba(192,41,58,0.05)", backdropFilter:"blur(12px)",
              border:"1px solid rgba(192,41,58,0.18)",
              borderRadius:24, padding:32, height:"100%",
              display:"flex", flexDirection:"column", justifyContent:"space-between",
            }}>
              <div style={{ fontSize:32 }}>🚨</div>
              <div>
                <div style={{ fontFamily:"'DM Serif Display'",fontSize:48,
                              color:"#d94058",lineHeight:1 }}>108</div>
                <div style={{ fontFamily:"'JetBrains Mono'",fontSize:10,
                              color:"rgba(217,64,88,0.55)",letterSpacing:"1.5px",marginTop:8 }}>
                  EMERGENCY HELPLINE
                </div>
              </div>
              <p style={{ fontFamily:"'Outfit'",fontSize:12,
                          color:"rgba(217,64,88,0.55)",lineHeight:1.6 }}>
                Always call 108 in a medical emergency. ArogyaBot is not a substitute for emergency care.
              </p>
            </div>
          </RevealCard>

          <GlassCard delay={.1} padding="40px" borderRadius={24} style={{ height:"100%" }}>
            <div style={{ position:"absolute",bottom:-60,right:-60,width:200,height:200,
              pointerEvents:"none",
              background:"radial-gradient(circle,rgba(61,184,174,0.09),transparent 70%)" }}/>
            <div style={{ fontFamily:"'DM Serif Display'",
              fontSize:"clamp(22px,3vw,32px)",
              color:"#e8e0f4",lineHeight:1.2,marginBottom:16 }}>
              Describe your symptoms.
              <br/>
              <span style={{ color:"#3db8ae",fontStyle:"italic" }}>Get help instantly.</span>
            </div>
            <p style={{ fontFamily:"'Outfit'",fontSize:14,color:"#6b5f84",
                        lineHeight:1.7,marginBottom:32 }}>
              No registration. No cost. Works offline.
              Built for rural India, usable by everyone.
            </p>
            <motion.button
              whileHover={{ scale:1.03,boxShadow:"0 0 48px rgba(61,184,174,0.22)" }}
              whileTap={{ scale:.97 }}
              onClick={() => router.push("/chat")}
              style={{
                background:"#3db8ae",border:"none",borderRadius:12,
                padding:"16px 40px",cursor:"pointer",alignSelf:"flex-start",
                fontFamily:"'JetBrains Mono'",fontSize:12,letterSpacing:"1.5px",
                color:"#090614",fontWeight:700,
              }}>
              START YOUR 1st CHAT →
            </motion.button>
          </GlassCard>
        </div>

        {/* ══════════════════════════════════════════════════════
            FOOTER
        ══════════════════════════════════════════════════════ */}
        <RevealCard delay={.05}>
          <div style={{
            borderTop:"1px solid #1c1730", padding:"24px 0",
            display:"flex", alignItems:"center",
            justifyContent:"space-between", flexWrap:"wrap", gap:12,
          }}>
            <span style={{ fontFamily:"'DM Serif Display'",fontSize:16,color:"#2a2248" }}>
              Arogya<span style={{ color:"#3a2e60",fontStyle:"italic" }}>Bot</span>
            </span>
            <span style={{ fontFamily:"'JetBrains Mono'",fontSize:9,
                           color:"#2a2248",letterSpacing:"1.5px" }}>
              NOT A SUBSTITUTE FOR MEDICAL ADVICE · BUILT FOR INDIA BY DARPAN
            </span>
            <motion.button
              whileHover={{ color:"#3db8ae" }}
              onClick={() => router.push("/chat")}
              style={{ background:"none",border:"none",fontFamily:"'JetBrains Mono'",
                       fontSize:10,color:"#2a2248",cursor:"pointer",
                       letterSpacing:"1px",transition:"color .2s" }}>
              OPEN APP →
            </motion.button>
          </div>
        </RevealCard>

      </div>
    </div>
  );
}
