import type { Metadata } from 'next';

// 添加这一行来启用动态渲染
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'VoiceCanvas Studio - Professional AI Voice Synthesis & Voice Cloning Workspace',
  description: 'Create professional-grade voice content with our advanced AI voice synthesis and cloning studio. Features real-time preview, multi-voice support, precise control over speed, pitch, and personalized voice cloning capabilities.',
  metadataBase: new URL('https://voicecanvas.org'),
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/apple-touch-icon-precomposed.png',
    },
  },
  openGraph: {
    title: 'VoiceCanvas Studio - Professional AI Voice Synthesis & Voice Cloning Workspace',
    description: 'Create professional-grade voice content with our advanced AI voice synthesis and cloning studio. Features real-time preview, multi-voice support, precise control over speed, pitch, and personalized voice cloning capabilities.',
    url: 'https://voicecanvas.org/app',
    siteName: 'VoiceCanvas',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://voicecanvas.org/images/studio-og.png',
        width: 1200,
        height: 630,
        alt: 'VoiceCanvas Studio - AI Voice Synthesis & Cloning Platform',
        type: 'image/png'
      }
    ]
  },
  twitter: {
    title: 'VoiceCanvas Studio - Professional AI Voice Synthesis & Voice Cloning Workspace',
    description: 'Create professional-grade voice content with our advanced AI voice synthesis and cloning studio. Features real-time preview, multi-voice support, precise control over speed, pitch, and personalized voice cloning capabilities.',
    card: 'summary_large_image',
    images: {
      url: 'https://voicecanvas.org/images/studio-og.png',
      alt: 'VoiceCanvas Studio - AI Voice Synthesis & Cloning Platform',
      width: 1200,
      height: 630
    },
    creator: '@VoiceCanvas',
    site: '@VoiceCanvas'
  },
  other: {
    'og:image:secure_url': 'https://voicecanvas.org/images/studio-og.png',
    'pinterest-rich-pin': 'true',
    'fb:app_id': '',
    'article:author': 'https://voicecanvas.org',
    'article:publisher': 'https://voicecanvas.org'
  }
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 