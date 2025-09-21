import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import AnswerWritingForm from "@/components/answer-writing-form"

export default async function SubjectPracticePage({ params }: { params: Promise<{ subjectId: string }> }) {
  const { subjectId } = await params
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get subject details
  const { data: subject } = await supabase.from("subjects").select("*").eq("id", subjectId).single()

  if (!subject) {
    redirect("/practice")
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">{subject.name}</h1>
          <p className="text-gray-600 text-lg">Write your answer and get detailed feedback</p>
        </div>

        <AnswerWritingForm subjectId={subjectId} subjectName={subject.name} />
      </div>
    </div>
  )
}
