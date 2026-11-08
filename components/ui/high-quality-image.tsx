"use client"

import Image from "next/image"
import { useState } from "react"
import { ImageOff } from "lucide-react"

type HighQualityImageProps = {
  src: string
  alt: string
  className?: string
  sizes?: string
  priority?: boolean
  quality?: number
  objectPosition?: string
}

export default function HighQualityImage({
  src,
  alt,
  className,
  sizes = "100vw",
  priority = false,
  quality = 90,
  objectPosition = "center",
}: HighQualityImageProps) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt || "Image unavailable"}
        className={`grid place-items-center bg-slate-100 text-slate-400 ${className ?? ""}`}
      >
        <ImageOff aria-hidden="true" className="size-10" />
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      unoptimized={false}
      sizes={sizes}
      quality={quality}
      priority={priority}
      className={className}
      style={{ objectPosition }}
      onError={() => setFailed(true)}
    />
  )
}
