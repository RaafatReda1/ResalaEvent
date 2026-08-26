import QRCode from "qrcode";
import { formatDoctorName, formatDisplayId } from "./qrHelpers";
import { buildQrCanvas, createMainCanvas, drawBackground, drawBorders } from "./qrBackground";
import {
  drawHeader,
  drawQrCard,
  drawLogoOverlay,
  drawStudentInfo,
  drawVerificationBox,
  drawFooter,
} from "./qrPassSections";

/**
 * qrPassCanvas.js — Orchestrator
 * ─────────────────────────────────────────────────────────────────────
 * Assembles the full 600×840 branded Event Pass PNG in ten layers.
 * Each visual group lives in its own file — edit those to change design:
 *
 *   qrBackground.js   → sections 1–4  (canvas, gradient, glow, borders)
 *   qrPassSections.js → sections 5–10 (header, QR, logo, info, footer)
 *   qrHelpers.js      → shared canvas utils + text formatters
 * ─────────────────────────────────────────────────────────────────────
 *
 * ⚠️  The QR encodes `student.id` (primary key from the students table).
 *     Never swap this for user_id or any other field.
 *
 * @param {Object|string|number} studentOrId - Full student object or just the ID
 * @returns {Promise<string|null>} Base64 PNG data URL, or null on failure
 */
export const generateStudentQRDataURL = async (studentOrId) => {
  try {
    const student =
      typeof studentOrId === "object" && studentOrId !== null
        ? studentOrId
        : { id: studentOrId, name: "" };

    const studentId   = String(student.id || "");
    const studentName = formatDoctorName(student.name);
    const displayId   = formatDisplayId(student.id);
    const studentUniv = student.university   ? String(student.university).trim()   : "";
    const studentYear = student.academicYear ? String(student.academicYear).trim() : "";

    // ── Build canvas ──────────────────────────────────────────────────
    const qrCanvas          = await buildQrCanvas(studentId);
    const canvas            = createMainCanvas();
    const ctx               = canvas.getContext("2d");
    const { width, height } = canvas;

    // ── Layer by layer ────────────────────────────────────────────────
    drawBackground(ctx, width, height);
    drawBorders(ctx, width, height);
    await drawHeader(ctx, width);
    const { cardX, cardY, cardSize } = drawQrCard(ctx, qrCanvas, width);
    await drawLogoOverlay(ctx, cardX, cardY, cardSize);
    drawStudentInfo(ctx, width, studentName, studentUniv, studentYear, displayId);
    drawVerificationBox(ctx, width);
    drawFooter(ctx, width);

    return canvas.toDataURL("image/png");
  } catch (err) {
    console.error("Failed to generate branded QR code pass:", err);
    // Fallback: plain QR code without branding
    try {
      const id =
        typeof studentOrId === "object" && studentOrId !== null
          ? studentOrId.id
          : studentOrId;
      return await QRCode.toDataURL(String(id), {
        width: 350,
        margin: 2,
        color: { dark: "#062e2a", light: "#ffffff" },
      });
    } catch {
      return null;
    }
  }
};
