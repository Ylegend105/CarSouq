import Link from "next/link";
import { LogoMark } from "@/components/site/Logo";
import { IconGavel, IconArrowLeft } from "@/components/ui/icons";

export default function NotFound() {
  return (
    <div className="aurora relative grid min-h-[70vh] place-items-center overflow-hidden py-20">
      <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 opacity-50" />
      <div className="container-page relative text-center">
        <LogoMark className="mx-auto h-24 w-[12rem] opacity-90" />
        <p className="mt-8 font-display text-6xl font-extrabold tracking-tight text-line-strong sm:text-7xl">404</p>
        <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink">
          This page has left the lot
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted">
          The page you&apos;re looking for doesn&apos;t exist, or the auction may have already ended.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-secondary">
            <IconArrowLeft className="h-4 w-4 rtl:rotate-180" />
            Go home
          </Link>
          <Link href="/auctions" className="btn btn-primary">
            <IconGavel className="h-4 w-4" />
            Browse live auctions
          </Link>
        </div>
      </div>
    </div>
  );
}
