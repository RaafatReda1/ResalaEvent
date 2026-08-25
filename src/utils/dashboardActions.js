import supabase from "./supabaseClient";

// ─────────────────────────────────────────────────────
// Smart University & Data Normalization Helpers
// ─────────────────────────────────────────────────────

/**
 * Smart normalize university / faculty names into clean, unified university names.
 * Maps variations like "Al Azhar", "طب الازهر", "بنات الأزهر", "القصر العيني", "عين شمس"
 * to standard unified titles: "جامعة الأزهر", "جامعة القاهرة", "جامعة عين شمس", etc.
 */
export function normalizeUniversityName(rawName) {
  if (!rawName || typeof rawName !== "string") return "غير محدد";

  const clean = rawName
    .trim()
    .toLowerCase()
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/[^a-zA-Z0-9\u0621-\u064A\s]/g, " ")
    .replace(/\s+/g, " ");

  if (!clean || clean.length < 2) return "غير محدد";

  // Check common universities & medical schools
  if (clean.includes("ازهر") || clean.includes("azhar")) return "جامعة الأزهر";
  if (
    clean.includes("قاهر") ||
    clean.includes("cairo") ||
    clean.includes("قصر العيني") ||
    clean.includes("kasr")
  ) {
    return "جامعة القاهرة";
  }
  if (
    clean.includes("عين شمس") ||
    clean.includes("ain shams") ||
    clean.includes("دمرداش")
  ) {
    return "جامعة عين شمس";
  }
  if (clean.includes("حلوان") || clean.includes("helwan")) return "جامعة حلوان";
  if (clean.includes("اسكندري") || clean.includes("alex")) return "جامعة الإسكندرية";
  if (clean.includes("منصور") || clean.includes("mansour")) return "جامعة المنصورة";
  if (clean.includes("زقازيق") || clean.includes("zagazig")) return "جامعة الزقازيق";
  if (clean.includes("طنطا") || clean.includes("tanta")) return "جامعة طنطا";
  if (
    clean.includes("بنها") ||
    clean.includes("banha") ||
    clean.includes("benha")
  ) {
    return "جامعة بنها";
  }
  if (
    clean.includes("منوفي") ||
    clean.includes("menof") ||
    clean.includes("monuf")
  ) {
    return "جامعة المنوفية";
  }
  if (clean.includes("كفر الشيخ") || clean.includes("kafr")) return "جامعة كفر الشيخ";
  if (
    clean.includes("اسيوط") ||
    clean.includes("assiut") ||
    clean.includes("asyut")
  ) {
    return "جامعة أسيوط";
  }
  if (clean.includes("سوهاج") || clean.includes("sohag")) return "جامعة سوهاج";
  if (
    clean.includes("جنوب الوادي") ||
    clean.includes("قنا") ||
    clean.includes("south valley")
  ) {
    return "جامعة جنوب الوادي";
  }
  if (clean.includes("بني سويف") || clean.includes("beni suef")) return "جامعة بني سويف";
  if (clean.includes("فيوم") || clean.includes("fayoum")) return "جامعة الفيوم";
  if (clean.includes("سويس") || clean.includes("suez")) return "جامعة قناة السويس";
  if (clean.includes("بورسعيد") || clean.includes("port said")) return "جامعة بورسعيد";
  if (clean.includes("بريطاني") || clean.includes("bue")) return "الجامعة البريطانية (BUE)";
  if (clean.includes("الماني") || clean.includes("guc")) return "الجامعة الألمانية (GUC)";
  if (clean.includes("مصر للعلوم") || clean.includes("must")) return "جامعة مصر (MUST)";
  if (
    clean.includes("6 اكتوبر") ||
    clean.includes("ستة اكتوبر") ||
    clean.includes("o6u")
  ) {
    return "جامعة 6 أكتوبر (O6U)";
  }
  if (clean.includes("مستقبل") || clean.includes("fue")) return "جامعة المستقبل (FUE)";
  if (clean.includes("نهض") || clean.includes("nub")) return "جامعة النهضة (NUB)";
  if (clean.includes("دلتا") || clean.includes("delta")) return "جامعة الدلتا";
  if (clean.includes("حورس") || clean.includes("horus")) return "جامعة حورس";
  if (clean.includes("بدر") || clean.includes("buc")) return "جامعة بدر (BUC)";
  if (clean.includes("جيزه الجديده") || clean.includes("ngu")) return "جامعة الجيزة الجديدة (NGU)";
  if (clean.includes("ميريت") || clean.includes("merit")) return "جامعة ميريت";
  if (clean.includes("روسي") || clean.includes("eru")) return "الجامعة الروسية (ERU)";
  if (clean.includes("حرب") || clean.includes("عسكري")) return "الأكاديمية الطبية العسكرية";

  // Check if it's a known generic university
  if (clean.includes("جامع") || clean.includes("كلي") || clean.includes("طب")) {
    return rawName.trim();
  }

  return "جامعات أخرى";
}

