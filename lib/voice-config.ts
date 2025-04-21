import { VoiceId } from "@aws-sdk/client-polly";

export interface VoiceOption {
  id: VoiceId | string;
  gender: 'Female' | 'Male';
  engine?: 'standard' | 'neural';
  provider?: 'aws' | 'minimax' | 'openai';
  name: string;
}

export interface LanguageVoices {
  languageCode: string;
  languageName: string;
  provider: 'aws' | 'minimax' | 'openai';
  voices: VoiceOption[];
  defaultVoice: VoiceId | string;
}

export const AWS_VOICES: LanguageVoices[] = [
  {
    languageCode: "arb",
    languageName: "阿拉伯语",
    provider: "aws",
    voices: [
      { id: "Zeina", name: "Zeina", gender: "Female", engine: "standard" }
    ],
    defaultVoice: "Zeina"
  },
  {
    languageCode: "zh-CN",
    languageName: "中文（普通话）",
    provider: "aws",
    voices: [
      { id: "Zhiyu", name: "Zhiyu", gender: "Female", engine: "standard" }
    ],
    defaultVoice: "Zhiyu"
  },
  {
    languageCode: "da-DK",
    languageName: "丹麦语",
    provider: "aws",
    voices: [
      { id: "Naja", name: "Naja", gender: "Female", engine: "standard" },
      { id: "Mads", name: "Mads", gender: "Male", engine: "standard" }
    ],
    defaultVoice: "Naja"
  },
  {
    languageCode: "nl-NL",
    languageName: "荷兰语",
    provider: "aws",
    voices: [
      { id: "Lotte", name: "Lotte", gender: "Female", engine: "standard" },
      { id: "Ruben", name: "Ruben", gender: "Male", engine: "standard" }
    ],
    defaultVoice: "Lotte"
  },
  {
    languageCode: "en-AU",
    languageName: "英语（澳大利亚）",
    provider: "aws",
    voices: [
      { id: "Nicole", name: "Nicole", gender: "Female", engine: "standard" },
      { id: "Russell", name: "Russell", gender: "Male", engine: "standard" }
    ],
    defaultVoice: "Nicole"
  },
  {
    languageCode: "en-GB",
    languageName: "英语（英国）",
    provider: "aws",
    voices: [
      { id: "Emma", name: "Emma", gender: "Female", engine: "standard" },
      { id: "Brian", name: "Brian", gender: "Male", engine: "standard" }
    ],
    defaultVoice: "Emma"
  },
  {
    languageCode: "en-IN",
    languageName: "英语（印度）",
    provider: "aws",
    voices: [
      { id: "Aditi", name: "Aditi", gender: "Female", engine: "standard" },
      { id: "Raveena", name: "Raveena", gender: "Female", engine: "standard" }
    ],
    defaultVoice: "Aditi"
  },
  {
    languageCode: "en-US",
    languageName: "英语（美国）",
    provider: "aws",
    voices: [
      { id: "Salli", name: "Salli", gender: "Female", engine: "standard" },
      { id: "Joey", name: "Joey", gender: "Male", engine: "standard" }
    ],
    defaultVoice: "Salli"
  },
  {
    languageCode: "fr-FR",
    languageName: "法语（法国）",
    provider: "aws",
    voices: [
      { id: "Céline", name: "Céline", gender: "Female", engine: "standard" },
      { id: "Mathieu", name: "Mathieu", gender: "Male", engine: "standard" }
    ],
    defaultVoice: "Céline"
  },
  {
    languageCode: "fr-CA",
    languageName: "法语（加拿大）",
    provider: "aws",
    voices: [
      { id: "Chantal", name: "Chantal", gender: "Female", engine: "standard" }
    ],
    defaultVoice: "Chantal"
  },
  {
    languageCode: "de-DE",
    languageName: "德语",
    provider: "aws",
    voices: [
      { id: "Marlene", name: "Marlene", gender: "Female", engine: "standard" },
      { id: "Hans", name: "Hans", gender: "Male", engine: "standard" }
    ],
    defaultVoice: "Marlene"
  },
  {
    languageCode: "hi-IN",
    languageName: "印地语",
    provider: "aws",
    voices: [
      { id: "Aditi", name: "Aditi", gender: "Female", engine: "standard" }
    ],
    defaultVoice: "Aditi"
  },
  {
    languageCode: "is-IS",
    languageName: "冰岛语",
    provider: "aws",
    voices: [
      { id: "Dóra", name: "Dóra", gender: "Female", engine: "standard" },
      { id: "Karl", name: "Karl", gender: "Male", engine: "standard" }
    ],
    defaultVoice: "Dóra"
  },
  {
    languageCode: "it-IT",
    languageName: "意大利语",
    provider: "aws",
    voices: [
      { id: "Carla", name: "Carla", gender: "Female", engine: "standard" },
      { id: "Giorgio", name: "Giorgio", gender: "Male", engine: "standard" }
    ],
    defaultVoice: "Carla"
  },
  {
    languageCode: "ja-JP",
    languageName: "日语",
    provider: "aws",
    voices: [
      { id: "Mizuki", name: "みずき", gender: "Female", engine: "standard" },
      { id: "Takumi", name: "たくみ", gender: "Male", engine: "standard" }
    ],
    defaultVoice: "Mizuki"
  },
  {
    languageCode: "ko-KR",
    languageName: "韩语",
    provider: "aws",
    voices: [
      { id: "Seoyeon", name: "서연", gender: "Female", engine: "standard" }
    ],
    defaultVoice: "Seoyeon"
  },
  {
    languageCode: "pl-PL",
    languageName: "波兰语",
    provider: "aws",
    voices: [
      { id: "Ewa", name: "Ewa", gender: "Female", engine: "standard" },
      { id: "Maja", name: "Maja", gender: "Female", engine: "standard" },
      { id: "Jacek", name: "Jacek", gender: "Male", engine: "standard" },
      { id: "Jan", name: "Jan", gender: "Male", engine: "standard" }
    ],
    defaultVoice: "Ewa"
  },
  {
    languageCode: "pt-BR",
    languageName: "葡萄牙语（巴西）",
    provider: "aws",
    voices: [
      { id: "Vitória", name: "Vitória", gender: "Female", engine: "standard" },
      { id: "Ricardo", name: "Ricardo", gender: "Male", engine: "standard" }
    ],
    defaultVoice: "Vitória"
  },
  {
    languageCode: "pt-PT",
    languageName: "葡萄牙语（葡萄牙）",
    provider: "aws",
    voices: [
      { id: "Inês", name: "Inês", gender: "Female", engine: "standard" },
      { id: "Cristiano", name: "Cristiano", gender: "Male", engine: "standard" }
    ],
    defaultVoice: "Inês"
  },
  {
    languageCode: "ro-RO",
    languageName: "罗马尼亚语",
    provider: "aws",
    voices: [
      { id: "Carmen", name: "Carmen", gender: "Female", engine: "standard" }
    ],
    defaultVoice: "Carmen"
  },
  {
    languageCode: "ru-RU",
    languageName: "俄语",
    provider: "aws",
    voices: [
      { id: "Tatyana", name: "Татьяна", gender: "Female", engine: "standard" },
      { id: "Maxim", name: "Максим", gender: "Male", engine: "standard" }
    ],
    defaultVoice: "Tatyana"
  },
  {
    languageCode: "es-ES",
    languageName: "西班牙语（西班牙）",
    provider: "aws",
    voices: [
      { id: "Conchita", name: "Conchita", gender: "Female", engine: "standard" },
      { id: "Enrique", name: "Enrique", gender: "Male", engine: "standard" }
    ],
    defaultVoice: "Conchita"
  },
  {
    languageCode: "es-MX",
    languageName: "西班牙语（墨西哥）",
    provider: "aws",
    voices: [
      { id: "Mia", name: "Mia", gender: "Female", engine: "standard" },
      { id: "Andrés", name: "Andrés", gender: "Male", engine: "standard" }
    ],
    defaultVoice: "Mia"
  },
  {
    languageCode: "es-US",
    languageName: "西班牙语（美国）",
    provider: "aws",
    voices: [
      { id: "Penélope", name: "Penélope", gender: "Female", engine: "standard" },
      { id: "Miguel", name: "Miguel", gender: "Male", engine: "standard" }
    ],
    defaultVoice: "Penélope"
  },
  {
    languageCode: "sv-SE",
    languageName: "瑞典语",
    provider: "aws",
    voices: [
      { id: "Astrid", name: "Astrid", gender: "Female", engine: "standard" }
    ],
    defaultVoice: "Astrid"
  },
  {
    languageCode: "tr-TR",
    languageName: "土耳其语",
    provider: "aws",
    voices: [
      { id: "Filiz", name: "Filiz", gender: "Female", engine: "standard" }
    ],
    defaultVoice: "Filiz"
  },
  {
    languageCode: "cy-GB",
    languageName: "威尔士语",
    provider: "aws",
    voices: [
      { id: "Gwyneth", name: "Gwyneth", gender: "Female", engine: "standard" }
    ],
    defaultVoice: "Gwyneth"
  }
];

