// import { SynthesizeSpeechCommand, SynthesizeSpeechCommandInput, LanguageCode, VoiceId } from "@aws-sdk/client-polly";
// import { pollyClient } from "./aws-config";
// import { AudioCache } from './audio-cache';
// import { openai, TTS_MODEL } from './openai';

// import { getVoicesByLanguage } from './voice-config';
// const voiceConfig = {
//   "fr-FR": {
//     female: "Lea" as VoiceId,
//     male: "Chantal" as VoiceId
//   },
//   "is-IS": {
//     female: "Dora" as VoiceId,
//     male: "Karl" as VoiceId
//   },
//   "nb-NO": {
//     female: "Liv" as VoiceId,
//     male: "Liv" as VoiceId
//   },
//   "ro-RO": {
//     female: "Carmen" as VoiceId,
//     male: "Carmen" as VoiceId
//   },
//   "sv-SE": {
//     female: "Astrid" as VoiceId,
//     male: "Astrid" as VoiceId
//   },
//   "es-US": {
//     female: "Lupe" as VoiceId,
//     male: "Pedro" as VoiceId
//   },
//   "fi-FI": {
//     female: "Suvi" as VoiceId,
//     male: "Suvi" as VoiceId
//   },
//   "yue-CN": {
//     female: "Hiujin" as VoiceId,
//     male: "Hiujin" as VoiceId
//   },
//   "ca-ES": {
//     female: "Arlet" as VoiceId,
//     male: "Arlet" as VoiceId
//   },
//   "de-AT": {
//     female: "Hannah" as VoiceId,
//     male: "Hannah" as VoiceId
//   },
//   "de-CH": {
//     female: "Sabrina" as VoiceId,
//     male: "Sabrina" as VoiceId
//   },
//   "en-IE": {
//     female: "Niamh" as VoiceId,
//     male: "Niamh" as VoiceId
//   },
//   "en-NZ": {
//     female: "Aria" as VoiceId,
//     male: "Aria" as VoiceId
//   },
//   "en-ZA": {
//     female: "Ayanda" as VoiceId,
//     male: "Ayanda" as VoiceId
//   },
//   "fr-BE": {
//     female: "Isabelle" as VoiceId,
//     male: "Isabelle" as VoiceId
//   },
//   "nl-BE": {
//     female: "Lisa" as VoiceId,
//     male: "Lisa" as VoiceId
//   },
//   "ar-AE": {
//     female: "Hala" as VoiceId,
//     male: "Hala" as VoiceId
//   },
//   "cs-CZ": {
//     female: "Jitka" as VoiceId,
//     male: "Jitka" as VoiceId
//   }
// };

// const languageCodeMap = {
//   "en-US": "en-US" as LanguageCode,
//   "en-GB": "en-GB" as LanguageCode,
//   "en-AU": "en-AU" as LanguageCode,
//   "zh-CN": "cmn-CN" as LanguageCode,
//   "fr-FR": "fr-FR" as LanguageCode,
//   "es-ES": "es-ES" as LanguageCode,
//   "es-MX": "es-MX" as LanguageCode,
//   "de-DE": "de-DE" as LanguageCode,
//   "it-IT": "it-IT" as LanguageCode,
//   "ja-JP": "ja-JP" as LanguageCode,
//   "ko-KR": "ko-KR" as LanguageCode,
//   "pt-BR": "pt-BR" as LanguageCode,
//   "pt-PT": "pt-PT" as LanguageCode,
//   "pl-PL": "pl-PL" as LanguageCode,
//   "ru-RU": "ru-RU" as LanguageCode,
//   "tr-TR": "tr-TR" as LanguageCode,
//   "hi-IN": "hi-IN" as LanguageCode,
//   "arb": "arb" as LanguageCode,
//   "cy-GB": "cy-GB" as LanguageCode,
//   "da-DK": "da-DK" as LanguageCode,
//   "nl-NL": "nl-NL" as LanguageCode,
//   "en-IN": "en-IN" as LanguageCode,
//   "en-GB-WLS": "en-GB-WLS" as LanguageCode,
//   "fr-CA": "fr-CA" as LanguageCode,
//   "is-IS": "is-IS" as LanguageCode,
//   "nb-NO": "nb-NO" as LanguageCode,
//   "ro-RO": "ro-RO" as LanguageCode,
//   "sv-SE": "sv-SE" as LanguageCode,
//   "es-US": "es-US" as LanguageCode,
//   "fi-FI": "fi-FI" as LanguageCode,
//   "yue-CN": "yue-CN" as LanguageCode,
//   "ca-ES": "ca-ES" as LanguageCode,
//   "de-AT": "de-AT" as LanguageCode,
//   "de-CH": "de-CH" as LanguageCode,
//   "en-IE": "en-IE" as LanguageCode,
//   "en-NZ": "en-NZ" as LanguageCode,
//   "en-ZA": "en-ZA" as LanguageCode,
//   "fr-BE": "fr-BE" as LanguageCode,
//   "nl-BE": "nl-BE" as LanguageCode,
//   "ar-AE": "ar-AE" as LanguageCode,
//   "cs-CZ": "cs-CZ" as LanguageCode
// };

