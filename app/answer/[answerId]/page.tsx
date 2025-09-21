import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, TrendingUp, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function AnswerFeedbackPage({ params }: { params: Promise<{ answerId: string }> }) {
  const { answerId } = await params
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get answer with feedback
  const { data: answer } = await supabase
    .from("answers")
    .select("*, subjects(name)")
    .eq("id", answerId)
    .eq("user_id", data.user.id)
    .single()

  if (!answer) {
    redirect("/dashboard")
  }

  const feedback = answer.feedback as any

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-black mb-2">Answer Feedback</h1>
          <p className="text-gray-600 text-lg">{answer.subjects?.name}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Score Card */}
          <Card className="lg:col-span-1">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Overall Score</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-6xl font-bold text-black mb-2">{answer.score || 0}</div>
              <div className="text-gray-500 mb-4">out of 100</div>
              <Badge
                variant={answer.score >= 80 ? "default" : answer.score >= 60 ? "secondary" : "destructive"}
                className="text-sm px-3 py-1"
              >
                {answer.score >= 80 ? "Excellent" : answer.score >= 60 ? "Good" : "Needs Improvement"}
              </Badge>
            </CardContent>
          </Card>

          {/* Question and Answer */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Your Submission</CardTitle>
              <CardDescription>Submitted on {new Date(answer.created_at).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-black mb-2">Question:</h3>
                <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{answer.question}</p>
              </div>
              <div>
                <h3 className="font-semibold text-black mb-2">Your Answer:</h3>
                <div className="text-gray-600 bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
                  {answer.answer_text.split("\n").map((paragraph: string, index: number) => (
                    <p key={index} className="mb-2">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Strengths */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {feedback?.strengths?.map((strength: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Areas for Improvement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                Areas for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {feedback?.improvements?.map((improvement: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{improvement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Detailed Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-black" />
                Detailed Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-black mb-1">Content Quality</h4>
                <p className="text-sm text-gray-600">{feedback?.detailed_analysis?.content}</p>
              </div>
              <div>
                <h4 className="font-medium text-black mb-1">Presentation</h4>
                <p className="text-sm text-gray-600">{feedback?.detailed_analysis?.presentation}</p>
              </div>
              <div>
                <h4 className="font-medium text-black mb-1">Relevance</h4>
                <p className="text-sm text-gray-600">{feedback?.detailed_analysis?.relevance}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Link href="/practice">
            <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3">Practice More Questions</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
