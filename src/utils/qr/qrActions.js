/**
 * qrActions.js
 * -------------------------------------------------------------------
 * Public browser actions for the QR Event Pass system:
 *   - downloadQRCode         → saves the pass PNG to the device
 *   - copyQRCodeToClipboard  → copies pass PNG to OS clipboard
 *   - processAndCopyStudentQR → full flow: generate → download → copy
 *
 * Import these (and generateStudentQRDataURL) in your components.
 * -------------------------------------------------------------------
 */

import { generateStudentQRDataURL } from "./qrPassCanvas";

/**
 * Triggers a browser download of a PNG data URL.
 *
 * @param {string} dataUrl   - Base64 PNG data URL
 * @param {string} filename  - Desired filename (default: "event_pass.png")
 */
export const downloadQRCode = (dataUrl, filename = "event_pass.png") => {
  if (!dataUrl) return;
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Copies a PNG data URL directly to the OS image clipboard.
 * Falls back silently if the Clipboard API is unavailable.
 *
 * @param {string} dataUrl - Base64 PNG data URL
 * @returns {Promise<boolean>} true on success, false on failure
 */
export const copyQRCodeToClipboard = async (dataUrl) => {
  if (!dataUrl || !navigator.clipboard) return false;
  try {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
    return true;
  } catch (err) {
    console.error("Failed to copy QR code to clipboard:", err);
    return false;
  }
};

/**
 * Full QR pass flow: Generate → Download → Copy to Clipboard.
 * Designed to be called directly from WhatsApp and QR buttons.
 *
 * @param {Object|string|number} student  - Student object or ID
 * @param {string}               filename - Optional custom filename
 * @returns {Promise<string|null>} The generated data URL, or null on failure
 */
export const processAndCopyStudentQR = async (student, filename) => {
  const studentObj =
    typeof student === "object" && student !== null
      ? student
      : { id: student, name: "" };

  const dataUrl = await generateStudentQRDataURL(studentObj);
  if (!dataUrl) return null;

  const cleanName = studentObj.name
    ? String(studentObj.name).replace(/\s+/g, "_")
    : String(studentObj.id);

  const finalFilename = filename || `ticket_${cleanName}_${studentObj.id}.png`;

  downloadQRCode(dataUrl, finalFilename);
  await copyQRCodeToClipboard(dataUrl);
  return dataUrl;
};
