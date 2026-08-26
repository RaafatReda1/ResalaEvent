/**
 * qrCodeManager.js
 * -------------------------------------------------------------------
 * ⚠️  This file is now a COMPATIBILITY SHIM.
 *
 * The QR system has been split into focused modules under /utils/qr/:
 *
 *   utils/qr/qrHelpers.js     - Canvas primitives & text formatters
 *   utils/qr/qrPassCanvas.js  - Branded pass canvas drawing (10 sections)
 *   utils/qr/qrActions.js     - download / clipboard / full-flow helpers
 *   utils/qr/index.js         - Barrel re-export for all of the above
 *
 * All existing imports from "qrCodeManager" still work transparently.
 * New code should import directly from "@/utils/qr" or the sub-files.
 * -------------------------------------------------------------------
 */

export {
  generateStudentQRDataURL,
  downloadQRCode,
  copyQRCodeToClipboard,
  processAndCopyStudentQR,
} from "./qr/index";
