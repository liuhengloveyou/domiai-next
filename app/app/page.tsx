"use client";

// 添加这一行来启用动态渲染
export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Volume2, Upload, Download, Pause, Play } from "lucide-react";

// import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/lib/i18n/language-context";
// import { synthesizeSpeech, playPollyAudio, hasSingleVoice, downloadAudio, SpeechService, playMinimaxAudio, SERVICE_LIMITS } from "@/lib/polly-service";
// import { getSupportedLanguages } from "@/lib/voice-config";

import { AudioVisualizer } from "@/components/audio-visualizer";
import { NavBar } from "@/components/nav-bar";
import { motion } from "framer-motion";
import { RequireAuth } from "@/components/require-auth";
import { useSession } from "next-auth/react";
import { useAnalytics } from '@/hooks/use-analytics';
import { VoiceSelector } from '@/components/voice-selector';
import { VoiceOption } from "@/lib/voice-config";


interface Language {
  code: string;
  nameKey: 'chinese' | 'english' | 'japanese' | 'korean' | 'spanish' | 'french' | 'russian' | 'italian' | 'portuguese' | 'german' | 'indonesian' | 'arabic' | 'cantonese' | 'danish' | 'dutch' | 'finnish' | 'greek' | 'hebrew' | 'hindi' | 'hungarian' | 'norwegian' | 'polish' | 'romanian' | 'swedish' | 'turkish' | 'welsh' | 'britishEnglish' | 'australianEnglish' | 'mexicanSpanish' | 'usSpanish' |  'canadianFrench' | 'belgianFrench' | 'brazilianPortuguese' | 'austrianGerman' | 'swissGerman' | 'uaeArabic' | 'belgianDutch' | 'indianEnglish' | 'welshEnglish' | 'irishEnglish' | 'newZealandEnglish' | 'southAfricanEnglish' | 'icelandic' | 'catalan' | 'czech' | 'vietnamese' | 'ukrainian' | 'afrikaans' | 'bulgarian' | 'croatian' | 'lithuanian' | 'latvian' | 'macedonian' | 'malay' | 'serbian' | 'slovak' | 'slovenian' | 'swahili' | 'tamil' | 'thai' | 'urdu' | 'traditionalChinese' | 'saudiArabic';
}

const MINIMAX_LANGUAGES = [
  { code: 'zh-CN', nameKey: 'chinese' as const },
  { code: 'en-US', nameKey: 'english' as const },
  { code: 'ja-JP', nameKey: 'japanese' as const },
  { code: 'ko-KR', nameKey: 'korean' as const },
  { code: 'es-ES', nameKey: 'spanish' as const },
  { code: 'fr-FR', nameKey: 'french' as const },
  { code: 'ru-RU', nameKey: 'russian' as const },
  { code: 'it-IT', nameKey: 'italian' as const },
  { code: 'pt-PT', nameKey: 'portuguese' as const },
  { code: 'de-DE', nameKey: 'german' as const },
  { code: 'vi-VN', nameKey: 'vietnamese' as const },
  { code: 'uk-UA', nameKey: 'ukrainian' as const },
  { code: 'tr-TR', nameKey: 'turkish' as const },
  { code: 'id-ID', nameKey: 'indonesian' as const },
  { code: 'ar-SA', nameKey: 'arabic' as const }
] as const satisfies readonly Language[];

