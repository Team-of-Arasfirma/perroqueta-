"use client";

import { useEffect, useState } from "react";
import SplashScreen from "./SplashScreen";

export default function AppShell({ children }) {
  const [showSplash, setShowSplash] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    // Same browser tab/session-la splash already show aagirukka check pannum.
    const splashAlreadyShown = sessionStorage.getItem(
      "perroquetaSplashShown"
    );

    if (splashAlreadyShown) {
      setShowSplash(false);
      setIsChecked(true);
      return;
    }

    // First website entry-la mattum splash show pannum.
    setShowSplash(true);
    setIsChecked(true);

    const leaveTimer = setTimeout(() => {
      setIsLeaving(true);
    }, 3500);

    const removeTimer = setTimeout(() => {
      setShowSplash(false);

      // Splash complete aana session-la save pannum.
      sessionStorage.setItem("perroquetaSplashShown", "true");
    }, 4300);

    return () => {
      clearTimeout(leaveTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  // Browser storage check mudiyura vara blank/dark screen prevent pannum.
  if (!isChecked) {
    return null;
  }

  return (
    <>
      {showSplash && <SplashScreen isLeaving={isLeaving} />}

      <div
        className={`site-content ${
          showSplash && !isLeaving ? "site-content--hidden" : ""
        }`}
      >
        {children}
      </div>
    </>
  );
}