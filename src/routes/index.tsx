import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Facebook, Instagram, Linkedin, MessageCircle } from "lucide-react";

import "../iamtechni.css";
import { initIamtechni } from "../lib/iamtechni-motion";
import logo from "../assets/logo.iamtechni.png";
import work01 from "../assets/solution-robot.svg";
import work02 from "../assets/solution-software.svg";
import work03 from "../assets/solution-satellite.svg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "iamtechni — AI Product Consulting & Software Development" },
      {
        name: "description",
        content:
          "iamtechni helps startups and product teams turn AI ideas into working software, sharper product decisions and faster business execution.",
      },
      { property: "og:title", content: "iamtechni — AI Product Consulting & Software Development" },
      {
        property: "og:description",
        content:
          "We help founders and product teams define AI opportunities, build software and ship digital products that move fast without losing clarity.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const RAIL = [
  { n: "01", label: "Overview", target: "origin" },
  { n: "02", label: "Position", target: "position" },
  { n: "03", label: "Services", target: "capability" },
  { n: "04", label: "Process", target: "system" },
  { n: "05", label: "Solutions", target: "work" },
  { n: "06", label: "Systems", target: "architecture" },
  { n: "07", label: "Industries", target: "fields" },
  { n: "08", label: "Contact", target: "contact" },
];

const CAPS = [
  {
    key: "ai",
    title: "AI product strategy",
    desc: "Practical AI guidance for startup teams: identify high-leverage use cases, validate concepts quickly and build a roadmap grounded in real product value.",
    tags: ["AI roadmap", "Use-case validation", "Automation", "Pilot design"],
  },
  {
    key: "software",
    title: "Custom software",
    desc: "Startup-ready software built to support product workflows, customer operations and internal execution without adding friction or complexity.",
    tags: ["MVPs", "Product tooling", "Process automation", "API integrations"],
  },
  {
    key: "product",
    title: "Product engineering",
    desc: "From early prototype to production-ready build, we create digital products that are lean, maintainable and designed around real user behavior.",
    tags: ["Product design", "Architecture", "Frontend", "Delivery support"],
  },
  {
    key: "data",
    title: "Data & intelligence",
    desc: "Smart reporting, decision support and AI-enabled workflows that help founders act faster with better visibility into performance and customer needs.",
    tags: ["Dashboards", "Reporting", "AI features", "Product analytics"],
  },
  {
    key: "support",
    title: "Technical enablement",
    desc: "Support for fast-moving teams that need stable infrastructure, faster delivery and better technical execution while scaling.",
    tags: ["System setup", "Technical support", "Operations", "Growth tooling"],
  },
];

const SYSTEM = [
  { n: "01", h: "Assess", p: "We review the business problem, current systems and operational bottlenecks before proposing a direction." },
  { n: "02", h: "Design", p: "We map the right workflow, architecture and user journey as one connected system instead of disconnected tools." },
  { n: "03", h: "Build", p: "We deliver in workable phases with production-minded engineering and clear milestones from the start." },
  { n: "04", h: "Deploy", p: "We support rollout, system integration and stabilization so the solution performs under real operating conditions." },
  { n: "05", h: "Optimize", p: "We improve performance, automate repetitive work and refine the system as the business grows." },
];

const WORK = [
  {
    n: "01",
    title: "AI operations suite",
    tags: ["AI", "Automation", "Reporting"],
    copy: "A workflow automation layer built to reduce repetitive admin work, improve visibility and help teams focus on decisions rather than manual coordination.",
    img: work01,
  },
  {
    n: "02",
    title: "Business portal",
    tags: ["Software", "UX", "Integration"],
    copy: "A client-facing platform designed to unify service information, requests and process tracking in one clearer digital experience.",
    img: work02,
  },
  {
    n: "03",
    title: "Intelligence platform",
    tags: ["Data", "Analytics", "AI"],
    copy: "A practical AI and analytics foundation connecting data, insight and business rules so teams can act faster with more confidence.",
    img: work03,
  },
];

