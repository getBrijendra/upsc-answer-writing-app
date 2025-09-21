import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Users, FileText, Brain } from "lucide-react"
import Link from "next/link"

export default async function SubjectDetailPage({ params }: { params: { subjectId: string } }) {
  const { subjectId } = params
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get the subject
  const { data: subject } = await supabase.from("subjects").select("*").eq("id", subjectId).single()

  if (!subject) {
    redirect("/admin/subjects")
  }

  // Get usage statistics
  const { data: answers } = await supabase.from("answers").select("*").eq("subject_id", subjectId)

  const { data: mcqQuestions } = await supabase.from("mcq_questions").select("*").eq("subject_id", subjectId)

  // Get unique users who have used this subject
  const uniqueUserIds = new Set([
    ...(answers?.map((a) => a.user_id) || []),
    ...(mcqQuestions?.map((q) => q.user_id) || []),
  ])

  // Get recent activity
  const { data: recentAnswers } = await supabase
    .from("answers")
    .select("*, profiles(full_name)")
    .eq("subject_id", subjectId)
    .order("created_at", { ascending: false })
    .limit(5)

  const { data: recentMCQs } = await supabase
    .from("mcq_questions")
    .select("*, profiles(full_name)")
    .eq("subject_id", subjectId)
    .order("created_at", { ascending: false })
    .limit(5)

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-black mb-2">{subject.name}</h1>
              {subject.description && <p className="text-gray-600 text-lg">{subject.description}</p>}
            </div>
            <Link href={`/admin/subjects/${subject.id}/edit`}>
              <Button className="bg-black hover:bg-gray-800">
                <Edit className="w-4 h-4 mr-2" />
                Edit Subject
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Total Answers</CardTitle>
                <FileText className="w-5 h-5 text-black" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black">{answers?.length || 0}</div>
              <p className="text-sm text-gray-600">Submitted answers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">MCQ Questions</CardTitle>
                <Brain className="w-5 h-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black">{mcqQuestions?.length || 0}</div>
              <p className="text-sm text-gray-600">Generated questions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Active Users</CardTitle>
                <Users className="w-5 h-5 text-black" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black">{uniqueUserIds.size}</div>
              <p className="text-sm text-gray-600">Users engaged</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Created</CardTitle>
                <Badge variant="outline" className="text-xs">
                  Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-black">{new Date(subject.created_at).toLocaleDateString()}</div>
              <p className="text-sm text-gray-600">Subject added</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Answers */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Answers</CardTitle>
              <CardDescription>Latest answer submissions for this subject</CardDescription>
            </CardHeader>
            <CardContent>
              {recentAnswers && recentAnswers.length > 0 ? (
                <div className="space-y-4">
                  {recentAnswers.map((answer: any) => (
                    <div key={answer.id} className="p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-black">
                          {answer.profiles?.full_name || "Anonymous User"}
                        </span>
                        {answer.score && (
                          <Badge
                            variant={answer.score >= 80 ? "default" : answer.score >= 60 ? "secondary" : "destructive"}
                          >
                            {answer.score}/100
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-1">{answer.question}</p>
                      <p className="text-xs text-gray-500">{new Date(answer.created_at).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No answers submitted yet</p>
              )}
            </CardContent>
          </Card>

          {/* Recent MCQ Questions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent MCQ Questions</CardTitle>
              <CardDescription>Latest generated questions for this subject</CardDescription>
            </CardHeader>
            <CardContent>
              {recentMCQs && recentMCQs.length > 0 ? (
                <div className="space-y-4">
                  {recentMCQs.map((mcq: any) => (
                    <div key={mcq.id} className="p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-black">
                          {mcq.profiles?.full_name || "Anonymous User"}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {mcq.options?.length || 4} options
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-1">{mcq.question}</p>
                      <p className="text-xs text-gray-500">{new Date(mcq.created_at).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No MCQ questions generated yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
