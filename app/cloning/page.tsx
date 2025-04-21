"use client";

// 从React中导入必要的hooks
import { useState, useEffect, useRef } from "react";
// import { useState as useStateImpl, useEffect as useEffectImpl, useRef as useRefImpl } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Volume2, Upload, Download, Pause, Play, Mic, Square } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";
import { AudioVisualizer } from "@/components/audio-visualizer";
import { NavBar } from "@/components/nav-bar";
import { motion } from "framer-motion";
import { RequireAuth } from "@/components/require-auth";
import { useSession } from "next-auth/react";
import { useAnalytics } from '@/hooks/use-analytics';
import { VoiceSelector } from '@/components/voice-selector';
import { VoiceOption } from "@/lib/voice-config";
// import { VoiceId } from "@aws-sdk/client-polly";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// interface Language {
//   code: string;
//   nameKey: 'chinese' | 'english' | 'japanese' | 'korean' | 'spanish' | 'french' | 'russian' | 'italian' | 'portuguese' | 'german' | 'indonesian' | 'arabic' | 'cantonese' | 'danish' | 'dutch' | 'finnish' | 'greek' | 'hebrew' | 'hindi' | 'hungarian' | 'norwegian' | 'polish' | 'romanian' | 'swedish' | 'turkish' | 'welsh' | 'britishEnglish' | 'australianEnglish' | 'mexicanSpanish' | 'usSpanish' |  'canadianFrench' | 'belgianFrench' | 'brazilianPortuguese' | 'austrianGerman' | 'swissGerman' | 'uaeArabic' | 'belgianDutch' | 'indianEnglish' | 'welshEnglish' | 'irishEnglish' | 'newZealandEnglish' | 'southAfricanEnglish' | 'icelandic' | 'catalan' | 'czech' | 'vietnamese' | 'ukrainian';
// }

// interface CloneQuota {
//   remaining_clones: number;
//   used_clones: number;
// }

// interface ClonedVoice {
//   id: string;
//   voiceId: string;
//   name: string;
//   createdAt: string;
// }

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
] as const;

const SERVICE_LIMITS = {
  minimax: 10000  // Minimax 最大支持 10,000 字符
};

