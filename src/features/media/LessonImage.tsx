import { useState } from "react";
import { getLessonImageSrc } from "../../lib/imageFallback";

type LessonImageProps = {
  src: string;
  alt: string;
  className?: string;
};

export function LessonImage({ src, alt, className = "" }: LessonImageProps) {
  const [failed, setFailed] = useState(!src.trim());

  if (failed) {
    return (
      <div
        data-testid="lesson-fallback"
        className={`flex h-full w-full items-center justify-center bg-black/30 text-sm uppercase tracking-[0.2em] text-zinc-500 ${className}`}
      >
        Image unavailable
      </div>
    );
  }

  return (
    <img
      src={getLessonImageSrc(src)}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
