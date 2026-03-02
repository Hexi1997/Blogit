import Link from "next/link";
import Image from "next/image";

export function BlogHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 w-full max-w-[766px] items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold">
          <Image
            src="/icons/combination-mark.svg"
            alt="Blogit"
            width={132}
            height={32}
            className="h-8 w-auto"
            priority
          />
        </Link>
        <nav>
          <Link
            href="/"
            className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
          >
            Blog
          </Link>
        </nav>
      </div>
    </header>
  );
}
