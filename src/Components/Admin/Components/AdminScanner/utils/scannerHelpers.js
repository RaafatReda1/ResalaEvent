/**
 * Robust extractor for student ID from scanned QR raw content.
 * Accepts:
 * - Direct UUID string (e.g. "9a12bc34-5678-90ab-cdef-1234567890ab")
 * - JSON string containing id (e.g. {"id":"..."})
 * - Branded pass URL containing studentId or id query/path
 */
export const extractStudentIdFromScan = (rawText) => {
  if (!rawText) return null;
  const str = String(rawText).trim();

  // 1. UUID regex test
  const uuidRegex =
    /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i;
  const uuidMatch = str.match(uuidRegex);
  if (uuidMatch) {
    return uuidMatch[0];
  }

  // 2. Check JSON
  try {
    const parsed = JSON.parse(str);
    if (parsed && typeof parsed === "object") {
      if (parsed.id) return String(parsed.id).trim();
      if (parsed.studentId) return String(parsed.studentId).trim();
    }
  } catch {
    // Not valid JSON
  }

  // 3. Check URL query params
  try {
    const url = new URL(str);
    const id =
      url.searchParams.get("id") ||
      url.searchParams.get("studentId") ||
      url.searchParams.get("s");
    if (id) return id.trim();
  } catch {
    // Not a full URL
  }

  // 4. Return trimmed raw text
  return str;
};

/**
 * Format timestamp into friendly Arabic date and time string
 */
export const formatArabicDateTime = (dateStr) => {
  if (!dateStr) return "غير محدد";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "غير صالح";

    const formattedDate = date.toLocaleDateString("ar-EG", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const formattedTime = date.toLocaleTimeString("ar-EG", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return `${formattedDate} • ${formattedTime}`;
  } catch {
    return String(dateStr);
  }
};

/**
 * Relative time in Arabic (e.g. "منذ 5 دقائق")
 */
export const getRelativeArabicTime = (dateStr) => {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);

    if (diffSec < 45) return "الآن";
    if (diffSec < 3600) return `منذ ${Math.floor(diffSec / 60)} دقيقة`;
    if (diffSec < 86400) return `منذ ${Math.floor(diffSec / 3600)} ساعة`;
    return `منذ ${Math.floor(diffSec / 86400)} يوم`;
  } catch {
    return "";
  }
};
