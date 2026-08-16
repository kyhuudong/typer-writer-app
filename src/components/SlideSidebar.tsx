import { useEffect, useRef, useState } from "react";

type SlideSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export function SlideSidebar({ isOpen, onClose, children }: SlideSidebarProps) {
  // Track whether the panel has ever been opened so we skip the initial
  // off-screen render entirely (avoids a flash on first open).
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) setMounted(true);
  }, [isOpen]);

  // Close on Escape key.
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Slide panel */}
      <div
        ref={panelRef}
        aria-label="Sidebar menu"
        className={`fixed left-0 top-0 z-50 h-full w-72 overflow-y-auto bg-zinc-950/95 backdrop-blur-md shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/5">
          <span className="text-xs uppercase tracking-widest text-zinc-500">Menu</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-lg p-1.5 text-zinc-500 hover:bg-white/10 hover:text-zinc-200 transition"
          >
            <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>

        <div className="p-4">
          {children}
        </div>
      </div>
    </>
  );
}
