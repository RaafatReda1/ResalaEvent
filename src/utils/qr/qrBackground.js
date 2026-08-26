import QRCode from "qrcode";
import { roundRect } from "./qrHelpers";

// ─── 1. Raw QR Matrix ─────────────────────────────────────────────────
// Generates an off-screen canvas with the encoded student ID.
// Level H = 30% damage tolerance, needed to survive the logo overlay.
export const buildQrCanvas = async (studentId) => {
  const qrCanvas = document.createElement("canvas");
  await QRCode.toCanvas(qrCanvas, studentId, {
    width: 260,
    margin: 1,
    errorCorrectionLevel: "H",
    color: { dark: "#042f2e", light: "#ffffff" },
  });
  return qrCanvas;
};

// ─── 2. Main Canvas (600 × 840) ───────────────────────────────────────
export const createMainCanvas = () => {
  const canvas = document.createElement("canvas");
  canvas.width  = 600;
  canvas.height = 840;
  return canvas;
};

// ─── 3. Background Gradient + Radial Glow ─────────────────────────────
export const drawBackground = (ctx, width, height) => {
  // Dark emerald diagonal gradient
  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0,    "#041f1c");
  bg.addColorStop(0.45, "#0a2d28");
  bg.addColorStop(1,    "#06181c");
  ctx.fillStyle = bg;
  roundRect(ctx, 0, 0, width, height, 24);
  ctx.fill();

  // Soft teal radial glow above the QR card area
  const glow = ctx.createRadialGradient(width / 2, 120, 10, width / 2, 120, 280);
  glow.addColorStop(0, "rgba(20, 184, 166, 0.3)");
  glow.addColorStop(1, "rgba(20, 184, 166, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, 320);
};

// ─── 4. Decorative Borders ────────────────────────────────────────────
// Outer teal border + inner subtle gold border for a premium layered look.
export const drawBorders = (ctx, width, height) => {
  ctx.strokeStyle = "rgba(45, 212, 191, 0.4)";
  ctx.lineWidth   = 3;
  roundRect(ctx, 10, 10, width - 20, height - 20, 18);
  ctx.stroke();

  ctx.strokeStyle = "rgba(245, 158, 11, 0.25)";
  ctx.lineWidth   = 1;
  roundRect(ctx, 16, 16, width - 32, height - 32, 14);
  ctx.stroke();
};
