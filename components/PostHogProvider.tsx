// components/PostHogProvider.tsx
'use client';

import { useEffect } from 'react';
import { initPostHog } from '@/lib/posthog-client';
import { usePathname } from 'next/navigation';
import { posthog } from '@/lib/posthog-client';

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    initPostHog();
  }, []);

  // track page views when route changes
  useEffect(() => {
    if (pathname) {
      posthog.capture('$pageview', { path: pathname });
    }
  }, [pathname]);

  return <>{children}</>;
}