// // Minimax声音配置
// const minimaxVoiceMap = {
//   female: {
//     zh: 'female-qn-qingse',
//     en: 'female-qn-qingse',
//     ja: 'female-qn-qingse',
//     ko: 'female-qn-qingse',
//     es: 'female-qn-qingse',
//     fr: 'female-qn-qingse',
//     ru: 'female-qn-qingse',
//     it: 'female-qn-qingse',
//     pt: 'female-qn-qingse',
//     de: 'female-qn-qingse'
//   },
//   male: {
//     zh: 'male-qn-qingse',
//     en: 'male-qn-qingse',
//     ja: 'male-qn-qingse',
//     ko: 'male-qn-qingse',
//     es: 'male-qn-qingse',
//     fr: 'male-qn-qingse',
//     ru: 'male-qn-qingse',
//     it: 'male-qn-qingse',
//     pt: 'male-qn-qingse',
//     de: 'male-qn-qingse'
//   }
// };

// // 服务提供商类型
// export type SpeechService = 'aws' | 'minimax' | 'openai';

// // 语音合成选项
// export interface SpeechOptions {
//   text: string;
//   language: string;
//   voiceId: VoiceId | string;
//   engine?: 'standard' | 'neural';
//   speed: number;
//   service: SpeechService;
//   useClonedVoice?: boolean;
// }

// // 字符限制
// export const SERVICE_LIMITS: Record<SpeechService, number> = {
//   aws: 100000,
//   minimax: 10000,
//   openai: 2000
// };

// export async function synthesizeSpeech({
//   text,
//   language,
//   voiceId,
//   engine = 'neural',
//   speed = 1.0,
//   service = 'aws',
//   useClonedVoice = false,
//   clonedVoiceId = ''
// }: {
//   text: string;
//   language: string;
//   voiceId: string;
//   engine?: 'standard' | 'neural';
//   speed?: number;
//   service?: SpeechService;
//   useClonedVoice?: boolean;
//   clonedVoiceId?: string;
// }): Promise<ArrayBuffer> {
//   if (service === 'minimax') {
//     // 转换语言代码
//     const minimaxLanguage = getMinimaxLanguageCode(language);
    
//     const response = await fetch('/api/speech', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         text,
//         language: minimaxLanguage,
//         voiceId,
//         speed,
//         useClonedVoice
//       })
//     });

//     if (!response.ok) {
//       let errorMessage = '语音合成失败';
//       try {
//         const errorData = await response.json();
//         console.error('API 响应:', errorData);
//         if (errorData.error) {
//           // 如果是API错误，直接显示错误信息
//           errorMessage = typeof errorData.error === 'string' 
//             ? errorData.error 
//             : JSON.stringify(errorData.error);
//         }
//       } catch (e) {
//         console.error('解析错误响应失败:', e);
//       }
//       throw new Error(errorMessage);
//     }

//     return await response.arrayBuffer();
//   } else {
//     // 1. 检查缓存
//     const cacheKey = AudioCache.getCacheKey({
//       text,
//       language,
//       voiceId,
//       engine,
//       speed,
//       service
//     });
    
//     const cachedAudio = AudioCache.get(cacheKey);
//     if (cachedAudio) {
//       return cachedAudio;
//     }

