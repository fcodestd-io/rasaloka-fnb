import Link from "next/link";

type Variant = "primary" | "outline" | "light";

const styles: Record<Variant, string> = {
  primary: "bg-orange-700 text-white hover:bg-orange-800 focus-visible:outline-orange-700",
  outline: "border border-stone-300 bg-white text-stone-800 hover:border-orange-700 hover:text-orange-700 focus-visible:outline-orange-700",
  light: "bg-white text-orange-800 hover:bg-orange-50 focus-visible:outline-white",
};

interface Props {
  href: string;
  variant?: Variant;
  external?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function LinkButton({ href, variant = "primary", external = false, className = "", children }: Props) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${styles[variant]} ${className}`;
  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
