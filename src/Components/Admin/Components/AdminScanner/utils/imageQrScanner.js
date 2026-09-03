import jsQR from "jsqr";

/**
 * Robust QR code decoder from an image File or Blob.
 * 1. Tries native browser BarcodeDetector API (fastest, hardware accelerated).
 * 2. Tries jsQR on full canvas image data.
 * 3. Tries jsQR on cropped center region (where branded pass QR card sits).
 * 4. Tries enhanced contrast binarization.
 *
 * @param {File|Blob} file - The uploaded image file
 * @returns {Promise<string|null>} The decoded QR string or null
 */
export const decodeQrFromImageFile = async (file) => {
  if (!file) return null;

  // 1. Try Native BarcodeDetector if available
  if (typeof window !== "undefined" && "BarcodeDetector" in window) {
    try {
      const barcodeDetector = new window.BarcodeDetector({
        formats: ["qr_code"],
      });
      const bitmap = await createImageBitmap(file);
      const barcodes = await barcodeDetector.detect(bitmap);
      if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
        return barcodes[0].rawValue.trim();
      }
    } catch (e) {
      console.warn("Native BarcodeDetector attempt failed, falling back to jsQR:", e);
    }
  }

  // 2. Load into HTMLImageElement
  const img = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = (err) => reject(err);
      image.src = reader.result;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  // Scale down excessively large images (e.g. 48MP phone photos) to max 1600px for speed & memory
  let { width, height } = img;
  const maxDim = 1600;
  if (width > maxDim || height > maxDim) {
    if (width > height) {
      height = Math.round((height * maxDim) / width);
      width = maxDim;
    } else {
      width = Math.round((width * maxDim) / height);
      height = maxDim;
    }
  }

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, 0, 0, width, height);

  // 2. Full Canvas scan with jsQR
  const fullImageData = ctx.getImageData(0, 0, width, height);
  let code = jsQR(fullImageData.data, width, height, {
    inversionAttempts: "attemptBoth",
  });
  if (code && code.data) {
    return code.data.trim();
  }

  // 3. Center Crop Scan (Targeting the event pass QR card)
  // On branded passes, the QR card typically sits horizontally center and upper-middle
  const cropX = Math.floor(width * 0.12);
  const cropY = Math.floor(height * 0.15);
  const cropW = Math.floor(width * 0.76);
  const cropH = Math.floor(height * 0.55);

  const croppedImageData = ctx.getImageData(cropX, cropY, cropW, cropH);
  code = jsQR(croppedImageData.data, cropW, cropH, {
    inversionAttempts: "attemptBoth",
  });
  if (code && code.data) {
    return code.data.trim();
  }

  // 4. Center tighter crop (just in case of tall screenshot)
  const tightX = Math.floor(width * 0.2);
  const tightY = Math.floor(height * 0.2);
  const tightW = Math.floor(width * 0.6);
  const tightH = Math.floor(height * 0.45);

  const tightImageData = ctx.getImageData(tightX, tightY, tightW, tightH);
  code = jsQR(tightImageData.data, tightW, tightH, {
    inversionAttempts: "attemptBoth",
  });
  if (code && code.data) {
    return code.data.trim();
  }

  return null;
};
