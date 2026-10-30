import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Menu, X, ArrowRight, ArrowUpRight, Mail,
  Check, ChevronRight, Terminal, RotateCcw, Send, CheckCircle2, ImagePlus
} from "lucide-react";
import { FaGithub as Github, FaLinkedin as Linkedin } from "react-icons/fa";


/* ============================================================
   DESIGN TOKENS
   Paper background, ink text, one verified-teal accent, amber
   reserved for "in progress" states. Signature motif: a small
   status dot + monospace label, echoing a CI/test-runner check.
   ============================================================ */
const C = {
  paper: "#0A0910",
  paperRaised: "#16131E",
  ink: "#F3F1F8",
  inkSoft: "#B6AFC7",
  inkFaint: "#7C7690",
  accent: "#8B5CF6",
  accentInk: "#C9B8FA",
  accentTint: "rgba(139,92,246,0.16)",
  accent2: "#F472B6",
  accent2Tint: "rgba(244,114,182,0.16)",
  amber: "#F0B93E",
  amberTint: "rgba(240,185,62,0.14)",
  line: "rgba(255,255,255,0.10)",
  lineStrong: "rgba(255,255,255,0.20)",
  gradient: "linear-gradient(135deg, #8B5CF6 0%, #F472B6 100%)",
  error: "#F87171",
};

const NAV_ITEMS = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Projects" },
  { id: "qa", label: "QA" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

/* ============================================================
   DATA
   ============================================================ */
const SKILL_GROUPS = [
  {
    tag: "Software Engineering",
    title: "My Tech Stack",
    pass: false,
    items: ["React", "TypeScript", "JavaScript", "Next.js", "Node.js", "Python", "Django REST Framework", "Kotlin", "HTML", "CSS"],
  },
  {
    tag: "Backend & Data",
    title: "Underneath the UI",
    pass: false,
    items: ["REST APIs", "PostgreSQL", "MySQL", "API integration", "Database design"],
  },
  {
    tag: "QA & Testing",
    title: "Checking it holds up",
    pass: true,
    items: ["Manual QA", "Test case design", "End-to-end testing", "API testing", "Cypress", "Postman", "Browser DevTools", "Debugging", "Regression testing", "Functional testing"],
  },
  {
    tag: "Development & Collaboration",
    title: "How I work with others",
    pass: false,
    items: ["Git", "GitHub", "GitHub Actions", "CI workflows", "VS Code", "Android Studio"],
  },
  {
    tag: "Design & Product",
    title: "Before the code",
    pass: false,
    items: ["Figma", "UI wireframing", "UX research", "Product requirements", "System architecture", "Technical documentation"],
  },
];

const STEPS = [
  { n: 1, title: "Problem", body: "Healthcare funding disruptions in Kenya put access to HIV/AIDS medication and counseling at risk." },
  { n: 2, title: "Research", body: "Investigated how patients find clinics and services today, and what information clinics needed to share." },
  { n: 3, title: "Solution", body: "A connected patient app, clinic dashboard, and backend keeping availability data current." },
  { n: 4, title: "Architecture", body: "Mobile app, REST API backend, and web dashboard, each with a clear responsibility." },
  { n: 5, title: "Development", body: "Built across Kotlin, Django REST Framework, PostgreSQL, and React/TypeScript." },
  { n: 6, title: "Testing", body: "Investigated behavior across the dashboard, API, and Android app to catch logic issues." },
  { n: 7, title: "Outcome", body: "A working, connected system spanning mobile, backend, and clinic-facing tools." },
];

const SUBSYSTEMS = [
  {
    key: "mobile",
    label: "Mobile App",
    stack: "Kotlin · Android Studio · Google Maps API",
    items: ["Find nearby clinics", "Identify available services", "Check medication availability", "Interact with healthcare service information", "Make bookings"],
  },
  {
    key: "backend",
    label: "Backend",
    stack: "Python · Django REST Framework · PostgreSQL . Supabase",
    items: ["Manages data between app and dashboard", "Handles bookings and availability", "Serves the mobile and web clients"],
  },
  {
    key: "dashboard",
    label: "Clinic Dashboard",
    stack: "React · TypeScript",
    items: ["Update available services", "Update ARV availability", "Manage clinic information", "Manage counseling services & bookings"],
  },
];

const QA_QUESTIONS = [
  { q: "Does it work as expected?", a: "The starting point — but only the starting point. A feature can pass its happy path and still fail everyone who doesn't follow it exactly." },
  { q: "What happens when the user does something unexpected?", a: "Double clicks, back button, empty fields, wrong order of steps. Real users don't read the flow diagram." },
  { q: "What happens for existing users, not just new ones?", a: "New-account testing is easy to over-index on. Returning users carry state — and state is where bugs hide." },
  { q: "Does the frontend agree with the API?", a: "A UI can look correct while quietly showing stale, mismatched, or misinterpreted data from the response it received." },
  { q: "Can I reproduce the problem?", a: "An unreproducible bug isn't fixed, it's postponed. Reproduction steps are the actual deliverable of a bug report." },
  { q: "What happens after the next change?", a: "Regression testing exists because fixing one thing quietly breaking another is the default, not the exception." },
  { q: "Can this behavior be tested automatically?", a: "If I'm going to check it more than once, it's a candidate for automation — that's what turns testing into a safety net." },
];

const WORKFLOW = [
  { title: "Understand", body: "Understand the problem, requirements, and users." },
  { title: "Research", body: "Investigate the problem and gather the information needed to make informed decisions." },
  { title: "Design", body: "Create wireframes, requirements, architecture, and technical plans." },
  { title: "Build", body: "Develop frontend, backend, mobile applications, APIs, and supporting systems." },
  { title: "Test", body: "Test functionality manually and through automated tests where appropriate." },
  { title: "Debug", body: "Use logs, DevTools, API responses, and debugging techniques to trace problems." },
  { title: "Improve", body: "Fix issues, refine the experience, and improve reliability." },
];

const OTHER_PROJECTS = [
  {
    id: "iddirnet",
    name: "IddirNet",
    role: "QA / Test Automation",
    category: "QA",
    github: 'https://github.com/shalinedavida/iddirnet-e2e',
    stack: ["Cypress", "E2E Testing", "Postman",'Javascript','Mocha','Chai'],
    desc: "A QA and testing-focused project where I built automated end-to-end tests with Cypress — covering key user flows, validating expected behavior, and catching regressions before they reached users.",
    bullets: ["Automated browser testing & regression checks", "Validated user flows end to end", "Identified defects across dashboards and flows"],
    learned: "Automated tests give repeatable confidence in the flows that matter most, and they catch regressions much earlier than manual testing alone ever could.",
  },
  {
    id: "halicare-web",
    name: "HaliCare — Informational Website",
    role: "Frontend Development",
    category: "Frontend",
    github: 'https://github.com/shalinedavida/halicare-informational',
    stack: ["Next.js", "TypeScript",'React','Tailwind CSS'],
    desc: "A companion website communicating the HaliCare project and its purpose through a clean, focused web experience — built to make a technical/product idea easy to understand at a glance.",
    bullets: [],
    learned: null,
  },
  {
    id: "lumora",
    name: "Lumora",
    role: "Frontend Development · Earlier Work",
    category: "Frontend",
    github: 'https://github.com/shalinedavida/mylumora--website',
    stack: ["HTML", "CSS"],
    desc: "A recreation of the Lumora website — an earlier project focused on translating a visual design into a working webpage with close attention to layout and detail.",
    bullets: [],
    learned: null,
  },
  {
    id: 'halicare-backend',
    name: "HaliCare — Backend Services",
    role: "Backend Development",
    category: "Backend",
    github: 'https://github.com/shalinedavida/halicare-backend',
    stack: ["Node.js", "Django RestFramework", "MongoDB",'Django 4.2+'],
    desc: "A robust backend system for managing HaliCare's core functionality — including user authentication, data validation, and API development.",
    bullets: [],
    learned: null,
  }
];

const TERMINAL_SEQUENCE = [
  { type: "cmd", text: "run suite --project=halicare" },
  { type: "pass", text: "booking flow .................. PASS" },
  { type: "pass", text: "auth persistence ............... PASS" },
  { type: "pass", text: "api response schema ............ PASS" },
  { type: "summary", text: "3 passed · 0 failed · investigated 1 edge case" },
];

/* ============================================================
   HOOK: reveal-on-scroll
   ============================================================ */
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0, className = "" }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(18px)",
        transition: `opacity .6s ease ${delay}ms, transform .6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}


function PhotoFrame({
  shape = "circle",
  width = 128,
  height = 128,
  label = "Add your photo",
  src,
}) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center gap-2 border-2 border-dashed flex-none overflow-hidden ${
        shape === "circle" ? "rounded-full" : "rounded-2xl"
      }`}
      style={{
        width,
        height,
        borderColor: C.lineStrong,
        background: C.paperRaised,
        color: C.inkFaint,
      }}
    >
      {src ? (
        <img
          src={src}
          alt={label || "Profile photo"}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <>
          <ImagePlus
            size={shape === "circle" ? 20 : 26}
            style={{ color: C.accentInk }}
          />
          <span
            className="font-mono text-[10px] text-center px-3 leading-tight"
            style={{ color: C.inkFaint }}
          >
            {label}
          </span>
        </>
      )}
    </div>
  );
}


