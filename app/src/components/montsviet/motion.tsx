import { useEffect } from "react";
import { READY_EVENT } from "./preloader";

/**
 * Page-wide motion: Lenis smooth scroll bridged to GSAP's ticker, anchor
 * scrolling, and scroll reveals driven by data attributes:
 *
 *   data-reveal            slide up (transform + partial opacity, never from 0)
 *   data-reveal="left"     slide in from the left
 *   data-reveal="right"    slide in from the right
 *   data-reveal="clip"     wipe reveal for images
 *   data-stagger           children reveal one after another
 *   data-split             words of a headline rise one by one
 *   data-parallax="0.15"   gentle scroll parallax (fraction of section height)
 *
 * Everything is skipped for prefers-reduced-motion. All browser access lives in
 * this effect, so the component is SSR safe.
 */
export function Motion() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cancelled = false;
    let cleanup: () => void = () => {};

    (async () => {
      const [{ default: Lenis }, gsapMod, stMod] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      const gsap = gsapMod.gsap;
      const ScrollTrigger = stMod.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      const lenis = reduced
        ? null
        : new Lenis({ autoRaf: false, lerp: 0.11, wheelMultiplier: 0.95, smoothWheel: true });

      const tick = (time: number) => lenis?.raf(time * 1000);
      if (lenis) {
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
        if (!window.__montsvietReady) lenis.stop();
      }

      const onReady = () => lenis?.start();
      window.addEventListener(READY_EVENT, onReady);

      // Smooth anchor navigation for every in-page link.
      const onClick = (event: MouseEvent) => {
        const anchor = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>(
          'a[href^="#"]',
        );
        if (!anchor) return;
        const hash = anchor.getAttribute("href");
        if (!hash || hash === "#") return;
        const target = document.querySelector<HTMLElement>(hash);
        if (!target) return;
        event.preventDefault();
        if (lenis) lenis.scrollTo(target, { offset: -72, duration: 1.4 });
        else target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
        history.replaceState(null, "", hash);
      };
      document.addEventListener("click", onClick);

      const ctx = gsap.context(() => {
        if (reduced) return;
        const start = "top 86%";

        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          const kind = el.dataset.reveal || "up";
          if (kind === "clip") {
            gsap.fromTo(
              el,
              { clipPath: "inset(0 0 100% 0)", scale: 1.06 },
              {
                clipPath: "inset(0 0 0% 0)",
                scale: 1,
                duration: 1.3,
                ease: "expo.out",
                scrollTrigger: { trigger: el, start, once: true },
              },
            );
            return;
          }
          const from =
            kind === "left" ? { x: -56, opacity: 0.2 } : kind === "right" ? { x: 56, opacity: 0.2 } : { y: 48, opacity: 0.2 };
          gsap.from(el, {
            ...from,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start, once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((el) => {
          gsap.from(el.children, {
            y: 44,
            opacity: 0.2,
            scale: 0.985,
            duration: 1,
            stagger: 0.14,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start, once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
          if (el.dataset.splitDone) return;
          const text = el.textContent ?? "";
          el.textContent = "";
          const words = text.split(/(\s+)/);
          const targets: HTMLElement[] = [];
          for (const word of words) {
            if (!word) continue;
            if (/^\s+$/.test(word)) {
              el.appendChild(document.createTextNode(" "));
              continue;
            }
            const wrap = document.createElement("span");
            wrap.className = "split-wrap";
            const inner = document.createElement("span");
            inner.className = "split-word";
            inner.textContent = word;
            wrap.appendChild(inner);
            el.appendChild(wrap);
            targets.push(inner);
          }
          el.dataset.splitDone = "1";
          gsap.from(targets, {
            yPercent: 110,
            rotate: 3,
            duration: 1,
            stagger: 0.07,
            ease: "power4.out",
            scrollTrigger: { trigger: el, start, once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          const amount = parseFloat(el.dataset.parallax || "0.15");
          gsap.fromTo(
            el,
            { yPercent: amount * 60 },
            {
              yPercent: -amount * 60,
              ease: "none",
              scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
      });

      const refresh = () => ScrollTrigger.refresh();
      document.fonts?.ready.then(refresh).catch(() => {});
      window.addEventListener("load", refresh);

      cleanup = () => {
        window.removeEventListener(READY_EVENT, onReady);
        window.removeEventListener("load", refresh);
        document.removeEventListener("click", onClick);
        ctx.revert();
        if (lenis) {
          gsap.ticker.remove(tick);
          lenis.destroy();
        }
      };
    })().catch(() => {});

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return null;
}
