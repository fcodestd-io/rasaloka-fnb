import { ChevronDown } from "lucide-react";
import { CtaBand } from "@/components/public/cta-band";
import { JsonLd } from "@/components/public/json-ld";
import { PageHero } from "@/components/public/page-hero";
import { Section } from "@/components/public/section";
import { faqs } from "@/content/faq";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "FAQ",
  description: "Pertanyaan yang sering diajukan seputar jam buka, reservasi, pembayaran, takeaway, dan pemesanan catering event di RasaLoka.",
  path: "/faq",
});

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

// Native <details>: tanpa JavaScript, tetap aksesibel dan statis.
export default function FaqPage() {
  return (
    <>
      <PageHero eyebrow="FAQ" title="Pertanyaan yang sering diajukan" description="Tidak menemukan jawabannya? Hubungi kami, dengan senang hati kami bantu." />
      <Section>
        <div className="mx-auto max-w-3xl divide-y divide-stone-200 rounded-3xl border border-stone-200">
          {faqs.map((f) => (
            <details key={f.q} className="group p-5 open:bg-orange-50/50">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-stone-900 [&::-webkit-details-marker]:hidden">
                {f.q}
                <ChevronDown className="size-5 shrink-0 text-orange-700 transition-transform group-open:rotate-180" aria-hidden="true" />
              </summary>
              <p className="mt-3 text-stone-600">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>
      <CtaBand title="Masih ada pertanyaan?" text="Tim kami siap menjawab melalui WhatsApp." message="Halo RasaLoka, saya ingin bertanya." />
      <JsonLd data={faqJsonLd} />
    </>
  );
}
