"use client";

import { useEffect } from "react";

/**
 * SWRegistration Component
 * Registers the Service Worker required for PWA installability on Android devices.
 */
export function SWRegistration() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("Namix Service Worker registered: ", registration.scope);
          })
          .catch((error) => {
            console.error("Service Worker registration failed:", error);
          });
      });
    }
  }, []);

  return null;
}