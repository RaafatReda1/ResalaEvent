import supabase from "./supabaseClient";
import {
  cleanStudentName,
  getFirstName,
  convertNameToSmartArabic,
} from "./arabicNameConverter";
import { formatWhatsAppNumber } from "./adminStudentActions";

export const DEFAULT_WHATSAPP_TEMPLATE = `مرحباً {name} 👋
يسرنا إبلاغك بأنه قد تم *قبول طلب تسجيلك* في إيفنت رسالة الطبي بنجاح! 🎉

📍 *نقطة التجمع والباص:* {place}
🎓 *الجامعة:* {university}
📚 *الفرقة الدراسية:* {academicYear}

نتطلع لرؤيتك ونتمنى لك يوماً رائعاً ومميزاً معنا! ✨
_فريق تنظيم أطباء الخير - جمعية رسالة_`;

const STORAGE_KEY = "resala_admin_whatsapp_template";

/**
 * Fetch WhatsApp template from Supabase public.admins table
 */
export const fetchAdminWhatsAppTemplate = async () => {
  try {
    // 1. Try to get current authenticated user
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user?.id) {
      const { data, error } = await supabase
        .from("admins")
        .select("whatsAppMsg")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (!error && data?.whatsAppMsg?.trim()) {
        localStorage.setItem(STORAGE_KEY, data.whatsAppMsg);
        return data.whatsAppMsg;
      }
    }

    // 2. Fallback: Query first admin record in admins table
    const { data: firstAdmin } = await supabase
      .from("admins")
      .select("whatsAppMsg")
      .not("whatsAppMsg", "is", null)
      .limit(1)
      .maybeSingle();

    if (firstAdmin?.whatsAppMsg?.trim()) {
      localStorage.setItem(STORAGE_KEY, firstAdmin.whatsAppMsg);
      return firstAdmin.whatsAppMsg;
    }
  } catch (err) {
    console.warn("Could not fetch template from admins table:", err);
  }

  // 3. Fallback to localStorage or Default
  const cached = localStorage.getItem(STORAGE_KEY);
  return cached?.trim() || DEFAULT_WHATSAPP_TEMPLATE;
};

/**
 * Save WhatsApp template to Supabase public.admins table and localStorage
 */
export const saveAdminWhatsAppTemplate = async (templateText) => {
  if (!templateText) return;
  const cleanText = templateText.trim();
  localStorage.setItem(STORAGE_KEY, cleanText);

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user?.id) {
      await supabase
        .from("admins")
        .update({ whatsAppMsg: cleanText })
        .eq("user_id", session.user.id);
    } else {
      // Update any admin record or insert
      const { data: existing } = await supabase
        .from("admins")
        .select("id")
        .limit(1)
        .maybeSingle();

      if (existing?.id) {
        await supabase
          .from("admins")
          .update({ whatsAppMsg: cleanText })
          .eq("id", existing.id);
      }
    }
  } catch (err) {
    console.error("Error saving WhatsApp template to Supabase:", err);
  }
};

/**
 * Compile template variables for a specific student
 * Options: { nameMode: 'full' | 'first', autoArabic: boolean }
 */
export const compileWhatsAppMessage = (
  template = DEFAULT_WHATSAPP_TEMPLATE,
  student = {},
  options = { nameMode: "full", autoArabic: true }
) => {
  if (!template) template = DEFAULT_WHATSAPP_TEMPLATE;

  const rawName = student.name || "صديقنا العزيز";
  const cleanedName = cleanStudentName(rawName);
  const firstName = getFirstName(rawName) || rawName;
  const arabicFullName = convertNameToSmartArabic(rawName, false);
  const arabicFirstName = convertNameToSmartArabic(rawName, true);

  // Determine standard {name} based on user's preference
  let standardName = cleanedName;
  if (options.nameMode === "first") {
    standardName = options.autoArabic ? arabicFirstName : firstName;
  } else if (options.autoArabic) {
    standardName = arabicFullName;
  }

  const variables = {
    "{name}": standardName || "صديقنا العزيز",
    "{firstName}": options.autoArabic ? arabicFirstName : firstName,
    "{fullName}": options.autoArabic ? arabicFullName : cleanedName,
    "{arabicName}": arabicFullName,
    "{university}": student.university || "جامعتك المحددة",
    "{place}": student.place || "نقطة التجمع المحددة بالاستمارة",
    "{academicYear}": student.academicYear || "الفرقة المسجلة",
    "{phone}": student.phone || "—",
    "{email}": student.email || "—",
  };

  let compiled = template;
  Object.entries(variables).forEach(([tag, val]) => {
    compiled = compiled.split(tag).join(val);
  });

  return compiled;
};

/**
 * Generate customized WhatsApp link using the admin's template
 */
export const generateCustomWhatsAppLink = (
  student,
  template = DEFAULT_WHATSAPP_TEMPLATE,
  options = { nameMode: "full", autoArabic: true }
) => {
  const phone = formatWhatsAppNumber(student?.phone);
  if (!phone) return null;

  const message = compileWhatsAppMessage(template, student, options);
  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(
    message
  )}`;
};
