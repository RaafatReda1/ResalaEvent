import supabase from "./supabaseClient";
import { deleteImgFromStorage } from "@/Components/Form/Actions";

/**
 * Fetch students with search, filters, pagination, and sorting
 */
export const fetchStudentsWithFilters = async ({
  search = "",
  status = "all", // "all" | "approved" | "pending" | "rejected"
  university = "all",
  place = "all",
  academicYear = "all",
  page = 1,
  pageSize = 10,
  sortBy = "created_at",
  sortAsc = false,
}) => {
  try {
    let query = supabase
      .from("students")
      .select(
        "id, name, phone, email, university, academicYear, place, imgSrc, isApproved, created_at",
        { count: "exact" }
      );

    // 1. Status Filter
    if (status === "approved") {
      query = query.eq("isApproved", true);
    } else if (status === "pending") {
      query = query.is("isApproved", null);
    } else if (status === "rejected") {
      query = query.eq("isApproved", false);
    }

    // 2. University Filter
    if (university && university !== "all") {
      query = query.ilike("university", `%${university}%`);
    }

    // 3. Place / Branch Filter
    if (place && place !== "all") {
      query = query.ilike("place", `%${place}%`);
    }

    // 4. Academic Year Filter
    if (academicYear && academicYear !== "all") {
      query = query.ilike("academicYear", `%${academicYear}%`);
    }

    // 5. Search Filter (Name, Email, Phone)
    if (search && search.trim()) {
      const term = search.trim();
      query = query.or(
        `name.ilike.%${term}%,email.ilike.%${term}%,phone.ilike.%${term}%,university.ilike.%${term}%`
      );
    }

    // 6. Sorting
    query = query.order(sortBy, { ascending: sortAsc });

    // 7. Pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;
    if (error) throw error;

    return {
      students: data || [],
      totalCount: count || 0,
      totalPages: Math.ceil((count || 0) / pageSize),
    };
  } catch (err) {
    console.error("fetchStudentsWithFilters error:", err);
    throw err;
  }
};

/**
 * Create a new student (Admin manual registration)
 */
export const createStudentAdmin = async (studentData) => {
  const payload = {
    name: studentData.name?.trim() || null,
    email: studentData.email?.trim().toLowerCase(),
    phone: studentData.phone?.trim() || null,
    university: studentData.university?.trim() || null,
    academicYear: studentData.academicYear?.trim() || null,
    place: studentData.place?.trim() || null,
    imgSrc: studentData.imgSrc || null,
    isApproved: studentData.isApproved !== undefined ? studentData.isApproved : null,
  };

  const { data, error } = await supabase
    .from("students")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Update student record
 */
export const updateStudentAdmin = async (id, studentData) => {
  const payload = {
    name: studentData.name?.trim(),
    email: studentData.email?.trim().toLowerCase(),
    phone: studentData.phone?.trim(),
    university: studentData.university?.trim(),
    academicYear: studentData.academicYear?.trim(),
    place: studentData.place?.trim(),
    imgSrc: studentData.imgSrc,
    isApproved: studentData.isApproved,
  };

  const { data, error } = await supabase
    .from("students")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Update single student approval status
 */
export const setStudentApprovalStatus = async (id, isApproved) => {
  const { data, error } = await supabase
    .from("students")
    .update({ isApproved })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Bulk update approval status
 */
export const bulkSetApprovalStatus = async (ids, isApproved) => {
  if (!ids || ids.length === 0) return;
  const { data, error } = await supabase
    .from("students")
    .update({ isApproved })
    .in("id", ids)
    .select();

  if (error) throw error;
  return data;
};

/**
 * Delete a single student (and remove photo from storage bucket)
 */
export const deleteStudentAdmin = async (id) => {
  try {
    const { data: student } = await supabase
      .from("students")
      .select("imgSrc")
      .eq("id", id)
      .maybeSingle();

    if (student?.imgSrc) {
      await deleteImgFromStorage(student.imgSrc);
    }
  } catch (storageErr) {
    console.warn("Storage cleanup failed before student deletion:", storageErr);
  }

  const { error } = await supabase.from("students").delete().eq("id", id);
  if (error) throw error;
  return true;
};

/**
 * Bulk delete students (and remove all their photos from storage bucket)
 */
export const bulkDeleteStudentsAdmin = async (ids) => {
  if (!ids || ids.length === 0) return;

  try {
    const { data: students } = await supabase
      .from("students")
      .select("imgSrc")
      .in("id", ids);

    const imgUrls = (students || []).map((s) => s.imgSrc).filter(Boolean);
    if (imgUrls.length > 0) {
      await deleteImgFromStorage(imgUrls);
    }
  } catch (storageErr) {
    console.warn("Storage bulk cleanup failed before student deletion:", storageErr);
  }

  const { error } = await supabase.from("students").delete().in("id", ids);
  if (error) throw error;
  return true;
};

/**
 * Format Egyptian/International phone number for WhatsApp
 */
export const formatWhatsAppNumber = (phone) => {
  if (!phone) return "";
  let clean = phone.replace(/[^\d+]/g, "");
  // If starts with 01 (Egyptian mobile), prepend country code 2
  if (clean.startsWith("01")) {
    clean = "2" + clean;
  } else if (clean.startsWith("+")) {
    clean = clean.substring(1);
  }
  return clean;
};

/**
 * Generate official WhatsApp approval link
 */
export const generateWhatsAppApprovalLink = (student) => {
  const phone = formatWhatsAppNumber(student?.phone);
  if (!phone) return null;

  const studentName = student.name || "صديقنا العزيز";
  const place = student.place || "المحدد في الاستمارة";
  const university = student.university || "جامعتك";

  const message = `مرحباً ${studentName} 👋
يسرنا إبلاغك بأنه قد تم *قبول طلب تسجيلك* في إيفنت رسالة الطبي بنجاح! 🎉

📍 *نقطة التجمع والباص:* ${place}
🎓 *الجامعة:* ${university}

نتطلع لرؤيتك ونتمنى لك يوماً رائعاً ومميزاً معنا! ✨
_فريق تنظيم أطباء الخير - جمعية رسالة_`;

  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(
    message
  )}`;
};

/**
 * Export filtered student rows to CSV file (download in browser)
 */
export const exportStudentsToCSV = (students = []) => {
  if (!students || students.length === 0) return;

  const headers = [
    "الاسم",
    "البريد الإلكتروني",
    "رقم الهاتف",
    "الجامعة",
    "السنة الدراسية",
    "نقطة التجمع / الفرع",
    "حالة القبول",
    "تاريخ التسجيل",
  ];

  const rows = students.map((s) => [
    `"${(s.name || "").replace(/"/g, '""')}"`,
    `"${(s.email || "").replace(/"/g, '""')}"`,
    `"${(s.phone || "").replace(/"/g, '""')}"`,
    `"${(s.university || "").replace(/"/g, '""')}"`,
    `"${(s.academicYear || "").replace(/"/g, '""')}"`,
    `"${(s.place || "").replace(/"/g, '""')}"`,
    `"${s.isApproved === true ? "مقبول" : s.isApproved === false ? "مرفوض" : "في الانتظار"}"`,
    `"${new Date(s.created_at).toLocaleString("ar-EG")}"`,
  ]);

  const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `طلاب_رسالة_${new Date().toISOString().split("T")[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