/** Group an array of objects by a string field, count occurrences */
function groupByField(rows, field, nullLabel = "غير محدد", limit = null, isUniversity = false) {
  const counts = {};
  rows.forEach((r) => {
    let key = r[field] && String(r[field]).trim();
    if (isUniversity) {
      key = normalizeUniversityName(key);
    } else {
      key = key || nullLabel;
    }
    counts[key] = (counts[key] || 0) + 1;
  });
  const sorted = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));
  return limit ? sorted.slice(0, limit) : sorted;
}

/** Format a date key for the trend chart label */
function formatTrendLabel(key, mode) {
  if (mode === "hourly") {
    const hour = parseInt(key, 10);
    if (hour === 0) return "12 ص";
    if (hour === 12) return "12 م";
    if (hour < 12) return `${hour} ص`;
    return `${hour - 12} م`;
  }
  if (mode === "monthly") {
    const [y, m] = key.split("-");
    return new Date(+y, +m - 1, 1).toLocaleDateString("ar-EG", { month: "short" });
  }
  const d = new Date(key + "T00:00:00");
  return d.toLocaleDateString("ar-EG", { month: "numeric", day: "numeric" });
}

// ─────────────────────────────────────────────────────
// KPI Stats — 3 parallel count queries, never fetches rows
// ─────────────────────────────────────────────────────
export const fetchKPIStats = async () => {
  const [totalRes, approvedRes, rejectedRes] = await Promise.all([
    supabase.from("students").select("*", { count: "exact", head: true }),
    supabase
      .from("students")
      .select("*", { count: "exact", head: true })
      .eq("isApproved", true),
    supabase
      .from("students")
      .select("*", { count: "exact", head: true })
      .eq("isApproved", false),
  ]);

  const total = totalRes.count ?? 0;
  const approved = approvedRes.count ?? 0;
  const rejected = rejectedRes.count ?? 0;
  const pending = total - approved - rejected;
  const approvalRate =
    total > 0 ? ((approved / total) * 100).toFixed(1) : "0.0";

  return { total, approved, rejected, pending, approvalRate };
};

// ─────────────────────────────────────────────────────
// Registration Trend — with any Selected Day (Hourly) support
// ─────────────────────────────────────────────────────
export const fetchRegistrationTrend = async (period = "30d", customDate = null) => {
  const now = new Date();

  // 1. Hourly mode for a specific Selected Date (24 hours: 00:00 - 23:00)
  if (period === "24h" || period === "hourly" || period === "today") {
    const counts = {};
    for (let h = 0; h < 24; h++) {
      counts[h] = 0;
    }

    let targetDate = now;
    if (customDate) {
      const parts = customDate.split("-");
      if (parts.length === 3) {
        targetDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      }
    }

    const startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 0, 0, 0, 0);
    const endOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 23, 59, 59, 999);

    const { data, error } = await supabase
      .from("students")
      .select("created_at")
      .gte("created_at", startOfDay.toISOString())
      .lte("created_at", endOfDay.toISOString());

    if (error) throw error;

    (data || []).forEach((r) => {
      const d = new Date(r.created_at);
      const h = d.getHours();
      if (counts[h] !== undefined) counts[h]++;
    });

    return Object.entries(counts).map(([hourStr, students]) => ({
      date: `${hourStr}:00`,
      label: formatTrendLabel(hourStr, "hourly"),
      students,
    }));
  }

  // 2. Daily or Monthly mode
  const isMonthly = period === "6m" || period === "1y";
  const totalUnits =
    period === "7d" ? 7 : period === "30d" ? 30 : period === "6m" ? 6 : 12;

  const counts = {};
  if (isMonthly) {
    for (let i = totalUnits - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!(key in counts)) counts[key] = 0;
    }
  } else {
    for (let i = totalUnits - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      counts[key] = 0;
    }
  }

  const fromDate = new Date(now);
  if (isMonthly) {
    fromDate.setMonth(fromDate.getMonth() - totalUnits + 1);
    fromDate.setDate(1);
  } else {
    fromDate.setDate(fromDate.getDate() - totalUnits + 1);
  }

  const { data, error } = await supabase
    .from("students")
    .select("created_at")
    .gte("created_at", fromDate.toISOString());

  if (error) throw error;

  (data || []).forEach((r) => {
    const d = new Date(r.created_at);
    const key = isMonthly
      ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
      : d.toISOString().split("T")[0];
    if (key in counts) counts[key]++;
  });

  return Object.entries(counts).map(([key, students]) => ({
    date: key,
    label: formatTrendLabel(key, isMonthly ? "monthly" : "daily"),
    students,
  }));
};

// ─────────────────────────────────────────────────────
// Distribution queries — single-column fetches
// ─────────────────────────────────────────────────────
export const fetchUniversityDistribution = async () => {
  const { data, error } = await supabase
    .from("students")
    .select("university");
  if (error) throw error;
  return groupByField(data || [], "university", "غير محدد", 10, true);
};

