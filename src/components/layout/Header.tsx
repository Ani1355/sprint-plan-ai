import type { FC, KeyboardEvent } from "react";

export const Header: FC = () => {
  const handleUserButtonClick = () => {
    // Placeholder for future user menu
  };

  const handleUserButtonKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleUserButtonClick();
    }
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6 bg-card/80 backdrop-blur border-b border-border">
      <div className="flex items-center gap-3">
        <a
          href="/"
          className="flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          aria-label="Go to home"
        >
          <img src="/favicon.ico" alt="Sprint Plan AI logo" className="h-6 w-6" />
          <span className="text-sm sm:text-base font-medium">Sprint Plan AI</span>
        </a>
      </div>
      <div className="flex items-center gap-3">
        <span
          className="text-xs sm:text-sm text-muted-foreground"
          aria-label="Header work in progress"
        >
          Header (WIP)
        </span>
        <button
          type="button"
          onClick={handleUserButtonClick}
          onKeyDown={handleUserButtonKeyDown}
          className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-muted text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="User menu placeholder"
          tabIndex={0}
        >
          <span className="text-[10px] font-semibold" aria-hidden="true">SP</span>
        </button>
      </div>
    </header>
  );
};