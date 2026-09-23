/**
 * IAMTECHNI — "Technology in Motion"
 * All scroll choreography, hero field, cursor, loader and interaction logic.
 * Vanilla DOM + GSAP/ScrollTrigger + Lenis. Framework-agnostic: given a root
 * element it wires everything and returns a disposer.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

type Cleanup = () => void;

const q = <T extends Element = HTMLElement>(root: ParentNode, sel: string) =>
  root.querySelector(sel) as T | null;
const qa = <T extends Element = HTMLElement>(root: ParentNode, sel: string) =>
  Array.from(root.querySelectorAll(sel)) as T[];

export function initIamtechni(root: HTMLElement): Cleanup {
  const cleanups: Cleanup[] = [];
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const ctx = gsap.context(() => {}, root);

  /* ---------------- smooth scroll ---------------- */
  let lenis: Lenis | null = null;
  if (!reduced) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    const raf = (time: number) => {
      lenis?.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    lenis.on("scroll", ScrollTrigger.update);
    cleanups.push(() => {
      gsap.ticker.remove(raf);
      lenis?.destroy();
    });
  }
  const scrollTo = (target: string) => {
    const el = q(root, target);
    if (!el) return;
    if (lenis) lenis.scrollTo(el as HTMLElement, { offset: 0 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  /* ---------------- loader ---------------- */
  const loader = q(root, ".it-loader");
  const startReveal = () => {
    const tl = gsap.timeline();
    tl.from(qa(root, ".it-hero__line span"), {
      yPercent: 118,
      duration: 1.15,
      ease: "expo.out",
      stagger: 0.08,
    })
      .from(
        qa(root, ".it-hero__bar"),
        { scaleY: 0, transformOrigin: "bottom", duration: 1.2, ease: "expo.out", stagger: 0.1 },
        0.1,
      )
      .from(
        q(root, ".it-hero__system"),
        { opacity: 0, scale: 0.96, transformOrigin: "50% 50%", duration: 1.1, ease: "power3.out" },
        0.3,
      )
      .fromTo(
        qa(root, ".it-hero__system-line"),
        { strokeDasharray: 260, strokeDashoffset: 260 },
        { strokeDashoffset: 0, duration: 1.25, ease: "power2.out", stagger: 0.08 },
        0.45,
      )
      .from(
        [q(root, ".it-hero__gold"), q(root, ".it-hero__meta"), q(root, ".it-brand")].filter(
          Boolean,
        ) as HTMLElement[],
        { opacity: 0, y: 18, duration: 0.9, ease: "power3.out", stagger: 0.08 },
        0.5,
      );
  };

  if (loader && !reduced) {
    const tl = gsap.timeline({
      onComplete: () => {
        loader.dataset["done"] = "true";
        loader.style.display = "none";
        startReveal();
      },
    });
    tl.to(q(loader, ".it-loader__logo"), { opacity: 1, duration: 0.7, ease: "power2.out" })
      .to({}, { duration: 0.25 })
      .to(q(loader, ".it-loader__wipe"), { yPercent: 0, duration: 0.7, ease: "expo.inOut" })
      .to(loader, { opacity: 0, duration: 0.35, ease: "power2.out" });
  } else if (loader) {
    loader.style.display = "none";
  }

  /* ---------------- custom cursor ---------------- */
  const cursor = q(root, ".it-cursor");
  if (cursor && fine && !reduced) {
    const label = q(cursor, ".it-cursor__label");
    const x = gsap.quickTo(cursor, "x", { duration: 0.32, ease: "power3" });
    const y = gsap.quickTo(cursor, "y", { duration: 0.32, ease: "power3" });
    const move = (e: PointerEvent) => {
      x(e.clientX);
      y(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const t = (e.target as HTMLElement)?.closest?.("[data-cursor]") as HTMLElement | null;
      if (t) {
        cursor.dataset["mode"] = t.dataset["cursor"] || "hover";
        if (label) label.textContent = t.dataset["cursorLabel"] || "";
      } else {
        cursor.dataset["mode"] = "";
        if (label) label.textContent = "";
      }
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    cleanups.push(() => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
    });
  }

  /* ---------------- hero: living field ---------------- */
  const canvas = q<HTMLCanvasElement>(root, "#it-field");
  if (canvas && !reduced) {
    const c2d = canvas.getContext("2d");
    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const streaks = Array.from({ length: 26 }, () => ({
      p: Math.random(),
      v: 0.00018 + Math.random() * 0.0007,
      len: 0.15 + Math.random() * 0.5,
      off: Math.random(),
      a: 0.05 + Math.random() * 0.16,
    }));
    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      c2d?.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const onResize = () => resize();
    const onMove = (e: PointerEvent) => {
      pointer.tx = e.clientX / window.innerWidth;
      pointer.ty = e.clientY / window.innerHeight;
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove, { passive: true });

    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!c2d) return;
      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;
      c2d.clearRect(0, 0, w, h);
      const shear = Math.tan((14 * Math.PI) / 180);
      for (const s of streaks) {
        s.p += s.v;
        if (s.p > 1.35) s.p = -0.35;
        const bx = (s.off * 1.25 - 0.12) * w + (pointer.x - 0.5) * 90 * (0.3 + s.len);
        const top = (s.p - s.len) * h + (pointer.y - 0.5) * 40;
        const bot = s.p * h + (pointer.y - 0.5) * 40;
        const g = c2d.createLinearGradient(bx, top, bx, bot);
        g.addColorStop(0, `rgba(36,169,210,0)`);
        g.addColorStop(0.5, `rgba(40,104,216,${s.a})`);
        g.addColorStop(1, `rgba(19,214,176,0)`);
        c2d.strokeStyle = g;
        c2d.lineWidth = 1 + s.len * 2.4;
        c2d.beginPath();
        c2d.moveTo(bx + shear * (h - top), top);
        c2d.lineTo(bx + shear * (h - bot), bot);
        c2d.stroke();
      }
    };
    raf = requestAnimationFrame(draw);
    cleanups.push(() => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
    });
  }

  ctx.add(() => {
    /* ---------------- hero parallax + gold dot ---------------- */
    const hero = q(root, ".it-hero");
    if (hero && !reduced) {
      const bars = qa(root, ".it-hero__bar");
      const gold = q(root, ".it-hero__gold");
      const glow = q(root, ".it-hero__glow");
      const setters = bars.map((b, i) => ({
        x: gsap.quickTo(b, "x", { duration: 1.1, ease: "power3" }),
        y: gsap.quickTo(b, "y", { duration: 1.4, ease: "power3" }),
        d: (i + 1) * 16,
      }));
      const goldX = gold && gsap.quickTo(gold, "x", { duration: 1.6, ease: "power3" });
      const goldY = gold && gsap.quickTo(gold, "y", { duration: 1.6, ease: "power3" });
      const onMove = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        setters.forEach((s) => {
          s.x(nx * s.d * 2.4);
          s.y(ny * s.d);
        });
        goldX?.(nx * 130);
        goldY?.(ny * 90);
        if (glow) gsap.to(glow, { x: nx * -80, y: ny * -60, duration: 1.8, ease: "power3" });
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      cleanups.push(() => window.removeEventListener("pointermove", onMove));

      if (gold) {
        gsap.to(gold, {
          y: "+=26",
          duration: 3.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }

      /* PHASE 01 — hero type breaks apart on scroll */
      const lines = qa(root, ".it-hero__line span");
      gsap
        .timeline({
          scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.6 },
        })
        .to(lines, { yPercent: -70, xPercent: (i) => (i % 2 ? 16 : -14), stagger: 0.05 }, 0)
        .to(lines, { opacity: 0, filter: "blur(14px)", stagger: 0.05 }, 0.15)
        .to(q(root, ".it-hero__meta"), { opacity: 0, y: -40 }, 0)
        .to(q(root, ".it-brand"), { opacity: 0, y: -18 }, 0)
        /* PHASE 02 — diagonal geometry expands */
        .to(bars, { scaleY: 1.7, xPercent: (i) => (i - 1) * 40, opacity: 0.28 }, 0);
    } else if (hero) {
      gsap.to(q(root, ".it-brand"), {
        opacity: 0,
        scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
      });
    }

    /* ---------------- generic reveals ---------------- */
    qa(root, ".it-reveal").forEach((el) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 88%" },
      });
    });

    /* ---------------- statement: words at different speeds ---------------- */
    const statement = q(root, ".it-statement");
    if (statement) {
      const words = qa(root, ".it-statement__word");
      gsap.from(words, {
        yPercent: 110,
        opacity: 0,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.045,
        scrollTrigger: { trigger: statement, start: "top 74%" },
      });
    }

    /* ---------------- system: gold dot travels, stages activate ---------------- */
    const stage = q(root, ".it-system__stage");
    const travel = q(root, ".it-system__travel");
    if (stage && travel) {
      const rows = qa(root, ".it-system__row");
      gsap.to(travel, {
        y: () => stage.offsetHeight - 14,
        ease: "none",
        scrollTrigger: { trigger: stage, start: "top 70%", end: "bottom 60%", scrub: 0.5 },
      });
      rows.forEach((row) => {
        ScrollTrigger.create({
          trigger: row,
          start: "top 68%",
          end: "bottom 30%",
          onToggle: (self) => {
            row.dataset["on"] = self.isActive ? "true" : "false";
          },
        });
      });
    }

    /* ---------------- work: pinned horizontal gallery ---------------- */
    const work = q(root, ".it-work");
    const track = q(root, ".it-work__track");
    if (work && track && !reduced && window.matchMedia("(min-width: 861px)").matches) {
      const distance = () => track.scrollWidth - window.innerWidth;
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: work,
          start: "top top",
          end: () => `+=${distance() + window.innerHeight * 0.5}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
      qa(root, ".it-work__figure img").forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -10 },
          {
            yPercent: 0,
            ease: "none",
            scrollTrigger: {
              trigger: work,
              start: "top top",
              end: () => `+=${distance()}`,
              scrub: 1,
            },
          },
        );
      });
    }

    /* ---------------- numbers ---------------- */
    qa(root, "[data-count]").forEach((el) => {
      const target = Number(el.dataset["count"] || 0);
      const obj = { v: 0 };
      gsap.to(obj, {
        v: target,
        duration: 1.8,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 85%" },
        onUpdate: () => {
          el.firstChild && (el.firstChild.textContent = String(Math.round(obj.v)));
        },
      });
      gsap.from(el, {
        yPercent: 22,
        opacity: 0,
        duration: 1.3,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 88%" },
      });
    });

    /* ---------------- footer bars grow ---------------- */
    const foot = q(root, ".it-foot");
    if (foot) {
      gsap.from(qa(root, ".it-foot__bars i"), {
        scaleY: 0,
        duration: 1.4,
        ease: "expo.out",
        stagger: 0.05,
        scrollTrigger: { trigger: foot, start: "top 80%" },
      });
      const gold = q(root, ".it-foot__gold");
      if (gold && !reduced) {
        gsap.to(gold, {
          x: () => foot.clientWidth * 0.78,
          ease: "none",
          scrollTrigger: { trigger: foot, start: "top bottom", end: "bottom bottom", scrub: 1 },
        });
      }
    }
  }, root);

  /* ---------------- nav rail state + inversion ---------------- */
  const railItems = qa<HTMLButtonElement>(root, ".it-rail__item");
  const rail = q(root, ".it-rail");
  const sections = railItems
    .map((b) => q(root, `#${b.dataset["target"]}`))
    .filter(Boolean) as HTMLElement[];
  const onRailClick = (e: Event) => {
    const btn = (e.currentTarget as HTMLElement).dataset["target"];
    if (btn) scrollTo(`#${btn}`);
  };
  railItems.forEach((b) => b.addEventListener("click", onRailClick));
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const id = (en.target as HTMLElement).id;
        railItems.forEach((b) =>
          b.setAttribute("aria-current", b.dataset["target"] === id ? "true" : "false"),
        );
        if (rail)
          rail.dataset["invert"] = (en.target as HTMLElement).classList.contains("it-dark")
            ? "true"
            : "false";
      });
    },
    { rootMargin: "-45% 0px -45% 0px" },
  );
  sections.forEach((s) => io.observe(s));
  cleanups.push(() => {
    io.disconnect();
    railItems.forEach((b) => b.removeEventListener("click", onRailClick));
  });

  /* ---------------- mobile overlay nav ---------------- */
  const menuBtn = q<HTMLButtonElement>(root, ".it-menu-btn");
  const overlay = q(root, ".it-overlay");
  if (menuBtn && overlay) {
    const links = qa(overlay, "a");
    let open = false;
    const setOpen = (next: boolean) => {
      open = next;
      overlay.dataset["open"] = String(next);
      menuBtn.setAttribute("aria-expanded", String(next));
      menuBtn.setAttribute("aria-label", next ? "Close navigation" : "Open navigation");
      gsap.to(overlay, {
        clipPath: next ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)",
        duration: 0.7,
        ease: "expo.inOut",
      });
      gsap.to(links, {
        opacity: next ? 1 : 0,
        y: next ? 0 : 24,
        duration: 0.6,
        ease: "expo.out",
        stagger: next ? 0.06 : 0,
        delay: next ? 0.18 : 0,
      });
      if (lenis) next ? lenis.stop() : lenis.start();
      if (next) links[0]?.focus();
      else menuBtn.focus();
    };
    const toggle = () => setOpen(!open);
    menuBtn.addEventListener("click", toggle);
    const onLink = (e: Event) => {
      e.preventDefault();
      const href = (e.currentTarget as HTMLAnchorElement).getAttribute("href") || "";
      setOpen(false);
      setTimeout(() => scrollTo(href), 260);
    };
    links.forEach((l) => l.addEventListener("click", onLink));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    cleanups.push(() => {
      menuBtn.removeEventListener("click", toggle);
      links.forEach((l) => l.removeEventListener("click", onLink));
      window.removeEventListener("keydown", onKey);
      lenis?.start();
    });
  }

  /* ---------------- capability field ---------------- */
  const capItems = qa<HTMLButtonElement>(root, ".it-cap__item");
  if (capItems.length) {
    const title = q(root, "#cap-title");
    const desc = q(root, "#cap-desc");
    const tags = q(root, "#cap-tags");
    const visual = q(root, ".it-cap__visual");
    let activeIndex = 0;
    const activate = (idx: number) => {
      activeIndex = idx;
      capItems.forEach((it, i) => {
        it.setAttribute("aria-selected", i === idx ? "true" : "false");
        const dist = i - idx;
        gsap.to(it, {
          x: i === idx ? 34 : dist * 14,
          opacity: i === idx ? 1 : 0.5,
          duration: 0.7,
          ease: "expo.out",
        });
      });
      const src = capItems[idx]!;
      const data = JSON.parse(src.dataset["payload"] || "{}") as {
        title: string;
        desc: string;
        tags: string[];
      };
      if (title) title.textContent = data.title;
      if (desc) desc.textContent = data.desc;
      if (tags) {
        tags.innerHTML = data.tags.map((t) => `<li>${t}</li>`).join("");
        gsap.from(qa(tags, "li"), {
          opacity: 0,
          x: -14,
          duration: 0.5,
          ease: "expo.out",
          stagger: 0.05,
        });
      }
      if (visual) {
        gsap.to(qa(visual, "i"), {
          height: () => `${18 + Math.random() * 82}%`,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.03,
        });
      }
    };
    const handlers = capItems.map((it, i) => {
      const h = () => activate(i);
      it.addEventListener("pointerenter", h);
      it.addEventListener("focus", h);
      it.addEventListener("click", h);
      return h;
    });
    activate(0);
    const mobileQuery = window.matchMedia("(max-width: 700px) and (pointer: coarse)");
    const autoAdvance = mobileQuery.matches
      ? window.setInterval(() => activate((activeIndex + 1) % capItems.length), 5000)
      : undefined;
    cleanups.push(() => {
      capItems.forEach((it, i) => {
        it.removeEventListener("pointerenter", handlers[i]!);
        it.removeEventListener("focus", handlers[i]!);
        it.removeEventListener("click", handlers[i]!);
      });
      if (autoAdvance !== undefined) window.clearInterval(autoAdvance);
    });
  }

  /* ---------------- network nodes ---------------- */
  const nodes = qa<HTMLButtonElement>(root, ".it-net__node");
  if (nodes.length) {
    const readout = q(root, ".it-net__readout");
    const set = (idx: number) => {
      nodes.forEach((n, i) => n.setAttribute("aria-current", i === idx ? "true" : "false"));
      if (readout) {
        readout.textContent = nodes[idx]!.dataset["info"] || "";
        gsap.fromTo(readout, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5 });
      }
    };
    const hs = nodes.map((n, i) => {
      const h = () => set(i);
      n.addEventListener("pointerenter", h);
      n.addEventListener("focus", h);
      return h;
    });
    set(0);
    if (!reduced) {
      nodes.forEach((n, i) =>
        gsap.to(n, {
          y: (i % 2 ? 1 : -1) * (6 + (i % 3) * 4),
          duration: 3 + i * 0.3,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        }),
      );
    }
    cleanups.push(() =>
      nodes.forEach((n, i) => {
        n.removeEventListener("pointerenter", hs[i]!);
        n.removeEventListener("focus", hs[i]!);
      }),
    );
  }

  /* ---------------- industries environment ---------------- */
  const indWords = qa<HTMLButtonElement>(root, ".it-ind__word");
  if (indWords.length) {
    const host = q(root, ".it-ind");
    const aura = q(root, ".it-ind__aura");
    const say = q(root, ".it-ind__say");
    const set = (idx: number) => {
      indWords.forEach((w, i) => w.setAttribute("aria-current", i === idx ? "true" : "false"));
      const el = indWords[idx]!;
      const tone = el.dataset["tone"] || "#2868d8";
      if (aura)
        aura.style.background = `radial-gradient(circle, ${tone}55, transparent 62%)`;
      if (host)
        host.style.background = `linear-gradient(160deg, #091733, color-mix(in oklab, ${tone} 18%, #06101f) 70%)`;
      if (say) {
        say.textContent = el.dataset["say"] || "";
        gsap.fromTo(say, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, ease: "expo.out" });
      }
      indWords.forEach((w, i) =>
        gsap.to(w, {
          y: i === idx ? -8 : (i - idx) * 3,
          duration: 0.7,
          ease: "expo.out",
        }),
      );
    };
    const hs = indWords.map((w, i) => {
      const h = () => set(i);
      w.addEventListener("pointerenter", h);
      w.addEventListener("focus", h);
      return h;
    });
    set(0);
    cleanups.push(() =>
      indWords.forEach((w, i) => {
        w.removeEventListener("pointerenter", hs[i]!);
        w.removeEventListener("focus", hs[i]!);
      }),
    );
  }

  /* ---------------- voices (kinetic testimonials) ---------------- */
  const voices = qa(root, ".it-voice__item");
  const dots = qa<HTMLButtonElement>(root, ".it-voice__nav button");
  if (voices.length) {
    let idx = 0;
    let timer = 0;
    const show = (next: number) => {
      const prev = idx;
      idx = (next + voices.length) % voices.length;
      voices.forEach((v, i) => (v.dataset["on"] = i === idx ? "true" : "false"));
      dots.forEach((d, i) => d.setAttribute("aria-current", i === idx ? "true" : "false"));
      if (!reduced) {
        gsap.fromTo(
          qa(voices[idx]!, "blockquote, footer"),
          { yPercent: 60, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.9, ease: "expo.out", stagger: 0.08 },
        );
        gsap.to(qa(voices[prev]!, "blockquote, footer"), {
          yPercent: -40,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
        });
      }
    };
    show(0);
    const loop = () => {
      timer = window.setTimeout(() => {
        show(idx + 1);
        loop();
      }, 6200);
    };
    if (!reduced) loop();
    const hs = dots.map((d, i) => {
      const h = () => {
        window.clearTimeout(timer);
        show(i);
        if (!reduced) loop();
      };
      d.addEventListener("click", h);
      return h;
    });
    cleanups.push(() => {
      window.clearTimeout(timer);
      dots.forEach((d, i) => d.removeEventListener("click", hs[i]!));
    });
  }

  /* ---------------- contact glow trail ---------------- */
  const contact = q(root, ".it-contact");
  const trail = q(root, ".it-contact__trail i");
  if (contact && trail && fine && !reduced) {
    gsap.set(trail, { opacity: 0 });
    const x = gsap.quickTo(trail, "left", { duration: 0.9, ease: "power3" });
    const y = gsap.quickTo(trail, "top", { duration: 0.9, ease: "power3" });
    const move = (e: PointerEvent) => {
      const r = contact.getBoundingClientRect();
      x(e.clientX - r.left);
      y(e.clientY - r.top);
    };
    const enter = () => gsap.to(trail, { opacity: 1, duration: 0.5 });
    const leave = () => gsap.to(trail, { opacity: 0, duration: 0.5 });
    contact.addEventListener("pointermove", move, { passive: true });
    contact.addEventListener("pointerenter", enter);
    contact.addEventListener("pointerleave", leave);
    cleanups.push(() => {
      contact.removeEventListener("pointermove", move);
      contact.removeEventListener("pointerenter", enter);
      contact.removeEventListener("pointerleave", leave);
    });
  }

  /* ---------------- anchor links inside page ---------------- */
  const anchors = qa<HTMLAnchorElement>(root, "a[data-scroll]");
  const onAnchor = (e: Event) => {
    e.preventDefault();
    scrollTo((e.currentTarget as HTMLAnchorElement).getAttribute("href") || "");
  };
  anchors.forEach((a) => a.addEventListener("click", onAnchor));
  cleanups.push(() => anchors.forEach((a) => a.removeEventListener("click", onAnchor)));

  ScrollTrigger.refresh();

  return () => {
    cleanups.forEach((c) => c());
    ctx.revert();
    ScrollTrigger.getAll().forEach((t) => t.kill());
  };
}