export const fetchAcademicYearDistribution = async () => {
  const { data, error } = await supabase
    .from("students")
    .select("academicYear");
  if (error) throw error;
  return groupByField(data || [], "academicYear", "غير محدد");
};

export const fetchPlaceDistribution = async () => {
  const { data, error } = await supabase.from("students").select("place");
  if (error) throw error;
  return groupByField(data || [], "place", "غير محدد", 10);
};

// ─────────────────────────────────────────────────────
// Pending students — isApproved IS NULL, no cookie
// ─────────────────────────────────────────────────────
export const fetchPendingStudents = async (limit = 8) => {
  const { data, error } = await supabase
    .from("students")
    .select(
      "id,name,email,university,academicYear,place,imgSrc,created_at,isApproved"
    )
    .is("isApproved", null)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data || [];
};

// ─────────────────────────────────────────────────────
// Recent registrations — latest N, no cookie
// ─────────────────────────────────────────────────────
export const fetchRecentStudents = async (limit = 10) => {
  const { data, error } = await supabase
    .from("students")
    .select(
      "id,name,email,university,academicYear,imgSrc,created_at,isApproved"
    )
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data || [];
};

// ─────────────────────────────────────────────────────
// Profile completion — no cookie column
// ─────────────────────────────────────────────────────
const PROFILE_FIELDS = [
  { key: "name",         label: "اسم مفقود"          },
  { key: "phone",        label: "هاتف مفقود"          },
  { key: "university",   label: "جامعة مفقودة"        },
  { key: "place",        label: "مكان مفقود"          },
  { key: "imgSrc",       label: "صورة مفقودة"         },
  { key: "academicYear", label: "سنة دراسية مفقودة"   },
  { key: "email",        label: "بريد إلكتروني مفقود" },
];

export const fetchProfileCompletion = async () => {
  const { data, error } = await supabase
    .from("students")
    .select("name,phone,university,place,imgSrc,academicYear,email");
  if (error) throw error;

  const rows = data || [];
  const total = rows.length;
  const fieldKeys = PROFILE_FIELDS.map((f) => f.key);
  const missingCounts = Object.fromEntries(fieldKeys.map((k) => [k, 0]));
  let completeCount = 0;

  rows.forEach((r) => {
    const isComplete = fieldKeys.every((k) => {
      const v = r[k];
      return v !== null && v !== undefined && String(v).trim() !== "";
    });
    if (isComplete) completeCount++;
    fieldKeys.forEach((k) => {
      const v = r[k];
      if (v === null || v === undefined || String(v).trim() === "")
        missingCounts[k]++;
    });
  });

  const missing = PROFILE_FIELDS.map((f) => ({
    key: f.key,
    label: f.label,
    count: missingCounts[f.key],
  })).filter((m) => m.count > 0);

  return {
    total,
    complete: completeCount,
    incomplete: total - completeCount,
    rate: total > 0 ? ((completeCount / total) * 100).toFixed(1) : "0.0",
    missing,
  };
};

// ─────────────────────────────────────────────────────
// Approval by university — analytics table data
// ─────────────────────────────────────────────────────
export const fetchApprovalByUniversity = async () => {
  const { data, error } = await supabase
    .from("students")
    .select("university,isApproved");
  if (error) throw error;

  const map = {};
  (data || []).forEach((r) => {
    const uni = normalizeUniversityName(r.university);
    if (!map[uni]) map[uni] = { total: 0, approved: 0, rejected: 0, pending: 0 };
    map[uni].total++;
    if (r.isApproved === true) map[uni].approved++;
    else if (r.isApproved === false) map[uni].rejected++;
    else map[uni].pending++;
  });

  return Object.entries(map)
    .map(([name, s]) => ({
      name,
      total: s.total,
      approved: s.approved,
      rejected: s.rejected,
      pending: s.pending,
      rate: s.total > 0 ? ((s.approved / s.total) * 100).toFixed(1) : "0.0",
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);
};

// ─────────────────────────────────────────────────────
// Relative time helper
// ─────────────────────────────────────────────────────
export const formatRelativeTime = (dateStr) => {
  const date = new Date(dateStr);
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  if (diffMin < 1) return "الآن";
  if (diffMin < 60) return `منذ ${diffMin} دقيقة`;
  if (diffHour < 24) return `منذ ${diffHour} ساعة`;
  if (diffDay < 7) return `منذ ${diffDay} يوم`;
  return date.toLocaleDateString("ar-EG", { month: "short", day: "numeric" });
};

export const getStatusInfo = (isApproved) => {
  if (isApproved === true)  return { label: "مقبول",         color: "#22c55e", bg: "#dcfce7" };
  if (isApproved === false) return { label: "مرفوض",         color: "#ef4444", bg: "#fee2e2" };
  return                           { label: "في الانتظار",   color: "#f59e0b", bg: "#fef3c7" };
};
