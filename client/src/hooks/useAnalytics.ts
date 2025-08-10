import { useEffect } from 'react';

declare global {
  interface Window {
    gtag: (
      type: string,
      action: string,
      options?: {
        [key: string]: any;
      }
    ) => void;
  }
}

export const useAnalytics = () => {
  const trackPageView = (path: string) => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('config', 'G-Y8N11B410S', {
        page_path: path,
      });
    }
  };

  const trackEvent = (
    action: string,
    category: string,
    label?: string,
    value?: number
  ) => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  };

  return {
    trackPageView,
    trackEvent,
  };
};
