"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

class Particle {
  constructor(x, y, size, dispersion, returnSpd) {
    this.x = x;
    this.y = y;
    this.originX = x;
    this.originY = y;
    this.vx = 0;
    this.vy = 0;
    this.size = size;
    this.dispersion = dispersion;
    this.returnSpd = returnSpd;
    this.damping = 0.86;
  }

  update(pointers, shockwaves, tiltX = 0, tiltY = 0) {
    let moved = false;

    // 1. Pointers interaction (Mouse & Touch)
    if (pointers && pointers.length > 0) {
      for (let i = 0; i < pointers.length; i++) {
        const p = pointers[i];
        if (p.x === -1000 || p.y === -1000) continue;

        const dx = p.x - this.x;
        const dy = p.y - this.y;
        const distSq = dx * dx + dy * dy;
        const radius = p.radius || 110;
        const radiusSq = radius * radius;

        if (distSq < radiusSq && distSq > 0) {
          const distance = Math.sqrt(distSq);
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (radius - distance) / radius;
          const repulsion = force * force * this.dispersion * (p.strength || 1);

          this.vx -= forceDirectionX * repulsion;
          this.vy -= forceDirectionY * repulsion;
          moved = true;
        }
      }
    }

    // 2. Shockwave explosion ripples
    if (shockwaves && shockwaves.length > 0) {
      for (let i = 0; i < shockwaves.length; i++) {
        const sw = shockwaves[i];
        const dx = this.x - sw.x;
        const dy = this.y - sw.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const ringDist = Math.abs(dist - sw.radius);

        if (ringDist < 40 && dist > 0) {
          const force = (1 - ringDist / 40) * sw.strength * (1 - sw.radius / sw.maxRadius);
          this.vx += (dx / dist) * force * 14;
          this.vy += (dy / dist) * force * 14;
          moved = true;
        }
      }
    }

    // 3. Gyroscope tilt
    if (tiltX !== 0 || tiltY !== 0) {
      this.vx += tiltX * 0.3;
      this.vy += tiltY * 0.3;
    }

    // 4. Spring back to origin
    const dx = this.originX - this.x;
    const dy = this.originY - this.y;
    this.vx += dx * this.returnSpd;
    this.vy += dy * this.returnSpd;

    this.vx *= this.damping;
    this.vy *= this.damping;

    this.x += this.vx;
    this.y += this.vy;

    // Check if still moving
    if (Math.abs(this.vx) > 0.05 || Math.abs(this.vy) > 0.05 || Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
      moved = true;
    }

    return moved;
  }
}