//     // 2. 根据服务选择生成方式
//     const audioData = (service as 'minimax' | 'aws' | 'openai') === 'minimax'
//       ? await synthesizeWithMinimax(text, language, true)
//       : (service as 'minimax' | 'aws' | 'openai') === 'openai'
//         ? await synthesizeWithOpenai(text, language, voiceId, speed)
//         : await synthesizeWithPolly(text, language, { voiceId: voiceId as VoiceId, engine }, speed);

//     // 3. 存入缓存
//     AudioCache.set(cacheKey, audioData);
    
//     return audioData;
//   }
// }

// // Minimax支持的语言代码映射
// const minimaxLanguageMap = {
//   'zh-CN': 'zh',
//   'en-US': 'en',
//   'ja-JP': 'ja',
//   'ko-KR': 'ko',
//   'es-ES': 'es',
//   'fr-FR': 'fr',
//   'ru-RU': 'ru',
//   'it-IT': 'it',
//   'pt-PT': 'pt',
//   'de-DE': 'de',
//   'id-ID': 'id',
//   'vi-VN': 'vi',
//   'uk-UA': 'uk',
//   'th-TH': 'th',
//   'tr-TR': 'tr',
//   'ar-SA': 'ar'
// } as const;

// function isMinimaxSupported(language: string): boolean {
//   return language in minimaxLanguageMap;
// }

// function getMinimaxLanguageCode(pollyLanguage: string): string {
//   return minimaxLanguageMap[pollyLanguage as keyof typeof minimaxLanguageMap] || pollyLanguage;
// }

// async function synthesizeWithMinimax(text: string, language: string, isFemale: boolean): Promise<ArrayBuffer> {
//   const minimaxLanguage = getMinimaxLanguageCode(language);
//   // 非中文固定使用女声
//   const voiceId = language === 'zh-CN' 
//     ? (isFemale ? minimaxVoiceMap.female[minimaxLanguage as keyof typeof minimaxVoiceMap.female]
//                 : minimaxVoiceMap.male[minimaxLanguage as keyof typeof minimaxVoiceMap.male])
//     : minimaxVoiceMap.female[minimaxLanguage as keyof typeof minimaxVoiceMap.female];

//   const response = await fetch('/api/speech', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       text,
//       language: minimaxLanguage,
//       voiceId
//     }),
//   });

//   if (!response.ok) {
//     throw new Error('语音生成失败');
//   }

//   return await response.arrayBuffer();
// }

// async function synthesizeWithOpenai(
//   text: string, 
//   language: string, 
//   voiceId: string, 
//   speed: number
// ): Promise<ArrayBuffer> {
//   try {
//     console.log('开始OpenAI TTS请求...');
//     const response = await fetch('/api/voice/openai-tts', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         text,
//         voice: voiceId,
//         speed
//       }),
//       signal: AbortSignal.timeout(30000) // 30秒超时
//     });

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}));
//       console.error('OpenAI TTS请求失败:', response.status, response.statusText, errorData);
//       throw new Error(`语音生成失败: ${response.status} ${response.statusText} ${errorData.error || ''}`);
//     }

//     console.log('OpenAI TTS请求成功，处理响应...');
//     // 使用blob()而不是arrayBuffer()，避免ArrayBuffer被分离
//     const blob = await response.blob();
//     return await blob.arrayBuffer();
//   } catch (error: any) {
//     // 无论是网络错误、超时、服务器错误还是其他任何错误，都切换到AWS Polly
//     console.warn('OpenAI TTS请求失败，切换到AWS Polly作为备选方案:', error);
    
//     // 确定适合的AWS Polly声音ID
//     let awsVoiceId: VoiceId = 'Joanna'; // 默认英语女声
    