const AWS_LANGUAGES: readonly Language[] = [
  { code: 'zh-CN', nameKey: 'chinese' as const },
  { code: 'en-US', nameKey: 'english' as const },
  { code: 'en-GB', nameKey: 'britishEnglish' as const },
  { code: 'en-AU', nameKey: 'australianEnglish' as const },
  { code: 'ja-JP', nameKey: 'japanese' as const },
  { code: 'ko-KR', nameKey: 'korean' as const },
  { code: 'es-ES', nameKey: 'spanish' as const },
  { code: 'es-MX', nameKey: 'mexicanSpanish' as const },
  { code: 'es-US', nameKey: 'usSpanish' as const },
  { code: 'fr-FR', nameKey: 'french' as const },
  { code: 'fr-CA', nameKey: 'canadianFrench' as const },
  { code: 'fr-BE', nameKey: 'belgianFrench' as const },
  { code: 'ru-RU', nameKey: 'russian' as const },
  { code: 'it-IT', nameKey: 'italian' as const },
  { code: 'pt-PT', nameKey: 'portuguese' as const },
  { code: 'pt-BR', nameKey: 'brazilianPortuguese' as const },
  { code: 'de-DE', nameKey: 'german' as const },
  { code: 'de-AT', nameKey: 'austrianGerman' as const },
  { code: 'de-CH', nameKey: 'swissGerman' as const },
  { code: 'id-ID', nameKey: 'indonesian' as const },
  { code: 'arb', nameKey: 'arabic' as const },
  { code: 'ar-AE', nameKey: 'uaeArabic' as const },
  { code: 'ar-SA', nameKey: 'arabic' as const },
  { code: 'yue-CN', nameKey: 'cantonese' as const },
  { code: 'da-DK', nameKey: 'danish' as const },
  { code: 'nl-NL', nameKey: 'dutch' as const },
  { code: 'nl-BE', nameKey: 'belgianDutch' as const },
  { code: 'fi-FI', nameKey: 'finnish' as const },
  { code: 'hi-IN', nameKey: 'hindi' as const },
  { code: 'en-IN', nameKey: 'indianEnglish' as const },
  { code: 'en-GB-WLS', nameKey: 'welshEnglish' as const },
  { code: 'en-IE', nameKey: 'irishEnglish' as const },
  { code: 'en-NZ', nameKey: 'newZealandEnglish' as const },
  { code: 'en-ZA', nameKey: 'southAfricanEnglish' as const },
  { code: 'is-IS', nameKey: 'icelandic' as const },
  { code: 'nb-NO', nameKey: 'norwegian' as const },
  { code: 'pl-PL', nameKey: 'polish' as const },
  { code: 'ro-RO', nameKey: 'romanian' as const },
  { code: 'sv-SE', nameKey: 'swedish' as const },
  { code: 'tr-TR', nameKey: 'turkish' as const },
  { code: 'cy-GB', nameKey: 'welsh' as const },
  { code: 'ca-ES', nameKey: 'catalan' as const },
  { code: 'cs-CZ', nameKey: 'czech' as const }
] as const;

