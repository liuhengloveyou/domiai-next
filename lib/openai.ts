import OpenAI from 'openai';

// 模型常量
export const TTS_MODEL = 'gpt-4o-mini-tts';

// 检查环境变量
const apiKey = process.env.OPENAI_API_KEY || '';

// 只有在实际调用API时才检查API密钥
export const openai = new OpenAI({
  apiKey,
  timeout: 60 * 1000, // 60秒超时
  maxRetries: 3, // 最多重试3次
});
