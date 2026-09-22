import { useEffect, useRef, useState } from "react";
import { HeartIcon } from "./icons";
import { Lotus } from "./lotus";

/**
 * The framed "Saveurs du Vietnam" panel from the flyer, set on the generated
 * blossom-and-lantern film. The film plays once each time the section comes
 * into view and rests on its last frame; the lotus unfolds when seen.
 */
export function Saveurs() {
  const video = useRef<HTMLVideoElement>(null);
  const section = useRef<HTMLElement>(null);
  const [lotusOpen, setLotusOpen] = useState(false);

  useEffect(() => {
    const el = section.current;
    const v = video.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLotusOpen(true);
          if (v && !reduced) {
            v.currentTime = 0;
            v.play().catch(() => {});
          }
        } else {
          v?.pause();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={section} className="saveurs">
      <div className="saveurs-media" aria-hidden="true">
        <video
          ref={video}
          className="saveurs-video"
          muted
          playsInline
          preload="metadata"
          poster="/assets/blossom-poster.jpg"
        >
          <source src="/assets/blossom-loop.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="saveurs-frame" data-reveal>
        <span className="saveurs-corner saveurs-corner-tl" aria-hidden="true" />
        <span className="saveurs-corner saveurs-corner-tr" aria-hidden="true" />
        <span className="saveurs-corner saveurs-corner-bl" aria-hidden="true" />
        <span className="saveurs-corner saveurs-corner-br" aria-hidden="true" />

        <Lotus open={lotusOpen} variant="line" className="saveurs-lotus" />
        <h2 className="saveurs-title">Saveurs du Vietnam</h2>
        <ul className="saveurs-list" data-stagger>
          <li>Cuisine traditionnelle</li>
          <li>Produits frais sélectionnés</li>
          <li>Faits avec passion</li>
        </ul>
        <div className="saveurs-divider" aria-hidden="true">
          <span />
          <HeartIcon className="saveurs-heart" />
          <span />
        </div>
        <p className="saveurs-thanks">Merci pour votre soutien et à très bientôt !</p>
      </div>
    </section>
  );
}
