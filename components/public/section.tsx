interface Props {
  id?: string;
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  tone?: "plain" | "soft" | "dark";
  children: React.ReactNode;
}

const tones = {
  plain: "bg-white text-stone-800",
  soft: "bg-orange-50/60 text-stone-800",
  dark: "bg-stone-900 text-stone-100",
} as const;

export function Section({ id, title, subtitle, eyebrow, tone = "plain", children }: Props) {
  return (
    <section id={id} className={`${tones[tone]} py-14 sm:py-20`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {(title || subtitle || eyebrow) && (
          <header className="mb-10 max-w-2xl">
            {eyebrow && <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-orange-700">{eyebrow}</p>}
            {title && <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>}
            {subtitle && <p className={`mt-3 ${tone === "dark" ? "text-stone-300" : "text-stone-600"}`}>{subtitle}</p>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
