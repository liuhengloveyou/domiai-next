'use client';

import { Github, Twitter, Globe } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n/language-context";
import { motion } from "framer-motion";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center gap-8">
          <motion.div 
            className="flex items-center gap-2 group relative px-3 py-1"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300" />
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Image
                src="/images/logo.png"
                alt="VoiceCanvas Logo"
                width={24}
                height={24}
                className="w-6 h-6 transition-transform duration-300 group-hover:scale-110"
              />
            </motion.div>
            <span className="font-semibold text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient-x">
              VoiceCanvas
            </span>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-all duration-300 -z-10" />
          </motion.div>
          <div className="flex gap-6">
            <a
              href="https://github.com/ItusiAI"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com/zyailive"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="https://voicecanvas.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Globe className="h-5 w-5" />
            </a>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            <p>{t('copyright').replace('{year}', new Date().getFullYear().toString())}</p>
            <p className="mt-1">
              {t('footerSlogan')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 