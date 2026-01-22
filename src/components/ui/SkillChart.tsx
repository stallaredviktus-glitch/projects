import { useEffect, useRef, useState } from 'react';
import styles from './SkillChart.module.css';

interface SkillChartProps {
  percent: number;
  size?: number;
  lineWidth?: number;
  animate?: boolean;
  duration?: number;
}

export function SkillChart({
  percent,
  size = 120,
  lineWidth = 6,
  animate = true,
  duration = 1400,
}: SkillChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentPercent, setCurrentPercent] = useState(0);
  const animationRef = useRef<number | undefined>(undefined);

  const drawCircle = (canvas: HTMLCanvasElement, value: number) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const radius = (size - lineWidth * 2) / 2;
    const centerX = size / 2;
    const centerY = size / 2;

    ctx.clearRect(0, 0, size, size);

    // Background circle
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();

    // Progress circle
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#7c3aed');
    gradient.addColorStop(1, '#22d3ee');

    ctx.strokeStyle = gradient;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.beginPath();
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + (value / 100) * 2 * Math.PI;
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.stroke();

    // Text
    ctx.fillStyle = '#7c3aed';
    ctx.font = `bold ${size / 5}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.round(value)}%`, centerX, centerY);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!animate) {
      drawCircle(canvas, percent);
      setCurrentPercent(percent);
      return;
    }

    const start = performance.now();
    const startPercent = currentPercent;

    const animateChart = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const value = startPercent + (percent - startPercent) * easeOut;

      drawCircle(canvas, value);
      setCurrentPercent(value);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animateChart);
      }
    };

    animationRef.current = requestAnimationFrame(animateChart);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [percent, animate, duration]);

  return (
    <canvas
      ref={canvasRef}
      className={styles.canvas}
      width={size}
      height={size}
      style={{ width: size, height: size }}
    />
  );
}
