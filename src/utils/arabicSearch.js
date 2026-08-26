/**
 * Smart Arabic text normalization utility for flexible, typo-tolerant search
 * Matches "رافت" with "رأفت", "احمد" with "أحمد", "منى" with "مني", etc.
 */

export const normalizeArabic = (text) => {
  if (!text || typeof text !== "string") return "";

  return text
    .toLowerCase()
    // Remove Arabic tashkeel / diacritics
    .replace(/[\u064B-\u065F\u0670]/g, "")
    // Normalize Alef variations (أ, إ, آ, ٱ -> ا)
    .replace(/[أإآٱ]/g, "ا")
    // Normalize Taa Marbuta (ة -> ه)
    .replace(/ة/g, "ه")
    // Normalize Yaa / Alef Maksura (ى, ي, ئ -> ي)
    .replace(/[ىئ]/g, "ي")
    // Normalize Waw with Hamza (ؤ -> و)
    .replace(/ؤ/g, "و")
    // Remove repeated spaces
    .replace(/\s+/g, " ")
    .trim();
};

/**
 * Smart match function: checks if query matches any part of target string
 */
export const smartSearchMatch = (target, query) => {
  if (!query || !query.trim()) return true;
  if (!target) return false;

  const normTarget = normalizeArabic(String(target));
  const normQuery = normalizeArabic(String(query));

  // Direct substring match
  if (normTarget.includes(normQuery)) return true;

  // Split query into terms to support multi-word search (e.g. "احمد ازهر")
  const queryTerms = normQuery.split(" ").filter(Boolean);
  return queryTerms.every((term) => normTarget.includes(term));
};

/**
 * Phone number search helper (ignores leading 0, +20, spaces, dashes)
 */
export const smartPhoneMatch = (targetPhone, query) => {
  if (!query || !query.trim()) return true;
  if (!targetPhone) return false;

  const cleanTarget = String(targetPhone).replace(/[^\d]/g, "");
  const cleanQuery = String(query).replace(/[^\d]/g, "");

  if (!cleanQuery) return false;
  return cleanTarget.includes(cleanQuery);
};