export function CursorDrivenParticleTypography({
  className,
  text,
  fontSize = 135,
  fontFamily = "Cairo, sans-serif",
  particleSize = 2.4,
  particleDensity = 6.5,
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

    let animationFrameId = 0;
    let isVisible = false;
    let isPageVisible = !document.hidden;
    let isSleeping = false;
    let particles = [];
    let shockwaves = [];
    let pointers = [];

    let tiltX = 0;
    let tiltY = 0;
    let containerWidth = 0;
    let containerHeight = 0;
    let activeColor = "#3AB9AC";

    const init = () => {
      if (!container) return;

      containerWidth = container.clientWidth || 300;
      containerHeight = container.clientHeight || 200;

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = containerWidth * dpr;
      canvas.height = containerHeight * dpr;
      canvas.style.width = `${containerWidth}px`;
      canvas.style.height = `${containerHeight}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      const computedStyle = window.getComputedStyle(container);
      activeColor = color || computedStyle.color || "#3AB9AC";

      ctx.clearRect(0, 0, containerWidth, containerHeight);

      // Responsive font sizing for mobile vs desktop
      const maxTextWidth = containerWidth * 0.88;
      let effectiveFontSize = Math.min(fontSize, containerWidth * 0.22);

      ctx.font = `900 ${effectiveFontSize}px ${fontFamily}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      let measuredWidth = ctx.measureText(text).width;
      if (measuredWidth > maxTextWidth && measuredWidth > 0) {
        effectiveFontSize = Math.floor(effectiveFontSize * (maxTextWidth / measuredWidth));
        ctx.font = `900 ${effectiveFontSize}px ${fontFamily}`;
      }

      ctx.fillStyle = activeColor;
      ctx.fillText(text, containerWidth / 2, containerHeight / 2);

      const textCoordinates = ctx.getImageData(0, 0, canvas.width, canvas.height);

      particles = [];
      // Clean, well-spaced density step for crisp performance
      const densityStep = Math.max(5, Math.floor(particleDensity * dpr));

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
                dispersionStrength,
                returnSpeed
              )
            );
          }
        }
      }

      wakeUp();
    };

    const addShockwave = (x, y) => {
      shockwaves.push({
        x,
        y,
        radius: 5,
        maxRadius: Math.min(containerWidth, containerHeight) * 0.65,
        speed: 8,
        strength: 1.6,
      });
      wakeUp();
    };

    // ── Single-Batch High Performance Render Loop ──
    const animate = () => {
      if (!isVisible || !isPageVisible) {
        animationFrameId = 0;
        return;
      }

      ctx.clearRect(0, 0, containerWidth, containerHeight);

      // Update shockwaves
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.radius += sw.speed;
        if (sw.radius >= sw.maxRadius) {
          shockwaves.splice(i, 1);
        }
      }

      let anyParticleMoved = false;

      // Update particles physics
      for (let i = 0; i < particles.length; i++) {
        const moved = particles[i].update(pointers, shockwaves, tiltX, tiltY);
        if (moved) anyParticleMoved = true;
      }

      // ── BATCHED DRAW CALL (1 Draw Call instead of 1500 individual beginPath/fill calls) ──
      ctx.fillStyle = activeColor;
      ctx.beginPath();
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.moveTo(p.x + p.size, p.y);
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      }
      ctx.fill();

      // If nothing is moving and no pointers/shockwaves active, sleep to save 100% CPU
      if (!anyParticleMoved && pointers.length === 0 && shockwaves.length === 0) {
        isSleeping = true;
        animationFrameId = 0;
        return;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const wakeUp = () => {
      if (!isVisible || !isPageVisible) return;
      if (isSleeping || animationFrameId === 0) {
        isSleeping = false;
        if (animationFrameId === 0) {
          animationFrameId = requestAnimationFrame(animate);
        }
      }
    };

    const stopAnimation = () => {
      if (animationFrameId !== 0) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = 0;
      }
      isSleeping = true;
    };

    // ── Intersection Observer ──
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          wakeUp();
        } else {
          stopAnimation();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    const onVisibilityChange = () => {
      isPageVisible = !document.hidden;
      if (isPageVisible && isVisible) {
        wakeUp();
      } else {
        stopAnimation();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    // ── Event Handlers with WakeUp ──
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      pointers = [
        {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          radius: 110,
          strength: 1.2,
        },
      ];
      wakeUp();
    };

    const handleMouseLeave = () => {
      pointers = [];
    };

    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      addShockwave(e.clientX - rect.left, e.clientY - rect.top);
    };

    const handleTouchStart = (e) => {
      const rect = canvas.getBoundingClientRect();
      const newPointers = [];
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        newPointers.push({
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top,
          radius: 120,
          strength: 1.4,
        });
        if (i === 0) {
          addShockwave(touch.clientX - rect.left, touch.clientY - rect.top);
        }
      }
      pointers = newPointers;
      wakeUp();
    };

    const handleTouchMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const newPointers = [];
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        newPointers.push({
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top,
          radius: 120,
          strength: 1.4,
        });
      }
      pointers = newPointers;
      wakeUp();
    };

    const handleTouchEnd = (e) => {
      if (e.touches.length === 0) {
        pointers = [];
      } else {
        const rect = canvas.getBoundingClientRect();
        pointers = Array.from(e.touches).map((t) => ({
          x: t.clientX - rect.left,
          y: t.clientY - rect.top,
          radius: 120,
          strength: 1.4,
        }));
      }
    };

    const handleOrientation = (e) => {
      if (e.gamma !== null && e.beta !== null) {
        tiltX = Math.max(-1, Math.min(1, e.gamma / 30));
        tiltY = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
        wakeUp();
      }
    };

    const handleResize = () => {
      init();
    };

    const timeoutId = setTimeout(() => {
      init();
    }, 40);

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

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
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
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

      stopAnimation();
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
