import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import SubjectForm from "@/components/subject-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function EditSubjectPage({ params }: { params: Promise<{ subjectId: string }> }) {
  const { subjectId } = await params
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get the subject to edit
  const { data: subject } = await supabase.from("subjects").select("*").eq("id", subjectId).single()

  if (!subject) {
    redirect("/admin/subjects")
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/admin/subjects">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Subjects
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-black mb-2">Edit Subject</h1>
          <p className="text-gray-600 text-lg">Update subject information</p>
        </div>

        <SubjectForm subject={subject} />
      </div>
    </div>
  )
}
