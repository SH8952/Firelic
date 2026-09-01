"use client";

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
 * Right-side order, left to right: About / Guides / FAQ nav links, then
 * the theme toggle, then the language switcher — per the 2026-09-01
 * layout request (nav links left of theme toggle, language switcher
 * right of theme toggle).
 */
export function SiteHeader() {
  const t = useTranslations("nav");

  const navLinkClass =
    "text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]";

  return (
    <header className="border-b border-[var(--color-border)]">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <Logo showWordmark={false} />
        </Link>

        <nav className="flex items-center gap-4">
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
      </div>
    </header>
  );
}
