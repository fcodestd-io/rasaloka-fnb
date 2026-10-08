import type { Metadata } from "next";
import { site } from "@/content/site";

interface PageMeta {
  title: string;
  description: string;
  path: string;
}

// Metadata per halaman: title (memakai template dari root layout), canonical, Open Graph, Twitter.
export function pageMetadata({ title, description, path }: PageMeta): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "id_ID",
      siteName: site.name,
      title: `${title} | ${site.name}`,
      description,
      url: path,
    },
    twitter: { card: "summary_large_image", title: `${title} | ${site.name}`, description },
  };
}
