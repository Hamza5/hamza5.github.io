import Image from "next/image";

interface IllustrationProps {
  /** Path under /public, usually an unDraw SVG recoloured to the palette. */
  src: string;
  /** Intrinsic size, so next/image reserves the right box. */
  width: number;
  height: number;
  alt: string;
  /**
   * Forces a fixed art-board shape (e.g. "4 / 3") and fits the art inside it.
   * Cards use this so rows line up despite the source illustrations having
   * different proportions; the hero omits it and uses the natural shape.
   */
  aspect?: string;
  className?: string;
  priority?: boolean;
}

/**
 * unDraw illustrations are drawn with dark ink, so they always sit on their own
 * light "art board" rather than on the themed page surface. That keeps them
 * legible in dark mode without maintaining two colour variants of every file.
 */
export default function Illustration({
  src,
  width,
  height,
  alt,
  aspect,
  className,
  priority = false,
}: IllustrationProps) {
  const framed = Boolean(aspect);

  return (
    <div className="illustration-frame" style={aspect ? { aspectRatio: aspect } : undefined}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={className}
        style={
          framed
            ? { width: "100%", height: "100%", objectFit: "contain" }
            : { width: "100%", height: "auto" }
        }
      />
    </div>
  );
}
