"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { IOSInstallGuide } from "./IOSInstallGuide";
import { AndroidInstallModal } from "./AndroidInstallModal";
import { DesktopInstallModal } from "./DesktopInstallModal";

/**
 * @fileOverview محرك تثبيت التطبيق v4.1 - Safe Execution Edition
 * تم إضافة فحص أمان لمنع أخطاء استدعاء prompt ودعم الإطلاق اليدوي عبر الأحداث.
 */
export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showAndroidModal, setShowAndroidModal] = useState(false);
  const [showDesktopModal, setShowDesktopModal] = useState(false);
  const [showIosTooltip, setShowIosTooltip] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    setIsInstalled(isStandalone);
    
    if (isStandalone) return;

    const ua = navigator.userAgent.toLowerCase();
    const ios = /ipad|iphone|ipod/.test(ua) && !(window as any).MSStream;
    const android = /android/.test(ua);
    
    setIsIos(ios);
    setIsAndroid(android);

    const visits = parseInt(localStorage.getItem("namix_access_count") || "0") + 1;
    localStorage.setItem("namix_access_count", visits.toString());
    const shouldAutoShow = visits >= 2;

    const handlePrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (shouldAutoShow) {
        setTimeout(() => {
          if (android) setShowAndroidModal(true);
          else if (!ios) setShowDesktopModal(true);
        }, 5000);
      }
    };

    const handleManualShow = () => {
      if (android) setShowAndroidModal(true);
      else if (!ios) setShowDesktopModal(true);
      else setShowIosTooltip(true);
    };

    window.addEventListener('beforeinstallprompt', handlePrompt);
    window.addEventListener('namix-show-install-prompt', handleManualShow);

    if (ios && !isStandalone && shouldAutoShow) {
      setTimeout(() => setShowIosTooltip(true), 6000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handlePrompt);
      window.removeEventListener('namix-show-install-prompt', handleManualShow);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt && typeof deferredPrompt.prompt === 'function') {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowAndroidModal(false);
        setShowDesktopModal(false);
      }
      setDeferredPrompt(null);
    } else {
      // إذا لم يتوفر محرك التثبيت التلقائي (مثلاً ضغط يدوي والحدث لم يقع بعد)
      // نكتفي بإغلاق النافذة أو توجيه المستخدم
      setShowAndroidModal(false);
      setShowDesktopModal(false);
    }
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
