import { useEffect, useState } from "react";
import { Lotus } from "./lotus";

type Phase = "closed" | "open" | "done" | "gone";

export const READY_EVENT = "montsviet:ready";

declare global {
  interface Window {
    __montsvietReady?: boolean;
  }
}

/**
 * Opening curtain: a lotus unfolds on a cream page, the name appears, then the
 * curtain lifts to reveal the hero. Fires `montsviet:ready` for the hero intro.
 */
export function Preloader() {
  const [phase, setPhase] = useState<Phase>("closed");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers: number[] = [];
    document.documentElement.classList.add("is-loading");

    const finish = () => {
      setPhase("done");
      document.documentElement.classList.remove("is-loading");
      window.__montsvietReady = true;
      window.dispatchEvent(new CustomEvent(READY_EVENT));
      timers.push(window.setTimeout(() => setPhase("gone"), 1200));
    };

    if (reduced) {
      timers.push(window.setTimeout(finish, 250));
    } else {
      timers.push(window.setTimeout(() => setPhase("open"), 150));
      timers.push(window.setTimeout(finish, 2500));
    }

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      document.documentElement.classList.remove("is-loading");
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div className={`preloader preloader-${phase}`} aria-hidden="true">
      <div className="preloader-inner">
        <Lotus open={phase !== "closed"} className="preloader-lotus" />
        <p className="preloader-word">
          Monts <span>Việt</span>
        </p>
        <p className="preloader-sub">Restaurant vietnamien</p>
      </div>
    </div>
  );
}