/* ============================================================
   SMALL UI PRIMITIVES
   ============================================================ */
function Eyebrow({ children }) {
  return (
    <span
      className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest"
      style={{ color: C.inkSoft, letterSpacing: "0.08em" }}
    >
      <span className="inline-block rounded-full" style={{ width: 7, height: 7, background: C.accent }} />
      {children}
    </span>
  );
}

function Tag({ children, variant }) {
  const styles =
    variant === "pass"
      ? { background: C.accentTint, color: C.accentInk, borderColor: "transparent" }
      : variant === "progress"
      ? { background: C.amberTint, color: C.amber, borderColor: "transparent" }
      : { background: C.paperRaised, color: C.inkSoft, borderColor: C.lineStrong };
  return (
    <span
      className="font-mono text-xs px-2.5 py-1 rounded border whitespace-nowrap"
      style={{ letterSpacing: "0.02em", ...styles }}
    >
      {children}
    </span>
  );
}

function Chip({ children }) {
  return (
    <span
      className="text-sm font-medium px-3 py-1.5 rounded-full border"
      style={{ borderColor: C.line, background: C.paperRaised, color: C.ink }}
    >
      {children}
    </span>
  );
}

function Btn({ children, variant = "primary", as = "button", href, onClick, className = "", ...rest }) {
  const base = "inline-flex items-center gap-2 font-semibold text-sm rounded-lg px-5 py-3 transition-all duration-200";
  const styles =
    variant === "primary"
      ? { background: C.gradient, color: "#fff", boxShadow: "0 6px 18px -6px rgba(124,58,237,0.55)" }
      : variant === "secondary"
      ? { background: "transparent", color: C.ink, border: `1.5px solid ${C.lineStrong}` }
      : variant === "invert"
      ? { background: "#FFFFFF", color: "#171224" }
      : { background: "transparent", color: C.accentInk, padding: "8px 2px" };
  const Comp = as;
  return (
    <Comp
      href={href}
      onClick={onClick}
      className={`${base} ${className} hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0`}
      style={styles}
      {...rest}
    >
      {children}
    </Comp>
  );
}

/* ============================================================
   NAV
   ============================================================ */
