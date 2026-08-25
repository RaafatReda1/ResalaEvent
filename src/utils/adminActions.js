import supabase from "./supabaseClient";

export const fetchUsers = async ()=>{
    const {data, error} = await supabase.from('students').select('*');
    if(error) return null;
    return data;
}