export const MINIMAX_VOICES: LanguageVoices[] = [
  {
    languageCode: "zh-CN",
    languageName: "中文（普通话）",
    provider: "minimax",
    voices: [
      { id: "male-qn-qingse", gender: "Male", provider: "minimax", name: "清澈男声" },
      { id: "male-qn-jingying", gender: "Male", provider: "minimax", name: "精英男声" },
      { id: "male-qn-badao", gender: "Male", provider: "minimax", name: "霸道男声" },
      { id: "male-qn-daxuesheng", gender: "Male", provider: "minimax", name: "大学生男声" },
      { id: "female-shaonv", gender: "Female", provider: "minimax", name: "少女音" },
      { id: "female-yujie", gender: "Female", provider: "minimax", name: "御姐音" },
      { id: "female-chengshu", gender: "Female", provider: "minimax", name: "成熟女声" },
      { id: "female-tianmei", gender: "Female", provider: "minimax", name: "甜美女声" },
      { id: "presenter_male", gender: "Male", provider: "minimax", name: "主持人男声" },
      { id: "presenter_female", gender: "Female", provider: "minimax", name: "主持人女声" },
      { id: "audiobook_male_1", gender: "Male", provider: "minimax", name: "有声书男声1" },
      { id: "audiobook_male_2", gender: "Male", provider: "minimax", name: "有声书男声2" },
      { id: "audiobook_female_1", gender: "Female", provider: "minimax", name: "有声书女声1" },
      { id: "audiobook_female_2", gender: "Female", provider: "minimax", name: "有声书女声2" },
      { id: "male-qn-qingse-jingpin", gender: "Male", provider: "minimax", name: "清澈男声(精品)" },
      { id: "male-qn-jingying-jingpin", gender: "Male", provider: "minimax", name: "精英男声(精品)" },
      { id: "male-qn-badao-jingpin", gender: "Male", provider: "minimax", name: "霸道男声(精品)" },
      { id: "male-qn-daxuesheng-jingpin", gender: "Male", provider: "minimax", name: "大学生男声(精品)" },
      { id: "female-shaonv-jingpin", gender: "Female", provider: "minimax", name: "少女音(精品)" },
      { id: "female-yujie-jingpin", gender: "Female", provider: "minimax", name: "御姐音(精品)" },
      { id: "female-chengshu-jingpin", gender: "Female", provider: "minimax", name: "成熟女声(精品)" },
      { id: "female-tianmei-jingpin", gender: "Female", provider: "minimax", name: "甜美女声(精品)" },
      { id: "clever_boy", gender: "Male", provider: "minimax", name: "机灵男孩" },
      { id: "cute_boy", gender: "Male", provider: "minimax", name: "可爱男孩" },
      { id: "lovely_girl", gender: "Female", provider: "minimax", name: "可爱女孩" },
      { id: "cartoon_pig", gender: "Female", provider: "minimax", name: "卡通小猪" },
      { id: "bingjiao_didi", gender: "Male", provider: "minimax", name: "冰骄弟弟" },
      { id: "junlang_nanyou", gender: "Male", provider: "minimax", name: "俊朗男友" },
      { id: "chunzhen_xuedi", gender: "Male", provider: "minimax", name: "纯真学弟" },
      { id: "lengdan_xiongzhang", gender: "Male", provider: "minimax", name: "冷淡兄长" },
      { id: "badao_shaoye", gender: "Male", provider: "minimax", name: "霸道少爷" },
      { id: "tianxin_xiaoling", gender: "Female", provider: "minimax", name: "甜心校领" },
      { id: "qiaopi_mengmei", gender: "Female", provider: "minimax", name: "俏皮萌妹" },
      { id: "wumei_yujie", gender: "Female", provider: "minimax", name: "妩媚御姐" },
      { id: "diadia_xuemei", gender: "Female", provider: "minimax", name: "嗲嗲学妹" },
      { id: "danya_xuejie", gender: "Female", provider: "minimax", name: "淡雅学姐" }
    ],
    defaultVoice: "male-qn-qingse"
  },
  {
    languageCode: "en-US",
    languageName: "英语",
    provider: "minimax",
    voices: [
      { id: "Santa_Claus", name: "Santa Claus", gender: "Male", provider: "minimax" },
      { id: "Grinch", name: "Grinch", gender: "Male", provider: "minimax" },
      { id: "Rudolph", name: "Rudolph", gender: "Male", provider: "minimax" },
      { id: "Arnold", name: "Arnold", gender: "Male", provider: "minimax" },
      { id: "Charming_Santa", name: "Charming Santa", gender: "Male", provider: "minimax" },
      { id: "Charming_Lady", name: "Charming Lady", gender: "Female", provider: "minimax" },
      { id: "Sweet_Girl", name: "Sweet Girl", gender: "Female", provider: "minimax" },
      { id: "Cute_Elf", name: "Cute Elf", gender: "Female", provider: "minimax" },
      { id: "Attractive_Girl", name: "Attractive Girl", gender: "Female", provider: "minimax" },
      { id: "Serene_Woman", name: "Serene Woman", gender: "Female", provider: "minimax" }
    ],
    defaultVoice: "Sweet_Girl"
  }
];

