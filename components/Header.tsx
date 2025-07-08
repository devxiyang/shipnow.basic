"use client";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Logo } from "@/components/logo";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

export function Header(props: React.HTMLAttributes<HTMLElement>) {
  return (
    <header {...props} className="flex justify-between items-center py-4">
      {/* Left: Logo */}
      <Logo 
        iconSize="md"
        textClassName="hidden sm:block"
        className="gap-3"
      />
      
      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </header>
  );
} 