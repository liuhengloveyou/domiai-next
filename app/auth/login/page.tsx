'use client';

import { useEffect } from 'react';
// import { AuthDialog } from '@/components/auth-dialog';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // 自动打开登录对话框
    const loginTrigger = document.querySelector('[data-login-trigger="true"]');
    if (loginTrigger) {
      (loginTrigger as HTMLButtonElement).click();
    }
    // 返回上一页
    router.back();
  }, [router]);

  return null;
} 