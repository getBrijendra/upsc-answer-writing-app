import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import ProfileEditForm from "@/components/profile-edit-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function EditProfilePage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  if (!profile) {
    redirect("/profile")
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/profile">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-black mb-2">Edit Profile</h1>
          <p className="text-gray-600 text-lg">Update your profile information</p>
        </div>

        <ProfileEditForm profile={profile} />
      </div>
    </div>
  )
}