// OpenAI 支持的语言
const OPENAI_LANGUAGES = [
  { code: 'af-ZA', nameKey: 'afrikaans' as const },
  { code: 'ar-AE', nameKey: 'uaeArabic' as const },
  { code: 'ar-SA', nameKey: 'saudiArabic' as const },
  { code: 'bg-BG', nameKey: 'bulgarian' as const },
  { code: 'ca-ES', nameKey: 'catalan' as const },
  { code: 'cs-CZ', nameKey: 'czech' as const },
  { code: 'cy-GB', nameKey: 'welsh' as const },
  { code: 'da-DK', nameKey: 'danish' as const },
  { code: 'de-DE', nameKey: 'german' as const },
  { code: 'el-GR', nameKey: 'greek' as const },
  { code: 'en-AU', nameKey: 'australianEnglish' as const },
  { code: 'en-GB', nameKey: 'britishEnglish' as const },
  { code: 'en-GB-WLS', nameKey: 'welshEnglish' as const },
  { code: 'en-IE', nameKey: 'irishEnglish' as const },
  { code: 'en-IN', nameKey: 'indianEnglish' as const },
  { code: 'en-NZ', nameKey: 'newZealandEnglish' as const },
  { code: 'en-US', nameKey: 'english' as const },
  { code: 'en-ZA', nameKey: 'southAfricanEnglish' as const },
  { code: 'es-ES', nameKey: 'spanish' as const },
  { code: 'es-MX', nameKey: 'mexicanSpanish' as const },
  { code: 'es-US', nameKey: 'usSpanish' as const },
  { code: 'fi-FI', nameKey: 'finnish' as const },
  { code: 'fr-BE', nameKey: 'belgianFrench' as const },
  { code: 'fr-CA', nameKey: 'canadianFrench' as const },
  { code: 'fr-FR', nameKey: 'french' as const },
  { code: 'he-IL', nameKey: 'hebrew' as const },
  { code: 'hi-IN', nameKey: 'hindi' as const },
  { code: 'hr-HR', nameKey: 'croatian' as const },
  { code: 'hu-HU', nameKey: 'hungarian' as const },
  { code: 'id-ID', nameKey: 'indonesian' as const },
  { code: 'is-IS', nameKey: 'icelandic' as const },
  { code: 'it-IT', nameKey: 'italian' as const },
  { code: 'ja-JP', nameKey: 'japanese' as const },
  { code: 'ko-KR', nameKey: 'korean' as const },
  { code: 'lt-LT', nameKey: 'lithuanian' as const },
  { code: 'lv-LV', nameKey: 'latvian' as const },
  { code: 'mk-MK', nameKey: 'macedonian' as const },
  { code: 'ms-MY', nameKey: 'malay' as const },
  { code: 'nb-NO', nameKey: 'norwegian' as const },
  { code: 'nl-BE', nameKey: 'belgianDutch' as const },
  { code: 'nl-NL', nameKey: 'dutch' as const },
  { code: 'pl-PL', nameKey: 'polish' as const },
  { code: 'pt-BR', nameKey: 'brazilianPortuguese' as const },
  { code: 'pt-PT', nameKey: 'portuguese' as const },
  { code: 'ro-RO', nameKey: 'romanian' as const },
  { code: 'ru-RU', nameKey: 'russian' as const },
  { code: 'sk-SK', nameKey: 'slovak' as const },
  { code: 'sl-SI', nameKey: 'slovenian' as const },
  { code: 'sr-RS', nameKey: 'serbian' as const },
  { code: 'sv-SE', nameKey: 'swedish' as const },
  { code: 'sw-KE', nameKey: 'swahili' as const },
  { code: 'ta-IN', nameKey: 'tamil' as const },
  { code: 'th-TH', nameKey: 'thai' as const },
  { code: 'tr-TR', nameKey: 'turkish' as const },
  { code: 'uk-UA', nameKey: 'ukrainian' as const },
  { code: 'ur-PK', nameKey: 'urdu' as const },
  { code: 'vi-VN', nameKey: 'vietnamese' as const },
  { code: 'zh-CN', nameKey: 'chinese' as const },
  { code: 'zh-TW', nameKey: 'traditionalChinese' as const },
  { code: 'yue-CN', nameKey: 'cantonese' as const }
] as const;

