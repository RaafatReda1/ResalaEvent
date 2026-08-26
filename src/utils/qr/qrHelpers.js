/**
 * qrHelpers.js
 * ─────────────────────────────────────────────────────────────
 * Low-level canvas utilities and text-formatting helpers.
 * Used internally by qrPassCanvas.js and qrActions.js.
 * ─────────────────────────────────────────────────────────────
 */

// ─── Canvas Primitives ────────────────────────────────────────

/**
 * Loads an image from a URL and returns a Promise.
 * Resolves with null on error so callers can show a fallback.
 */
export const loadImage = (src) =>
  new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });

/**
 * Draws a rounded rectangle path on a Canvas 2D context.
 * Does NOT fill or stroke - the caller decides that.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @param {number | {tl,tr,br,bl}} radius - uniform or per-corner radius
 */
export function roundRect(ctx, x, y, width, height, radius) {
  if (typeof radius === "number") {
    radius = { tl: radius, tr: radius, br: radius, bl: radius };
  } else {
    radius = { tl: 0, tr: 0, br: 0, bl: 0, ...radius };
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
}

// ─── Text Formatters ──────────────────────────────────────────

/**
 * Prepends the appropriate doctor title to a student name.
 * - Arabic names  -> d. {name}
 * - English names -> Dr. {name}
 * - Already titled names are returned as-is.
 */
export const formatDoctorName = (name) => {
  if (!name || !name.trim()) return "د. مشارك";
  const clean = name.trim();
  if (/^(د\.?|دكتور|دكتورة|dr\.?|doctor)\s+/i.test(clean)) return clean;
  const isArabic = /[\u0600-\u06FF]/.test(clean);
  return isArabic ? `د. ${clean}` : `Dr. ${clean}`;
};

/**
 * Extracts a short, user-friendly display code from a student ID.
 * - UUIDs   -> first segment before "-"  (e.g. "A3F8C1D2")
 * - Long IDs -> first 8 chars uppercased
 * - Short IDs -> returned as-is
 */
export const formatDisplayId = (id) => {
  if (!id) return "PASS";
  const str = String(id).trim();
  if (str.includes("-")) return str.split("-")[0].toUpperCase();
  if (str.length > 8) return str.substring(0, 8).toUpperCase();
  return str;
};
