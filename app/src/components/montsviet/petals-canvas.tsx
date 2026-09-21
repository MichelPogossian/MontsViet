import { useEffect, useRef } from "react";

type Petal = {
  x: number;
  y: number;
  size: number;
  angle: number;
  spin: number;
  vy: number;
  sway: number;
  phase: number;
  color: string;
  alpha: number;
};

const COLORS = ["#c8463a", "#b4382c", "#d9573f", "#e07a5f", "#9c2f24"];

/**
 * Blossom petals drifting down over the hero. Plain canvas, transform-only
 * work, paused when off screen or when the tab is hidden, disabled for
 * reduced-motion users.
 */
export function PetalsCanvas({ className, density = 1 }: { className?: string; density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let petals: Petal[] = [];
    let raf = 0;
    let running = false;
    let visible = true;

    const spawn = (fromTop: boolean): Petal => ({
      x: Math.random() * width,
      y: fromTop ? -20 : Math.random() * height,
      size: 4 + Math.random() * 7,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.04,
      vy: 0.35 + Math.random() * 0.75,
      sway: 0.4 + Math.random() * 0.9,
      phase: Math.random() * Math.PI * 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: 0.55 + Math.random() * 0.4,
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(30, Math.max(10, Math.round((width / 52) * density)));
      petals = Array.from({ length: count }, () => spawn(false));
    };

    const drawPetal = (p: Petal, t: number) => {
      const s = p.size;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle + Math.sin(t * 0.001 + p.phase) * 0.35);
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.bezierCurveTo(s * 0.95, -s * 0.45, s * 0.95, s * 0.45, 0, s);
      ctx.bezierCurveTo(-s * 0.95, s * 0.45, -s * 0.95, -s * 0.45, 0, -s);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const frame = (t: number) => {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.y += p.vy;
        p.x += Math.sin(t * 0.0012 + p.phase) * p.sway * 0.6;
        p.angle += p.spin;
        if (p.y > height + 24 || p.x < -30 || p.x > width + 30) {
          petals[i] = spawn(true);
        }
        drawPetal(p, t);
      }
      raf = window.requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || !visible || document.hidden) return;
      running = true;
      raf = window.requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      window.cancelAnimationFrame(raf);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { threshold: 0 },
    );
    const onVisibility = () => (document.hidden ? stop() : start());

    resize();
    io.observe(canvas);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    start();

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [density]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
