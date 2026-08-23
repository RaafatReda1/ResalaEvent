import supabase from "@/utils/supabaseClient";

const BUCKET = "studentImg";

/**
 * Upload student image and return its public URL
 */
export const uploadImg = async (file, studentName = "student") => {
  if (!file) {
    throw new Error("No image selected");
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  
  // Safe folder key (Supabase storage prefers ASCII/URI-safe keys)
  const safeName = encodeURIComponent((studentName || "student").trim().replace(/\s+/g, "_"));
  const filePath = `${safeName}/${fileName}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Image upload error:", error);
    throw error;
  }

  const { data } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(filePath);

  return data.publicUrl;
};


/**
 * Upload student data
 */
export const uploadData = async (form) => {
  try {
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
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Update student data by ID or phone
 */
export const updateStudentData = async (id, form) => {
  try {
    let query = supabase.from("students").update(form);
    
    if (id) {
      query = query.eq("id", id);
    } else if (form.phone) {
      query = query.eq("phone", form.phone);
    }

    const { data, error } = await query.select().single();

    if (error) {
      console.error("Student update error:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Student update exception:", error);
    throw error;
  }
};

/**
 * Cookie & LocalStorage Management for Single Registration Persistence
 */
const REG_COOKIE_NAME = "resala_student_reg_v1";

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
    // 1. Check document.cookie
    const match = document.cookie.match(
      new RegExp(`(?:^|;\\s*)${REG_COOKIE_NAME}=([^;]*)`)
    );
    if (match && match[1]) {
      return JSON.parse(decodeURIComponent(match[1]));
    }
    // 2. Fallback to localStorage
    const local = localStorage.getItem(REG_COOKIE_NAME);
    if (local) {
      return JSON.parse(local);
    }
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