const NODES = [
  { x: 12, y: 26, label: "Cloud", info: "Reproducible landing zones, policy as code, and cost visibility from day one." },
  { x: 30, y: 62, label: "Infrastructure", info: "Self-healing runtime foundations with observability designed in, never added later." },
  { x: 46, y: 18, label: "Software", info: "Domain-driven services with explicit contracts and honest failure modes." },
  { x: 58, y: 74, label: "Data", info: "One lineage-tracked path from event to decision, governed end to end." },
  { x: 72, y: 34, label: "AI", info: "Retrieval, agents and evaluation harnesses wired into the product loop." },
  { x: 84, y: 66, label: "APIs", info: "Versioned, documented, rate-aware interfaces that partners can build a business on." },
  { x: 94, y: 24, label: "Experience", info: "The surface where all of the above becomes something a person can trust." },
];

const EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 3],
  [2, 4],
  [3, 5],
  [4, 5],
  [4, 6],
  [5, 6],
  [1, 2],
];

const INDUSTRIES = [
  { label: "Healthcare", tone: "#13d6b0", say: "Digital systems built for privacy, reliability and a seamless patient or staff experience." },
  { label: "Finance", tone: "#2868d8", say: "Secure, compliant systems designed to support operations, reporting and customer trust." },
  { label: "Logistics", tone: "#24a9d2", say: "Operational visibility and workflow automation that help teams move faster with less friction." },
  { label: "Retail", tone: "#d4a83e", say: "Connected systems that improve service, reporting and customer experience across channels." },
  { label: "Manufacturing", tone: "#193b8f", say: "Production data and service workflows that support efficiency, uptime and process clarity." },
  { label: "Professional services", tone: "#24a9d2", say: "Business systems that simplify delivery, customer experience and internal operations without added complexity." },
];

const VOICES = [
  {
    quote: "The team focused on the real operational pain points and helped us simplify the process without adding noise.",
    who: "Operations lead",
    org: "Business team",
  },
  {
    quote: "We wanted a partner who could build systems that work in practice, not just look strong in a review deck.",
    who: "Product director",
    org: "Digital service team",
  },
  {
    quote: "The new workflow and reporting setup gave us faster decisions and better visibility across the business.",
    who: "Technology manager",
    org: "Internal systems",
  },
];

const STATEMENT =
  "We build the software, systems and IT solutions that help businesses move with confidence.";

const HERO_MESSAGES = [
  {
    title: ["Smarter systems", "for growing", "teams"],
    note: "We connect software, automation and business insight so growing teams can spend less time coordinating work and more time moving forward.",
  },
  {
    title: ["AI product", "engineering", "for startups"],
    note: "From first idea to working product, we help startup teams turn AI opportunities into focused software that is ready for real users.",
  },
  {
    title: ["Build the", "next useful", "thing"],
    note: "Strategy, design and engineering in one senior team, shaped around the customer problem and the outcome your business needs next.",
  },
];

