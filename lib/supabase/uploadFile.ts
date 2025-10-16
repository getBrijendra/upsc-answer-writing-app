import { createClient } from "@/lib/supabase/client"

export async function uploadToSupabase(file: File, bucketName = "uploads") {
  const supabase = createClient()
  const fileExt = file.name.split(".").pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`

  // Optional: organize files by user or folder
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const filePath = `${user?.id || "anonymous"}/${fileName}`

  // include contentType and correct path
  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    })

  if (uploadError) {
    console.error("Supabase upload error:", uploadError)
    throw new Error(uploadError.message)
  }

  // Get public URL
  const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath)
  return data.publicUrl
}
