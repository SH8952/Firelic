"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";

/**
 * Site-wide top header, shared by every locale page (calculator, guides,
 * about, faq, ...). Spacing (h-16 bar, max-w-6xl container, px-4 padding,
 * bottom border) mirrors ExifLens's src/components/site-header.tsx.
 *
 * Left: logo + wordmark + tagline (moved here from the calculator page's
 * own local header on 2026-09-01, at ExifLens's header font sizes —
 * text-lg wordmark, text-xs tagline hidden below sm).
 *
 * Right (desktop, sm+): About / Guides / FAQ nav links, then the theme
 * toggle, then the language switcher. Below sm, the nav links collapse
 * behind a hamburger button (matching ExifLens's mobile header pattern)
 * so the theme toggle and language switcher always stay visible.
 */
export function SiteHeader() {
  const t = useTranslations("nav");
  const tCalc = useTranslations("calculator");
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinkClass =
    "text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]";

  return (
    <header className="relative border-b border-[var(--color-border)]">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Logo showWordmark={false} />
          <span className="flex flex-col leading-tight">
            <span className="text-lg font-bold text-[var(--color-text-primary)]">
              FIRE Calculator
            </span>
            <span className="hidden text-xs text-[var(--color-text-secondary)] sm:block">
              {tCalc("subtitle")}
            </span>
          </span>
        </Link>

        {/* Desktop nav: full width available, everything stays on one line */}
        <nav className="hidden items-center gap-4 sm:flex">
          <Link href="/about" className={navLinkClass}>
            {t("about")}
          </Link>
          <Link href="/guides" className={navLinkClass}>
            {t("guides")}
          </Link>
          <Link href="/faq" className={navLinkClass}>
            {t("faq")}
          </Link>
          <ThemeToggle />
          <LocaleSwitcher />
        </nav>

        {/* Mobile: not enough width for 3 text links + theme/locale controls
            without wrapping, so the text links collapse into a hamburger
            menu; theme toggle and language switcher stay visible. */}
        <div className="flex items-center gap-2 sm:hidden">
          <ThemeToggle />
          <LocaleSwitcher />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
            aria-expanded={menuOpen}
            className="flex size-9 items-center justify-center rounded-md text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)]"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav className="flex flex-col border-t border-[var(--color-border)] px-4 py-2 sm:hidden">
          <Link
            href="/about"
            className={`${navLinkClass} py-2.5`}
            onClick={() => setMenuOpen(false)}
          >
            {t("about")}
          </Link>
          <Link
            href="/guides"
            className={`${navLinkClass} py-2.5`}
            onClick={() => setMenuOpen(false)}
          >
            {t("guides")}
          </Link>
          <Link
            href="/faq"
            className={`${navLinkClass} py-2.5`}
            onClick={() => setMenuOpen(false)}
          >
            {t("faq")}
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