// // 创建语言代码到翻译键的映射
// const languageCodeToNameKey: Record<string, string> = {
//   'zh-CN': 'chinese',
//   'en-US': 'english',
//   'en-GB': 'britishEnglish',
//   'en-AU': 'australianEnglish',
//   'ja-JP': 'japanese',
//   'ko-KR': 'korean',
//   'es-ES': 'spanish',
//   'es-MX': 'mexicanSpanish',
//   'es-US': 'usSpanish',
//   'fr-FR': 'french',
//   'fr-CA': 'canadianFrench',
//   'fr-BE': 'belgianFrench',
//   'ru-RU': 'russian',
//   'it-IT': 'italian',
//   'pt-PT': 'portuguese',
//   'pt-BR': 'brazilianPortuguese',
//   'de-DE': 'german',
//   'de-AT': 'austrianGerman',
//   'de-CH': 'swissGerman',
//   'id-ID': 'indonesian',
//   'arb': 'arabic',
//   'ar-AE': 'uaeArabic',
//   'ar-SA': 'saudiArabic',
//   'yue-CN': 'cantonese',
//   'da-DK': 'danish',
//   'nl-NL': 'dutch',
//   'nl-BE': 'belgianDutch',
//   'fi-FI': 'finnish',
//   'hi-IN': 'hindi',
//   'en-IN': 'indianEnglish',
//   'en-GB-WLS': 'welshEnglish',
//   'en-IE': 'irishEnglish',
//   'en-NZ': 'newZealandEnglish',
//   'en-ZA': 'southAfricanEnglish',
//   'is-IS': 'icelandic',
//   'nb-NO': 'norwegian',
//   'pl-PL': 'polish',
//   'ro-RO': 'romanian',
//   'sv-SE': 'swedish',
//   'tr-TR': 'turkish',
//   'cy-GB': 'welsh',
//   'ca-ES': 'catalan',
//   'cs-CZ': 'czech',
//   'vi-VN': 'vietnamese',
//   'uk-UA': 'ukrainian',
//   'af-ZA': 'afrikaans',
//   'bg-BG': 'bulgarian',
//   'hr-HR': 'croatian',
//   'lt-LT': 'lithuanian',
//   'lv-LV': 'latvian',
//   'mk-MK': 'macedonian',
//   'ms-MY': 'malay',
//   'sr-RS': 'serbian',
//   'sk-SK': 'slovak',
//   'sl-SI': 'slovenian',
//   'sw-KE': 'swahili',
//   'ta-IN': 'tamil',
//   'th-TH': 'thai',
//   'ur-PK': 'urdu',
//   'zh-TW': 'traditionalChinese'
// };

// 使用从 polly-service.ts 导入的 SERVICE_LIMITS
// const SERVICE_LIMITS = {
//   aws: 100000,    // AWS Polly 最大支持 100,000 字符
//   minimax: 10000,  // Minimax 最大支持 10,000 字符
//   openai: 10000,  // OpenAI TTS 最大支持 10,000 字符
// };

