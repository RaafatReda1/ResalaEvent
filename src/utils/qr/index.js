/**
 * index.js — QR Module Barrel
 * -------------------------------------------------------------------
 * Re-exports everything from the three focused sub-files:
 *
 *   qrHelpers.js      → loadImage, roundRect, formatDoctorName, formatDisplayId
 *   qrPassCanvas.js   → generateStudentQRDataURL
 *   qrActions.js      → downloadQRCode, copyQRCodeToClipboard, processAndCopyStudentQR
 *
 * Usage (from anywhere in the app):
 *   import { generateStudentQRDataURL, processAndCopyStudentQR } from "@/utils/qr";
 * -------------------------------------------------------------------
 */

export { loadImage, roundRect, formatDoctorName, formatDisplayId } from "./qrHelpers";
export { generateStudentQRDataURL } from "./qrPassCanvas";
export { downloadQRCode, copyQRCodeToClipboard, processAndCopyStudentQR } from "./qrActions";
