import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import MCQQuestionPractice from "@/components/mcq-question-practice"

export default async function MCQQuestionPage({ params }: { params: Promise<{ questionId: string }> }) {
  const { questionId } = await params
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get the question
  const { data: question } = await supabase
    .from("mcq_questions")
    .select("*, subjects(name)")
    .eq("id", questionId)
    .eq("user_id", data.user.id)
    .single()

  if (!question) {
    redirect("/mcq/practice")
  }

  // Check if user has already attempted this question
  const { data: existingAttempt } = await supabase
    .from("user_mcq_attempts")
    .select("*")
    .eq("user_id", data.user.id)
    .eq("mcq_question_id", questionId)
    .single()

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <MCQQuestionPractice question={question} existingAttempt={existingAttempt} />
      </div>
    </div>
  )
}