function Nav({ active, onCvClick }) {
  const [open, setOpen] = useState(false);

  const scrollTo = (id) => (e) => {
    e.preventDefault();
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur"
      style={{ background: "rgba(10,9,16,0.82)", borderColor: C.line }}
    >
      <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
        <a href="#home" onClick={scrollTo("home")} className="font-mono font-semibold text-sm flex items-center gap-2" style={{ color: C.ink }}>
          <span className="inline-block rotate-45" style={{ width: 9, height: 9, background: C.accent, borderRadius: 2 }} />
          Shaline Davida
        </a>

        <nav className="hidden md:flex items-center gap-7">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={scrollTo(item.id)}
              className="text-sm font-medium transition-colors"
              style={{ color: active === item.id ? C.ink : C.inkSoft }}
            >
              {item.label}
            </a>
          ))}
        </nav>

      </div>

      {open && (
        <div className="md:hidden border-t px-6 pb-5 flex flex-col" style={{ borderColor: C.line }}>
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={scrollTo(item.id)}
              className="text-base font-medium py-3.5 border-b"
              style={{ borderColor: C.line, color: C.ink }}
            >
              {item.label}
            </a>
          ))}
          <Btn variant="primary" className="mt-4 justify-center" onClick={onCvClick}>
            Download CV
          </Btn>
        </div>
      )}
    </header>
  );
}

/* ============================================================
   HERO — interactive terminal
   ============================================================ */
