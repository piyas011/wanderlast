import Image from "next/image"

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
    />
  )
}