function Home() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroVisible, setHeroVisible] = useState(true);
  const heroSwapRef = useRef<number | undefined>(undefined);

  const selectHeroSlide = (nextIndex: number) => {
    if (nextIndex === heroIndex) return;
    setHeroVisible(false);
    if (heroSwapRef.current) window.clearTimeout(heroSwapRef.current);
    heroSwapRef.current = window.setTimeout(() => {
      setHeroIndex(nextIndex);
      setHeroVisible(true);
    }, 260);
  };

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const interval = window.setInterval(() => {
      setHeroVisible(false);
      heroSwapRef.current = window.setTimeout(() => {
        setHeroIndex((index) => (index + 1) % HERO_MESSAGES.length);
        setHeroVisible(true);
      }, 260);
    }, 4200);
    return () => {
      window.clearInterval(interval);
      if (heroSwapRef.current) window.clearTimeout(heroSwapRef.current);
    };
  }, []);
  useEffect(() => {
    if (!rootRef.current) return;
    const dispose = initIamtechni(rootRef.current);
    return dispose;
  }, []);

  return (
    <div className="it" ref={rootRef}>
      {/* ---------- loader ---------- */}
      <div className="it-loader" aria-hidden="true">
        <img className="it-loader__logo" src={logo} alt="iamtechni" />
        <div className="it-loader__wipe" />
      </div>

      {/* ---------- cursor ---------- */}
      <div className="it-cursor" aria-hidden="true">
        <span className="it-cursor__dot" />
        <span className="it-cursor__label" />
      </div>

      {/* ---------- brand + instrument nav ---------- */}
      <a className="it-brand" href="#origin" data-scroll data-cursor="hover" aria-label="iamtechni, back to top">
        <img className="it-brand__logo" src={logo} alt="iamtechni" />
      </a>

      <nav className="it-rail" aria-label="Section navigation">
        {RAIL.map((r) => (
          <button
            key={r.target}
            type="button"
            className="it-rail__item"
            data-target={r.target}
            data-cursor="hover"
            aria-current="false"
          >
            <span className="it-rail__label">{r.label}</span>
            <span className="it-rail__num">{r.n}</span>
            <span className="it-rail__tick" aria-hidden="true" />
          </button>
        ))}
      </nav>

      <button
        className="it-menu-btn"
        type="button"
        aria-controls="mobile-navigation"
        aria-expanded="false"
        aria-label="Open navigation"
      >
        <span />
        <span />
      </button>

      <nav className="it-overlay" id="mobile-navigation" data-open="false" aria-label="Mobile section navigation">
        {RAIL.map((r) => (
          <a key={r.target} href={`#${r.target}`}>
            <small>{r.n}</small>
            {r.label}
          </a>
        ))}
      </nav>

      <main>
        {/* ================= 01 HERO ================= */}
        <section className="it-hero" id="origin">
          <div className="it-hero__field" aria-hidden="true">
            <span className="it-hero__glow" />
            <canvas id="it-field" />
            <i className="it-bar it-hero__bar it-hero__bar--b" />
            <i className="it-bar it-hero__bar it-hero__bar--a" />
            <i className="it-bar it-hero__bar it-hero__bar--c" />
            <span className="it-hero__gold" />
            <svg className="it-hero__system" viewBox="0 0 520 420" aria-hidden="true">
              <path className="it-hero__system-line" d="M46 312 158 230 252 278 364 144 468 202" />
              <path className="it-hero__system-line" d="M158 230 220 106 364 144 420 318" />
              <path className="it-hero__system-path" d="M46 312 158 230 252 278 364 144" />
              <circle cx="46" cy="312" r="5" /><circle cx="158" cy="230" r="5" /><circle cx="220" cy="106" r="4" />
              <circle cx="252" cy="278" r="5" /><circle cx="364" cy="144" r="7" /><circle cx="420" cy="318" r="4" /><circle cx="468" cy="202" r="5" />
            </svg>
            <span className="it-hero__system-label it-mono">SYSTEM / 01</span>
            <span className="it-hero__system-meta it-mono">AUTOMATION × INTELLIGENCE</span>
          </div>

          <div className="it-hero__layout">
            <div className="it-hero__copy">
              <p className="it-hero__eyebrow it-mono"><span /> Software · Automation · Intelligence</p>
              <p className="it-hero__kicker it-mono">Independent technology partner</p>
              <h1 className={`it-hero__title it-giant${heroVisible ? " is-visible" : ""}`} aria-live="polite">
                <span className="it-hero__line it-hero__line--1"><span>{HERO_MESSAGES[heroIndex]!.title[0]}</span></span>
                <span className="it-hero__line it-hero__line--2"><span className="it-accent">{HERO_MESSAGES[heroIndex]!.title[1]}</span></span>
                <span className="it-hero__line it-hero__line--3"><span>{HERO_MESSAGES[heroIndex]!.title[2]}<span className="it-dot" /></span></span>
              </h1>
              <p className={`it-hero__note${heroVisible ? " is-visible" : ""}`} aria-live="polite">{HERO_MESSAGES[heroIndex]!.note}</p>
              <div className="it-hero__actions">
                <a href="#work" data-scroll data-cursor="hover">Explore what we build <span aria-hidden="true">→</span></a>
                <a href="#system" data-scroll data-cursor="hover">How we work</a>
              </div>
            </div>

            <aside className="it-hero__panel" aria-label="Hero slides">
              <div className="it-hero__panel-head"><span className="it-mono">Selected direction</span><span className="it-hero__count it-mono">0{heroIndex + 1} / 0{HERO_MESSAGES.length}</span></div>
              <p className="it-hero__panel-title">Built for the work that matters next.</p>
              <div className="it-hero__slides" role="tablist" aria-label="Hero messages">
                {HERO_MESSAGES.map((message, index) => (
                  <button key={message.title.join("-")} type="button" role="tab" aria-selected={heroIndex === index} className={`it-hero__slide${heroIndex === index ? " is-active" : ""}`} onClick={() => selectHeroSlide(index)} data-cursor="hover">
                    <span>0{index + 1}</span><strong>{message.title.join(" ")}</strong><i aria-hidden="true" />
                  </button>
                ))}
              </div>
              <div className="it-hero__scroll it-mono"><i aria-hidden="true" /><span>Scroll to explore</span></div>
            </aside>
          </div>
        </section>

        {/* ================= 02 STATEMENT ================= */}
        <section className="it-section it-dark it-statement" id="position">
          <p className="it-eyebrow it-mono">02 — Position</p>
          <h2 className="it-mid it-statement__body" style={{ marginTop: "clamp(1.5rem,5vh,3rem)" }}>
            {STATEMENT.split(" ").map((w, i) => (
              <span className="it-clip" key={`${w}-${i}`} style={{ display: "inline-block" }}>
                <span className="it-statement__word">{w}&nbsp;</span>
              </span>
            ))}
          </h2>
          <p className="it-statement__aside">
            Founded by engineers who were tired of decks. We work in small senior teams, in the
            open, against production from week one — because a system that has never met reality is
            only an opinion.
          </p>
        </section>

        {/* ================= 03 CAPABILITY FIELD ================= */}
        <section className="it-section it-dark it-cap" id="capability">
          <p className="it-eyebrow it-mono">03 — Startup services</p>
          <div className="it-cap__grid">
            <div className="it-cap__list" role="tablist" aria-label="Capabilities">
              {CAPS.map((c, i) => (
                <button
                  key={c.key}
                  type="button"
                  role="tab"
                  className="it-cap__item"
                  aria-selected={i === 0}
                  data-cursor="view"
                  data-cursor-label="Explore"
                  data-payload={JSON.stringify({ title: c.title, desc: c.desc, tags: c.tags })}
                >
                  <span className="it-mono">{`0${i + 1}`}</span>
                  <span>{c.title}</span>
                </button>
              ))}
            </div>

            <div className="it-cap__panel" aria-live="polite">
              <h3 className="it-mono" id="cap-title">
                {CAPS[0]!.title}
              </h3>
              <p className="it-cap__desc" id="cap-desc">
                {CAPS[0]!.desc}
              </p>
              <ul className="it-cap__tags" id="cap-tags">
                {CAPS[0]!.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <div className="it-cap__visual" aria-hidden="true">
                {Array.from({ length: 14 }).map((_, i) => (
                  <i key={i} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================= 04 SYSTEM ================= */}
        <section className="it-section it-system" id="system">
          <p className="it-eyebrow it-mono">04 — How we move</p>
          <div className="it-system__stage">
            <span className="it-system__travel" aria-hidden="true" />
            {SYSTEM.map((s) => (
              <div className="it-system__row" key={s.n} data-on="false">
                <span className="it-mono">{s.n}</span>
                <h3>{s.h}</h3>
                <p>{s.p}</p>
                <i aria-hidden="true" />
              </div>
            ))}
          </div>
        </section>

        {/* ================= 05 WORK ================= */}
        <section className="it-work it-dark" id="work" aria-label="Selected work">
          <div className="it-work__track">
            <article className="it-work__panel">
              <div className="it-work__lead">
                <p className="it-eyebrow it-mono">05 — Solution areas</p>
                <h2 className="it-mid" style={{ marginTop: "1.2rem" }}>
                  Practical systems<span className="it-dot" /> built for your operations
                </h2>
              </div>
            </article>

            {WORK.map((p) => (
              <article className="it-work__panel" key={p.n} data-cursor="view" data-cursor-label="View">
                <div>
                  <p className="it-mono it-work__index">{p.n}</p>
                  <h3 className="it-work__title">{p.title}</h3>
                  <p className="it-mono it-work__tags">
                    {p.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </p>
                  <p className="it-work__copy">{p.copy}</p>
                </div>
                <figure className="it-work__figure">
                  <img src={p.img} alt={`${p.title} visual`} loading="lazy" width={1280} height={1600} />
                </figure>
              </article>
            ))}
          </div>
        </section>

        {/* ================= 06 ARCHITECTURE ================= */}
        <section className="it-section it-net" id="architecture">
          <div className="it-net__intro">
            <p className="it-eyebrow it-mono">06 — Systems architecture</p>
            <h2 className="it-mid it-reveal">Every layer working together.</h2>
            <p className="it-net__lead">
              We design the foundations behind reliable products: a connected stack from cloud infrastructure to the customer experience.
            </p>
            <div className="it-net__readout" aria-live="polite">
              {NODES[0]!.info}
            </div>
          </div>
          <div className="it-net__stage">
            <span className="it-net__orbit it-net__orbit--one" aria-hidden="true" />
            <span className="it-net__orbit it-net__orbit--two" aria-hidden="true" />
            <svg className="it-net__svg" aria-hidden="true">
              {EDGES.map(([a, b], i) => (
                <line
                  key={i}
                  className="it-net__line"
                  x1={`${NODES[a]!.x}%`}
                  y1={`${NODES[a]!.y}%`}
                  x2={`${NODES[b]!.x}%`}
                  y2={`${NODES[b]!.y}%`}
                />
              ))}
            </svg>
            {NODES.map((n, i) => (
              <button
                key={n.label}
                type="button"
                className="it-net__node"
                style={{ left: `${n.x}%`, top: `${n.y}%` }}
                data-info={n.info}
                data-cursor="hover"
                aria-current={i === 0}
              >
                <b aria-hidden="true" />
                <small>{n.label}</small>
              </button>
            ))}
            <p className="it-net__hint it-mono">Explore the system</p>
          </div>
        </section>

        {/* ================= 07 FIELDS ================= */}
        <section className="it-section it-dark it-ind" id="fields">
          <span className="it-ind__aura" aria-hidden="true" />
          <p className="it-eyebrow it-mono">07 — Industries we serve</p>
          <div className="it-ind__wrap">
            {INDUSTRIES.map((ind, i) => (
              <button
                key={ind.label}
                type="button"
                className="it-ind__word"
                data-tone={ind.tone}
                data-say={ind.say}
                data-cursor="hover"
                aria-current={i === 0}
              >
                {ind.label}
              </button>
            ))}
          </div>
          <div aria-hidden="true" style={{ height: "clamp(2rem, 4vh, 4rem)" }} />
          <p className="it-ind__say" aria-live="polite">
            {INDUSTRIES[0]!.say}
          </p>
        </section>

        {/* ================= 08 NUMBERS ================= */}
        <section className="it-section it-num" aria-label="What we value">
          <div>
            <p className="it-eyebrow it-mono">08 — What we value</p>
            <p className="it-num__hero" data-count="3">
              <span>0</span>
            </p>
            <p className="it-mono" style={{ marginTop: "1.4rem" }}>
              Product principles behind every build
            </p>
          </div>
          <div className="it-num__side">
            <div className="it-num__cell" data-count="1">
              <strong>
                <span>0</span>
              </strong>
              <span className="it-mono">Clear product direction</span>
            </div>
            <div className="it-num__cell" data-count="2">
              <strong>
                <span>0</span>
              </strong>
              <span className="it-mono">Fast validation and delivery</span>
            </div>
            <div className="it-num__cell" data-count="3">
              <strong>
                <span>0</span>
              </strong>
              <span className="it-mono">Scalable product foundations</span>
            </div>
          </div>
        </section>

        {/* ================= 09 VOICES ================= */}
        <section className="it-section it-dark it-voice" aria-label="Client perspective">
          <p className="it-eyebrow it-mono">09 — Client perspective</p>
          <div className="it-voice__stack">
            {VOICES.map((v, i) => (
              <div className="it-voice__item" key={v.who} data-on={i === 0}>
                <blockquote>&ldquo;{v.quote}&rdquo;</blockquote>
                <footer className="it-mono">
                  <span>{v.who}</span>
                  <span>/</span>
                  <span>{v.org}</span>
                </footer>
              </div>
            ))}
          </div>
          <div className="it-voice__nav" role="tablist" aria-label="Select testimonial">
            {VOICES.map((v, i) => (
              <button
                key={v.who}
                type="button"
                aria-current={i === 0}
                aria-label={`Testimonial ${i + 1}`}
                data-cursor="hover"
              />
            ))}
          </div>
        </section>

        {/* ================= 10 CONTACT ================= */}
        <section className="it-contact" id="contact">
          <div className="it-contact__trail" aria-hidden="true">
            <i />
          </div>
          <p className="it-eyebrow it-mono">10 — Next move</p>
          <h2 className="it-giant it-contact__lines" style={{ marginTop: "clamp(1.5rem,5vh,3rem)" }}>
            <span>Let&rsquo;s</span>
            <span className="it-accent">build</span>
            <span>
              something<span className="it-dot" />
            </span>
          </h2>
          <div className="it-contact__acts">
            <a className="it-contact__act" href="mailto:hello@iamtechni.com?subject=Starting%20a%20project" data-cursor="hover">
              Start a project <em aria-hidden="true">→</em>
            </a>
            <a className="it-contact__act" href="mailto:hello@iamtechni.com?subject=Talk%20to%20us" data-cursor="hover">
              Talk to us <em aria-hidden="true">→</em>
            </a>
            <a className="it-contact__act" href="mailto:hello@iamtechni.com" data-cursor="hover">
              hello@iamtechni.com <em aria-hidden="true">→</em>
            </a>
            <a className="it-contact__act" href="tel:+917418120053" data-cursor="hover">
              +91 74181 20053 <em aria-hidden="true">→</em>
            </a>
            <a className="it-contact__act" href="https://wa.me/917418120053" target="_blank" rel="noreferrer" data-cursor="hover">
              WhatsApp us <em aria-hidden="true">→</em>
            </a>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="it-foot">
        <div className="it-foot__bars" aria-hidden="true">
          {[38, 52, 64, 78, 92, 70, 56, 44].map((h, i) => (
            <i key={i} style={{ height: `${h}%` }} />
          ))}
        </div>
        <span className="it-foot__gold" aria-hidden="true" />

        <div className="it-foot__grid">
          <p className="it-foot__wordmark">
            iamtechni<span className="it-dot" />
          </p>
          <div className="it-foot__col">
            <span className="it-mono">Studio</span>
            <a href="#position" data-scroll data-cursor="hover">
              Position
            </a>
            <a href="#capability" data-scroll data-cursor="hover">
              Capability
            </a>
            <a href="#work" data-scroll data-cursor="hover">
              Work
            </a>
          </div>
          <div className="it-foot__col">
            <span className="it-mono">Contact</span>
            <a href="mailto:hello@iamtechni.com" data-cursor="hover">
              hello@iamtechni.com
            </a>
            <a href="tel:+917418120053" data-cursor="hover">
              +91 74181 20053
            </a>
            <a href="#contact" data-scroll data-cursor="hover">
              Start a project
            </a>
          </div>
          <div className="it-foot__col it-foot__social">
            <span className="it-mono">Follow</span>
            <div className="it-foot__social-links">
              <a href="https://wa.me/917418120053" target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp" data-cursor="hover">
                <MessageCircle aria-hidden="true" />
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" data-cursor="hover">
                <Linkedin aria-hidden="true" />
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" data-cursor="hover">
                <Instagram aria-hidden="true" />
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" data-cursor="hover">
                <Facebook aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="it-foot__base it-mono">
          <span>© {new Date().getFullYear()} iamtechni</span>
          <span>Technology in motion</span>
        </div>
      </footer>
    </div>
  );
}
