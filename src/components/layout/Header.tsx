import { } from "react";

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6 bg-card/80 backdrop-blur border-b border-border">
      <div className="sr-only" aria-live="polite">Dashboard header</div>
    </header>
  );
}