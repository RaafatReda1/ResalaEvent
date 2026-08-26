import { loadImage, roundRect } from "./qrHelpers";

// ─── 5. Header ────────────────────────────────────────────────────────
// Draws the org name, event title logo (or text fallback), and subtitle.
export const drawHeader = async (ctx, width) => {
  ctx.textAlign = "center";
  ctx.fillStyle = "#2dd4bf";
  ctx.font = "bold 16px 'Segoe UI', Tahoma, Arial, sans-serif";
  ctx.fillText("اطباء الخير - رسالة - مدينة نصر", width / 2, 48);

  const mawaraaLogo = await loadImage("/mawaraanew.png");
  if (mawaraaLogo) {
    ctx.drawImage(mawaraaLogo, (width - 230) / 2, 60, 230, 80);
  } else {
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 32px 'Segoe UI', Tahoma, Arial, sans-serif";
    ctx.fillText("ما وراء الطب", width / 2, 105);
  }

  ctx.fillStyle = "#99f6e4";
  ctx.font = "600 13.5px 'Segoe UI', Tahoma, Arial, sans-serif";
  ctx.fillText("بطاقة الدخول الرسمية للفعالية | Official Event Pass", width / 2, 154);
};

// ─── 6. QR Card ───────────────────────────────────────────────────────
// White rounded card with drop shadow; the QR bitmap sits inside it.
// Returns the card geometry so the logo overlay can be centered on top.
export const drawQrCard = (ctx, qrCanvas, width) => {
  const cardX    = (width - 290) / 2;
  const cardY    = 174;
  const cardSize = 290;

  ctx.save();
  ctx.shadowColor   = "rgba(0, 0, 0, 0.45)";
  ctx.shadowBlur    = 18;
  ctx.shadowOffsetY = 6;
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, cardX, cardY, cardSize, cardSize, 20);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth   = 2;
  roundRect(ctx, cardX, cardY, cardSize, cardSize, 20);
  ctx.stroke();

  ctx.drawImage(qrCanvas, cardX + 15, cardY + 15, 260, 260);
  return { cardX, cardY, cardSize };
};

// ─── 7. Activity Logo (QR Center Overlay) ─────────────────────────────
// Clips the activity logo into a rounded square at the QR dead-center.
// The Level-H QR has 30% tolerance so it still scans correctly.
export const drawLogoOverlay = async (ctx, cardX, cardY, cardSize) => {
  const activityLogo = await loadImage("/activitylogoNoFill.jpeg");
  const size = 56;
  const cx   = cardX + (cardSize - size) / 2;
  const cy   = cardY + (cardSize - size) / 2;

  // White badge background + teal border
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, cx - 3, cy - 3, size + 6, size + 6, 12);
  ctx.fill();
  ctx.strokeStyle = "#0d9488";
  ctx.lineWidth   = 2;
  roundRect(ctx, cx - 3, cy - 3, size + 6, size + 6, 12);
  ctx.stroke();

  if (activityLogo) {
    ctx.save();
    roundRect(ctx, cx, cy, size, size, 10);
    ctx.clip();
    ctx.drawImage(activityLogo, cx, cy, size, size);
    ctx.restore();
  } else {
    ctx.fillStyle = "#0d9488";
    roundRect(ctx, cx, cy, size, size, 10);
    ctx.fill();
  }
};

// ─── 8. Student Info (name, university, ID badge) ─────────────────────
// The ID badge uses a two-line pill: Arabic label on top, mono code below.
// Arabic and LTR text are rendered in separate fillText calls to avoid
// RTL/LTR bidirectional mixing artefacts on Canvas.
export const drawStudentInfo = (ctx, width, studentName, studentUniv, studentYear, displayId) => {
  const infoY = 490;

  // Doctor-titled name
  ctx.fillStyle = "#ffffff";
  ctx.font      = "bold 24px 'Segoe UI', Tahoma, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(studentName, width / 2, infoY);

  // University & academic year
  const details = [studentUniv, studentYear].filter(Boolean);
  if (details.length > 0) {
    ctx.fillStyle = "#94a3b8";
    ctx.font      = "bold 15px 'Segoe UI', Tahoma, Arial, sans-serif";
    ctx.fillText(details.join(" • "), width / 2, infoY + 30);
  }

  // Two-line ID badge pill
  const badgeW = 210;
  const badgeH = 56;
  const badgeX = (width - badgeW) / 2;
  const badgeY = infoY + 40;

  const grad = ctx.createLinearGradient(badgeX, badgeY, badgeX + badgeW, badgeY + badgeH);
  grad.addColorStop(0, "#064e3b");
  grad.addColorStop(1, "#065f46");
  ctx.fillStyle = grad;
  roundRect(ctx, badgeX, badgeY, badgeW, badgeH, 20);
  ctx.fill();

  ctx.strokeStyle = "rgba(52, 211, 153, 0.5)";
  ctx.lineWidth   = 1.5;
  roundRect(ctx, badgeX, badgeY, badgeW, badgeH, 20);
  ctx.stroke();

  // Line 1 — Arabic label (RTL only)
  ctx.fillStyle = "rgba(110, 231, 183, 0.85)";
  ctx.font      = "12px 'Segoe UI', Tahoma, Arial, sans-serif";
  ctx.direction = "rtl";
  ctx.fillText("كود الحضور", width / 2, badgeY + 18);

  // Line 2 — ID code (LTR monospace only)
  ctx.fillStyle = "#ffffff";
  ctx.font      = "bold 20px 'Courier New', 'Lucida Console', monospace";
  ctx.direction = "ltr";
  ctx.fillText(`# ${displayId}`, width / 2, badgeY + 41);
  ctx.direction = "ltr"; // reset
};

// ─── 9. Verification Notice ───────────────────────────────────────────
export const drawVerificationBox = (ctx, width) => {
  const y = 624;

  ctx.fillStyle = "#112f2c";
  roundRect(ctx, 40, y, width - 80, 80, 14);
  ctx.fill();

  ctx.strokeStyle = "rgba(20, 184, 166, 0.25)";
  ctx.lineWidth   = 1;
  roundRect(ctx, 40, y, width - 80, 80, 14);
  ctx.stroke();

  ctx.fillStyle = "#5eead4";
  ctx.font = "bold 13.5px 'Segoe UI', Tahoma, Arial, sans-serif";
  ctx.fillText("يرجى إبراز هذا الرمز عند بوابة الدخول للتحقق السريع", width / 2, y + 33);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "12.5px 'Segoe UI', Tahoma, Arial, sans-serif";
  ctx.fillText("هذا الرمز مشفر وخاص بالطالب فقط ولا يجوز استخدامه لأكثر من شخص", width / 2, y + 57);
};

// ─── 10. Footer ───────────────────────────────────────────────────────
export const drawFooter = (ctx, width) => {
  ctx.fillStyle = "#10b981";
  ctx.font = "bold 13.5px 'Segoe UI', Tahoma, Arial, sans-serif";
  ctx.fillText("● تذكرة معتمدة ومسجلة في قاعدة بيانات الفعالية", width / 2, 748);

  ctx.fillStyle = "#2dd4bf";
  ctx.font = "bold 12.5px 'Segoe UI', Tahoma, Arial, sans-serif";
  ctx.fillText("4 Sep 2026 • اطباء الخير - رسالة - مدينة نصر", width / 2, 778);

  ctx.fillStyle = "rgba(148, 163, 184, 0.55)";
  ctx.font = "11px 'Segoe UI', Tahoma, Arial, sans-serif";
  ctx.fillText("Mawaraa El-Teb Event Pass", width / 2, 800);
};
