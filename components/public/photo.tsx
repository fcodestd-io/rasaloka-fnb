import Image from "next/image";
import { UtensilsCrossed } from "lucide-react";
import { getPhoto, type SitePhoto } from "@/content/images";

interface Props {
  photoKey: string;
  fallbackKeys?: readonly string[];
  alt?: string; // menimpa alt bawaan (mis. nama menu)
  sizes: string;
  priority?: boolean;
  className?: string; // tentukan ukuran wadah, mis. "aspect-[4/3] w-full"
}

// Foto dari content/images.generated.json; jika tidak ada → placeholder (tanpa emoji).
export function Photo({ photoKey, fallbackKeys = [], alt, sizes, priority = false, className = "" }: Props) {
  const photo = [photoKey, ...fallbackKeys]
    .map((k) => getPhoto(k))
    .find((p): p is SitePhoto => p !== undefined);

  if (!photo) {
    return (
      <div
        role="img"
        aria-label={alt ?? "Foto belum tersedia"}
        className={`flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-100 to-amber-50 ${className}`}
      >
        <UtensilsCrossed className="size-8 text-orange-300" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-stone-100 ${className}`}>
      <Image
        src={photo.src}
        alt={alt ?? photo.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}
