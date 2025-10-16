import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadTextureFile(bucket = "textures", file) {
  const path = `${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage.from(bucket).upload(path, file);
  if (error) throw error;
  const publicUrl = supabase.storage.from(bucket).getPublicUrl(data.path).data.publicUrl;
  return { path: data.path, publicUrl };
}

export async function deleteTextureFile(bucket = "textures", path) {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw error;
  return true;
}