// OpenAI TTS 语音配置
export const OPENAI_VOICES: LanguageVoices[] = [
  {
    languageCode: "en-US",
    languageName: "英语",
    provider: "openai",
    voices: [
      { id: "alloy", gender: "Female", provider: "openai", name: "Alloy" },
      { id: "ash", gender: "Male", provider: "openai", name: "Ash" },
      { id: "ballad", gender: "Female", provider: "openai", name: "Ballad" },
      { id: "coral", gender: "Female", provider: "openai", name: "Coral" },
      { id: "echo", gender: "Male", provider: "openai", name: "Echo" },
      { id: "fable", gender: "Female", provider: "openai", name: "Fable" },
      { id: "onyx", gender: "Male", provider: "openai", name: "Onyx" },
      { id: "nova", gender: "Female", provider: "openai", name: "Nova" },
      { id: "sage", gender: "Male", provider: "openai", name: "Sage" },
      { id: "shimmer", gender: "Female", provider: "openai", name: "Shimmer" }
    ],
    defaultVoice: "nova"
  },
  // 添加其他支持的语言，但不提供音色选择
  { languageCode: "af-ZA", languageName: "南非荷兰语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "ar-AE", languageName: "阿拉伯语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "hy-AM", languageName: "亚美尼亚语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "az-AZ", languageName: "阿塞拜疆语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "be-BY", languageName: "白俄罗斯语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "bs-BA", languageName: "波斯尼亚语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "bg-BG", languageName: "保加利亚语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "ca-ES", languageName: "加泰罗尼亚语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "zh-CN", languageName: "中文（普通话）", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "hr-HR", languageName: "克罗地亚语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "cs-CZ", languageName: "捷克语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "da-DK", languageName: "丹麦语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "nl-NL", languageName: "荷兰语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "et-EE", languageName: "爱沙尼亚语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "fi-FI", languageName: "芬兰语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "fr-FR", languageName: "法语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "gl-ES", languageName: "加利西亚语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "de-DE", languageName: "德语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "el-GR", languageName: "希腊语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "he-IL", languageName: "希伯来语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "hi-IN", languageName: "印地语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "hu-HU", languageName: "匈牙利语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "is-IS", languageName: "冰岛语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "id-ID", languageName: "印度尼西亚语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "it-IT", languageName: "意大利语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "ja-JP", languageName: "日语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "kn-IN", languageName: "卡纳达语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "kk-KZ", languageName: "哈萨克语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "ko-KR", languageName: "韩语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "lv-LV", languageName: "拉脱维亚语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "lt-LT", languageName: "立陶宛语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "mk-MK", languageName: "马其顿语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "ms-MY", languageName: "马来语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "mr-IN", languageName: "马拉地语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "mi-NZ", languageName: "毛利语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "ne-NP", languageName: "尼泊尔语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "nb-NO", languageName: "挪威语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "fa-IR", languageName: "波斯语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "pl-PL", languageName: "波兰语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "pt-PT", languageName: "葡萄牙语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "ro-RO", languageName: "罗马尼亚语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "ru-RU", languageName: "俄语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "sr-RS", languageName: "塞尔维亚语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "sk-SK", languageName: "斯洛伐克语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "sl-SI", languageName: "斯洛文尼亚语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "es-ES", languageName: "西班牙语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "sw-KE", languageName: "斯瓦希里语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "sv-SE", languageName: "瑞典语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "tl-PH", languageName: "他加禄语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "ta-IN", languageName: "泰米尔语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "th-TH", languageName: "泰语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "tr-TR", languageName: "土耳其语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "uk-UA", languageName: "乌克兰语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "ur-PK", languageName: "乌尔都语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "vi-VN", languageName: "越南语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" },
  { languageCode: "cy-GB", languageName: "威尔士语", provider: "openai", voices: [{ id: "alloy", gender: "Female", provider: "openai", name: "默认" }], defaultVoice: "alloy" }
];

export const AVAILABLE_VOICES = [...AWS_VOICES, ...MINIMAX_VOICES, ...OPENAI_VOICES];

// 根据语言代码和服务商获取可用的声音选项
export function getVoicesByLanguage(languageCode: string, provider: 'aws' | 'minimax' | 'openai' = 'aws'): VoiceOption[] {
  const voices = provider === 'aws' 
    ? AWS_VOICES 
    : provider === 'minimax' 
      ? MINIMAX_VOICES 
      : provider === 'openai'
        ? OPENAI_VOICES
        : [];
  const languageVoices = voices.find(v => v.languageCode === languageCode);
  return languageVoices?.voices || [];
}

// 根据服务提供商获取支持的语言列表
export function getSupportedLanguages(provider: 'aws' | 'minimax' | 'openai'): { code: string; name: string; provider: string }[] {
  switch (provider) {
    case 'aws':
      return AWS_VOICES.map(voice => ({
        code: voice.languageCode,
        name: voice.languageName,
        provider: voice.provider
      }));
    case 'minimax':
      return MINIMAX_VOICES.map(voice => ({
        code: voice.languageCode,
        name: voice.languageName,
        provider: voice.provider
      }));
    case 'openai':
      return OPENAI_VOICES.map(voice => ({
        code: voice.languageCode,
        name: voice.languageName,
        provider: voice.provider
      }));
    default:
      return [];
  }
}