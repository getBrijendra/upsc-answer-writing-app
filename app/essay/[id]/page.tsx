import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, TrendingUp, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function EssayFeedbackPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get essay with feedback
  const { data: essay } = await supabase.from("essays").select("*").eq("id", id).eq("user_id", data.user.id).single()

  if (!essay) {
    redirect("/dashboard")
  }

  const feedback = essay.feedback?.analysis ? parseAnalysis(essay.feedback.analysis) : {}

  function parseAnalysis(analysisText: string) {
    // Parse the markdown-formatted analysis text into structured feedback
    const sections: Record<string, string> = {}

    // Extract overall score
    const scoreMatch = analysisText.match(/Overall Score:\s*(\d+(?:\.\d+)?)\s*\/\s*10/)
    const overallScore = scoreMatch ? Math.round(Number.parseFloat(scoreMatch[1]) * 10) : 72

    // Extract sections
    const contentMatch = analysisText.match(/\*\*1\.\s*Content Quality.*?\*\*\n([\s\S]*?)(?=\*\*2\.|$)/)
    const structureMatch = analysisText.match(/\*\*2\.\s*Structure.*?\*\*\n([\s\S]*?)(?=\*\*3\.|$)/)
    const languageMatch = analysisText.match(/\*\*3\.\s*Language.*?\*\*\n([\s\S]*?)(?=\*\*4\.|$)/)
    const criticalMatch = analysisText.match(/\*\*4\.\s*Critical Analysis.*?\*\*\n([\s\S]*?)(?=\*\*5\.|$)/)

    // Extract strengths and improvements
    const strengthsMatch = analysisText.match(/\*\*Strengths:\*\*\n([\s\S]*?)(?=\*\*Areas for Improvement|$)/)
    const improvementsMatch = analysisText.match(/\*\*Areas for Improvement:\*\*\n([\s\S]*?)(?=\*\*|$)/)

    const parseList = (text: string) => {
      return (
        text
          ?.split("\n")
          .filter((line) => line.trim().startsWith("-"))
          .map((line) => line.replace(/^-\s*/, "").trim())
          .filter(Boolean) || []
      )
    }

    return {
      overall_score: overallScore,
      strengths: parseList(strengthsMatch?.[1] || ""),
      improvements: parseList(improvementsMatch?.[1] || ""),
      detailed_analysis: {
        content: contentMatch?.[1]?.trim() || "",
        structure: structureMatch?.[1]?.trim() || "",
        language: languageMatch?.[1]?.trim() || "",
        critical_analysis: criticalMatch?.[1]?.trim() || "",
      },
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/essay-practice">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Essay Practice
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-black mb-2">Essay Feedback</h1>
          <p className="text-gray-600 text-lg">{essay.topic}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Score Card */}
          <Card className="lg:col-span-1">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Overall Score</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-6xl font-bold text-black mb-2">{feedback.overall_score || 0}</div>
              <div className="text-gray-500 mb-4">out of 100</div>
              <Badge
                variant={
                  feedback.overall_score >= 80 ? "default" : feedback.overall_score >= 60 ? "secondary" : "destructive"
                }
                className="text-sm px-3 py-1"
              >
                {feedback.overall_score >= 80
                  ? "Excellent"
                  : feedback.overall_score >= 60
                    ? "Good"
                    : "Needs Improvement"}
              </Badge>
            </CardContent>
          </Card>

          {/* Topic and Essay */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Your Submission</CardTitle>
              <CardDescription>Submitted on {new Date(essay.created_at).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-black mb-2">Topic:</h3>
                <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{essay.topic}</p>
              </div>
              <div>
                <h3 className="font-semibold text-black mb-2">Your Essay:</h3>
                <div className="text-gray-600 bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
                  {essay.essay_text.split("\n").map((paragraph: string, index: number) => (
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
                <h4 className="font-medium text-black mb-1">Structure & Organization</h4>
                <p className="text-sm text-gray-600">{feedback?.detailed_analysis?.structure}</p>
              </div>
              <div>
                <h4 className="font-medium text-black mb-1">Language & Expression</h4>
                <p className="text-sm text-gray-600">{feedback?.detailed_analysis?.language}</p>
              </div>
              <div>
                <h4 className="font-medium text-black mb-1">Critical Analysis</h4>
                <p className="text-sm text-gray-600">{feedback?.detailed_analysis?.critical_analysis}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Link href="/essay-practice">
            <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3">Practice More Essays</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
