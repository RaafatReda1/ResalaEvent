import QRCode from "qrcode";

/**
 * Loads an image from a URL and returns a Promise
 */
const loadImage = (src) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
};

/**
 * Helper to draw rounded rectangle on Canvas
 */
function roundRect(ctx, x, y, width, height, radius) {
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

/**
 * Formats student name with appropriate doctor title
 */
const formatDoctorName = (name) => {
  if (!name || !name.trim()) return "دكتور مشارك";
  const clean = name.trim();
  // Check if name already has Doctor prefix
  if (/^(د\.?|دكتور|دكتورة|dr\.?|doctor)\s+/i.test(clean)) {
    return clean;
  }
  const isArabic = /[\u0600-\u06FF]/.test(clean);
  return isArabic ? `د. ${clean}` : `Dr. ${clean}`;
};

/**
 * Extracts a user-friendly preview of the student ID
 */
const formatDisplayId = (id) => {
  if (!id) return "PASS";
  const str = String(id).trim();
  if (str.includes("-")) {
    return str.split("-")[0].toUpperCase();
  }
  if (str.length > 8) {
    return str.substring(0, 8).toUpperCase();
  }
  return str;
};

/**
 * Generates a branded, ultra-premium Event Access Pass Card Data URL for the student
 * @param {Object|number|string} studentOrId - Student object or primary ID
 * @returns {Promise<string>} Base64 PNG Data URL
 */
export const generateStudentQRDataURL = async (studentOrId) => {
  try {
    const student =
      typeof studentOrId === "object" && studentOrId !== null
        ? studentOrId
        : { id: studentOrId, name: "" };

    const studentId = String(student.id || "");
    const studentName = formatDoctorName(student.name);
    const displayId = formatDisplayId(student.id);
    const studentUniv = student.university ? String(student.university).trim() : "";
    const studentYear = student.academicYear ? String(student.academicYear).trim() : "";

    // 1. Generate base QR Code with full encoded studentId (Level H - 30% error correction)
    const qrCanvas = document.createElement("canvas");
    await QRCode.toCanvas(qrCanvas, studentId, {
      width: 260,
      margin: 1,
      errorCorrectionLevel: "H",
      color: {
        dark: "#042f2e", // Deep emerald branding
        light: "#ffffff",
      },
    });

    // 2. Setup the Main Branded Pass Canvas (600 x 840)
    const canvas = document.createElement("canvas");
    const width = 600;
    const height = 840;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    // 3. Draw Background Gradient
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, "#041f1c");
    bgGradient.addColorStop(0.45, "#0a2d28");
    bgGradient.addColorStop(1, "#06181c");
    ctx.fillStyle = bgGradient;
    roundRect(ctx, 0, 0, width, height, 24);
    ctx.fill();

    // 4. Decorative Glowing Background Highlights
    const glow = ctx.createRadialGradient(width / 2, 120, 10, width / 2, 120, 280);
    glow.addColorStop(0, "rgba(20, 184, 166, 0.3)");
    glow.addColorStop(1, "rgba(20, 184, 166, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, 320);

    // Decorative Outer Border
    ctx.strokeStyle = "rgba(45, 212, 191, 0.4)";
    ctx.lineWidth = 3;
    roundRect(ctx, 10, 10, width - 20, height - 20, 18);
    ctx.stroke();

    // Inner subtle gold/emerald thin border
    ctx.strokeStyle = "rgba(245, 158, 11, 0.25)";
    ctx.lineWidth = 1;
    roundRect(ctx, 16, 16, width - 32, height - 32, 14);
    ctx.stroke();

    // 5. Load & Draw Logos
    const mawaraaLogo = await loadImage("/mawaraanew.png");
    const activityLogo = await loadImage("/activitylogoNoFill.jpeg");

    // 1st Item: Header Badge — "اطباء الخير - رسالة - مدينة نصر"
    ctx.textAlign = "center";
    ctx.fillStyle = "#2dd4bf";
    ctx.font = "bold 16px 'Segoe UI', Tahoma, Arial, sans-serif";
    ctx.fillText("اطباء الخير - رسالة - مدينة نصر", width / 2, 48);

    // Draw Event Title Logo (ما وراء الطب)
    if (mawaraaLogo) {
      const logoW = 230;
      const logoH = 80;
      ctx.drawImage(mawaraaLogo, (width - logoW) / 2, 60, logoW, logoH);
    } else {
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 32px 'Segoe UI', Tahoma, Arial, sans-serif";
      ctx.fillText("ما وراء الطب", width / 2, 105);
    }

    ctx.fillStyle = "#99f6e4";
    ctx.font = "600 13.5px 'Segoe UI', Tahoma, Arial, sans-serif";
    ctx.fillText("بطاقة الدخول الرسمية للفعالية | Official Event Pass", width / 2, 154);

    // 6. Draw White QR Code Container Card with Soft Shadow
    const qrCardX = (width - 290) / 2;
    const qrCardY = 174;
    const qrCardSize = 290;

    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 6;
    ctx.fillStyle = "#ffffff";
    roundRect(ctx, qrCardX, qrCardY, qrCardSize, qrCardSize, 20);
    ctx.fill();
    ctx.restore();

    // Inner QR Card Border
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 2;
    roundRect(ctx, qrCardX, qrCardY, qrCardSize, qrCardSize, 20);
    ctx.stroke();

    // Draw QR onto Canvas
    ctx.drawImage(qrCanvas, qrCardX + 15, qrCardY + 15, 260, 260);

    // 7. Draw Activity Logo in Center of QR Code (2nd Item)
    const centerSize = 56;
    const centerX = qrCardX + (qrCardSize - centerSize) / 2;
    const centerY = qrCardY + (qrCardSize - centerSize) / 2;

    // White badge background for the logo
    ctx.fillStyle = "#ffffff";
    roundRect(ctx, centerX - 3, centerY - 3, centerSize + 6, centerSize + 6, 12);
    ctx.fill();
    ctx.strokeStyle = "#0d9488";
    ctx.lineWidth = 2;
    roundRect(ctx, centerX - 3, centerY - 3, centerSize + 6, centerSize + 6, 12);
    ctx.stroke();

    if (activityLogo) {
      ctx.save();
      roundRect(ctx, centerX, centerY, centerSize, centerSize, 10);
      ctx.clip();
      ctx.drawImage(activityLogo, centerX, centerY, centerSize, centerSize);
      ctx.restore();
    } else {
      ctx.fillStyle = "#0d9488";
      roundRect(ctx, centerX, centerY, centerSize, centerSize, 10);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 20px 'Segoe UI', Tahoma, Arial, sans-serif";
      ctx.fillText("⚕️", centerX + centerSize / 2, centerY + centerSize / 2 + 7);
    }

    // 8. Student Information Section (Doctor Title Included)
    const infoY = 490;
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 24px 'Segoe UI', Tahoma, Arial, sans-serif";
    ctx.fillText(studentName, width / 2, infoY);

    // University & Academic Year
    let subtitleDetails = [];
    if (studentUniv) subtitleDetails.push(studentUniv);
    if (studentYear) subtitleDetails.push(studentYear);

    if (subtitleDetails.length > 0) {
      ctx.fillStyle = "#94a3b8";
      ctx.font = "bold 15px 'Segoe UI', Tahoma, Arial, sans-serif";
      ctx.fillText(subtitleDetails.join(" • "), width / 2, infoY + 30);
    }

    // Student ID Pill Badge — two-line: label on top, big ID below
    const badgeW = 210;
    const badgeH = 56;
    const badgeX = (width - badgeW) / 2;
    const badgeY = infoY + 40;

    // Badge background
    const badgeGrad = ctx.createLinearGradient(badgeX, badgeY, badgeX + badgeW, badgeY + badgeH);
    badgeGrad.addColorStop(0, "#064e3b");
    badgeGrad.addColorStop(1, "#065f46");
    ctx.fillStyle = badgeGrad;
    roundRect(ctx, badgeX, badgeY, badgeW, badgeH, 20);
    ctx.fill();

    // Glowing border
    ctx.strokeStyle = "rgba(52, 211, 153, 0.5)";
    ctx.lineWidth = 1.5;
    roundRect(ctx, badgeX, badgeY, badgeW, badgeH, 20);
    ctx.stroke();

    // Label row — Arabic only, no mixed text
    ctx.fillStyle = "rgba(110, 231, 183, 0.85)";
    ctx.font = "12px 'Segoe UI', Tahoma, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.direction = "rtl";
    ctx.fillText("كود الحضور", width / 2, badgeY + 18);

    // ID value — LTR mono, clean and prominent
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px 'Courier New', 'Lucida Console', monospace";
    ctx.direction = "ltr";
    ctx.fillText(`# ${displayId}`, width / 2, badgeY + 41);
    ctx.direction = "ltr"; // reset

    // 9. Verification Notice Box
    const noticeY = 624;
    ctx.fillStyle = "#112f2c";
    roundRect(ctx, 40, noticeY, width - 80, 80, 14);
    ctx.fill();
    ctx.strokeStyle = "rgba(20, 184, 166, 0.25)";
    ctx.lineWidth = 1;
    roundRect(ctx, 40, noticeY, width - 80, 80, 14);
    ctx.stroke();

    ctx.fillStyle = "#5eead4";
    ctx.font = "bold 13.5px 'Segoe UI', Tahoma, Arial, sans-serif";
    ctx.fillText("يرجى إبراز هذا الرمز عند بوابة الدخول للتحقق السريع", width / 2, noticeY + 33);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "12.5px 'Segoe UI', Tahoma, Arial, sans-serif";
    ctx.fillText("هذا الرمز مشفر وخاص بالطالب فقط ولا يجوز استخدامه لأكثر من شخص", width / 2, noticeY + 57);

    // 10. Footer Section (4 Sep 2026 • اطباء الخير - رسالة - مدينة نصر)
    ctx.fillStyle = "#10b981";
    ctx.font = "bold 13.5px 'Segoe UI', Tahoma, Arial, sans-serif";
    ctx.fillText("● تذكرة معتمدة ومسجلة في قاعدة بيانات الفعالية", width / 2, 748);

    ctx.fillStyle = "#2dd4bf";
    ctx.font = "bold 12.5px 'Segoe UI', Tahoma, Arial, sans-serif";
    ctx.fillText("4 Sep 2026 • اطباء الخير - رسالة - مدينة نصر", width / 2, 778);

    ctx.fillStyle = "rgba(148, 163, 184, 0.55)";
    ctx.font = "11px 'Segoe UI', Tahoma, Arial, sans-serif";
    ctx.fillText("Mawaraa El-Teb Event Pass", width / 2, 800);

    return canvas.toDataURL("image/png");
  } catch (err) {
    console.error("Failed to generate branded QR code pass:", err);
    try {
      const studentId =
        typeof studentOrId === "object" && studentOrId !== null
          ? studentOrId.id
          : studentOrId;
      return await QRCode.toDataURL(String(studentId), {
        width: 350,
        margin: 2,
        color: { dark: "#062e2a", light: "#ffffff" },
      });
    } catch {
      return null;
    }
  }
};

/**
 * Downloads the QR Code to the user's device
 * @param {string} dataUrl - The base64 Data URL of the image
 * @param {string} filename - The name of the file to save
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
 * Copies the QR code image directly to the clipboard
 * @param {string} dataUrl - The base64 Data URL of the image
 * @returns {Promise<boolean>} True if successful, false otherwise
 */
export const copyQRCodeToClipboard = async (dataUrl) => {
  if (!dataUrl || !navigator.clipboard) return false;

  try {
    const response = await fetch(dataUrl);
    const blob = await response.blob();

    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob,
      }),
    ]);
    return true;
  } catch (err) {
    console.error("Failed to copy QR code to clipboard:", err);
    return false;
  }
};

/**
 * Helper to execute the full flow: Generate -> Download -> Copy
 * @param {Object|string|number} student
 * @param {string} filename
 */
export const processAndCopyStudentQR = async (student, filename) => {
  const studentObj =
    typeof student === "object" && student !== null
      ? student
      : { id: student, name: "" };

  const dataUrl = await generateStudentQRDataURL(studentObj);
  if (dataUrl) {
    const cleanName = studentObj.name
      ? String(studentObj.name).replace(/\s+/g, "_")
      : studentObj.id;
    const finalFilename = filename || `ticket_${cleanName}_${studentObj.id}.png`;

    downloadQRCode(dataUrl, finalFilename);
    await copyQRCodeToClipboard(dataUrl);
    return dataUrl;
  }
  return null;
};
