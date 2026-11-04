'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView } from '@/utils/analytics';

export default function AnalyticsProvider() {
  const pathname = usePathname();
  const prevPathname = useRef<string | null>(null);

  useEffect(() => {
    if (pathname !== prevPathname.current) {
      prevPathname.current = pathname;
      // Wait for the document title to be updated by Next.js
      const timeout = setTimeout(() => {
        trackPageView(pathname, document.title);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [pathname]);

  return null;
}
