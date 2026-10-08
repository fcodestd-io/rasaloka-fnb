export function PageHero({ title, description, eyebrow }: { title: string; description: string; eyebrow?: string }) {
  return (
    <div className="border-b border-orange-100 bg-gradient-to-b from-orange-50 to-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        {eyebrow && <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-orange-700">{eyebrow}</p>}
        <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-lg text-stone-600">{description}</p>
      </div>
    </div>
  );
}
