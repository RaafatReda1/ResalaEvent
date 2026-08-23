import supabase from "@/utils/supabaseClient";

const BUCKET = "studentImg";

/**
 * Upload student image and return its public URL
 */
export const uploadImg = async (file, studentName) => {
  if (!file) {
    throw new Error("No image selected");
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;

  const filePath = `${studentName}/${fileName}`;

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