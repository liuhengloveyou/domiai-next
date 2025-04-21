interface CacheOptions {
  text: string;
  language: string;
  voiceId: string;
  engine?: string;
  speed: number;
  service: string;
}

interface CacheEntry {
  data: ArrayBuffer;
  timestamp: number;
}

export class AudioCache {
  private static cache = new Map<string, CacheEntry>();
  private static readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24小时

  static getCacheKey(options: CacheOptions): string {
    return JSON.stringify(options);
  }

  static get(key: string): ArrayBuffer | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > this.CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  static set(key: string, data: ArrayBuffer): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
} 