export default function Cloning() {
  const { t } = useLanguage();
  const [text, setText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("zh-CN");
  const [speed] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [audioVisualizer] = useState<{
    audioContext: AudioContext;
    source: AudioBufferSourceNode;
    url: string;
  } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { data: session } = useSession();
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const analytics = useAnalytics();
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isCloning, setIsCloning] = useState(false);
  // const [ setClonedVoices] = useState<ClonedVoice[]>([]);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  // const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  // const [cloneQuota, setCloneQuota] = useState<CloneQuota>({ remaining_clones: 0, used_clones: 0 });
  const router = useRouter();

  // 在组件顶层定义错误消息
  const errorMessages = {
    uploadAudioFirst: t("uploadAudioFirst"),
    audioUploadRequirements: t("audioUploadRequirements"),
    loginRequired: t("loginRequired"),
    loginForCloning: t("loginForCloning"),
    fetchUserDataError: t("fetchUserDataError"),
    insufficientCloneCredits: t("insufficientCloneCredits"),
    buyMoreCredits: t("buyMoreCredits"),
    startCloningTitle: t("startCloningTitle"),
    startCloningDesc: t("startCloningDesc"),
    cloneVoiceFailed: t("cloneVoiceFailed"),
    invalidVoiceId: t("invalidVoiceId"),
    cloneSuccess: t("cloneSuccess"),
    cloneReadyToUse: t("cloneReadyToUse"),
    cloneError: t("cloneError"),
    unknownError: t("unknownError"),
    invalidResponse: t("invalidResponse") || "Invalid response from server"
  };

  // 在组件顶层定义所有翻译消息
  const messages = {
    // 已有的错误消息
    ...errorMessages,
    // 新增的其他消息
    error: t("error"),
    fetchCloneVoicesError: t("fetchCloneVoicesError"),
    deleteSuccess: t("deleteSuccess"),
    cloneVoiceDeleted: t("cloneVoiceDeleted"),
    deleteCloneVoiceError: t("deleteCloneVoiceError"),
    recordingComplete: t("recordingComplete"),
    recordingSaved: (filename: string, size: string) => t("recordingSaved", { filename, size }),
    startRecordingTitle: t("startRecordingTitle"),
    startRecordingDesc: t("startRecordingDesc"),
    microphoneAccessError: t("microphoneAccessError"),
    clonedVoice: t("clonedVoice")
  };

  useEffect(() => {
    setMounted(true);
    // 从 localStorage 读取保存的声音ID
    const savedVoiceId = localStorage.getItem('clonedVoiceId');
    if (savedVoiceId) {
      setSelectedVoice({
        id: savedVoiceId,
        gender: 'Female',
        provider: 'minimax',
        name: t('clonedVoice'),
      });
    }
  }, []);

  // 处理文本输入，限制字符数
  // const handleTextChange = (value: string) => {
  //   const limit = SERVICE_LIMITS.minimax;
  //   if (value.length <= limit) {
  //     setText(value);
  //   } else {
  //     toast( t("serviceProviderCharacterLimit", { limit: limit.toLocaleString() }));
  //   }
  // };

  const handleSpeak = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);

      // const audioData = await synthesizeSpeech({
      //   text,
      //   language: selectedLanguage,
      //   voiceId: selectedVoice?.id || '',
      //   speed: speed,
      //   service: 'minimax',
      //   useClonedVoice: !!selectedVoice
      // });

      // const { audioContext, source } = await playMinimaxAudio(audioData, speed);
      // setAudioVisualizer({ audioContext, source, url: '' });

    } catch (error) {
      console.error(t('speechSynthesisError'), error);
      toast( error instanceof Error ? error.message : t('speechError'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    try {
      if (!text) {
        toast( t("pleaseEnterText"));
        return;
      }

      if (!selectedVoice) {
        toast( t("selectVoiceFirst"));
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
      //   service: 'minimax'
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

  // 跟踪语言切换
  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
    analytics.trackEvent('change_language', 'settings', value);
  };

  // 处理音频文件上传
  const handleAudioUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      if (!file.type.startsWith('audio/')) {
        // toast({
        //   title: t("error"),
        //   description: t("audioUploadRequirements"),
        //   variant: "destructive",
        // });
        return;
      }

      // 检查文件大小（20MB限制）
      const maxSize = 20 * 1024 * 1024; // 20MB in bytes
      if (file.size > maxSize) {
        // toast({
        //   title: t("error"),
        //   description: t("fileSizeExceeded", { size: (file.size / 1024 / 1024).toFixed(2) }),
        //   variant: "destructive",
        // });
        return;
      }

      // 检查音频时长
      const audio = new Audio();
      const duration = await new Promise<number>((resolve, reject) => {
        audio.onloadedmetadata = () => resolve(audio.duration);
        audio.onerror = () => reject(new Error(t('audioDurationError')));
        audio.src = URL.createObjectURL(file);
      });

      if (duration < 10) { // 最小10秒
        // toast({
        //   title: t("error"),
        //   description: t("minDurationError"),
        //   variant: "destructive",
        // });
        URL.revokeObjectURL(audio.src);
        return;
      }

      if (duration > 300) { // 最大5分钟
        // toast({
        //   title: t("error"),
        //   description: t("maxDurationError"),
        //   variant: "destructive",
        // });
        URL.revokeObjectURL(audio.src);
        return;
      }

      setAudioFile(file);
      // toast({
      //   title: t("audioFileSelectedTitle"),
      //   description: t("audioFileSelectedDesc", { 
      //     filename: file.name, 
      //     size: (file.size / 1024 / 1024).toFixed(2),
      //     duration: Math.round(duration)
      //   }),
      // });
      URL.revokeObjectURL(audio.src);
    } catch (error) {
      console.error(t("uploadError"), error);
      // toast({
      //   title: t("error"),
      //   description: t("uploadError"),
      //   variant: "destructive",
      // });
    }
  };

  // 获取用户的克隆声音列表
  const fetchClonedVoices = async () => {
    try {
      const response = await fetch('/api/voice/cloned-voices');
      
      // 如果是未登录或其他预期的错误状态，静默处理
      if (response.status === 401 || response.status === 404) {
        // setClonedVoices([]);
        return;
      }

      const data = await response.json();

      // 确保返回的是数组
      if (Array.isArray(data)) {
        // setClonedVoices(data);
      } else {
        // setClonedVoices([]);
      }
    } catch (error) {
      // 静默处理错误，只设置空数组
      // setClonedVoices([]);
      // 仅在开发环境下记录错误
      if (process.env.NODE_ENV === 'development') {
        console.log('获取克隆语音列表:', error);
      }
    }
  };

  // useEffect(() => {
  //   if (session?.user) {
  //     fetchClonedVoices();
  //   } else {
  //     setClonedVoices([]);
  //   }
  // }, [session]);

  // 删除克隆声音
  // const handleDeleteClonedVoice = async (id: string) => {
  //   try {
  //     const response = await fetch('/api/voice/cloned-voices', {
  //       method: 'DELETE',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ id })
  //     });

  //     if (!response.ok) {
  //       throw new Error(messages.deleteCloneVoiceError);
  //     }

  //     // 更新列表
  //     setClonedVoices(prev => prev.filter(voice => voice.id !== id));
      
  //     // 如果当前选中的是被删除的声音，清除选择
  //     if (selectedVoice?.id === id) {
  //       setSelectedVoice(null);
  //     }

  //     toast({
  //       title: messages.deleteSuccess,
  //       description: messages.cloneVoiceDeleted,
  //     });
  //   } catch (error) {
  //     console.error(messages.deleteCloneVoiceError, error);
  //     toast({
  //       title: messages.error,
  //       description: messages.deleteCloneVoiceError,
  //       variant: "destructive",
  //     });
  //   }
  // };

  // 克隆声音
  const handleCloneVoice = async () => {
    if (!audioFile) {
      // toast({
      //   title: t("error"),
      //   description: errorMessages.uploadAudioFirst,
      //   variant: "destructive",
      // });
      return;
    }

    // 检查用户是否登录
    if (!session?.user) {
      // toast({
      //   title: errorMessages.loginRequired,
      //   description: errorMessages.loginForCloning,
      //   variant: "destructive",
      // });
      router.push('/auth/login');
      return;
    }

    // 检查剩余次数
    try {
      const response = await fetch('/api/user/plan');
      if (!response.ok) {
        throw new Error(errorMessages.fetchUserDataError);
      }
      const data = await response.json();
      
      if (!data.cloneQuota || data.cloneQuota.remaining_clones <= 0) {
        // toast({
        //   title: errorMessages.insufficientCloneCredits,
        //   description: errorMessages.buyMoreCredits,
        //   variant: "destructive",
        // });
        router.push('/pricing?type=clone');
        return;
      }
    } catch (error) {
      console.error(errorMessages.fetchUserDataError, error);
      // toast({
      //   title: t("error"),
      //   description: errorMessages.fetchUserDataError,
      //   variant: "destructive",
      // });
      return;
    }

    try {
      setIsCloning(true);

      const formData = new FormData();
      formData.append('audio', audioFile);

      // toast({
      //   title: errorMessages.startCloningTitle,
      //   description: errorMessages.startCloningDesc,
      // });

      const response = await fetch('/api/voice/clone', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        let errorMessage = errorMessages.cloneVoiceFailed;
        try {
          // 检查响应的内容类型
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            if (errorData.error) {
              errorMessage = errorData.error;
            }
          } else {
            // 如果不是JSON，尝试获取文本内容
            const textContent = await response.text();
            console.error('非JSON错误响应:', textContent.substring(0, 200) + '...');
          }
        } catch (parseError) {
          console.error('解析错误响应失败:', parseError);
        }
        throw new Error(errorMessage);
      }

      // 安全地解析JSON响应
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('解析JSON响应失败:', jsonError);
        throw new Error(errorMessages.invalidResponse);
      }
      
      if (!data.voiceId) {
        throw new Error(errorMessages.invalidVoiceId);
      }

      await fetchClonedVoices();

      const clonedVoice: VoiceOption = {
        id: data.savedVoice.voiceId,
        gender: 'Female',
        provider: 'minimax',
        name: data.savedVoice.name,
      };

      setSelectedVoice(clonedVoice);
      
      // toast({
      //   title: errorMessages.cloneSuccess,
      //   description: errorMessages.cloneReadyToUse,
      // });

      handleResetAudio();
    } catch (error) {
      console.error(errorMessages.cloneError, error);
      // toast({
      //   title: errorMessages.cloneError,
      //   description: error instanceof Error ? error.message : errorMessages.unknownError,
      //   variant: "destructive",
      // });
    } finally {
      setIsCloning(false);
    }
  };

  // 重置音频文件
  const handleResetAudio = () => {
    setAudioFile(null);
    if (audioInputRef.current) {
      audioInputRef.current.value = '';
    }
  };

  // 处理录音
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const file = new File([blob], `recording-${Date.now()}.wav`, { type: 'audio/wav' });
        setAudioFile(file);
        // setRecordedChunks([]);
        // toast({
        //   title: messages.recordingComplete,
        //   description: messages.recordingSaved(
        //     file.name,
        //     (file.size / 1024 / 1024).toFixed(2)
        //   ),
        // });
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      // toast({
      //   title: messages.startRecordingTitle,
      //   description: messages.startRecordingDesc,
      // });
    } catch (error) {
      console.error(messages.error, error);
      // toast({
      //   title: messages.error,
      //   description: messages.microphoneAccessError,
      //   variant: "destructive",
      // });
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="container mx-auto px-4 py-4 md:py-8 space-y-4 md:space-y-8">
        <Card className="backdrop-blur-sm bg-background/80 border-primary/10 shadow-lg">
          <CardHeader className="border-b border-primary/10 pb-4 md:pb-6">
            <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent text-center">
              {t('voiceCloning')}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 md:pt-6">
            <div className="space-y-4 md:space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="backdrop-blur-sm bg-background/80 border-primary/10 shadow-md">
                  <CardHeader className="space-y-1 md:space-y-2">
                    <CardTitle className="text-lg md:text-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                      {t('uploadAudio')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 md:space-y-4">
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <RequireAuth>
                          <Button
                            variant="outline"
                            onClick={() => audioInputRef.current?.click()}
                            disabled={isCloning || isRecording}
                            className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 h-10"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {t('uploadAudio')}
                          </Button>
                        </RequireAuth>
                        <RequireAuth>
                          <Button
                            variant="outline"
                            onClick={isRecording ? handleStopRecording : handleStartRecording}
                            disabled={isCloning}
                            className={cn(
                              "bg-gradient-to-r text-white h-10",
                              isRecording 
                                ? "from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                                : "from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600"
                            )}
                          >
                            {isRecording ? (
                              <>
                                <Square className="w-4 h-4 mr-2" />
                                {t('stopRecording')}
                              </>
                            ) : (
                              <>
                                <Mic className="w-4 h-4 mr-2" />
                                {t('record')}
                              </>
                            )}
                          </Button>
                        </RequireAuth>
                      </div>
                      {audioFile && (
                        <div className="text-sm text-gray-500 bg-muted/30 p-2 rounded-lg">
                          {t('fileSelected', { 
                            filename: audioFile.name, 
                            size: (audioFile.size / 1024 / 1024).toFixed(2) 
                          })}
                        </div>
                      )}
                      <input
                        type="file"
                        ref={audioInputRef}
                        className="hidden"
                        accept="audio/*"
                        onChange={handleAudioUpload}
                      />
                      <Button
                        className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-10 text-white hover:from-blue-600 hover:via-purple-600 hover:to-pink-600"
                        onClick={handleCloneVoice}
                        disabled={!audioFile || isCloning || isRecording}
                      >
                        {isCloning ? t('cloning') : t('startCloning')}
                      </Button>
                      {selectedVoice && (
                        <div className="p-2 bg-muted/30 rounded-lg">
                          <div className="flex items-center justify-between">
                            <p className="text-sm">{t('voiceId')}{selectedVoice.id}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                localStorage.removeItem('clonedVoiceId');
                                setSelectedVoice(null);
                                // toast({
                                //   title: t("clear"),
                                //   description: t("clearClonedVoice"),
                                // });
                              }}
                              className="text-red-500 hover:text-red-600"
                            >
                              {t('clear')}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-background/80 border-primary/10 shadow-md">
                  <CardHeader className="space-y-1 md:space-y-2">
                    <CardTitle className="text-lg md:text-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                      {t('instructions')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>{t('instruction1')}</p>
                      <p>{t('instruction2')}</p>
                      <p>{t('instruction3')}</p>
                      <p>{t('instruction4')}</p>
                      <p>{t('instruction5')}</p>
                      <p>{t('instruction6')}</p>
                      <div className="mt-4 pt-4 border-t border-primary/10">
                        <p className="text-xs text-red-500">{t('legalNotice')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="backdrop-blur-sm bg-background/80 border-primary/10 shadow-md">
                  <CardHeader className="space-y-1 md:space-y-2">
                    <CardTitle className="text-lg md:text-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                      {t('serviceSettings')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 md:space-y-4">
                    <div className="space-y-3 md:space-y-4">
                      <div className="space-y-1.5 md:space-y-2">
                        <Label>{t('selectLanguage')}</Label>
                        <Select
                          value={selectedLanguage}
                          onValueChange={handleLanguageChange}
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="max-h-[40vh] overflow-y-auto">
                            {MINIMAX_LANGUAGES.map((lang) => (
                              <SelectItem key={lang.code} value={lang.code}>
                                {t(lang.nameKey)}
                              </SelectItem>
                            ))}
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
                            provider="minimax"
                            // clonedVoices={clonedVoices.map(voice => ({
                            //   id: voice.voiceId,
                            //   provider: 'minimax',
                            //   name: voice.name,
                            //   gender: 'Female'
                            // }))}
                          />
                        )}
                      </div>

                      <div className="space-y-1.5 md:space-y-2">
                        <Label>{t('speed')}: {speed}x</Label>
                        <Slider
                          value={[speed]}
                          // onValueChange={([value]) => setSpeed(value)}
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
                        maxLength={SERVICE_LIMITS.minimax}
                      />
                      <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                        {text.length}/{SERVICE_LIMITS.minimax.toLocaleString()} {t('characters')}
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
                    
                    <div className="flex flex-wrap gap-2">
                      <RequireAuth>
                        <Button 
                          onClick={handleSpeak} 
                          className="flex-1 h-10 text-sm bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300"
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
                              className="h-10 w-10 border-primary/20 hover:border-primary/40"
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
                          className="flex-1 h-10 text-sm border-primary/20 hover:border-primary/40 hover:bg-primary/5"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          {t('downloadAudio')}
                        </Button>
                      </RequireAuth>

                      <RequireAuth>
                        <Button
                          variant="outline"
                          className="flex-1 h-10 text-sm border-primary/20 hover:border-primary/40 hover:bg-primary/5"
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
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}