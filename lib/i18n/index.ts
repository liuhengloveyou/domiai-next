// import { useTranslations } from 'next-intl';

export function t(key: string, params?: Record<string, string>) {
  console.log(key);
  console.log(params);
  return key;
  // return useTranslations()(key, params);
} 