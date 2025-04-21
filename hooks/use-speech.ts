import { useState } from 'react';

const SUPPORTED_LANGUAGES = {
  zh: "中文",
  en: "英语",
  ja: "日语",
  ko: "韩语",
  es: "西班牙语",
  fr: "法语",
  ru: "俄语",
  it: "意大利语",
  pt: "葡萄牙语",
  de: "德语",
  id: "印尼语"
} as const;

type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

export function useSpeech() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const speak = async (text: string, language: SupportedLanguage) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error('语音生成失败');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      await audio.play();

    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    speak,
    isLoading,
    error,
    SUPPORTED_LANGUAGES,
  };
} 