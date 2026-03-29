import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  className?: string;
  /** e.g. "16/10" */
  ratio?: string;
  priority?: boolean;
  sizes?: string;
};

export function SiteImage({
  src,
  alt,
  className = "",
  ratio = "4/3",
  priority = false,
  sizes = "(max-width: 768px) 100vw, min(720px, 55vw)",
}: Props) {
  return (
    <div
      className={`site-image-frame ${className}`.trim()}
      style={{ aspectRatio: ratio }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="site-image-img"
        priority={priority}
      />
    </div>
  );
}
