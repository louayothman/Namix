
"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { IOSInstallGuide } from "./IOSInstallGuide";
import { AndroidInstallModal } from "./AndroidInstallModal";
import { DesktopInstallModal } from "./DesktopInstallModal";

/**
 * @fileOverview محرك تثبيت التطبيق v4.0 - Modular Orchestrator
 * يدير ظهور نوافذ التثبيت حسب نوع الجهاز بملفات معزولة.
 */
export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showAndroidModal, setShowAndroidModal] = useState(false);
  const [showDesktopModal, setShowDesktopModal] = useState(false);
  const [showIosTooltip, setShowIosTooltip] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop' | null>(null);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    setIsInstalled(isStandalone);
    
    if (isStandalone) return;

    const ua = navigator.userAgent.toLowerCase();
    const isIos = /ipad|iphone|ipod/.test(ua) && !(window as any).MSStream;
    const isAndroid = /android/.test(ua);
    const isMobile = isIos || isAndroid;

    setPlatform(isIos ? 'ios' : isAndroid ? 'android' : 'desktop');

    const visits = parseInt(localStorage.getItem("namix_access_count") || "0") + 1;
    localStorage.setItem("namix_access_count", visits.toString());
    const shouldShow = visits >= 2;

    const handlePrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (shouldShow) {
        setTimeout(() => {
          if (isAndroid) setShowAndroidModal(true);
          else if (!isIos) setShowDesktopModal(true);
        }, 5000);
      }
    };

    window.addEventListener('beforeinstallprompt', handlePrompt);

    if (isIos && !isStandalone && shouldShow) {
      setTimeout(() => setShowIosTooltip(true), 6000);
    }

    return () => window.removeEventListener('beforeinstallprompt', handlePrompt);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowAndroidModal(false);
      setShowDesktopModal(false);
    }
    setDeferredPrompt(null);
  };

  if (isInstalled) return null;

  return (
    <>
      <AnimatePresence>
        {showAndroidModal && (
          <AndroidInstallModal 
            onClose={() => setShowAndroidModal(false)} 
            onInstall={handleInstall} 
          />
        )}
        
        {showDesktopModal && (
          <DesktopInstallModal 
            onClose={() => setShowDesktopModal(false)} 
            onInstall={handleInstall} 
          />
        )}

        {showIosTooltip && (
          <IOSInstallGuide 
            onClose={() => setShowIosTooltip(false)} 
          />
        )}
      </AnimatePresence>
    </>
  );
}
