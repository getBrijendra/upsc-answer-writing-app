import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, BookOpen, History } from "lucide-react"
import MCQQuizGenerator from "@/components/mcq-quiz-generator"

export default async function GenerateMCQPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: totalQuestions } = await supabase
    .from("mcq_questions")
    .select("id", { count: "exact" })
    .eq("user_id", data.user.id)

  const { data: totalAttempts } = await supabase
    .from("user_mcq_attempts")
    .select("id", { count: "exact" })
    .eq("user_id", data.user.id)

  const { data: correctAttempts } = await supabase
    .from("user_mcq_attempts")
    .select("id", { count: "exact" })
    .eq("user_id", data.user.id)
    .eq("is_correct", true)

  const accuracy = totalAttempts?.length ? Math.round(((correctAttempts?.length || 0) / totalAttempts.length) * 100) : 0

  const { data: profile } = await supabase
    .from("profiles")
    .select("optional_subject_id")
    .eq("id", data.user.id)
    .single()

  const { data: prelimsMainsSubjects } = await supabase
    .from("subjects")
    .select("*")
    .in("category", ["PRELIMS", "MAINS"])
    .order("category", { ascending: true })
    .order("name", { ascending: true })

  let subjects = prelimsMainsSubjects || []

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
          <h1 className="text-4xl font-bold text-black mb-2">Generate MCQ Questions</h1>
          <p className="text-gray-600 text-lg">
            Create practice questions from your study materials for Prelims, Mains
            {profile?.optional_subject_id ? ", and your Optional subject" : ""}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white border border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-black">Generated Questions</CardTitle>
                <Brain className="w-5 h-5 text-black" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black">{totalQuestions?.length || 0}</div>
              <p className="text-sm text-gray-600">Questions created</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-black">Total Attempts</CardTitle>
                <BookOpen className="w-5 h-5 text-black" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black">{totalAttempts?.length || 0}</div>
              <p className="text-sm text-gray-600">Questions attempted</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-black">Accuracy</CardTitle>
                <History className="w-5 h-5 text-black" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black">{accuracy}%</div>
              <p className="text-sm text-gray-600">Correct answers</p>
            </CardContent>
          </Card>
        </div>

        <MCQQuizGenerator subjects={subjects || []} />
      </div>
    </div>
  )
}