export default function Home() {
  const { t } = useLanguage();
  const [text, setText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en-US");
  const [speed, setSpeed] = useState(1);
  const [isWordByWord, setIsWordByWord] = useState(false);
  // const [ setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [mounted, setMounted] = useState(false);
  // const [ setLastGeneratedAudio] = useState<ArrayBuffer | null>(null);
  const [selectedProvider] = useState<'aws' | 'minimax' | 'openai'>('aws');
  const [audioVisualizer] = useState<{
    audioContext: AudioContext;
    source: AudioBufferSourceNode;
  } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { data: session } = useSession();
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const analytics = useAnalytics();

  useEffect(() => {
    setMounted(true);
    
    // Initialize voices
    const initVoices = () => {
      // const availableVoices = window.speechSynthesis.getVoices();
      // setVoices(availableVoices);
    };

    initVoices();
    window.speechSynthesis.onvoiceschanged = initVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // useEffect(() => {
  //   if (hasSingleVoice(selectedLanguage, speechService)) {
  //     setIsFemaleVoice(true);
  //   }
  // }, [selectedLanguage, speechService]);

  // 当切换服务商时，自动选择合适的语言
  // useEffect(() => {
  //   // 只在服务商变化时触发语言切换
  //   if (prevSpeechServiceRef.current !== speechService) {
  //     if (speechService === 'minimax') {
  //       setSelectedLanguage('zh-CN');
  //     } else if (speechService === 'openai') {
  //       // 切换到 OpenAI 时默认选择英语
  //       setSelectedLanguage('en-US');
  //     } else if (speechService === 'aws' && selectedLanguage === 'zh-CN') {
  //       // 如果从 Minimax 切换到 AWS，且当前是中文，则切换到英语
  //       setSelectedLanguage('en-US');
  //     }
      
  //     prevSpeechServiceRef.current = speechService;
  //   }
  // }, [speechService, selectedLanguage]);

  // 处理文本输入，限制字符数
//   const handleTextChange = (value: string) => {
//     const limit = SERVICE_LIMITS[speechService];
//     if (value.length <= limit) {
//       setText(value);
//     } else {
//       toast(    t("serviceProviderCharacterLimit", { limit: limit.toLocaleString() }),
// );
//     }
//   };

  // 当切换服务商时，如果当前文本超过新服务商的限制，则截断文本
  // useEffect(() => {
  //   const limit = SERVICE_LIMITS[speechService];
  //   if (text.length > limit) {
  //     setText(text.slice(0, limit));
  //     toast({
  //       description: t("textTruncatedDueToLimit"),
  //       variant: "default",
  //     });
  //   }
  // }, [speechService]);

  const handleSpeak = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);

      // if (!text) {
      //   toast({
      //     title: t("noTextError"),
      //     description: t("pleaseEnterText"),
      //     variant: "destructive",
      //   });
      //   return;
      // }

      // if (!selectedVoice) {
      //   toast({
      //     title: t("error"),
      //     description: t("selectVoiceFirst"),
      //     variant: "destructive",
      //   });
      //   return;
      // }

      let quotaCheckPassed = false;

      try {
        // 检查用户是否登录
        if (!session?.user) {
          // toast({
          //   title: t("loginRequired"),
          //   description: t("loginToUseFeature"),
          //   variant: "destructive",
          // });
          return;
        }

        // 获取用户当前配额信息
        const quotaResponse = await fetch('/api/user/plan');
        if (quotaResponse.ok) {
          const quotaData = await quotaResponse.json();
          
          // 检查用户是否有足够的字符额度
          const { permanentQuota, temporaryQuota, usedCharacters, quotaExpiry } = quotaData.characterQuota;
          const totalQuota = permanentQuota + (quotaExpiry && new Date(quotaExpiry) > new Date() ? temporaryQuota : 0);
          const remainingQuota = totalQuota - usedCharacters;

          if (remainingQuota < text.length) {
            // toast({
            //   title: t("error"),
            //   description: t("insufficientCharacterQuota"),
            //   variant: "destructive",
            // });
            return;
          }
          quotaCheckPassed = true;
        } else {
          console.error(t("quotaCheckFailed"));
          // toast({
          //   title: t("notice"),
          //   description: t("quotaCheckUnavailable"),
          // });
        }
      } catch (error) {
        console.error(t("quotaCheckError"), error);
        // toast({
        //   title: t("notice"),
        //   description: t("quotaCheckUnavailable"),
        // });
      }

      // const audioData = await synthesizeSpeech({
      //   text,
      //   language: selectedLanguage,
      //   voiceId: selectedVoice.id as VoiceId,
      //   engine: selectedVoice.engine,
      //   speed,
      //   service: speechService
      // });

      // if (speechService === 'minimax') {
      //   const result = await playMinimaxAudio(audioData, speed);
      //   setAudioVisualizer(result);
      //   setIsPlaying(true);
      // } else if (speechService === 'openai') {
      //   const result = await playPollyAudio(audioData, speed); // OpenAI 音频可以使用相同的播放函数
      //   setAudioVisualizer(result);
      //   setIsPlaying(true);
      // } else {
      //   const result = await playPollyAudio(audioData, speed);
      //   setAudioVisualizer(result);
      //   setIsPlaying(true);
      // }
      
      // setLastGeneratedAudio(audioData);

      // 只有在配额检查成功的情况下才更新使用量
      if (quotaCheckPassed) {
        try {
          // 统一处理所有语音服务的字符配额更新
          const updateResponse = await fetch('/api/user/update-quota', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              usedCharacters: text.length,
            }),
          });

          if (!updateResponse.ok) {
            console.error(t("updateQuotaFailed"));
          } else {
            console.log(`字符配额更新成功，使用字符数: ${text.length}`);
          }
        } catch (error) {
          console.error(t("updateQuotaError"), error);
        }
      }

    } catch (error) {
      console.error(t("speechSynthesisError"), error);
      // toast({
      //   title: t("error"),
      //   description: (error as Error).message || t("speechError"),
      //   variant: "destructive",
      // });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    try {
      if (!text) {
        // toast({
        //   title: t("noTextError"),
        //   description: t("pleaseEnterText"),
        //   variant: "destructive",
        // });
        return;
      }

      if (!selectedVoice) {
        // toast({
        //   title: t("error"),
        //   description: t("selectVoiceFirst"),
        //   variant: "destructive",
        // });
        return;
      }

      // 检查用户是否登录
      if (!session?.user) {
        // toast({
        //   title: t("loginRequired"),
        //   description: t("loginToUseFeature"),
        //   variant: "destructive",
        // });
        return;
      }

      // const audioData = await synthesizeSpeech({
      //   text,
      //   language: selectedLanguage,
      //   voiceId: selectedVoice.id as VoiceId,
      //   engine: selectedVoice.engine,
      //   speed,
      //   service: speechService
      // });

      // const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      // const filename = `audio_${selectedLanguage}_${timestamp}.mp3`;
      // await downloadAudio(audioData, filename);
    } catch (error) {
      console.error(t("downloadError"), error);
      // toast({
      //   title: t("error"),
      //   description: error instanceof Error ? error.message : t("downloadError"),
      //   variant: "destructive",
      // });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        // 处理纯文本文件
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setText(content);
        };
        reader.readAsText(file);
      } else if (file.type === 'application/pdf') {
        // 处理 PDF 文件
        // toast({
        //   title: t("error"),
        //   description: t("pdfNotSupported"),
        //   variant: "destructive",
        // });
      } else if (file.type.includes('word') || file.name.endsWith('.doc') || file.name.endsWith('.docx') || file.name.endsWith('.rtf')) {
        // 处理 Word 文件
        // toast({
        //   title: t("error"),
        //   description: t("wordNotSupported"),
        //   variant: "destructive",
        // });
      } else {
        // toast({
        //   title: t("error"),
        //   description: t("unsupportedFormat"),
        //   variant: "destructive",
        // });
      }
    } catch (error) {
      console.error("File upload error:", error);
      // toast({
      //   title: t("error"),
      //   description: t("uploadError"),
      //   variant: "destructive",
      // });
    }
  };

  const handlePause = () => {
    if (audioVisualizer) {
      audioVisualizer.audioContext.suspend();
      setIsPlaying(false);
    }
  };

  const handleResume = () => {
    if (audioVisualizer) {
      audioVisualizer.audioContext.resume();
      setIsPlaying(true);
    }
  };

  // 跟踪语音服务切换
  // const handleServiceChange = (value: SpeechService) => {
  //   setSpeechService(value);
  //   setSelectedProvider(value);
  //   analytics.trackEvent('change_service', 'settings', value);
  // };

  // 跟踪语言切换
  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
    analytics.trackEvent('change_language', 'settings', value);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="container mx-auto px-4 py-4 md:py-8 space-y-4 md:space-y-8">
        <Card className="backdrop-blur-sm bg-background/80 border-primary/10 shadow-lg">
          <CardHeader className="border-b border-primary/10 pb-4 md:pb-6 flex justify-center items-center">
            <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent text-center">
              {t('title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 md:pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
              <Card className="backdrop-blur-sm bg-background/80 border-primary/10 shadow-md">
                <CardHeader className="space-y-1 md:space-y-2">
                  <CardTitle className="text-lg md:text-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    {t('serviceSettings')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4">
                  <div className="space-y-3 md:space-y-4">
                    <div className="space-y-1.5 md:space-y-2">
                      <Label>{t('speechService')}</Label>
                      <Select
                        value={""}
                        // onValueChange=
                      >
                        <SelectTrigger className="h-9 md:h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aws">AWS Polly</SelectItem>
                          <SelectItem value="minimax">Minimax</SelectItem>
                          <SelectItem value="openai">OpenAI TTS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5 md:space-y-2">
                      <Label>{t('selectLanguage')}</Label>
                      <Select
                        value={selectedLanguage}
                        onValueChange={handleLanguageChange}
                      >
                        <SelectTrigger className="h-9 md:h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-[40vh] overflow-y-auto">
                          {true ? (
                            MINIMAX_LANGUAGES.map((lang) => (
                              <SelectItem key={lang.code} value={lang.code}>
                                {t(lang.nameKey)}
                              </SelectItem>
                            ))
                          ) : true ? (
                            // 使用 OpenAI 的语言列表
                            OPENAI_LANGUAGES.map((lang) => (
                              <SelectItem key={lang.code} value={lang.code}>
                                {t(lang.nameKey)}
                              </SelectItem>
                            ))
                          ) : (
                            AWS_LANGUAGES.map((lang) => (
                              <SelectItem key={lang.code} value={lang.code}>
                                {t(lang.nameKey)}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5 md:space-y-2">
                      <Label>{t('voice')}</Label>
                      {selectedLanguage && (
                        <VoiceSelector
                          languageCode={selectedLanguage}
                          onVoiceSelect={setSelectedVoice}
                          selectedVoiceId={selectedVoice?.id}
                          provider={selectedProvider}
                        />
                      )}
                    </div>

                    <div className="space-y-1.5 md:space-y-2">
                      <Label>{t('wordByWord')}</Label>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {isWordByWord ? t('on') : t('off')}
                        </span>
                        <Switch
                          checked={isWordByWord}
                          onCheckedChange={setIsWordByWord}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 md:space-y-2">
                      <Label>{t('speed')}: {speed}x</Label>
                      <Slider
                        value={[speed]}
                        onValueChange={([value]) => setSpeed(value)}
                        min={0.5}
                        max={2}
                        step={0.1}
                        className="py-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-background/80 border-primary/10 shadow-md">
                <CardHeader className="space-y-1 md:space-y-2">
                  <CardTitle className="text-lg md:text-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    {t('readText')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4">
                  <div className="relative">
                    <Textarea
                      placeholder={t('inputPlaceholder')}
                      className="min-h-[120px] md:min-h-[200px] bg-background/70 backdrop-blur-sm border-primary/20 focus:border-primary/40 transition-all duration-300 resize-none text-sm md:text-base"
                      value={text}
                      // onChange={(e) => handleTextChange(e.target.value)}
                      // maxLength={SERVICE_LIMITS[speechService]}
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                      {text.length} {t('characters')}
                    </div>
                  </div>
                  
                  {audioVisualizer && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="w-full"
                    >
                      <AudioVisualizer 
                        audioContext={audioVisualizer.audioContext}
                        audioSource={audioVisualizer.source}
                        onPause={handlePause}
                        onResume={handleResume}
                        isPlaying={isPlaying}
                      />
                    </motion.div>
                  )}
                  
                  <div className="flex flex-wrap gap-2 md:gap-4">
                    <RequireAuth>
                      <Button 
                        onClick={handleSpeak} 
                        className="flex-1 h-9 md:h-10 text-sm bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300"
                      >
                        <Volume2 className="mr-2 h-4 w-4" />
                        {t('readText')}
                      </Button>
                    </RequireAuth>

                    {audioVisualizer && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                      >
                        <RequireAuth>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={isPlaying ? handlePause : handleResume}
                            className="h-9 md:h-10 w-9 md:w-10 border-primary/20 hover:border-primary/40"
                          >
                            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                        </RequireAuth>
                      </motion.div>
                    )}

                    <RequireAuth>
                      <Button 
                        variant="outline" 
                        onClick={handleDownload}
                        className="flex-1 h-9 md:h-10 text-sm border-primary/20 hover:border-primary/40 hover:bg-primary/5"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        {t('downloadAudio')}
                      </Button>
                    </RequireAuth>

                    <RequireAuth>
                      <Button
                        variant="outline"
                        className="flex-1 h-9 md:h-10 text-sm border-primary/20 hover:border-primary/40 hover:bg-primary/5"
                        asChild
                      >
                        <label>
                          <Upload className="mr-2 h-4 w-4" />
                          {t('uploadFile')}
                          <input
                            type="file"
                            className="hidden"
                            accept=".txt,.md"
                            onChange={handleFileUpload}
                          />
                        </label>
                      </Button>
                    </RequireAuth>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}