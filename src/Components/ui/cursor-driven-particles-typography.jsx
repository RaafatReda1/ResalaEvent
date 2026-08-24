"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

class Particle {
  constructor(x, y, size, color, dispersion, returnSpd) {
    this.x = x + (Math.random() - 0.5) * 8;
    this.y = y + (Math.random() - 0.5) * 8;
    this.originX = x;
    this.originY = y;
    this.vx = (Math.random() - 0.5) * 4;
    this.vy = (Math.random() - 0.5) * 4;
    this.size = size;
    this.color = color;
    this.dispersion = dispersion;
    this.returnSpd = returnSpd;
    this.damping = 0.88;
    this.glowAlpha = 0.9;
  }

  update(pointers, shockwaves, tiltX = 0, tiltY = 0, time = 0) {
    // 1. Interaction with all active pointers (mouse & multi-touch fingers)
    if (pointers && pointers.length > 0) {
      for (let i = 0; i < pointers.length; i++) {
        const p = pointers[i];
        if (p.x === -1000 || p.y === -1000) continue;

        const dx = p.x - this.x;
        const dy = p.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const radius = p.radius || 130;

        if (distance < radius && distance > 0) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (radius - distance) / radius;

          // Stronger non-linear repulsion for satisfying mobile touch
          const repulsion = Math.pow(force, 1.3) * this.dispersion * (p.strength || 1);

          this.vx -= forceDirectionX * repulsion;
          this.vy -= forceDirectionY * repulsion;
        }
      }
    }

    // 2. Shockwave explosion ripples (from taps/clicks)
    if (shockwaves && shockwaves.length > 0) {
      for (let i = 0; i < shockwaves.length; i++) {
        const sw = shockwaves[i];
        const dx = this.x - sw.x;
        const dy = this.y - sw.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const ringDist = Math.abs(dist - sw.radius);

        if (ringDist < 45 && dist > 0) {
          const force = (1 - ringDist / 45) * sw.strength * (1 - sw.radius / sw.maxRadius);
          this.vx += (dx / dist) * force * 18;
          this.vy += (dy / dist) * force * 18;
        }
      }
    }

    // 3. Device Tilt / Gyroscope subtle influence
    if (tiltX !== 0 || tiltY !== 0) {
      this.vx += tiltX * 0.4;
      this.vy += tiltY * 0.4;
    }

    // 4. Subtle ambient idle wave (keeps dots looking alive)
    if ((!pointers || pointers.length === 0 || pointers[0]?.x === -1000) && (!shockwaves || shockwaves.length === 0)) {
      const wave = Math.sin(time * 2 + this.originX * 0.03 + this.originY * 0.03) * 0.12;
      this.vx += wave * 0.25;
      this.vy += Math.cos(time * 1.5 + this.originX * 0.02) * 0.15;
    }

    // 5. Spring back to origin with smooth damping
    this.vx += (this.originX - this.x) * this.returnSpd;
    this.vy += (this.originY - this.y) * this.returnSpd;

    this.vx *= this.damping;
    this.vy *= this.damping;

