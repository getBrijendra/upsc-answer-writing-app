import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PenTool, BookOpen, BarChart3, Brain, Settings } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user's recent activity
  const { data: recentAnswers } = await supabase
    .from("answers")
    .select("*, subjects(name)")
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false })
    .limit(3)

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">Welcome back, {profile?.full_name || "Aspirant"}!</h1>
          <p className="text-gray-600 text-lg">Ready to continue your UPSC preparation journey?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white border border-gray-200">
            <Link href="/practice">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                  <PenTool className="w-6 h-6 text-black" />
                </div>
                <CardTitle className="text-lg text-black">Answer Writing</CardTitle>
                <CardDescription className="text-gray-600">Practice with real UPSC questions</CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white border border-gray-200">
            <Link href="/mcq">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                  <Brain className="w-6 h-6 text-black" />
                </div>
                <CardTitle className="text-lg text-black">MCQ Generator</CardTitle>
                <CardDescription className="text-gray-600">Generate practice questions</CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white border border-gray-200">
            <Link href="/profile">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                  <BookOpen className="w-6 h-6 text-black" />
                </div>
                <CardTitle className="text-lg text-black">My Answers</CardTitle>
                <CardDescription className="text-gray-600">Review past submissions</CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white border border-gray-200">
            <Link href="/progress">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                  <BarChart3 className="w-6 h-6 text-black" />
                </div>
                <CardTitle className="text-lg text-black">Progress</CardTitle>
                <CardDescription className="text-gray-600">Track your improvement</CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white border border-gray-200">
            <Link href="/admin/subjects">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                  <Settings className="w-6 h-6 text-black" />
                </div>
                <CardTitle className="text-lg text-black">Manage Subjects</CardTitle>
                <CardDescription className="text-gray-600">Configure UPSC subjects</CardDescription>
              </CardHeader>
            </Link>
          </Card>
        </div>

        {recentAnswers && recentAnswers.length > 0 && (
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-black">Recent Activity</CardTitle>
              <CardDescription className="text-gray-600">Your latest answer submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAnswers.map((answer: any) => (
                  <div
                    key={answer.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <div>
                      <p className="font-medium text-black">{answer.subjects?.name}</p>
                      <p className="text-sm text-gray-600 truncate max-w-md">{answer.question.substring(0, 100)}...</p>
                      <p className="text-xs text-gray-500">{new Date(answer.created_at).toLocaleDateString()}</p>
                    </div>
                    {answer.score && (
                      <div className="text-right">
                        <div className="text-lg font-bold text-black">{answer.score}/100</div>
                        <div className="text-xs text-gray-500">Score</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
