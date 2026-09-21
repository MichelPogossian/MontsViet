type BrushLabelProps = {
  children: string;
  className?: string;
  size?: "sm" | "md" | "lg";
};

/**
 * Red dry-brush stroke with white condensed caps, the label style used on the
 * flyer for dish names and the "sur place & à emporter" banner.
 */
export function BrushLabel({ children, className, size = "md" }: BrushLabelProps) {
  return (
    <span className={`brush brush-${size} ${className ?? ""}`}>
      <svg viewBox="0 0 320 72" preserveAspectRatio="none" aria-hidden="true">
        <path
          className="brush-ghost"
          d="M10 22c50-14 120-2 170-10s90-8 132 2c6 20 4 34-2 50-60 8-130 2-190 8s-90 6-110-4C4 54 2 40 10 22Z"
        />
        <path
          className="brush-main"
          d="M4 16C40 4 100 14 150 8s110-10 164 4c4 18 2 34-4 48-56 10-120 0-176 6s-100 8-132-2C0 48 0 30 4 16Z"
        />
      </svg>
      <span className="brush-text">{children}</span>
    </span>
  );
}