    this.x += this.vx;
    this.y += this.vy;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function CursorDrivenParticleTypography({
  className,
  text,
  fontSize = 135,
  fontFamily = "Cairo, sans-serif",
  particleSize = 1.8,
  particleDensity = 4.5,
  dispersionStrength = 18,
  returnSpeed = 0.085,
  color,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let animationFrameId;
    let particles = [];
    let shockwaves = [];
    let pointers = []; // supports multiple touches

    let tiltX = 0;
    let tiltY = 0;
    let containerWidth = 0;
    let containerHeight = 0;
    let startTime = Date.now();

    const init = () => {
      if (!container) return;

      containerWidth = container.clientWidth || 300;
      containerHeight = container.clientHeight || 200;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = containerWidth * dpr;
      canvas.height = containerHeight * dpr;
      canvas.style.width = `${containerWidth}px`;
      canvas.style.height = `${containerHeight}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      const computedStyle = window.getComputedStyle(container);
      const textColor = color || computedStyle.color || "#3AB9AC";

      ctx.clearRect(0, 0, containerWidth, containerHeight);

      // Responsive font sizing for mobile vs desktop
      const maxTextWidth = containerWidth * 0.88;
      let effectiveFontSize = Math.min(fontSize, containerWidth * 0.22);
      
      ctx.font = `900 ${effectiveFontSize}px ${fontFamily}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Measure and scale down font if text overflows
      let measuredWidth = ctx.measureText(text).width;
      if (measuredWidth > maxTextWidth && measuredWidth > 0) {
        effectiveFontSize = Math.floor(effectiveFontSize * (maxTextWidth / measuredWidth));
        ctx.font = `900 ${effectiveFontSize}px ${fontFamily}`;
      }

      ctx.fillStyle = textColor;
      ctx.fillText(text, containerWidth / 2, containerHeight / 2);

      const textCoordinates = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );

      particles = [];
      const densityStep = Math.max(2, Math.floor(particleDensity * dpr));

      for (let y = 0; y < textCoordinates.height; y += densityStep) {
        for (let x = 0; x < textCoordinates.width; x += densityStep) {
          const index = (y * textCoordinates.width + x) * 4;
          const alpha = textCoordinates.data[index + 3] || 0;

          if (alpha > 110) {
            particles.push(
              new Particle(
                x / dpr,
                y / dpr,
                particleSize,
                textColor,
                dispersionStrength,
                returnSpeed
              )
            );
          }
        }
      }
    };

    const addShockwave = (x, y) => {
      shockwaves.push({
        x,
        y,
        radius: 5,
        maxRadius: Math.min(containerWidth, containerHeight) * 0.65,
        speed: 9,
        strength: 1.8,
      });
    };

    const animate = () => {
      const now = (Date.now() - startTime) * 0.001;
      ctx.clearRect(0, 0, containerWidth, containerHeight);

      // Update shockwaves
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.radius += sw.speed;
        if (sw.radius >= sw.maxRadius) {
          shockwaves.splice(i, 1);
        }
      }

      // Update & Draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.update(pointers, shockwaves, tiltX, tiltY, now);
        p.draw(ctx);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    // ── Mouse Events (Desktop) ──
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      pointers = [
        {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          radius: 120,
          strength: 1.2,
        },
      ];
    };

    const handleMouseLeave = () => {
      pointers = [];
    };

    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      addShockwave(x, y);
    };

    // ── Touch Events (Mobile Multi-Touch) ──
    const handleTouchStart = (e) => {
      const rect = canvas.getBoundingClientRect();
      const newPointers = [];

      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        newPointers.push({
          x,
          y,
          radius: 140, // larger finger radius for touch
          strength: 1.5,
        });

        // Trigger tap explosion shockwave on first touch
        if (i === 0) {
          addShockwave(x, y);
        }
      }

      pointers = newPointers;
    };

    const handleTouchMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const newPointers = [];

      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        newPointers.push({
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top,
          radius: 140,
          strength: 1.4,
        });
      }

      pointers = newPointers;
    };

    const handleTouchEnd = (e) => {
      if (e.touches.length === 0) {
        pointers = [];
      } else {
        const rect = canvas.getBoundingClientRect();
        pointers = Array.from(e.touches).map((t) => ({
          x: t.clientX - rect.left,
          y: t.clientY - rect.top,
          radius: 140,
          strength: 1.4,
        }));
      }
    };

    // ── Device Orientation (Phone Tilt / Gyroscope) ──
    const handleOrientation = (e) => {
      if (e.gamma !== null && e.beta !== null) {
        // gamma is left/right [-90, 90], beta is front/back [-180, 180]
        tiltX = Math.max(-1, Math.min(1, e.gamma / 30));
        tiltY = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
      }
    };

    const handleResize = () => {
      init();
    };

    const timeoutId = setTimeout(() => {
      init();
      animate();
    }, 50);

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Attach all desktop & mobile listeners
    canvas.addEventListener("mousemove", handleMouseMove, { passive: true });
    canvas.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    canvas.addEventListener("click", handleClick, { passive: true });

    canvas.addEventListener("touchstart", handleTouchStart, { passive: true });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true });
    canvas.addEventListener("touchend", handleTouchEnd, { passive: true });
    canvas.addEventListener("touchcancel", handleTouchEnd, { passive: true });

    if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleOrientation, { passive: true });
    }

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();

      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("click", handleClick);

      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
      canvas.removeEventListener("touchcancel", handleTouchEnd);

      if (window.DeviceOrientationEvent) {
        window.removeEventListener("deviceorientation", handleOrientation);
      }

      cancelAnimationFrame(animationFrameId);
    };
  }, [
    text,
    fontSize,
    fontFamily,
    particleSize,
    particleDensity,
    dispersionStrength,
    returnSpeed,
    color,
  ]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full h-full min-h-[220px] flex items-center justify-center relative select-none cursor-pointer",
        className
      )}
      style={{ touchAction: "none" }}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}


