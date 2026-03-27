"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const DEFAULT_MESSAGE = "Hi! How can I help you?";

export default function FloatingWhatsApp() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const waUrl = useMemo(() => {
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "212673717955";
    const text = encodeURIComponent(DEFAULT_MESSAGE);
    // Using api.whatsapp.com is more reliable than wa.me in some environments.
    return `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${text}`;
  }, []);

  const shouldHide = pathname?.startsWith("/dashboard-azzouzi-secure");

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: MouseEvent) {
      const target = e.target as Node;

      if (popupRef.current && popupRef.current.contains(target)) return;
      if (buttonRef.current && buttonRef.current.contains(target)) return;

      setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  if (shouldHide) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden="true"
      >
        <span className="absolute inline-flex h-16 w-16 rounded-full bg-[#25D366]/20 animate-ping" />
        <span className="absolute inline-flex h-16 w-16 rounded-full bg-[#25D366]/20 animate-ping [animation-delay:0.6s]" />
      </div>

      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open WhatsApp"
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:bg-[#1ebe57]"
      >
        <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-red-600 px-1 text-[12px] font-bold text-white">
          1
        </span>

        <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
          <path d="M20.52 3.48A11.86 11.86 0 0 0 12 0C5.37 0 .01 5.36.01 11.99c0 2.14.55 4.14 1.52 5.89L0 24l6.31-1.49c1.6.86 3.42 1.33 5.35 1.33h.09c6.63 0 11.99-5.36 11.99-11.99 0-3.03-1.18-5.87-3.12-8.03ZM12 22c-1.73 0-3.4-.46-4.88-1.32l-.39-.22-3.61.85.86-3.53-.25-.41A9.95 9.95 0 0 1 2 11.99C2 6.48 6.48 2 12 2c5.52 0 10 4.48 10 9.99S17.52 22 12 22Zm5.53-7.05c-.29-.14-1.72-.85-1.99-.95-.27-.1-.46-.14-.65.14-.2.29-.75.95-.92 1.14-.18.2-.34.23-.63.1-.29-.14-1.2-.44-2.28-1.41-.84-.75-1.41-1.67-1.57-1.96-.17-.29-.02-.45.12-.59.13-.14.29-.34.43-.52.14-.18.18-.29.27-.48.1-.2.05-.37-.02-.52-.07-.14-.65-1.58-.89-2.16-.23-.55-.47-.47-.65-.47h-.55c-.18 0-.45.07-.68.33-.23.26-.89.86-.89 2.1 0 1.24.91 2.44 1.04 2.6.13.16 1.8 2.75 4.36 3.86.61.26 1.08.41 1.45.52.61.19 1.17.16 1.61.1.49-.07 1.72-.71 1.96-1.4.24-.69.24-1.28.17-1.4-.07-.13-.27-.2-.56-.33Z" />
        </svg>
      </button>

      {open ? (
        <div
          ref={popupRef}
          className="absolute right-0 bottom-16 w-72 max-w-[80vw] rounded-2xl border border-gray-200 bg-white p-4 shadow-xl"
          role="dialog"
          aria-label="WhatsApp message"
        >
          <p className="text-sm font-semibold text-gray-900">
            Elvaris Jewelry
          </p>
          <p className="mt-2 text-sm text-gray-700">{DEFAULT_MESSAGE}</p>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-[#25D366] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1ebe57]"
          >
            Open WhatsApp
          </a>
        </div>
      ) : null}
    </div>
  );
}