//     // 根据语言代码选择合适的AWS Polly声音
//     // 使用更全面的语言映射
//     if (language.startsWith('zh')) {
//       awsVoiceId = 'Zhiyu'; // 中文
//     } else if (language.startsWith('ja')) {
//       awsVoiceId = 'Takumi'; // 日语
//     } else if (language.startsWith('fr')) {
//       awsVoiceId = 'Lea'; // 法语
//     } else if (language.startsWith('de')) {
//       awsVoiceId = 'Vicki'; // 德语
//     } else if (language.startsWith('es')) {
//       awsVoiceId = 'Lupe'; // 西班牙语
//     } else if (language.startsWith('it')) {
//       awsVoiceId = 'Bianca'; // 意大利语
//     } else if (language.startsWith('pt')) {
//       awsVoiceId = 'Camila'; // 葡萄牙语
//     } else if (language.startsWith('ru')) {
//       awsVoiceId = 'Tatyana'; // 俄语
//     } else if (language.startsWith('ar')) {
//       awsVoiceId = 'Zeina'; // 阿拉伯语
//     } else if (language.startsWith('hi')) {
//       awsVoiceId = 'Aditi'; // 印地语
//     } else if (language.startsWith('ko')) {
//       awsVoiceId = 'Seoyeon'; // 韩语
//     } else if (language.startsWith('pl')) {
//       awsVoiceId = 'Ewa'; // 波兰语
//     } else if (language.startsWith('sv')) {
//       awsVoiceId = 'Astrid'; // 瑞典语
//     } else if (language.startsWith('tr')) {
//       awsVoiceId = 'Filiz'; // 土耳其语
//     } else if (language.startsWith('nl')) {
//       awsVoiceId = 'Lotte'; // 荷兰语
//     } else if (language.startsWith('da')) {
//       awsVoiceId = 'Naja'; // 丹麦语
//     } else if (language.startsWith('no')) {
//       awsVoiceId = 'Liv'; // 挪威语
//     } else if (language.startsWith('is')) {
//       awsVoiceId = 'Dora'; // 冰岛语
//     } else if (language.startsWith('ro')) {
//       awsVoiceId = 'Carmen'; // 罗马尼亚语
//     } else if (language.startsWith('fi')) {
//       awsVoiceId = 'Suvi'; // 芬兰语
//     } else if (language.startsWith('cs')) {
//       awsVoiceId = 'Jitka'; // 捷克语
//     } else if (language.startsWith('ca')) {
//       awsVoiceId = 'Arlet'; // 加泰罗尼亚语
//     } else if (language.startsWith('cy')) {
//       awsVoiceId = 'Gwyneth'; // 威尔士语
//     } else if (language.startsWith('uk') || 
//                language.startsWith('hu') || 
//                language.startsWith('th') || 
//                language.startsWith('id') || 
//                language.startsWith('ms') || 
//                language.startsWith('vi')) {
//       // 对于不直接支持的语言，使用英语默认声音
//       // 根据OpenAI声音选择对应的英语声音
//       switch (voiceId) {
//         case 'alloy':
//         case 'echo':
//         case 'fable':
//         case 'shimmer':
//         case 'coral':
//         case 'sage':
//           awsVoiceId = 'Joanna'; // 女声
//           break;
//         case 'onyx':
//         case 'nova':
//         case 'ash':
//         case 'ballad':
//           awsVoiceId = 'Matthew'; // 男声
//           break;
//         default:
//           awsVoiceId = 'Joanna';
//       }
//     } else {
//       // 根据OpenAI声音选择对应的英语声音
//       switch (voiceId) {
//         case 'alloy':
//         case 'echo':
//         case 'fable':
//           awsVoiceId = 'Joanna'; // 女声
//           break;
//         case 'onyx':
//         case 'nova':
//           awsVoiceId = 'Matthew'; // 男声
//           break;
//         case 'shimmer':
//           awsVoiceId = 'Kendra'; // 女声
//           break;
//         case 'ash':
//           awsVoiceId = 'Joey'; // 男声
//           break;
//         case 'coral':
//           awsVoiceId = 'Salli'; // 女声
//           break;
//         case 'ballad':
//           awsVoiceId = 'Justin'; // 男声
//           break;
//         case 'sage':
//           awsVoiceId = 'Amy'; // 女声
//           break;
//         default:
//           awsVoiceId = 'Joanna';
//       }
//     }
    
//     console.log(`切换到AWS Polly备选方案，使用声音: ${awsVoiceId}，原始语言: ${language}`);
    
//     // 使用AWS Polly作为备选方案
//     return await synthesizeWithPolly(text, language, { voiceId: awsVoiceId, engine: 'neural' }, speed);
//   }
// }

// // 优化 Polly 合成函数
// export interface PollyVoiceOptions {
//   voiceId: VoiceId;
//   engine?: 'standard' | 'neural';
// }

// async function synthesizeWithPolly(
//   text: string,
//   language: string,
//   voiceOptions: PollyVoiceOptions,
//   speed: number
// ): Promise<ArrayBuffer> {
//   try {
//     const languageCode = languageCodeMap[language as keyof typeof languageCodeMap] || languageCodeMap["en-US"];
//     const { voiceId, engine = 'standard' } = voiceOptions;

