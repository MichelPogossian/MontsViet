import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { DISHES, RESTAURANT, type Dish } from "../../lib/restaurant";
import { BrushLabel } from "./brush-label";
import { PhoneIcon } from "./icons";

/** Card that tilts toward the pointer, with a light sheen that follows it. */
function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef(0);

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || event.pointerType === "touch") return;
    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    window.cancelAnimationFrame(raf.current);
    raf.current = window.requestAnimationFrame(() => {
      el.style.setProperty("--rx", `${(0.5 - py) * 10}deg`);
      el.style.setProperty("--ry", `${(px - 0.5) * 12}deg`);
      el.style.setProperty("--mx", `${px * 100}%`);
      el.style.setProperty("--my", `${py * 100}%`);
    });
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    window.cancelAnimationFrame(raf.current);
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <div ref={ref} className={`tilt ${className ?? ""}`} onPointerMove={onMove} onPointerLeave={onLeave}>
      {children}
    </div>
  );
}

function DishCard({ dish, index }: { dish: Dish; index: number }) {
  return (
    <article className="dish" style={{ "--i": index } as CSSProperties}>
      <TiltCard className="dish-visual">
        <div className="dish-photo">
          <picture>
            <source srcSet={dish.imageWebp} type="image/webp" />
            <img src={dish.image} alt={dish.name} loading="lazy" width="1200" height="1500" />
          </picture>
          {dish.steam ? (
            <div className="steam" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          ) : null}
          <div className="dish-sheen" aria-hidden="true" />
        </div>
        <BrushLabel className="dish-label" size="lg">
          {dish.name}
        </BrushLabel>
      </TiltCard>
      <div className="dish-text">
        <h3 className="dish-name">{dish.subtitle}</h3>
        <p className="dish-desc">{dish.description}</p>
      </div>
    </article>
  );
}

export function Dishes() {
  return (
    <section id="plats" className="dishes">
      <div className="dishes-head">
        <h2 className="section-title" data-split>
          Nos plats signature
        </h2>
        <p className="section-lead" data-reveal>
          Trois incontournables de la maison, préparés chaque jour avec des produits frais. La carte
          complète vous attend au restaurant.
        </p>
      </div>

      <div className="dishes-grid" data-stagger>
        {DISHES.map((dish, i) => (
          <DishCard key={dish.id} dish={dish} index={i} />
        ))}
      </div>

      <div className="dishes-foot" data-reveal>
        <p>Une envie, une question sur un plat ? Nous vous répondons avec plaisir.</p>
        <a href={RESTAURANT.phoneHref} className="cta-inline">
          <PhoneIcon /> {RESTAURANT.phoneDisplay}
        </a>
      </div>
    </section>
  );
}
