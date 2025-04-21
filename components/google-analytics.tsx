'use client';

import Script from 'next/script';

const NEXT_PUBLIC_GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export function GoogleAnalytics() {
  // 如果没有配置 GA ID，则不加载 GA
  if (!NEXT_PUBLIC_GA_ID) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${NEXT_PUBLIC_GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${NEXT_PUBLIC_GA_ID}');
        `}
      </Script>
    </>
  );
} 