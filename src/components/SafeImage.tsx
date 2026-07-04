"use client";

import { resolveImageSrc } from "@/lib/imageFallback";

type SafeImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

/** Renders an img tag with automatic fallback for unreplaced placeholder tokens. */
export function SafeImage({ src, alt, ...props }: SafeImageProps) {
  const resolved = resolveImageSrc(typeof src === "string" ? src : undefined);
  return <img src={resolved} alt={alt ?? ""} {...props} />;
}
