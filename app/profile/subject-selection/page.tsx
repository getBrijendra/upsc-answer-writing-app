import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import SubjectSelectionForm from "@/components/subject-selection-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function SubjectSelectionPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*, subjects(id, name, description)")
    .eq("id", data.user.id)
    .single()

  // Get all available subjects
  const { data: subjects } = await supabase.from("subjects").select("id, name, description").order("name")

  if (!profile || !subjects) {
    redirect("/profile")
  }

  const hasSelectedSubject = !!profile.optional_subject_id

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
          <h1 className="text-4xl font-bold text-black mb-2">Optional Subject Selection</h1>
          <p className="text-gray-600 text-lg">Choose an optional subject to enhance your UPSC preparation</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <SubjectSelectionForm
            subjects={subjects}
            currentSubjectId={profile.optional_subject_id}
            hasSelectedSubject={hasSelectedSubject}
          />
        </div>
      </div>
    </div>
  )
}
