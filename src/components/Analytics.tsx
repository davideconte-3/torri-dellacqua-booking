'use client';

import { useEffect } from 'react';
import Script from 'next/script';

// Tracking events for conversion optimization
export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  // Meta Pixel (Facebook/Instagram)
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', eventName, params);
  }

  // Google Analytics 4
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, params);
  }

  // Console log for debugging
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Track Event:', eventName, params);
  }
};

// Standard ecommerce events
export const analytics = {
  pageView: (page: string) => {
    trackEvent('PageView', { page });
  },

  viewContent: (contentName: string, contentCategory?: string) => {
    trackEvent('ViewContent', {
      content_name: contentName,
      content_category: contentCategory,
    });
  },

  initiateCheckout: () => {
    trackEvent('InitiateCheckout', {
      content_category: 'San Valentino Booking',
    });
  },

  addToCart: (value: number) => {
    trackEvent('AddToCart', {
      value,
      currency: 'EUR',
    });
  },

  lead: (value: number, guests: number) => {
    const params = {
      value,
      currency: 'EUR',
      guests,
      event_category: 'Booking',
      event_label: 'San Valentino 2026',
    };
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log('Track Event: Lead (conversione prenotazione)', params);
    }
    trackEvent('Lead', params);
  },

  customEvent: (name: string, params?: Record<string, any>) => {
    trackEvent(name, params);
  },
};

interface AnalyticsProps {
  metaPixelId?: string;
  googleAnalyticsId?: string;
}

export default function Analytics({ metaPixelId, googleAnalyticsId }: AnalyticsProps) {
  useEffect(() => {
    // Track page view on mount
    analytics.pageView(window.location.pathname);
  }, []);

  return (
    <>
      {/* Meta Pixel */}
      {metaPixelId && (
        <>
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${metaPixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}

      {/* Google Analytics 4 */}
      {googleAnalyticsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${googleAnalyticsId}', {
                page_path: window.location.pathname,
              });
            `}
          </Script>
        </>
      )}
    </>
  );
}
