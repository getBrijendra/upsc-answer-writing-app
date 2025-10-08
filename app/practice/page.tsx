import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import AnswerWritingForm from "@/components/answer-writing-form"

export default async function PracticePage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("optional_subject_id")
    .eq("id", data.user.id)
    .single()

  const { data: mainsSubjects } = await supabase
    .from("subjects")
    .select("*")
    .eq("category", "MAINS")
    .order("name", { ascending: true })

  let subjects = mainsSubjects || []

  if (profile?.optional_subject_id) {
    const { data: optionalSubject } = await supabase
      .from("subjects")
      .select("*")
      .eq("id", profile.optional_subject_id)
      .single()

    if (optionalSubject) {
      subjects = [...subjects, optionalSubject]
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">Answer Writing Practice</h1>
          <p className="text-gray-600 text-lg">
            Practice with Mains{profile?.optional_subject_id ? " and your Optional subject" : ""}
          </p>
        </div>

        <AnswerWritingForm subjects={subjects || []} />
      </div>
    </div>
  )
}
