import Image from "next/image";

interface IllustrationProps {
  /** Path under /public — a Storyset SVG, recoloured to the palette. */
  src: string;
  /** Intrinsic size, so next/image reserves the right box. */
  width: number;
  height: number;
  alt: string;
  className?: string;
  priority?: boolean;
}

/**
 * Renders a Storyset illustration in its authored colours, on both themes.
 *
 * There is deliberately no plate, no glow and no re-paint: the art keeps its
 * white lab coats, light screens and true skin tones, and sits straight on the
 * card. Dark-mode legibility is a separation problem, not a colour one, so it is
 * solved by a light rim traced around the artwork's own silhouette in CSS —
 * see `.dark .illustration-frame img` in globals.css.
 *
 * The art keeps its own proportions, so the frame is sized by the image and the
 * `width`/`height` props only reserve space to avoid layout shift.
 */
export default function Illustration({
  src,
  width,
  height,
  alt,
  className,
  priority = false,
}: IllustrationProps) {
  return (
    <div className="illustration-frame">
      <Image src={src} alt={alt} width={width} height={height} priority={priority} className={className} />
    </div>
  );
}
