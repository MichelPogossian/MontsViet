import { useEffect, useRef } from "react";
import { RESTAURANT } from "../../lib/restaurant";
import { ArrowDownIcon, PhoneIcon } from "./icons";
import { PetalsCanvas } from "./petals-canvas";
import { READY_EVENT } from "./preloader";

/**
 * Hero: the generated pho film breathes behind a cream veil, the logo blooms
 * in with a hand-drawn ring, petals fall, and the film parallaxes on scroll.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cancelled = false;
    let cleanup: () => void = () => {};

    const play = () => {
      const v = video.current;
      if (!v) return;
      v.play().catch(() => {});
    };

    const run = async () => {
      const [gsapMod, stMod] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled) return;
      const gsap = gsapMod.gsap;
      gsap.registerPlugin(stMod.ScrollTrigger);

      const ctx = gsap.context(() => {
        if (reduced) return;

        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
        intro
          .fromTo(
            ".hero-logo",
            { clipPath: "circle(0% at 50% 50%)", scale: 0.78, rotate: -10 },
            { clipPath: "circle(71% at 50% 50%)", scale: 1, rotate: 0, duration: 1.5 },
          )
          .fromTo(
            ".hero-ring",
            { strokeDashoffset: 1, opacity: 1 },
            { strokeDashoffset: 0, duration: 1.7, ease: "power2.inOut" },
            "<0.15",
          )
          .to(".hero-ring", { opacity: 0.45, duration: 1.2 }, ">-0.2")
          .from(".hero-line", { y: 46, opacity: 0, stagger: 0.14, duration: 1 }, "-=1.6")
          .from(".hero-cta > *", { y: 22, opacity: 0, stagger: 0.12, duration: 0.8 }, "-=0.6")
          .from(".hero-scroll-hint", { opacity: 0, y: -10, duration: 0.8 }, "-=0.3");

        gsap.to(".hero-logo-float", {
          y: -12,
          duration: 3.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });

        gsap.to(".hero-media", {
          yPercent: 16,
          scale: 1.1,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to(".hero-content", {
          yPercent: -14,
          opacity: 0.35,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
        });

        // Pointer parallax: the logo drifts gently toward the cursor.
        const xTo = gsap.quickTo(".hero-logo-mouse", "x", { duration: 0.8, ease: "power3" });
        const yTo = gsap.quickTo(".hero-logo-mouse", "y", { duration: 0.8, ease: "power3" });
        const onMove = (event: PointerEvent) => {
          const rect = el.getBoundingClientRect();
          const nx = (event.clientX - rect.left) / rect.width - 0.5;
          const ny = (event.clientY - rect.top) / rect.height - 0.5;
          xTo(nx * 26);
          yTo(ny * 18);
        };
        const onLeave = () => {
          xTo(0);
          yTo(0);
        };
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);
        cleanup = () => {
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerleave", onLeave);
        };
      }, el);

      const prev = cleanup;
      cleanup = () => {
        prev();
        ctx.revert();
      };
    };

    const onReady = () => {
      play();
      run().catch(() => {});
    };
    if (window.__montsvietReady) onReady();
    else window.addEventListener(READY_EVENT, onReady, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener(READY_EVENT, onReady);
      cleanup();
    };
  }, []);

  return (
    <section id="accueil" ref={root} className="hero">
      <div className="hero-media" aria-hidden="true">
        <video
          ref={video}
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/assets/hero-poster.jpg"
        >
          <source src="/assets/hero-loop.webm" type="video/webm" />
          <source src="/assets/hero-loop.mp4" type="video/mp4" />
        </video>
        <div className="hero-veil" />
      </div>

      <PetalsCanvas className="hero-petals" />

      <div className="hero-content">
        <div className="hero-logo-mouse">
          <div className="hero-logo-float">
            <div className="hero-logo-wrap">
              <svg className="hero-ring-svg" viewBox="0 0 100 100" aria-hidden="true">
                <circle
                  className="hero-ring"
                  cx="50"
                  cy="50"
                  r="48.5"
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={0}
                  transform="rotate(-100 50 50)"
                />
              </svg>
              <picture>
                <source srcSet="/assets/logo.webp" type="image/webp" />
                <img
                  src="/assets/logo.png"
                  alt="Monts Việt, restaurant vietnamien"
                  className="hero-logo"
                  width="1400"
                  height="1401"
                  fetchPriority="high"
                />
              </picture>
            </div>
          </div>
        </div>

        <div className="hero-text">
          <p className="hero-line hero-tagline">{RESTAURANT.tagline}</p>
          <h1 className="hero-line hero-title">
            Saveurs du Vietnam
            <span className="hero-title-sub">à Saint-Jean-de-Monts</span>
          </h1>
          <p className="hero-line hero-sub">
            Cuisine traditionnelle, produits frais sélectionnés, plats faits avec passion. Sur place
            et à emporter, midi et soir, sept jours sur sept.
          </p>
          <div className="hero-cta">
            <a href={RESTAURANT.phoneHref} className="cta-call">
              <span className="cta-call-icon">
                <PhoneIcon />
              </span>
              <span className="cta-call-label">
                <span className="cta-call-kicker">Commander par téléphone</span>
                <span className="cta-call-number">{RESTAURANT.phoneDisplay}</span>
              </span>
            </a>
            <a href="#plats" className="cta-discover">
              <span>Découvrir nos plats</span>
              <ArrowDownIcon className="cta-discover-arrow" />
            </a>
          </div>
        </div>
      </div>

      <a href="#plats" className="hero-scroll-hint" aria-label="Faire défiler vers nos plats">
        <span className="hero-scroll-line" />
      </a>
    </section>
  );
}
