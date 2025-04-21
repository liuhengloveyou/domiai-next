import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Voice Cloning - Professional Voice Replication & Customization Service',
  description: 'Clone and customize your voice using advanced AI technology. Support for multiple languages including English, Chinese, Japanese, and Korean. Features real-time preview and personalization options. Perfect for voiceovers, education, and podcasting.',
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
  keywords: 'voice cloning, AI voiceover, voice synthesis, voice customization, multilingual voiceover, personalized voice, professional voiceover, voice customization service',
  openGraph: {
    title: 'AI Voice Cloning - Professional Voice Replication & Customization Service',
    description: 'Clone and customize your voice using advanced AI technology. Support for multiple languages including English, Chinese, Japanese, and Korean. Features real-time preview and personalization options.',
    url: 'https://voicecanvas.org/cloning',
    siteName: 'VoiceCanvas',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://voicecanvas.org/images/cloning-og.png',
        width: 1200,
        height: 630,
        alt: 'VoiceCanvas Cloning Interface',
        type: 'image/png'
      }
    ]
  },
  twitter: {
    title: 'AI Voice Cloning - Professional Voice Replication & Customization',
    description: 'Clone and customize your voice using advanced AI technology. Supports multiple languages with personalization options and real-time preview.',
    card: 'summary_large_image',
    images: {
      url: '/images/cloning-twitter.png',
      alt: 'VoiceCanvas Cloning Interface',
      width: 1200,
      height: 630
    },
    creator: '@VoiceCanvas',
    site: '@VoiceCanvas'
  },
  other: {
    'og:image:secure_url': 'https://voicecanvas.org/images/cloning-og.png',
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