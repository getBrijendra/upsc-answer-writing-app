import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  Calendar,
  BookOpen,
  TrendingUp,
  Filter,
  Settings,
  GraduationCap,
  Brain,
  Network,
  Layers,
} from "lucide-react"
import AnswerHistoryFilters from "@/components/answer-history-filters"
import AnswerHistoryGrid from "@/components/answer-history-grid"
import MCQHistoryGrid from "@/components/mcq-history-grid"
import MCQStatsCards from "@/components/mcq-stats-cards"
import SavedItemsGrid from "@/components/saved-items-grid"
import Link from "next/link"

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string; month?: string; year?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile with optional subject
  const { data: profile } = await supabase.from("profiles").select("*, subjects(name)").eq("id", data.user.id).single()

  const { data: totalAnswers } = await supabase
    .from("answers")
    .select("id", { count: "exact" })
    .eq("user_id", data.user.id)

  const { data: avgScore } = await supabase
    .from("answers")
    .select("score")
    .eq("user_id", data.user.id)
    .not("score", "is", null)

  const averageScore = avgScore?.length
    ? Math.round(avgScore.reduce((sum, answer) => sum + (answer.score || 0), 0) / avgScore.length)
    : 0

  // Get subjects for filtering
  const { data: subjects } = await supabase.from("subjects").select("*").order("name")

  // Build query for filtered answers
  let answersQuery = supabase
    .from("answers")
    .select("*, subjects(name)")
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false })

  // Apply filters
  if (params.subject) {
    answersQuery = answersQuery.eq("subject_id", params.subject)
  }

  if (params.year) {
    const startDate = new Date(`${params.year}-01-01`)
    const endDate = new Date(`${params.year}-12-31`)
    answersQuery = answersQuery.gte("created_at", startDate.toISOString()).lte("created_at", endDate.toISOString())
  }

  if (params.month && params.year) {
    const startDate = new Date(`${params.year}-${params.month.padStart(2, "0")}-01`)
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0)
    answersQuery = answersQuery.gte("created_at", startDate.toISOString()).lte("created_at", endDate.toISOString())
  }

  const { data: answers } = await answersQuery

  const { data: mcqAttempts } = await supabase
    .from("user_mcq_attempts")
    .select(`
      *,
      mcq_questions (
        question,
        correct_answer,
        explanation,
        subjects (
          name
        )
      )
    `)
    .eq("user_id", data.user.id)
    .order("attempted_at", { ascending: false })

  const totalMCQAttempts = mcqAttempts?.length || 0
  const correctMCQAttempts = mcqAttempts?.filter((a) => a.is_correct).length || 0
  const mcqAccuracy = totalMCQAttempts > 0 ? Math.round((correctMCQAttempts / totalMCQAttempts) * 100) : 0

  const recentMCQAttempts = mcqAttempts?.slice(0, 10) || []
  const recentCorrect = recentMCQAttempts.filter((a) => a.is_correct).length
  const recentMCQAccuracy =
    recentMCQAttempts.length > 0 ? Math.round((recentCorrect / recentMCQAttempts.length) * 100) : 0

  const mcqSubjectStats = mcqAttempts?.reduce((acc: any, attempt: any) => {
    const subjectName = attempt.mcq_questions?.subjects?.name || "General"
    if (!acc[subjectName]) {
      acc[subjectName] = { total: 0, correct: 0 }
    }
    acc[subjectName].total += 1
    if (attempt.is_correct) acc[subjectName].correct += 1
    return acc
  }, {})

  const mcqSubjectData = Object.entries(mcqSubjectStats || {}).map(([name, data]: [string, any]) => ({
    subject: name,
    total: data.total,
    correct: data.correct,
    accuracy: Math.round((data.correct / data.total) * 100),
  }))

  const { data: mindmaps } = await supabase
    .from("mindmaps")
    .select("*")
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false })

  const { data: flashcardSets } = await supabase
    .from("flashcard_sets")
    .select("*")
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-black" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-black">{profile?.full_name || "UPSC Aspirant"}</h1>
                <p className="text-gray-600">{profile?.email}</p>
                {profile?.subjects && (
                  <p className="text-sm text-black font-medium mt-1">Optional Subject: {profile.subjects.name}</p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/profile/edit">
                <Button
                  variant="outline"
                  className="border-black text-black hover:bg-black hover:text-white bg-transparent"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </Link>
              <Link href="/profile/subject-selection">
                <Button className="bg-black hover:bg-gray-800 text-white">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  {profile?.optional_subject_id ? "View Subject" : "Select Subject"}
                </Button>
              </Link>
            </div>
          </div>

          <Tabs defaultValue="essays" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
              <TabsTrigger value="essays">Answer Writing</TabsTrigger>
              <TabsTrigger value="mcq">MCQ Practice</TabsTrigger>
              <TabsTrigger value="saved">Saved Items</TabsTrigger>
            </TabsList>

            <TabsContent value="essays">
              {/* Essay Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-white border border-gray-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-black">Total Answers</CardTitle>
                      <BookOpen className="w-5 h-5 text-black" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-black">{totalAnswers?.length || 0}</div>
                    <p className="text-sm text-gray-600">Submitted so far</p>
                  </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-black">Average Score</CardTitle>
                      <TrendingUp className="w-5 h-5 text-black" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-black">{averageScore}</div>
                    <p className="text-sm text-gray-600">Out of 100</p>
                  </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-black">This Month</CardTitle>
                      <Calendar className="w-5 h-5 text-black" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-black">
                      {answers?.filter((answer) => {
                        const answerDate = new Date(answer.created_at)
                        const now = new Date()
                        return (
                          answerDate.getMonth() === now.getMonth() && answerDate.getFullYear() === now.getFullYear()
                        )
                      }).length || 0}
                    </div>
                    <p className="text-sm text-gray-600">Answers submitted</p>
                  </CardContent>
                </Card>
              </div>

              {/* Answer History Section */}
              <Card className="mb-8 bg-white border border-gray-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl text-black">Answer History</CardTitle>
                      <CardDescription className="text-gray-600">
                        Review and filter your previous submissions
                      </CardDescription>
                    </div>
                    <Filter className="w-5 h-5 text-gray-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <AnswerHistoryFilters subjects={subjects || []} currentFilters={params} />
                  <AnswerHistoryGrid answers={answers || []} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mcq">
              <div className="mb-8">
                <MCQStatsCards
                  totalAttempts={totalMCQAttempts}
                  accuracy={mcqAccuracy}
                  recentAccuracy={recentMCQAccuracy}
                  subjectData={mcqSubjectData}
                />
              </div>

              <Card className="mb-8 bg-white border border-gray-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl text-black">MCQ Attempt History</CardTitle>
                      <CardDescription className="text-gray-600">Review your MCQ practice sessions</CardDescription>
                    </div>
                    <Brain className="w-5 h-5 text-gray-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <MCQHistoryGrid attempts={mcqAttempts || []} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="saved">
              <div className="space-y-8">
                {/* Mindmaps Section */}
                <Card className="bg-white border border-gray-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl text-black flex items-center gap-2">
                          <Network className="w-6 h-6" />
                          Saved Mindmaps
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                          Your interactive mindmap visualizations
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <SavedItemsGrid items={mindmaps || []} type="mindmap" />
                  </CardContent>
                </Card>

                {/* Flashcards Section */}
                <Card className="bg-white border border-gray-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl text-black flex items-center gap-2">
                          <Layers className="w-6 h-6" />
                          Saved Flashcard Sets
                        </CardTitle>
                        <CardDescription className="text-gray-600">Your Q&A flashcard collections</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <SavedItemsGrid items={flashcardSets || []} type="flashcard" />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
