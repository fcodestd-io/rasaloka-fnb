import { Photo } from "@/components/public/photo";
import type { MenuItem } from "@/content/menu";
import { categoryKey, itemKey } from "@/content/images";
import { formatRupiah } from "@/lib/format";

export function MenuCard({ item, categorySlug }: { item: MenuItem; categorySlug: string }) {
  return (
    <article className="flex gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <Photo
        photoKey={itemKey(item.name)}
        fallbackKeys={[categoryKey(categorySlug)]}
        alt={item.name}
        sizes="96px"
        className="size-24 shrink-0 rounded-xl"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold leading-snug text-stone-900">{item.name}</h3>
          <p className="shrink-0 font-bold text-orange-700">{formatRupiah(item.price)}</p>
        </div>
        <p className="mt-1 text-sm text-stone-600">{item.description}</p>
        {(item.bestSeller || item.spicy) && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {item.bestSeller && (
              <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-800">★ Favorit</span>
            )}
            {item.spicy && (
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">Pedas</span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
