"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

export default function GoogleAnalytics() {
  const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID;
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Ensure scripts only load after client-side hydration is complete
    setIsClient(true);
  }, []);

  // Don't render scripts during SSR to avoid hydration conflicts
  if (!isClient) return null;

  return (
    <>
      {/* Google Tag Manager */}
      {GTM_ID && (
        <Script
          id="google-tag-manager"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){
                w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});
                
                function loadGTM() {
                  var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
                  j.async=true;j.src=
                  'https://www.googletagmanager.com/gtm.js?id='+i+dl;
                  
                  // Wait for React hydration to complete before DOM manipulation
                  if (document.readyState === 'complete') {
                    f.parentNode.insertBefore(j,f);
                  } else {
                    window.addEventListener('load', function() {
                      setTimeout(function() {
                        f.parentNode.insertBefore(j,f);
                      }, 500);
                    });
                  }
                }
                
                // Delay GTM loading to avoid hydration conflicts
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', loadGTM);
                } else {
                  setTimeout(loadGTM, 100);
                }
              })(window,document,'script','dataLayer','${GTM_ID}');
            `,
          }}
        />
      )}

      {/* Google Analytics Script */}
      {GA_TRACKING_ID && (
        <>
          <Script
            strategy="lazyOnload"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          />
          <Script
            id="google-analytics"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                
                // Initialize consent mode with default denied state
                gtag('consent', 'default', {
                  'analytics_storage': 'denied',
                  'ad_storage': 'denied',
                  'ad_user_data': 'denied',
                  'ad_personalization': 'denied',
                });
                
                gtag('js', new Date());
                gtag('config', '${GA_TRACKING_ID}');
              `,
            }}
          />
        </>
      )}
    </>
  );
}
