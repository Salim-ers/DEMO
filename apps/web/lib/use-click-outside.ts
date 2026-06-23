"use client";
import { useEffect, useRef } from "react";

/** Calls `handler` when a pointer/touch event lands outside the returned ref. */
export function useClickOutside<T extends HTMLElement>(handler: () => void) {
  const ref = useRef<T>(null);
  useEffect(() => {
    function onDown(e: MouseEvent | TouchEvent) {
      const el = ref.current;
      if (el && !el.contains(e.target as Node)) handler();
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [handler]);
  return ref;
}
