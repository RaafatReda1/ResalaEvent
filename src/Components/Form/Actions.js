import supabase from "@/utils/supabaseClient";

export const BUCKET = "studentImg";

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
// Storage Path Helper & Cleaner
// ─────────────────────────────────────────────
/**
 * Extracts the relative bucket file path from a Supabase storage URL or relative path.
 * e.g. "https://xyz.supabase.co/storage/v1/object/public/studentImg/Ahmed_0101234/card.jpg"
 * -> "Ahmed_0101234/card.jpg"
 */
export const extractStoragePath = (urlOrPath) => {
  if (!urlOrPath || typeof urlOrPath !== "string") return null;
  if (!urlOrPath.startsWith("http")) return urlOrPath;

  try {
    const parsed = new URL(urlOrPath);
    const searchMarker = `/${BUCKET}/`;
    const markerIndex = parsed.pathname.indexOf(searchMarker);
    if (markerIndex !== -1) {
      return decodeURIComponent(parsed.pathname.substring(markerIndex + searchMarker.length));
    }
  } catch (e) {
    console.warn("Could not parse storage URL:", e);
  }
  return null;
};

/**
 * Delete a file or list of files from the Supabase storage bucket.
 */
export const deleteImgFromStorage = async (publicUrlsOrPaths) => {
  if (!publicUrlsOrPaths) return;
  const items = Array.isArray(publicUrlsOrPaths) ? publicUrlsOrPaths : [publicUrlsOrPaths];
  const pathsToDelete = items
    .map(extractStoragePath)
    .filter((p) => Boolean(p) && typeof p === "string");

  if (pathsToDelete.length === 0) return;

  try {
    const { error } = await supabase.storage.from(BUCKET).remove(pathsToDelete);
    if (error) {
      console.warn("Storage deletion error:", error);
    }
  } catch (err) {
    console.warn("Exception during storage deletion:", err);
  }
};

/**
 * Generate a clean, organized folder name for each student.
 * Uses the student's name + an identifier (phone, email prefix, or unique token).
 * e.g. "أحمد_محمد_01012345678" or "Ahmed_Ali_1234"
 */
export const getStudentFolderName = (studentName = "student", identifier = "") => {
  // Support Arabic letters (\u0600-\u06FF), alphanumeric, hyphens, and underscores
  const cleanName = (studentName || "student")
    .trim()
    .replace(/[^\w\u0600-\u06FF-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 40) || "student";

  const cleanId = (identifier || "")
    .toString()
    .trim()
    .replace(/[^\w\u0600-\u06FF-]/g, "")
    .slice(0, 15);

  return cleanId ? `${cleanName}_${cleanId}` : cleanName;
};

// ─────────────────────────────────────────────
// Image upload with per-student folder & automatic old-photo cleanup
// ─────────────────────────────────────────────
export const uploadImg = async (file, studentName = "student", options = {}) => {
  if (!file) throw new Error("No image selected");

  const { oldImgUrl = null, identifier = "" } = options;

  // 1. If updating, delete the previous photo from Supabase Storage so no orphaned files remain
  if (oldImgUrl) {
    await deleteImgFromStorage(oldImgUrl);
  }

  const rawExt = file.name ? file.name.split(".").pop() : "jpg";
  const fileExt = (rawExt || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";

  // 2. Build organized student folder path: [StudentFolder]/nomination_card_[Timestamp].[ext]
  const folder = getStudentFolderName(studentName, identifier);
  const fileName = `nomination_card_${Date.now()}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  // 3. Upload to student's dedicated folder in the bucket
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file, { cacheControl: "3600", upsert: true });

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
// Google OAuth & Supabase Auth Helpers
// ─────────────────────────────────────────────
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin,
    },
  });
  if (error) {
    console.error("Google sign in error:", error);
    throw error;
  }
  return data;
};

export const signOutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Sign out error:", error);
    throw error;
  }
};

export const fetchStudentByEmail = async (email) => {
  if (!email) return null;
  try {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("email", email.trim().toLowerCase())
      .maybeSingle();

    if (error) {
      console.error("Fetch by email error:", error);
      return null;
    }
    return data;
  } catch (e) {
    console.error("Fetch by email exception:", e);
    return null;
  }
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

