'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function SignatureDrinkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how far into the container section the user has scrolled (0 to 1)
      const start = rect.top - windowHeight * 0.7;
      const end = rect.bottom - windowHeight * 0.3;
      const total = end - start;
      
      if (total <= 0) return;
      
      const current = window.scrollY - (rect.top + window.scrollY - windowHeight * 0.7);
      const progress = Math.min(Math.max(current / total, 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const render = () => {
      time += 0.03;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Glass boundaries
      const glassTop = height * 0.15;
      const glassBottom = height * 0.85;
      const glassLeft = width * 0.25;
      const glassRight = width * 0.75;
      const glassWidth = glassRight - glassLeft;
      const glassHeight = glassBottom - glassTop;

      // Draw Pouring Liquid Stream from top
      const pourProgress = Math.min(scrollProgress * 1.5, 1); // Stream pours fast
      const fillProgress = Math.max(0, Math.min((scrollProgress - 0.1) * 1.25, 1)); // Liquid rises

      if (pourProgress > 0 && fillProgress < 1) {
        // Pour stream line
        ctx.beginPath();
        const streamX = width * 0.52 + Math.sin(time * 3) * 3;
        ctx.moveTo(streamX, 0);
        ctx.lineTo(streamX + Math.sin(time * 2) * 5, glassBottom - fillProgress * glassHeight);
        
        const streamGradient = ctx.createLinearGradient(0, 0, 0, height);
        streamGradient.addColorStop(0, 'rgba(255, 140, 0, 0.9)');
        streamGradient.addColorStop(0.6, 'rgba(255, 91, 0, 0.85)');
        streamGradient.addColorStop(1, 'rgba(255, 200, 50, 0.95)');

        ctx.strokeStyle = streamGradient;
        ctx.lineWidth = 14 + Math.sin(time * 5) * 2;
        ctx.lineCap = 'round';
        ctx.shadowColor = '#ff5b00';
        ctx.shadowBlur = 15;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Draw Glass Back Glow
      const glassGlow = ctx.createRadialGradient(
        width / 2, height / 2, 20,
        width / 2, height / 2, width * 0.4
      );
      glassGlow.addColorStop(0, 'rgba(255, 91, 0, 0.2)');
      glassGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glassGlow;
      ctx.fillRect(0, 0, width, height);

      // Draw Liquid in Glass
      if (fillProgress > 0) {
        ctx.save();

        // Clip to glass inner shape
        ctx.beginPath();
        ctx.moveTo(glassLeft + 12, glassTop + 10);
        ctx.lineTo(glassRight - 12, glassTop + 10);
        ctx.lineTo(glassRight - 25, glassBottom - 15);
        ctx.quadraticCurveTo(width / 2, glassBottom + 5, glassLeft + 25, glassBottom - 15);
        ctx.closePath();
        ctx.clip();

        // Liquid height calculation
        const liquidTopY = glassBottom - fillProgress * (glassHeight - 30);

        // Liquid wave path
        ctx.beginPath();
        ctx.moveTo(glassLeft - 10, glassBottom + 20);
        ctx.lineTo(glassLeft - 10, liquidTopY);

        // Dynamic wave top
        const waveCount = 2;
        const waveHeight = 6 * (1 - fillProgress * 0.5);
        for (let x = glassLeft - 10; x <= glassRight + 10; x += 5) {
          const relativeX = (x - glassLeft) / glassWidth;
          const y = liquidTopY + Math.sin(time * 4 + relativeX * Math.PI * 4) * waveHeight;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(glassRight + 10, glassBottom + 20);
        ctx.closePath();

        // Rich Drink Gradient
        const liquidGrad = ctx.createLinearGradient(0, liquidTopY, 0, glassBottom);
        liquidGrad.addColorStop(0, '#ff9e00'); // Fresh citrus top
        liquidGrad.addColorStop(0.4, '#ff5b00'); // Vibrant orange mid
        liquidGrad.addColorStop(1, '#d02b00'); // Deep amber base

        ctx.fillStyle = liquidGrad;
        ctx.fill();

        // Liquid Bubbles / Ice Cubes floating
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        for (let i = 0; i < 12; i++) {
          const bubbleX = glassLeft + 30 + ((i * 37) % (glassWidth - 60));
          const bubbleSpeed = (i % 3) + 1;
          const bubbleY = glassBottom - ((time * 20 * bubbleSpeed + i * 40) % (fillProgress * (glassHeight - 40)));
          if (bubbleY > liquidTopY && bubbleY < glassBottom - 20) {
            ctx.beginPath();
            ctx.arc(bubbleX + Math.sin(time + i) * 4, bubbleY, 2.5 + (i % 3), 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Ice Cube 1 floating
        if (fillProgress > 0.4) {
          ctx.save();
          const iceY = Math.max(liquidTopY + 25, glassBottom - fillProgress * glassHeight + 40);
          ctx.translate(width * 0.42, iceY + Math.sin(time * 2) * 3);
          ctx.rotate(0.15 + Math.sin(time) * 0.05);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.roundRect(-22, -22, 44, 44, 8);
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        }

        // Ice Cube 2 floating
        if (fillProgress > 0.6) {
          ctx.save();
          const iceY2 = Math.max(liquidTopY + 45, glassBottom - fillProgress * glassHeight + 70);
          ctx.translate(width * 0.6, iceY2 + Math.cos(time * 2.2) * 4);
          ctx.rotate(-0.2 + Math.cos(time * 1.5) * 0.05);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.roundRect(-18, -18, 36, 36, 6);
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        }

        // Mint Leaves floating near surface
        if (fillProgress > 0.75) {
          ctx.save();
          ctx.translate(width * 0.48, liquidTopY + 8);
          ctx.rotate(Math.sin(time * 1.8) * 0.1);
          ctx.fillStyle = '#10b981'; // Fresh mint green
          ctx.beginPath();
          ctx.ellipse(0, 0, 18, 9, Math.PI / 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        ctx.restore(); // End clipping
      }

      // Draw Glass Body & Highlights
      ctx.save();

      // Glass Outline
      ctx.beginPath();
      ctx.moveTo(glassLeft + 10, glassTop);
      ctx.lineTo(glassRight - 10, glassTop);
      ctx.lineTo(glassRight - 22, glassBottom - 10);
      ctx.quadraticCurveTo(width / 2, glassBottom + 12, glassLeft + 22, glassBottom - 10);
      ctx.closePath();

      // Glass stroke & rim light
      const glassGradient = ctx.createLinearGradient(glassLeft, glassTop, glassRight, glassBottom);
      glassGradient.addColorStop(0, 'rgba(255, 255, 255, 0.75)');
      glassGradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.25)');
      glassGradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.15)');
      glassGradient.addColorStop(1, 'rgba(255, 255, 255, 0.6)');

      ctx.strokeStyle = glassGradient;
      ctx.lineWidth = 3.5;
      ctx.stroke();

      // Left Highlight Sheen
      ctx.beginPath();
      ctx.moveTo(glassLeft + 18, glassTop + 20);
      ctx.lineTo(glassLeft + 28, glassBottom - 25);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Right Subtle Highlight
      ctx.beginPath();
      ctx.moveTo(glassRight - 18, glassTop + 25);
      ctx.lineTo(glassRight - 26, glassBottom - 30);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Glass Rim Oval
      ctx.beginPath();
      ctx.ellipse(width / 2, glassTop, glassWidth / 2 - 10, 8, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [scrollProgress]);

  return (
    <div ref={containerRef} className="relative w-full aspect-square max-w-[520px] mx-auto flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        className="w-full h-full object-contain pointer-events-none filter drop-shadow-[0_20px_50px_rgba(255,91,0,0.35)]"
      />
      {/* Scroll indicator overlay badge */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-orange-500/30 bg-black/60 backdrop-blur-md px-4 py-1.5 text-[11px] font-bold text-orange-400 shadow-lg tracking-wider uppercase flex items-center gap-2 pointer-events-none">
        <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
        <span>Scroll Pouring: {Math.round(scrollProgress * 100)}%</span>
      </div>
    </div>
  );
}
