// Foto dibaca dari content/images.generated.json (dibuat oleh scripts/fetch-images.mjs).
// Bila belum ada, komponen <Photo> menampilkan placeholder; situs tetap berfungsi.
import generated from "./images.generated.json";
import { slugify } from "@/lib/slug";

export interface PhotoCredit {
  name: string; // fotografer
  url: string; // profil fotografer
}

export interface SitePhoto {
  src: string; // path lokal di /public
  width: number;
  height: number;
  alt: string;
  credit: PhotoCredit;
  sourceUrl: string; // halaman foto di Pexels
  pexelsId?: number;
}

const photos = generated as Record<string, SitePhoto>;

export function getPhoto(key: string): SitePhoto | undefined {
  return photos[key];
}

export function allPhotos(): Array<[string, SitePhoto]> {
  return Object.entries(photos).sort(([a], [b]) => a.localeCompare(b));
}

export const itemKey = (name: string): string => `item-${slugify(name)}`;
export const categoryKey = (slug: string): string => `cat-${slug}`;