//     if (!voiceId) {
//       throw new Error("语音ID不能为空");
//     }

//     // 使用 AbortController 设置超时
//     const controller = new AbortController();
//     const timeout = setTimeout(() => controller.abort(), 10000); // 10秒超时

//     const input: SynthesizeSpeechCommandInput = {
//       Engine: engine,
//       LanguageCode: languageCode,
//       OutputFormat: "mp3",
//       SampleRate: "24000",
//       Text: text,
//       TextType: "text",
//       VoiceId: voiceId
//     };

//     const command = new SynthesizeSpeechCommand(input);
//     const response = await Promise.race([
//       pollyClient.send(command),
//       new Promise<never>((_, reject) => 
//         setTimeout(() => reject(new Error("Polly 请求超时")), 10000)
//       )
//     ]);

//     clearTimeout(timeout);

//     if (!response.AudioStream) {
//       throw new Error("No audio stream returned");
//     }

//     return new Uint8Array(await response.AudioStream.transformToByteArray()).buffer;
//   } catch (error) {
//     console.error("Error synthesizing speech:", error);
//     throw error;
//   }
// }

// interface PlayAudioResult {
//   audioContext: AudioContext;
//   source: AudioBufferSourceNode;
// }

// export async function playPollyAudio(audioData: ArrayBuffer, speed: number = 1): Promise<PlayAudioResult> {
//   // 创建一个新的ArrayBuffer副本，避免使用可能已分离的ArrayBuffer
//   const blob = new Blob([audioData], { type: 'audio/mp3' });
//   const freshArrayBuffer = await blob.arrayBuffer();
  
//   const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
//   const audioBuffer = await audioContext.decodeAudioData(freshArrayBuffer);
  
//   const source = audioContext.createBufferSource();
//   source.buffer = audioBuffer;
//   source.playbackRate.value = speed;
//   source.connect(audioContext.destination);
//   source.start(0);
  
//   return { audioContext, source };
// }

// export async function downloadAudio(audioData: ArrayBuffer, filename: string) {
//   const blob = new Blob([audioData], { type: 'audio/mp3' });
//   const url = URL.createObjectURL(blob);
//   const a = document.createElement('a');
//   a.href = url;
//   a.download = filename;
//   document.body.appendChild(a);
//   a.click();
//   document.body.removeChild(a);
//   URL.revokeObjectURL(url);
// }

// export function hasSingleVoice(language: string, service?: SpeechService): boolean {
//   // Minimax模式下，只有中文支持选择音色
//   if (service === 'minimax') {
//     return language !== 'zh-CN';
//   }

//   // AWS Polly模式下的逻辑
//   const voices = getVoicesByLanguage(language);
//   if (voices.length === 0) return false;
//   return voices.length === 1;
// }

// export const minimaxLanguages = {
//   'zh-CN': 'zh',
//   'en-US': 'en',
//   'ja-JP': 'ja',
//   'ko-KR': 'ko',
//   'es-ES': 'es',
//   'fr-FR': 'fr',
//   'ru-RU': 'ru',
//   'it-IT': 'it',
//   'pt-PT': 'pt',
//   'de-DE': 'de',
//   'id-ID': 'id',
//   'vi-VN': 'vi',
//   'uk-UA': 'uk',
//   'th-TH': 'th',
//   'tr-TR': 'tr',
//   'ar-SA': 'ar'
// } as const;

// export async function playMinimaxAudio(audioData: ArrayBuffer, speed: number = 1): Promise<PlayAudioResult> {
//   const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
//   try {
//     // 创建一个新的ArrayBuffer副本，避免使用可能已分离的ArrayBuffer
//     const blob = new Blob([audioData], { type: 'audio/mp3' });
//     const freshArrayBuffer = await blob.arrayBuffer();
    
//     const audioBuffer = await audioContext.decodeAudioData(freshArrayBuffer);
//     const source = audioContext.createBufferSource();
//     source.buffer = audioBuffer;
//     source.playbackRate.value = speed;
//     source.connect(audioContext.destination);
//     source.start(0);
    
//     return { audioContext, source };
//   } catch (error) {
//     audioContext.close();
//     throw error;
//   }
// }