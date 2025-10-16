
> If your project doesn’t have a `src/lib` folder, you can also put it in  
> `src/utils/supabaseClient.ts` — both are fine.  
> The important part is that you **import** it consistently later.

---

### 2. Paste the following code inside it  

```ts
// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

// ✅ These environment variables must be defined in your .env.local or .env file
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Uploads a texture file to Supabase Storage
 * @param bucket - Storage bucket name (default "textures")
 * @param file - File object to upload
 * @returns { path, publicUrl }
 */
export async function uploadTextureFile(bucket = "textures", file: File) {
  const path = `${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage.from(bucket).upload(path, file);

  if (error) throw error;

  // Get the public URL to display or reload the texture later
  const publicUrl = supabase.storage.from(bucket).getPublicUrl(data.path).publicUrl;

  return { path: data.path, publicUrl };
}

/**
 * Deletes a texture file from Supabase Storage
 * @param bucket - Storage bucket name (default "textures")
 * @param path - Path returned from uploadTextureFile
 */
export async function deleteTextureFile(bucket = "textures", path: string) {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw error;
  return true;
}
