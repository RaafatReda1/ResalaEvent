import supabase from "./supabaseClient";

export const checkIsAdmin = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  if (!session) return false;

  const user_id = session.user.id;
  console.log(user_id);
  const { data, error } = await supabase
    .from("admins")
    .select("*")
    .eq("user_id", user_id)
    .maybeSingle();
  if (error) return false;

  console.log(Boolean(data));
  return Boolean(data);
};
