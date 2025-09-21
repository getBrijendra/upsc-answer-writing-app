"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, FileText, PenTool, CheckCircle, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface DailyQuestion {
  id: string
  question: string
  published_date: string
  difficulty_level: "Easy" | "Medium" | "Hard"
  subject_name: string
  word_limit: number
  time_limit: number
  is_completed: boolean
}

export default function EssayWritingPage() {
  const [dailyQuestions, setDailyQuestions] = useState<DailyQuestion[]>([])
  const [selectedQuestion, setSelectedQuestion] = useState<DailyQuestion | null>(null)
  const [answer, setAnswer] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchDailyQuestions()
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerActive && timeRemaining && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev && prev <= 1) {
            setIsTimerActive(false)
            return 0
          }
          return prev ? prev - 1 : 0
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerActive, timeRemaining])

  const fetchDailyQuestions = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const { data: questions, error } = await supabase
        .from("daily_questions")
        .select(`
          *,
          subjects(name)
        `)
        .eq("is_active", true)
        .order("published_date", { ascending: false })
        .limit(10)

      if (error) {
        console.error("Error fetching daily questions:", error)
        setDailyQuestions([])
        return
      }

      // Check which questions user has already attempted
      const { data: attempts } = await supabase
        .from("user_daily_attempts")
        .select("daily_question_id")
        .eq("user_id", user.id)

      const attemptedIds = new Set(attempts?.map((a) => a.daily_question_id) || [])

      const questionsWithCompletion =
        questions?.map((q) => ({
          id: q.id,
          question: q.question,
          published_date: q.published_date,
          difficulty_level: q.difficulty_level as "Easy" | "Medium" | "Hard",
          subject_name: q.subjects?.name || "General",
          word_limit: q.word_limit,
          time_limit: q.time_limit,
          is_completed: attemptedIds.has(q.id),
        })) || []

      setDailyQuestions(questionsWithCompletion)
    } catch (error) {
      console.error("Error:", error)
      setDailyQuestions([])
    } finally {
      setLoading(false)
    }
  }

  const startWriting = (question: DailyQuestion) => {
    setSelectedQuestion(question)
    setAnswer("")
    setTimeRemaining(question.time_limit * 60) // Convert minutes to seconds
    setIsTimerActive(true)
  }

  const submitAnswer = async () => {
    if (!selectedQuestion || !answer.trim()) return

    setIsSubmitting(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { error } = await supabase.from("user_daily_attempts").insert({
        user_id: user.id,
        daily_question_id: selectedQuestion.id,
        answer_text: answer,
        credits_used: 0, // Will be updated when AI review is requested
      })

      if (error) {
        console.error("Error submitting answer:", error)
        alert("Failed to submit answer")
        return
      }

      // Update question as completed
      setDailyQuestions((prev) => prev.map((q) => (q.id === selectedQuestion.id ? { ...q, is_completed: true } : q)))

      setSelectedQuestion(null)
      setAnswer("")
      setIsTimerActive(false)
      setTimeRemaining(null)
    } catch (error) {
      console.error("Error submitting answer:", error)
      alert("Failed to submit answer")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const wordCount = answer
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading daily questions...</p>
        </div>
      </div>
    )
  }

  if (selectedQuestion) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedQuestion(null)
                  setIsTimerActive(false)
                  setAnswer("")
                }}
                className="hover:bg-gray-100"
              >
                ← Back to Questions
              </Button>

              {timeRemaining !== null && (
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    timeRemaining < 300 ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span className="font-mono text-lg">{formatTime(timeRemaining)}</span>
                </div>
              )}
            </div>

            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{selectedQuestion.question}</CardTitle>
                  <Badge className={getDifficultyColor(selectedQuestion.difficulty_level)}>
                    {selectedQuestion.difficulty_level}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    {selectedQuestion.subject_name}
                  </span>
                  <span className="flex items-center gap-1">
                    <PenTool className="w-4 h-4" />
                    {selectedQuestion.word_limit} words
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {selectedQuestion.time_limit} minutes
                  </span>
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Your Answer</CardTitle>
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-sm ${
                        wordCount > selectedQuestion.word_limit
                          ? "text-red-600"
                          : wordCount > selectedQuestion.word_limit * 0.9
                            ? "text-yellow-600"
                            : "text-gray-600"
                      }`}
                    >
                      {wordCount} / {selectedQuestion.word_limit} words
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Start writing your answer here..."
                  className="min-h-[400px] text-base leading-relaxed resize-none"
                  disabled={timeRemaining === 0}
                />

                <div className="flex justify-end mt-4">
                  <Button
                    onClick={submitAnswer}
                    disabled={!answer.trim() || isSubmitting || timeRemaining === 0}
                    className="bg-black text-white hover:bg-gray-800"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Answer"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">Daily Essay Writing</h1>
            <p className="text-gray-600">
              Practice answer writing with daily questions. Build your writing skills and improve your UPSC preparation.
            </p>
          </div>

          <div className="grid gap-6">
            {dailyQuestions.map((question) => (
              <Card key={question.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-500">
                          {new Date(question.published_date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                        {question.is_completed && <CheckCircle className="w-4 h-4 text-green-600" />}
                      </div>
                      <CardTitle className="text-lg mb-2">{question.question}</CardTitle>
                      <CardDescription className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {question.subject_name}
                        </span>
                        <span className="flex items-center gap-1">
                          <PenTool className="w-4 h-4" />
                          {question.word_limit} words
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {question.time_limit} minutes
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getDifficultyColor(question.difficulty_level)}>
                        {question.difficulty_level}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-end">
                    {question.is_completed ? (
                      <Button variant="outline" disabled className="text-green-600 bg-transparent">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Completed
                      </Button>
                    ) : (
                      <Button onClick={() => startWriting(question)} className="bg-black text-white hover:bg-gray-800">
                        <PenTool className="w-4 h-4 mr-2" />
                        Start Writing
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {dailyQuestions.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No questions available</h3>
                <p className="text-gray-600">
                  Daily questions will appear here. Check back tomorrow for new practice questions.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
