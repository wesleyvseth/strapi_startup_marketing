"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { X, Cookie, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

type CookieConsent = {
  analytics: boolean;
  marketing: boolean;
};

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [consent, setConsent] = useState<CookieConsent>({
    analytics: false,
    marketing: false,
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Ensure we're on the client side
    setIsClient(true);

    const savedConsent = localStorage.getItem("cookieConsent");
    if (!savedConsent) {
      setIsVisible(true);
    } else {
      const parsedConsent = JSON.parse(savedConsent);
      setConsent(parsedConsent);
      // Update Google Consent Mode based on saved consent
      updateGoogleConsentMode(parsedConsent);
    }
  }, []);

  const updateGoogleConsentMode = (consent: CookieConsent) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: consent.analytics ? "granted" : "denied",
        ad_storage: consent.marketing ? "granted" : "denied",
        ad_user_data: consent.marketing ? "granted" : "denied",
        ad_personalization: consent.marketing ? "granted" : "denied",
      });
    }
  };

  const handleAcceptAll = () => {
    const newConsent = {
      analytics: true,
      marketing: true,
    };
    setConsent(newConsent);
    localStorage.setItem("cookieConsent", JSON.stringify(newConsent));
    updateGoogleConsentMode(newConsent);
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    const newConsent = {
      analytics: false,
      marketing: false,
    };
    setConsent(newConsent);
    localStorage.setItem("cookieConsent", JSON.stringify(newConsent));
    updateGoogleConsentMode(newConsent);
    setIsVisible(false);
  };

  const handleSaveSettings = () => {
    localStorage.setItem("cookieConsent", JSON.stringify(consent));
    updateGoogleConsentMode(consent);
    setIsVisible(false);
  };

  const handleConsentChange = (type: keyof CookieConsent, value: boolean) => {
    setConsent((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  // Don't render anything during SSR to avoid hydration mismatch
  if (!isClient || !isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" />

      {/* Cookie Banner */}
      <div className="fixed bottom-4 left-4 right-4 md:left-8 md:right-8 z-50 flex justify-center">
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200/50 max-w-2xl w-full mx-auto overflow-hidden">
          {!showSettings ? (
            // Main banner
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Cookie className="w-5 h-5 text-gray-600" />
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      We value your privacy
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      We use cookies to enhance your browsing experience,
                      analyze site traffic, and serve personalized
                      advertisements. You can customize your preferences or
                      accept all cookies.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={handleAcceptAll}
                      className="bg-gray-900 text-white hover:bg-gray-800 flex-1 sm:flex-none"
                    >
                      Accept All
                    </Button>
                    <Button
                      onClick={handleRejectAll}
                      variant="outline"
                      className="flex-1 sm:flex-none"
                    >
                      Reject All
                    </Button>
                    <Button
                      onClick={() => setShowSettings(true)}
                      variant="ghost"
                      className="flex items-center gap-2 flex-1 sm:flex-none"
                    >
                      <Settings className="w-4 h-4" />
                      Customize
                    </Button>
                  </div>
                </div>

                <button
                  onClick={() => setIsVisible(false)}
                  className="flex-shrink-0 p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            // Settings panel
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Cookie Preferences
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Strictly Necessary */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">
                      Strictly Necessary
                    </h4>
                    <p className="text-sm text-gray-600">
                      Essential cookies required for the website to function
                      properly. These cannot be disabled as they are necessary
                      for basic site functionality.
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-5 bg-gray-900 rounded-full flex items-center justify-end px-1">
                      <div className="w-3 h-3 bg-white rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Performance and Analytics */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">
                      Performance and Analytics
                    </h4>
                    <p className="text-sm text-gray-600">
                      These cookies help us understand how visitors interact
                      with our website by collecting and reporting information
                      anonymously via Google Analytics.
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleConsentChange("analytics", !consent.analytics)
                    }
                    className={cn(
                      "w-10 h-5 rounded-full transition-colors duration-200 flex items-center",
                      consent.analytics
                        ? "bg-gray-900 justify-end"
                        : "bg-gray-200 justify-start"
                    )}
                  >
                    <div className="w-3 h-3 bg-white rounded-full mx-1" />
                  </button>
                </div>

                {/* Targeting and Advertising */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">
                      Targeting and Advertising
                    </h4>
                    <p className="text-sm text-gray-600">
                      These cookies are used by Google Tag Manager and
                      advertising services to deliver relevant advertisements
                      and measure advertising effectiveness.
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleConsentChange("marketing", !consent.marketing)
                    }
                    className={cn(
                      "w-10 h-5 rounded-full transition-colors duration-200 flex items-center",
                      consent.marketing
                        ? "bg-gray-900 justify-end"
                        : "bg-gray-200 justify-start"
                    )}
                  >
                    <div className="w-3 h-3 bg-white rounded-full mx-1" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200">
                <Button
                  onClick={handleSaveSettings}
                  className="bg-gray-900 text-white hover:bg-gray-800 flex-1 sm:flex-none"
                >
                  Save Preferences
                </Button>
                <Button
                  onClick={handleAcceptAll}
                  variant="outline"
                  className="flex-1 sm:flex-none"
                >
                  Accept All
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
