interface RateLimitOptions {
  interval: number;  // 时间间隔（毫秒）
  getMaxRequests: (userId: string) => Promise<number>;  // 获取用户最大并发请求数的函数
}

interface UserQueue {
  currentRequests: number;
  queue: Array<() => void>;
}

export class RateLimiter {
  private userQueues = new Map<string, UserQueue>();
  private options: RateLimitOptions;

  constructor(options: RateLimitOptions) {
    this.options = options;
  }

  async acquire(userId: string): Promise<void> {
    let userQueue = this.userQueues.get(userId);
    if (!userQueue) {
      userQueue = { currentRequests: 0, queue: [] };
      this.userQueues.set(userId, userQueue);
    }

    const maxRequests = await this.options.getMaxRequests(userId);

    if (userQueue.currentRequests < maxRequests) {
      userQueue.currentRequests++;
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      userQueue!.queue.push(resolve);
    });
  }

  async release(userId: string): Promise<void> {
    const userQueue = this.userQueues.get(userId);
    if (!userQueue) return;

    userQueue.currentRequests = Math.max(0, userQueue.currentRequests - 1);
    
    const maxRequests = await this.options.getMaxRequests(userId);
    
    if (userQueue.queue.length > 0 && userQueue.currentRequests < maxRequests) {
      const next = userQueue.queue.shift();
      if (next) {
        userQueue.currentRequests++;
        next();
      }
    }

    // 如果用户没有正在进行的请求和等待的请求，清理用户队列
    if (userQueue.currentRequests === 0 && userQueue.queue.length === 0) {
      this.userQueues.delete(userId);
    }
  }
}

export function rateLimit(options: RateLimitOptions): RateLimiter {
  return new RateLimiter(options);
} 