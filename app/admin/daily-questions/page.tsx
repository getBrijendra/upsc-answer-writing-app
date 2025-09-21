import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Plus, FileText, Users, Eye } from "lucide-react"
import Link from "next/link"
import DailyQuestionsTable from "@/components/daily-questions-table"

export default async function DailyQuestionsManagementPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get all daily questions with subject names
  const { data: dailyQuestions } = await supabase
    .from("daily_questions")
    .select(`
      *,
      subjects(name)
    `)
    .order("published_date", { ascending: false })

  // Get statistics
  const { data: totalAttempts } = await supabase.from("user_daily_attempts").select("id", { count: "exact" })

  const activeQuestions = dailyQuestions?.filter((q) => q.is_active).length || 0
  const totalQuestions = dailyQuestions?.length || 0
  const totalAttemptsCount = totalAttempts?.length || 0

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-black mb-2">Daily Questions Management</h1>
              <p className="text-gray-600 text-lg">Manage daily essay writing questions for students</p>
            </div>
            <Link href="/admin/daily-questions/new">
              <Button className="bg-black text-white hover:bg-gray-800">
                <Plus className="w-4 h-4 mr-2" />
                Add New Question
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-black">Total Questions</CardTitle>
                <FileText className="w-5 h-5 text-black" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black">{totalQuestions}</div>
              <p className="text-sm text-gray-600">All time</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-black">Active Questions</CardTitle>
                <Eye className="w-5 h-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black">{activeQuestions}</div>
              <p className="text-sm text-gray-600">Currently visible</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-black">Total Attempts</CardTitle>
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black">{totalAttemptsCount}</div>
              <p className="text-sm text-gray-600">Student submissions</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-black">This Week</CardTitle>
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black">
                {dailyQuestions?.filter((q) => {
                  const questionDate = new Date(q.published_date)
                  const weekAgo = new Date()
                  weekAgo.setDate(weekAgo.getDate() - 7)
                  return questionDate >= weekAgo
                }).length || 0}
              </div>
              <p className="text-sm text-gray-600">Recent questions</p>
            </CardContent>
          </Card>
        </div>

        {/* Questions Table */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-black">All Daily Questions</CardTitle>
            <CardDescription className="text-gray-600">
              Manage daily essay writing questions and their visibility
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DailyQuestionsTable questions={dailyQuestions || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
