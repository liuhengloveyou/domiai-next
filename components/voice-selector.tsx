'use client';

// import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VoiceOption } from "@/lib/voice-config";
import { getVoicesByLanguage } from "@/lib/voice-config";
import { useLanguage } from "@/lib/i18n/language-context";
import { cn } from "@/lib/utils";

interface VoiceSelectorProps {
  languageCode: string;
  onVoiceSelect: (voice: VoiceOption | null) => void;
  selectedVoiceId?: string;
  provider: 'aws' | 'minimax' | 'openai';
  clonedVoices?: VoiceOption[];
}

export function VoiceSelector({
  languageCode,
  onVoiceSelect,
  selectedVoiceId,
  provider,
  clonedVoices = []
}: VoiceSelectorProps) {
  const { t } = useLanguage();

  if (clonedVoices.length === 0 && getVoicesByLanguage(languageCode, provider).length === 0) {
    return (
      <Card className="w-full text-center bg-muted/50">
        <CardContent className="flex items-center justify-center py-2">
          <p className="text-muted-foreground text-sm">
            {t('noAvailableVoice')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* 克隆声音部分 */}
      {clonedVoices.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">{t('clonedVoices')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {clonedVoices.map((voice) => (
              <Card
                key={voice.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  selectedVoiceId === voice.id
                    ? "border-primary bg-primary/5"
                    : "hover:border-primary/50"
                )}
                onClick={() => onVoiceSelect(voice)}
              >
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div>
                      <p className="font-medium">{voice.name}</p>
                      <Badge className="text-xs mt-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white border-0">{t('clonedVoice')}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 系统声音部分 */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">{t('systemVoices')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {getVoicesByLanguage(languageCode, provider).map((voice) => (
            <Card
              key={voice.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                selectedVoiceId === voice.id
                  ? "border-primary bg-primary/5"
                  : "hover:border-primary/50"
              )}
              onClick={() => onVoiceSelect(voice)}
            >
              <CardContent className="p-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div>
                    <p className="font-medium">{voice.name}</p>
                    <div className="flex gap-1 mt-1">
                      <Badge variant="outline" className="text-xs">{t('systemVoice')}</Badge>
                      <Badge variant="outline" className="text-xs">{voice.gender === 'Male' ? t('male') : t('female')}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// const MINIMAX_VOICES: VoiceOption[] = [
//   // ... 你的系统声音列表
// ];