import supabase from "@/utils/supabaseClient";

const BUCKET = "studentImg";

// ─────────────────────────────────────────────
// Cookie token helpers (browser storage)
// ─────────────────────────────────────────────
const REG_COOKIE_NAME = "resala_student_reg_v2";

/**
 * Generate a cryptographically random token to uniquely
 * identify this browser session in the DB `cookie` column.
 */
export const generateCookieToken = () => crypto.randomUUID();

export const saveRegistrationCookie = (data) => {
  try {
    const days = 365;
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    const encoded = encodeURIComponent(JSON.stringify(data));
    document.cookie = `${REG_COOKIE_NAME}=${encoded}; expires=${expires}; path=/; SameSite=Lax`;
    localStorage.setItem(REG_COOKIE_NAME, JSON.stringify(data));
  } catch (e) {
    console.warn("Storage write error:", e);
  }
};

export const getRegistrationCookie = () => {
  try {
    // 1. Prefer document.cookie
    const match = document.cookie.match(
      new RegExp(`(?:^|;\\s*)${REG_COOKIE_NAME}=([^;]*)`)
    );
    if (match && match[1]) {
      return JSON.parse(decodeURIComponent(match[1]));
    }
    // 2. Fallback to localStorage
    const local = localStorage.getItem(REG_COOKIE_NAME);
    if (local) return JSON.parse(local);
  } catch (e) {
    console.warn("Storage read error:", e);
  }
  return null;
};

export const clearRegistrationCookie = () => {
  try {
    document.cookie = `${REG_COOKIE_NAME}=; Max-Age=-99999999; path=/;`;
    localStorage.removeItem(REG_COOKIE_NAME);
  } catch (e) {
    console.warn("Storage clear error:", e);
  }
};

// ─────────────────────────────────────────────
// DB verification: check if browser cookie token
// matches a real row in Supabase `students` table.
// Returns the DB row on match, null otherwise.
// ─────────────────────────────────────────────
export const verifyStudentCookie = async (cookieToken) => {
  if (!cookieToken) return null;
  try {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("cookie", cookieToken)
      .maybeSingle();

    if (error) {
      console.error("Cookie verification error:", error);
      return null;
    }
    return data; // null if not found, row object if found
  } catch (e) {
    console.error("Cookie verification exception:", e);
    return null;
  }
};

// ─────────────────────────────────────────────
// Image upload
// ─────────────────────────────────────────────
export const uploadImg = async (file, studentName = "student") => {
  if (!file) throw new Error("No image selected");

  const fileExt = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const safeName = encodeURIComponent(
    (studentName || "student").trim().replace(/\s+/g, "_")
  );
  const filePath = `${safeName}/${fileName}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file, { cacheControl: "3600", upsert: false });

  if (error) {
    console.error("Image upload error:", error);
    throw error;
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
};

// ─────────────────────────────────────────────
// Insert new student row (includes cookie token)
// ─────────────────────────────────────────────
export const uploadData = async (form) => {
  const { data, error } = await supabase
    .from("students")
    .insert(form)
    .select()
    .single();

  if (error) {
    console.error("Student insert error:", error);
    throw error;
  }
  return data;
};

// ─────────────────────────────────────────────
// Update existing student row by id
// ─────────────────────────────────────────────
export const updateStudentData = async (id, form) => {
  const { data, error } = await supabase
    .from("students")
    .update(form)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Student update error:", error);
    throw error;
  }
  return data;
};