function HeroTerminal() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [running, setRunning] = useState(false);
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const play = useCallback(() => {
    if (reduced) {
      setVisibleCount(TERMINAL_SEQUENCE.length);
      return;
    }
    setRunning(true);
    setVisibleCount(0);
    let i = 0;
    const tick = () => {
      i += 1;
      setVisibleCount(i);
      if (i < TERMINAL_SEQUENCE.length) {
        setTimeout(tick, 380);
      } else {
        setRunning(false);
      }
    };
    setTimeout(tick, 250);
  }, [reduced]);

  useEffect(() => {
    play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="rounded-xl overflow-hidden font-mono text-sm" style={{ background: "#08070C", color: "#E7ECEA", border: `1px solid ${C.line}`, boxShadow: "0 8px 28px -12px rgba(139,92,246,0.35)" }}>
      <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.18)" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.18)" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.18)" }} />
        <span className="ml-2 text-xs flex items-center gap-1.5" style={{ color: "rgba(231,236,234,0.5)" }}>
          <Terminal size={12} /> test-runner
        </span>
        <button
          onClick={play}
          disabled={running}
          aria-label="Re-run tests"
          className="ml-auto text-xs flex items-center gap-1.5 px-2 py-1 rounded border disabled:opacity-40"
          style={{ borderColor: "rgba(255,255,255,0.16)", color: "rgba(231,236,234,0.8)" }}
        >
          <RotateCcw size={11} className={running ? "animate-spin" : ""} />
          {running ? "running…" : "re-run"}
        </button>
      </div>
      <div className="px-5 py-6 min-h-[168px]">
        {TERMINAL_SEQUENCE.slice(0, visibleCount).map((line, idx) => (
          <div key={idx} className={line.type === "summary" ? "mt-3.5 pt-3.5 border-t border-dashed" : "mb-2.5 flex gap-2.5"} style={line.type === "summary" ? { borderColor: "rgba(255,255,255,0.14)", color: "rgba(231,236,234,0.7)" } : {}}>
            {line.type === "cmd" && (
              <>
                <span style={{ color: "rgba(231,236,234,0.45)" }}>$</span>
                <span>{line.text}</span>
              </>
            )}
            {line.type === "pass" && (
              <>
                <span style={{ color: "#7FD9BC" }}>✓</span>
                <span>{line.text}</span>
              </>
            )}
            {line.type === "summary" && <span>{line.text}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   HALICARE — tabbed subsystems + clickable stepper
   ============================================================ */
function HaliCareCaseStudy() {
  const [activeStep, setActiveStep] = useState(0);
  const [activeSub, setActiveSub] = useState("mobile");
  const sub = SUBSYSTEMS.find((s) => s.key === activeSub);

  return (
    <div className="rounded-2xl border p-7 md:p-11" style={{ background: C.paperRaised, borderColor: C.line, boxShadow: "0 8px 24px -12px rgba(20,24,27,0.12)" }}>
      <Tag variant="pass">Mobile · Backend · Dashboard · QA</Tag>
      <p className="mt-5 max-w-3xl" style={{ color: C.inkSoft }}>
        HaliCare is a mobile platform designed to help people living with HIV/AIDS access medication and counseling
        services following funding disruptions that affected healthcare programs in Kenya. It wasn't a single app —
        it was a connected ecosystem: a mobile app for patients, a backend to move data safely between systems, and
        a dashboard clinics could keep updated in real time.
      </p>

      {/* Stepper */}
      <div className="mt-10 grid grid-cols-4 sm:grid-cols-7 gap-x-2 gap-y-6">
        {STEPS.map((s, i) => (
          <button
            key={s.n}
            onClick={() => setActiveStep(i)}
            className="text-left group"
          >
            <span
              className="font-mono text-xs w-7 h-7 rounded-full flex items-center justify-center mb-2 transition-all"
              style={{
                background: activeStep === i ? C.gradient : C.accentTint,
                color: activeStep === i ? "#fff" : C.accentInk,
                boxShadow: activeStep === i ? "0 4px 12px -4px rgba(124,58,237,0.5)" : "none",
              }}
            >
              {s.n}
            </span>
            <h4 className="text-sm font-semibold" style={{ color: activeStep === i ? C.ink : C.inkSoft }}>
              {s.title}
            </h4>
          </button>
        ))}
      </div>
      <div className="mt-4 p-5 rounded-lg" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
        <span className="font-mono text-xs uppercase tracking-wider" style={{ color: C.accentInk }}>
          Step {STEPS[activeStep].n} / {STEPS.length}
        </span>
        <p className="mt-2 text-sm" style={{ color: C.ink }}>{STEPS[activeStep].body}</p>
      </div>

      {/* Subsystem tabs */}
      <div className="mt-11">
        <div className="flex flex-wrap gap-2">
          {SUBSYSTEMS.map((s) => (
            <button
              key={s.key}
              onClick={() => setActiveSub(s.key)}
              className="text-sm font-medium px-4 py-2 rounded-full border transition-colors"
              style={
                activeSub === s.key
                  ? { background: C.gradient, color: "#fff", borderColor: "transparent" }
                  : { background: "transparent", color: C.inkSoft, borderColor: C.line }
              }
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="mt-5 rounded-lg p-6" style={{ border: `1px solid ${C.line}` }}>
          <span className="font-mono text-xs block mb-3" style={{ color: C.inkFaint }}>{sub.stack}</span>
          <ul className="flex flex-col gap-2.5">
            {sub.items.map((it, i) => (
              <li key={i} className="text-sm flex items-start gap-2" style={{ color: C.inkSoft }}>
                <ArrowRight size={14} className="mt-0.5 flex-none" style={{ color: C.accent }} />
                {it}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* QA story */}
      <div className="mt-8 rounded-lg p-6" style={{ background: C.paper, border: `1px solid ${C.line}`, borderLeft: `3px solid ${C.amber}` }}>
        <Tag variant="pass">QA & Debugging</Tag>
        <p className="mt-3 text-sm" style={{ color: C.inkSoft }}>
          <strong style={{ color: C.ink }}>What I investigated:</strong> I looked across the React dashboard,
          backend/API responses, Android application screens, browser DevTools, and Postman to understand how the
          system behaved end to end — not just whether individual screens looked right.
        </p>
        <p className="mt-2.5 text-sm" style={{ color: C.inkSoft }}>
          <strong style={{ color: C.ink }}>The bug:</strong> Returning users were incorrectly being prompted to
          upload a transfer letter — a step meant only for new patients. I traced the issue across the frontend and
          API flow and helped identify the logic causing returning users to be treated as new ones.
        </p>
        <p className="mt-2.5 text-sm" style={{ color: C.inkSoft }}>
          <strong style={{ color: C.ink }}>Why it mattered:</strong> It's a good example of what QA means to me —
          not just running test cases, but investigating how a system actually behaves and why.
        </p>
      </div>

      <div className="mt-4 rounded-lg p-6" style={{ background: C.paper, border: `1px solid ${C.line}`, borderLeft: `3px solid ${C.accent}` }}>
        <Tag variant="pass">Product & Research</Tag>
        <p className="mt-3 text-sm" style={{ color: C.inkSoft }}>
          Beyond code, I contributed to the <strong style={{ color: C.ink }}>Product Requirements Document</strong>,
          research documentation, system architecture, and visual designs — including <strong style={{ color: C.ink }}>Figma</strong> wireframes for both the mobile app and dashboard.
        </p>
      </div>

      <div className="mt-7 flex gap-6">
        <a href='https://github.com/shalinedavida/haliCare-mobile' target="_blank" rel="noopener noreferrer" className="text-sm font-semibold flex items-center gap-1" style={{ color: C.accentInk }}>
          <span className="border-b" style={{ borderColor: C.accent }}>GitHub</span> <ArrowUpRight size={14} />
        </a>
      
      </div>
    </div>
  );
}

/* ============================================================
   QA MINDSET — flip cards
   ============================================================ */
function QuestionCard({ item }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      onClick={() => setFlipped((f) => !f)}
      className="text-left rounded-xl p-5 border transition-all duration-200 hover:-translate-y-1"
      style={{
        background: flipped ? C.accent2Tint : C.paperRaised,
        borderColor: flipped ? C.accent2 : C.line,
        boxShadow: flipped ? "0 10px 24px -14px rgba(232,70,124,0.45)" : "none",
        minHeight: 132,
      }}
      aria-expanded={flipped}
    >
      <span
        className="font-mono text-xs w-6 h-6 rounded flex items-center justify-center mb-3 transition-colors duration-200"
        style={{ background: flipped ? C.accent2 : C.accentTint, color: flipped ? "#fff" : C.accentInk }}
      >
        {flipped ? <Check size={13} /> : "?"}
      </span>
      {!flipped ? (
        <p className="text-sm font-medium" style={{ color: C.ink }}>{item.q}</p>
      ) : (
        <p className="text-sm" style={{ color: C.inkSoft }}>{item.a}</p>
      )}
    
    </button>
  );
}

/* ============================================================
   WORKFLOW — clickable, animated progress
   ============================================================ */
function Workflow() {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="relative">
        <div className="hidden md:block absolute top-[15px] left-0 right-0 h-px" style={{ background: C.lineStrong }} />
        <div
          className="hidden md:block absolute top-[15px] left-0 h-[3px] rounded-full transition-all duration-500"
          style={{ background: C.gradient, width: `${(active / (WORKFLOW.length - 1)) * 100}%` }}
        />
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-x-4 gap-y-8 relative">
          {WORKFLOW.map((w, i) => (
            <button key={w.title} onClick={() => setActive(i)} className="text-left relative z-10">
              <span
                className="font-mono text-sm w-8 h-8 rounded-full flex items-center justify-center mb-3 transition-all duration-200"
                style={{
                  background: i <= active ? C.gradient : C.paper,
                  color: i <= active ? "#fff" : C.inkFaint,
                  border: `1.5px solid ${i <= active ? "transparent" : C.lineStrong}`,
                  boxShadow: i === active ? "0 4px 14px -4px rgba(124,58,237,0.5)" : "none",
                }}
              >
                {i + 1}
              </span>
              <h4 className="text-sm font-semibold" style={{ color: active === i ? C.ink : C.inkSoft }}>{w.title}</h4>
            </button>
          ))}
        </div>
      </div>
      <div className="mt-8 p-5 rounded-lg" style={{ background: C.paperRaised, border: `1px solid ${C.line}` }}>
        <span className="font-mono text-xs uppercase tracking-wider" style={{ color: C.accentInk }}>{WORKFLOW[active].title}</span>
        <p className="mt-2 text-sm" style={{ color: C.inkSoft }}>{WORKFLOW[active].body}</p>
      </div>
    </div>
  );
}

/* ============================================================
   PROJECTS — filterable grid
   ============================================================ */
function ProjectsGrid() {
  const [filter, setFilter] = useState("All");
  const categories = ["All", "QA", "Frontend"];
  const filtered = OTHER_PROJECTS.filter((p) => filter === "All" || p.category === filter);

  return (
    <div>
      <div className="flex gap-2 mb-7">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className="text-sm font-medium px-4 py-2 rounded-full border transition-colors"
            style={
              filter === c
                ? { background: C.gradient, color: "#fff", borderColor: "transparent" }
                : { background: "transparent", color: C.inkSoft, borderColor: C.line }
            }
          >
            {c}
          </button>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="rounded-xl p-6 border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            style={{ background: C.paperRaised, borderColor: C.line, boxShadow: "0 1px 2px rgba(28,22,38,0.05)" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.boxShadow = "0 16px 32px -18px rgba(124,58,237,0.35)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.line; e.currentTarget.style.boxShadow = "0 1px 2px rgba(28,22,38,0.05)"; }}
          >
            <span className="font-mono text-xs uppercase tracking-wider" style={{ color: C.inkFaint }}>{p.role}</span>
            <h3 className="text-lg font-semibold mt-2 mb-2" style={{ fontFamily: "var(--font-display)" }}>{p.name}</h3>
            <div className="flex flex-wrap gap-2 mb-3.5">
              {p.stack.map((s) => <Chip key={s}>{s}</Chip>)}
            </div>
            <p className="text-sm mb-3.5" style={{ color: C.inkSoft }}>{p.desc}</p>
            {p.bullets.length > 0 && (
              <ul className="flex flex-col gap-1.5 mb-3.5">
                {p.bullets.map((b, i) => (
                  <li key={i} className="text-sm flex items-start gap-2" style={{ color: C.inkSoft }}>
                    <ArrowRight size={13} className="mt-0.5 flex-none" style={{ color: C.accent }} />
                    {b}
                  </li>
                ))}
              </ul>
            )}
            {p.learned && (
              <div className="rounded-lg p-3.5 mb-3.5" style={{ background: C.accentTint }}>
                <span className="font-mono text-[10px] uppercase tracking-wider block mb-1" style={{ color: C.accentInk }}>What I learned</span>
                <p className="text-sm" style={{ color: C.accentInk }}>{p.learned}</p>
              </div>
            )}
            <a href={p.github} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold inline-flex items-center gap-1" style={{ color: C.accentInk }}>
              <span className="border-b" style={{ borderColor: C.accent }}>GitHub</span> <ArrowUpRight size={13} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   CONTACT FORM — validated, stateful
   ============================================================ */
function ContactForm() {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent

  const validate = () => {
    const e = {};
    if (!values.name.trim()) e.name = "Add your name.";
    if (!/^\S+@\S+\.\S+$/.test(values.email)) e.email = "Add a valid email.";
    if (!values.message.trim()) e.message = "Add a short message.";
    return e;
  };

 


const handleSubmit = async (ev) => {
  ev.preventDefault();

  const e = validate();
  setErrors(e);

  if (Object.keys(e).length > 0) return;

  const form = ev.currentTarget;
  setStatus("sending");

  try {
    const response = await fetch(
      "https://formspree.io/f/xppplwgn",
      {
        method: "POST",
        body: new FormData(form),
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (response.ok) {
      setValues({ name: "", email: "", message: "" });
      setErrors({});
      setStatus("sent");
    } else {
      setStatus("error");
    }
  } catch (error) {
    setStatus("error");
  }
};

const field = (key, label, type = "text") => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={`cf-${key}`} className="text-sm font-medium">
      {label}
    </label>

    {type === "textarea" ? (
      <textarea
        id={`cf-${key}`}
        name={key}
        rows={5}
        required
        value={values[key]}
        onChange={(e) =>
          setValues((v) => ({ ...v, [key]: e.target.value }))
        }
        className="text-sm px-3.5 py-3 rounded-lg border outline-none"
        style={{
          borderColor: errors[key] ? "#F87171" : C.line,
          background: C.paperRaised,
          color: C.ink,
        }}
      />
    ) : (
      <input
        id={`cf-${key}`}
        name={key}
        type={type}
        required
        value={values[key]}
        onChange={(e) =>
          setValues((v) => ({ ...v, [key]: e.target.value }))
        }
        className="text-sm px-3.5 py-3 rounded-lg border outline-none"
        style={{
          borderColor: errors[key] ? "#F87171" : C.line,
          background: C.paperRaised,
          color: C.ink,
        }}
      />
    )}

    {errors[key] && (
      <span className="text-xs" style={{ color: "#F87171" }}>
        {errors[key]}
      </span>
    )}
  </div>
);

if (status === "sent") {
  return (
    <div
      className="rounded-xl p-8 border flex flex-col items-start gap-3"
      style={{
        background: C.accentTint,
        borderColor: "transparent",
      }}
    >
      <CheckCircle2 size={26} style={{ color: C.accentInk }} />

      <h3 className="font-semibold" style={{ color: C.accentInk }}>
        Message sent!
      </h3>

      <p className="text-sm" style={{ color: C.accentInk }}>
        Thank you for reaching out. Your message has been submitted
        successfully.
      </p>

      <button
        type="button"
        onClick={() => setStatus("idle")}
        className="text-sm font-semibold underline mt-1"
        style={{ color: C.accentInk }}
      >
        Send another message
      </button>
    </div>
  );
}

return (
  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
    {field("name", "Name")}
    {field("email", "Email")}
    {field("message", "Message", "textarea")}

    <Btn
      variant="primary"
      as="button"
      type="submit"
      disabled={status === "sending"}
      className="self-start"
    >
      {status === "sending" ? (
        "Sending…"
      ) : (
        <>
          Send message <Send size={14} />
        </>
      )}
    </Btn>

    <p className="font-mono text-xs" style={{ color: C.inkFaint }}>
      {status === "error" &&
        "Your message could not be sent. Please check your connection and try again."}
    </p>
  </form>
);
}



/* ============================================================
   SCROLL PROGRESS BAR
   ============================================================ */
function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop;
      const height = h.scrollHeight - h.clientHeight;
      setPct(height > 0 ? (scrolled / height) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-[60]" style={{ background: "transparent" }}>
      <div className="h-full transition-[width] duration-150" style={{ width: `${pct}%`, background: C.gradient }} />
    </div>
  );
}

/* ============================================================
   MAIN APP
   ============================================================ */
export default function App() {
  const [active, setActive] = useState("home");
  const sectionRefs = useRef({});

  useEffect(() => {
    const ids = ["home", ...NAV_ITEMS.map((n) => n.id)];
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const handleCv = () => {
    window.open("/cv/software-engineering-cv.pdf", "_blank", "noopener,noreferrer");
  };

  return (
    <div style={{ background: C.paper, color: C.ink, fontFamily: "var(--font-body)", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        :root{ --font-display:'Space Grotesk', sans-serif; --font-body:'IBM Plex Sans', sans-serif; --font-mono:'IBM Plex Mono', monospace; }
        .font-mono{ font-family: var(--font-mono); }
        h1,h2,h3,h4{ font-family: var(--font-display); letter-spacing: -0.01em; }
        @media (prefers-reduced-motion: reduce){
          *{ animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; }
          .animate-blob-a, .animate-blob-b{ animation: none !important; }
        }
        :focus-visible{ outline: 2.5px solid ${C.accent}; outline-offset: 3px; border-radius: 4px; }
        .grad-text{
          background: ${C.gradient};
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }
        @keyframes blobA{
          0%,100%{ transform: translate(0,0) scale(1); }
          33%{ transform: translate(30px,-20px) scale(1.08); }
          66%{ transform: translate(-15px,15px) scale(0.95); }
        }
        @keyframes blobB{
          0%,100%{ transform: translate(0,0) scale(1); }
          33%{ transform: translate(-25px,20px) scale(1.1); }
          66%{ transform: translate(15px,-15px) scale(0.92); }
        }
        .animate-blob-a{ animation: blobA 14s ease-in-out infinite; }
        .animate-blob-b{ animation: blobB 17s ease-in-out infinite; }
      `}</style>

      <ScrollProgress />
      <a href="#main" className="sr-only focus:not-sr-only fixed left-4 top-4 z-[100] font-mono text-sm px-4 py-2 rounded" style={{ background: C.ink, color: C.paper }}>
        Skip to content
      </a>

      <Nav active={active} onCvClick={handleCv} />

      <main id="main">
        {/* HERO */}
        <section id="home" className="relative pt-16 pb-20 md:pt-20 md:pb-24 overflow-hidden">
          <div
            className="pointer-events-none absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full opacity-30 blur-3xl animate-blob-a"
            style={{ background: C.accent }}
          />
          <div
            className="pointer-events-none absolute top-10 right-[-120px] w-[380px] h-[380px] rounded-full opacity-25 blur-3xl animate-blob-b"
            style={{ background: C.accent2 }}
          />
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative">
            <div>
              <PhotoFrame shape="circle" width={130} height={140} src="/passport-photo.jpg" />
              <span
                className="mt-5 inline-flex items-center gap-2 font-mono text-xs px-3 py-1.5 rounded-full mb-5"
                style={{ color: C.accentInk, background: C.accentTint, letterSpacing: "0.05em" }}
              >
                <span className="relative flex w-2 h-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: C.accent2 }} />
                  <span className="relative inline-flex rounded-full w-2 h-2" style={{ background: C.accent }} />
                </span>
                OPEN TO WORK · SOFTWARE ENGINEERING &amp; QA ROLES
              </span>
              <h1 className="text-4xl md:text-5xl leading-[1.08] font-semibold max-w-md">
                I build software with <span className="grad-text">quality</span> in mind.
              </h1>
              <p className="mt-5 text-lg max-w-md" style={{ color: C.inkSoft }}>
                I'm a Software Engineer and QA Engineer who enjoys turning real-world problems into useful, reliable
                products — from mobile and web applications to APIs, dashboards, and automated tests.
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-8">
                <Btn variant="primary" as="a" href="#work" onClick={(e) => { e.preventDefault(); document.getElementById("work")?.scrollIntoView({ behavior: "smooth" }); }}>
                  View My Work <ArrowRight size={15} />
                </Btn>
                <Btn variant="secondary" as="a" href="/public/software-engineering-cv.pdf" download="Shaline-Davida-Software-Engineering-CV.pdf">Software Engineering CV</Btn>
                <Btn variant="secondary" as="a" href="/public/qa-cv.pdf" download="Shaline-Davida-QA-Engineering-CV.pdf">QA Engineering CV</Btn>
                <Btn variant="ghost" as="a" href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}>
                  <span className="border-b" style={{ borderColor: C.accent }}>Let's Connect</span> <ArrowRight size={14} />
                </Btn>
              </div>
            </div>
            <Reveal><HeroTerminal /></Reveal>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="py-20 md:py-24">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-[0.85fr_1.15fr] gap-12">
            <Reveal>
              <PhotoFrame shape="rect" width={260} height={340} src="/potrait-photo.jpg" />
              <div className="mt-5">
                <Eyebrow>About</Eyebrow>
              </div>
              <h2 className="text-3xl mt-3 font-semibold">Software Engineer, QA-minded from day one.</h2>
            </Reveal>
            <Reveal delay={100}>
              <div className="flex flex-col gap-4" style={{ color: C.inkSoft }}>
                <p>I studied for a <strong style={{ color: C.ink }}>Diploma in Information Technology at AkiraChix</strong>, in Kenya, where my training moved across software development, problem solving, research, and hands-on product work — not just theory.</p>
                <p>Since then, my background has combined <strong style={{ color: C.ink }}>software development, quality assurance, product research, and UI/UX thinking</strong>. I've worked across frontend, backend, mobile development, databases, and APIs, and I've tested the things I've built as seriously as I've built them.</p>
                <p className="text-xl font-semibold py-1 pl-4 my-2" style={{ color: C.ink, borderLeft: `3px solid ${C.accent}`, fontFamily: "var(--font-display)" }}>
                  "I enjoy understanding how a product is supposed to work, building it, and then asking: what could go wrong?"
                </p>
                <p>That question is what keeps pulling me toward QA and test automation alongside engineering. I like the full loop — understanding a requirement, building the feature, and then trying to break it in ways a real user eventually would.</p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" className="py-20 md:py-24 border-t border-b" style={{ background: C.paperRaised, borderColor: C.line }}>
          <div className="max-w-6xl mx-auto px-6">
            <Reveal className="max-w-xl mb-11">
              <Eyebrow>Skills</Eyebrow>
              <h2 className="text-3xl mt-3 font-semibold">What I actually work with.</h2>
              <p className="mt-3.5" style={{ color: C.inkSoft }}>Organized by how I use them, not how impressive they sound.</p>
            </Reveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SKILL_GROUPS.map((g, i) => (
                <Reveal key={g.tag} delay={i * 60}>
                  <div className="rounded-xl border p-5 h-full" style={{ borderColor: C.line, background: C.paper }}>
                    <Tag variant={g.pass ? "pass" : undefined}>{g.tag}</Tag>
                    <h3 className="text-base font-semibold mt-3.5 mb-3.5">{g.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      {g.items.map((it) => <Chip key={it}>{it}</Chip>)}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED PROJECT */}
        <section id="work" className="py-20 md:py-24">
          <div className="max-w-6xl mx-auto px-6">
            <Reveal className="max-w-xl mb-10">
              <Eyebrow>Featured Project</Eyebrow>
              <h2 className="text-3xl mt-3 font-semibold">HaliCare</h2>
              <p className="mt-3.5" style={{ color: C.inkSoft }}>Connecting patients to essential healthcare services when access becomes uncertain.</p>
            </Reveal>
            <Reveal><HaliCareCaseStudy /></Reveal>
          </div>
        </section>

        {/* QA MINDSET */}
        <section id="qa" className="py-20 md:py-24 border-t border-b" style={{ background: C.paperRaised, borderColor: C.line }}>
          <div className="max-w-6xl mx-auto px-6">
            <Reveal className="max-w-xl mb-10">
              <Eyebrow>How I think</Eyebrow>
              <h2 className="text-3xl mt-3 font-semibold">I don't just ask "Does it work?"</h2>
              <p className="mt-3.5" style={{ color: C.inkSoft }}>Testing isn't a phase I do at the end , it's a set of questions I carry through the whole build.</p>
            </Reveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {QA_QUESTIONS.map((item, i) => (
                <Reveal key={item.q} delay={i * 50}>
                  <QuestionCard item={item} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* OTHER PROJECTS */}
        <section className="py-20 md:py-24">
          <div className="max-w-6xl mx-auto px-6">
            <Reveal className="max-w-xl mb-10">
              <Eyebrow>Other Projects</Eyebrow>
              <h2 className="text-3xl mt-3 font-semibold">More things I've built and tested.</h2>
            </Reveal>
            <Reveal><ProjectsGrid /></Reveal>
          </div>
        </section>

        {/* WORKFLOW */}
        <section className="py-20 md:py-24 border-t border-b" style={{ background: C.paperRaised, borderColor: C.line }}>
          <div className="max-w-6xl mx-auto px-6">
            <Reveal className="max-w-xl mb-10">
              <Eyebrow>Workflow</Eyebrow>
              <h2 className="text-3xl mt-3 font-semibold">How I approach a project.</h2>
            
            </Reveal>
            <Reveal><Workflow /></Reveal>
          </div>
        </section>

        {/* EXPERIENCE */}
        <section id="experience" className="py-20 md:py-24">
          <div className="max-w-6xl mx-auto px-6">
            <Reveal className="max-w-xl mb-8">
              <Eyebrow>Experience</Eyebrow>
              <h2 className="text-3xl mt-3 font-semibold">Professional journey.</h2>
            </Reveal>
            <Reveal>
              <div className="rounded-xl border border-dashed p-6 font-mono text-sm" style={{ borderColor: C.lineStrong, color: C.inkFaint }}>
              
              </div>
            </Reveal>
            {/*
              To add a role, push an object into EXPERIENCE_ITEMS at the top of the file:
              { when: "Jan 2024 — Present", title: "Job Title", org: "Company", bullets: ["...", "..."] }
              then render it here the same way the ABOUT/skills sections render their data.
            */}
          </div>
        </section>

        {/* EDUCATION + LEARNING */}
        <section className="py-20 md:py-24 border-t border-b" style={{ background: C.paperRaised, borderColor: C.line }}>
          <div className="max-w-6xl mx-auto px-6">
            <Reveal className="max-w-xl mb-8">
              <Eyebrow>Education</Eyebrow>
              <h2 className="text-3xl mt-3 font-semibold">Where it started.</h2>
            </Reveal>
            <Reveal>
              <div className="rounded-xl border p-7 flex gap-5 flex-wrap items-start" style={{ borderColor: C.line, background: C.paper }}>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center font-semibold flex-none" style={{ background: C.accentTint, color: C.accentInk, fontFamily: "var(--font-display)" }}>
                  Ak
                </div>
                <div>
                  <h3 className="text-lg font-semibold">AkiraChix</h3>
                  <p style={{ color: C.inkSoft }} className="mt-0.5 mb-2">Diploma in Information Technology</p>
                  <span className="font-mono text-xs" style={{ color: C.inkFaint }}>Kenya</span>
                  <p className="mt-3 text-sm max-w-lg" style={{ color: C.inkSoft }}>
                    This training exposed me to software development, problem solving, research, product development, and practical projects — the foundation for how I still approach building software today.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="grid md:grid-cols-2 gap-5 mt-14">
                <div className="rounded-xl border p-6" style={{ borderColor: C.line, background: C.paper }}>
                  <Tag variant="progress">In progress</Tag>
                  <h3 className="text-base font-semibold mt-3 mb-1.5">QA automation &amp; infrastructure</h3>
                  <p className="text-sm mb-4" style={{ color: C.inkSoft }}>Areas I'm actively developing further, not claiming as finished expertise.</p>
                  <div className="flex flex-wrap gap-2">
                    {["Cypress", "Selenium", "Docker", "Kubernetes", "Deeper SE practices"].map((c) => <Chip key={c}>{c}</Chip>)}
                  </div>
                </div>
                <div className="rounded-xl border p-6" style={{ borderColor: C.line, background: C.paper }}>
                  <Tag>AI-assisted development &amp; productivity</Tag>
                  <h3 className="text-base font-semibold mt-3 mb-1.5">Working with AI tools</h3>
                  <p className="text-sm mb-4" style={{ color: C.inkSoft }}>I use AI as a development tool — to explore ideas, troubleshoot, learn unfamiliar concepts, and move faster, not as something I claim to build.</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {["ChatGPT", "GitHub Copilot", "Gemini", "Google Colab"].map((c) => <Chip key={c}>{c}</Chip>)}
                  </div>
                  <p className="text-sm" style={{ color: C.inkSoft }}>I've also used Python in Google Colab for data cleaning.</p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* RESUME CTA */}
        <section className="py-20 md:py-24">
          <div className="max-w-6xl mx-auto px-6">
            <Reveal>
              <div className="rounded-2xl p-8 md:p-12 flex flex-wrap items-center justify-between gap-6" style={{ background: C.gradient }}>
                <div>
                  <h2 className="text-2xl font-semibold" style={{ color: "#fff" }}>Want the full picture?</h2>
                  <p className="mt-2 max-w-md" style={{ color: "rgba(255,255,255,0.8)" }}>Take a closer look at my experience, projects, technical skills, and background.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Btn variant="invert" as="a" href="/public/software-engineering-cv.pdf" download="Shaline-Davida-Software-Engineering-CV.pdf">Software Engineering CV</Btn>
                  <Btn variant="invert" as="a" href="/public/qa-cv.pdf" download="Shaline-Davida-QA-Engineering-CV.pdf">QA Engineering CV</Btn>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="py-20 md:py-24">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-14">
            <Reveal>
              <Eyebrow>Contact</Eyebrow>
              <h2 className="text-3xl mt-3 font-semibold">Let's build something useful.</h2>
              <p className="mt-3.5" style={{ color: C.inkSoft }}>I'm open to software engineering, QA engineering, Product management, and other opportunities where I can build, learn, and contribute.</p>
              <div className="flex flex-col gap-3.5 mt-7">
                
<a
  href="https://mail.google.com/mail/?view=cm&fs=1&to=shalinedavida%40gmail.com"
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center justify-between gap-3 px-4.5 py-4 rounded-lg border transition-colors"
  style={{ borderColor: C.line, background: C.paperRaised }}
>
  <span className="flex items-center gap-3">
    <Mail size={16} style={{ color: C.accent }} />
    <span>
      <span
        className="font-mono text-[10px] uppercase tracking-wider block"
        style={{ color: C.inkFaint }}
      >
        Email
      </span>
      <span className="font-medium">shalinedavida@gmail.com</span>
    </span>
  </span>
  <ArrowUpRight size={16} style={{ color: C.accent }} />
</a>

                <a href="https://www.linkedin.com/in/shaline-davida/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 px-4.5 py-4 rounded-lg border" style={{ borderColor: C.line, background: C.paperRaised }}>
                  <span className="flex items-center gap-3">
                    <Linkedin size={16} style={{ color: C.accent }} />
                    <span>
                      <span className="font-mono text-[10px] uppercase tracking-wider block" style={{ color: C.inkFaint }}>LinkedIn</span>
                      <span className="font-medium">linkedin.com/in/shalinedavida</span>
                    </span>
                  </span>
                  <ArrowUpRight size={16} style={{ color: C.accent }} />
                </a>
                <a href="https://github.com/shalinedavida" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 px-4.5 py-4 rounded-lg border" style={{ borderColor: C.line, background: C.paperRaised }}>
                  <span className="flex items-center gap-3">
                    <Github size={16} style={{ color: C.accent }} />
                    <span>
                      <span className="font-mono text-[10px] uppercase tracking-wider block" style={{ color: C.inkFaint }}>GitHub</span>
                      <span className="font-medium">github.com/shalinedavida</span>
                    </span>
                  </span>
                  <ArrowUpRight size={16} style={{ color: C.accent }} />
                </a>
              </div>
            </Reveal>
            <Reveal delay={100}><ContactForm /></Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t py-9" style={{ borderColor: C.line }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4">
          <span className="font-mono font-semibold text-sm flex items-center gap-2">
            <span className="inline-block rotate-45" style={{ width: 9, height: 9, background: C.accent, borderRadius: 2 }} />
            Shaline Davida
          </span>
          <div className="flex gap-6">
            <a className="text-sm" style={{ color: C.inkSoft }}>+971 58 250 4991</a>
            <a href="https://www.linkedin.com/in/shalinedavida" target="_blank" rel="noopener noreferrer" className="text-sm" style={{ color: C.inkSoft }}>LinkedIn</a>
            <a href="https://github.com/shalinedavida" target="_blank" rel="noopener noreferrer" className="text-sm" style={{ color: C.inkSoft }}>GitHub</a>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6">
          <p className="font-mono text-xs mt-4" style={{ color: C.inkFaint }}>Built with quality in mind. © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}
