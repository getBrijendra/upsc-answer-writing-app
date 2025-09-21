import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Target, Calendar, Award, BookOpen, BarChart3 } from "lucide-react"
import ProgressChart from "@/components/progress-chart"
import SubjectProgressChart from "@/components/subject-progress-chart"
import ImprovementSuggestions from "@/components/improvement-suggestions"
import ProgressTimeline from "@/components/progress-timeline"

export default async function ProgressPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user's answers with scores over time
  const { data: answers } = await supabase
    .from("answers")
    .select("*, subjects(name)")
    .eq("user_id", data.user.id)
    .not("score", "is", null)
    .order("created_at", { ascending: true })

  // Get subject-wise performance
  const { data: subjectStats } = await supabase
    .from("answers")
    .select("subject_id, score, subjects(name)")
    .eq("user_id", data.user.id)
    .not("score", "is", null)

  // Calculate statistics
  const totalAnswers = answers?.length || 0
  const averageScore = answers?.length
    ? Math.round(answers.reduce((sum, answer) => sum + (answer.score || 0), 0) / answers.length)
    : 0

  // Calculate improvement trend (last 5 vs first 5 answers)
  const recentAnswers = answers?.slice(-5) || []
  const earliestAnswers = answers?.slice(0, 5) || []
  const recentAvg = recentAnswers.length
    ? Math.round(recentAnswers.reduce((sum, answer) => sum + (answer.score || 0), 0) / recentAnswers.length)
    : 0
  const earliestAvg = earliestAnswers.length
    ? Math.round(earliestAnswers.reduce((sum, answer) => sum + (answer.score || 0), 0) / earliestAnswers.length)
    : 0
  const improvement = recentAvg - earliestAvg

  // Get current month stats
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const thisMonthAnswers =
    answers?.filter((answer) => {
      const answerDate = new Date(answer.created_at)
      return answerDate.getMonth() === currentMonth && answerDate.getFullYear() === currentYear
    }) || []

  // Calculate subject-wise averages
  const subjectAverages = subjectStats?.reduce((acc: any, answer: any) => {
    const subjectName = answer.subjects?.name || "Unknown"
    if (!acc[subjectName]) {
      acc[subjectName] = { total: 0, count: 0, scores: [] }
    }
    acc[subjectName].total += answer.score || 0
    acc[subjectName].count += 1
    acc[subjectName].scores.push(answer.score || 0)
    return acc
  }, {})

  const subjectData = Object.entries(subjectAverages || {}).map(([name, data]: [string, any]) => ({
    subject: name,
    average: Math.round(data.total / data.count),
    count: data.count,
    highest: Math.max(...data.scores),
    lowest: Math.min(...data.scores),
  }))

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">Progress Dashboard</h1>
          <p className="text-gray-600 text-lg">Track your improvement and identify areas for growth</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Total Answers</CardTitle>
                <BookOpen className="w-5 h-5 text-black" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black">{totalAnswers}</div>
              <p className="text-sm text-gray-600">Submitted overall</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Average Score</CardTitle>
                <Target className="w-5 h-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black">{averageScore}</div>
              <p className="text-sm text-gray-600">Out of 100</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">This Month</CardTitle>
                <Calendar className="w-5 h-5 text-black" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black">{thisMonthAnswers.length}</div>
              <p className="text-sm text-gray-600">Answers submitted</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Improvement</CardTitle>
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${improvement >= 0 ? "text-green-600" : "text-red-600"}`}>
                {improvement >= 0 ? "+" : ""}
                {improvement}
              </div>
              <p className="text-sm text-gray-600">Points improvement</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Progress Over Time Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-black" />
                Score Progression
              </CardTitle>
              <CardDescription>Your performance over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ProgressChart answers={answers || []} />
            </CardContent>
          </Card>

          {/* Subject-wise Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-green-600" />
                Subject Performance
              </CardTitle>
              <CardDescription>Average scores by subject</CardDescription>
            </CardHeader>
            <CardContent>
              <SubjectProgressChart subjectData={subjectData} />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Progress Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity Timeline</CardTitle>
              <CardDescription>Your latest submissions and milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <ProgressTimeline answers={answers?.slice(-10) || []} />
            </CardContent>
          </Card>

          {/* Improvement Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle>Improvement Suggestions</CardTitle>
              <CardDescription>Personalized recommendations based on your performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ImprovementSuggestions
                averageScore={averageScore}
                subjectData={subjectData}
                totalAnswers={totalAnswers}
                improvement={improvement}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
