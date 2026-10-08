import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/content/site";

const routes: ReadonlyArray<{ path: string; priority: number; changeFrequency: "weekly" | "monthly" }> = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/menu", priority: 0.9, changeFrequency: "weekly" },
  { path: "/event", priority: 0.8, changeFrequency: "monthly" },
  { path: "/layanan", priority: 0.7, changeFrequency: "monthly" },
  { path: "/tentang", priority: 0.5, changeFrequency: "monthly" },
  { path: "/lokasi", priority: 0.6, changeFrequency: "monthly" },
  { path: "/kontak", priority: 0.6, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.5, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map((r) => ({
    url: absoluteUrl(r.path),
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
