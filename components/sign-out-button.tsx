'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';

export function SignOutButton() {
  const { t } = useLanguage();

  return (
    <Button
      variant="destructive"
      className="flex items-center"
      onClick={() => signOut({ callbackUrl: '/' })}
    >
      <LogOut className="w-4 h-4 mr-2" />
      {t('logout')}
    </Button>
  );
} 