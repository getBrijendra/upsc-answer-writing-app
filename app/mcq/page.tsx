import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, Plus, BookOpen, History } from "lucide-react"
import Link from "next/link"

export default async function MCQPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user's generated questions
  const { data: recentQuestions } = await supabase
    .from("mcq_questions")
    .select("*, subjects(name)")
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false })
    .limit(6)

  // Get user's MCQ attempts
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

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">MCQ Question Generator</h1>
          <p className="text-gray-600 text-lg">Generate practice questions from your study materials</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white border border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-black">Generated Questions</CardTitle>
                <Brain className="w-5 h-5 text-black" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black">{recentQuestions?.length || 0}</div>
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

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow bg-white border border-gray-200">
            <CardHeader>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <Plus className="w-6 h-6 text-black" />
              </div>
              <CardTitle className="text-xl text-black">Generate New Questions</CardTitle>
              <CardDescription className="text-gray-600">
                Create MCQ questions from text, PDFs, or images using AI. Perfect for testing your understanding of
                study materials.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/mcq/generate">
                <Button className="w-full bg-black text-white hover:bg-gray-800">Start Generating</Button>
              </Link>
            </CardContent>
          </Card>

          {/* <Card className="hover:shadow-lg transition-shadow bg-white border border-gray-200">
            <CardHeader>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-black" />
              </div>
              <CardTitle className="text-xl text-black">Practice Questions</CardTitle>
              <CardDescription className="text-gray-600">
                Practice with your previously generated questions or browse questions from different subjects.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/mcq/practice">
                <Button className="w-full bg-black text-white hover:bg-gray-800">Start Practice</Button>
              </Link>
            </CardContent>
          </Card> */}
        </div>

        {/* Recent Questions */}
        {/* {recentQuestions && recentQuestions.length > 0 && (
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-black">Recently Generated Questions</CardTitle>
              <CardDescription className="text-gray-600">Your latest MCQ questions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentQuestions.map((question: any) => (
                  <div key={question.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-black">{question.subjects?.name || "General"}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(question.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-black line-clamp-2 mb-3">{question.question}</p>
                    <Link href={`/mcq/question/${question.id}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full text-xs bg-white border-gray-200 text-black hover:bg-gray-50"
                      >
                        Practice This Question
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )} */}
      </div>
    </div>
  )
}
