'use client';

import { useEffect, useRef } from 'react';
// import { Pause, Play } from "lucide-react";

interface AudioVisualizerProps {
  audioContext: AudioContext;
  audioSource: AudioBufferSourceNode;
  onPause: () => void;
  onResume: () => void;
  isPlaying: boolean;
}

export function AudioVisualizer({ audioContext, audioSource }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = 0.8;
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;
      
      requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, width, height);
      
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.1)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.05)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      const barWidth = (width / bufferLength) * 1.5;
      const gap = 2;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * height * 0.8;
        
        const barGradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
        barGradient.addColorStop(0, 'rgba(66, 135, 245, 0.8)');
        barGradient.addColorStop(0.5, 'rgba(134, 89, 237, 0.8)');
        barGradient.addColorStop(1, 'rgba(245, 66, 141, 0.8)');
        ctx.fillStyle = barGradient;
        
        const cornerRadius = 4;
        ctx.beginPath();
        ctx.moveTo(x + cornerRadius, height);
        ctx.lineTo(x + barWidth - cornerRadius, height);
        ctx.quadraticCurveTo(x + barWidth, height, x + barWidth, height - cornerRadius);
        ctx.lineTo(x + barWidth, height - barHeight + cornerRadius);
        ctx.quadraticCurveTo(x + barWidth, height - barHeight, x + barWidth - cornerRadius, height - barHeight);
        ctx.lineTo(x + cornerRadius, height - barHeight);
        ctx.quadraticCurveTo(x, height - barHeight, x, height - barHeight + cornerRadius);
        ctx.lineTo(x, height - cornerRadius);
        ctx.quadraticCurveTo(x, height, x + cornerRadius, height);
        ctx.closePath();
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);

        x += barWidth + gap;
      }
    };

    draw();

    return () => {
      analyser.disconnect();
    };
  }, [audioContext, audioSource]);

  return (
    <div className="space-y-2">
      <canvas 
        ref={canvasRef} 
        className="w-full h-24 rounded-lg bg-black/10 dark:bg-white/5"
        width={800}
        height={100}
      />
    </div>
  );
} 