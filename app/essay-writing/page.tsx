"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Clock, PenTool, Upload, Loader2, CheckCircle, Bell } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface FreeQuestion {
  id: string
  question: string
  difficulty_level: "Easy" | "Medium" | "Hard"
  word_limit: number
  time_limit: number
}

const DEMO_QUESTIONS: FreeQuestion[] = [
  {
    id: "demo-1",
    question:
      "Discuss the role of technology in transforming India's agricultural sector. What are the challenges in implementing digital agriculture?",
    difficulty_level: "Medium",
    word_limit: 250,
    time_limit: 20,
  },
  {
    id: "demo-2",
    question:
      "Analyze the impact of climate change on India's coastal regions. Suggest measures to build climate resilience in these areas.",
    difficulty_level: "Hard",
    word_limit: 300,
    time_limit: 25,
  },
  {
    id: "demo-3",
    question:
      "What is the significance of the National Education Policy 2020 in shaping India's future? Discuss its key features and implementation challenges.",
    difficulty_level: "Easy",
    word_limit: 200,
    time_limit: 15,
  },
]

export default function EssayWritingPage() {
  const [freeQuestions, setFreeQuestions] = useState<FreeQuestion[]>([])
  const [selectedQuestion, setSelectedQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [uploadedContent, setUploadedContent] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchFreeQuestions()
  }, [])

  const fetchFreeQuestions = async () => {
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
        .select("*")
        .eq("is_active", true)
        .order("published_date", { ascending: false })
        .limit(3)

      if (error) {
        console.error("Error fetching questions:", error)
        setFreeQuestions(DEMO_QUESTIONS)
        return
      }

      const formattedQuestions =
        questions?.map((q) => ({
          id: q.id,
          question: q.question,
          difficulty_level: q.difficulty_level as "Easy" | "Medium" | "Hard",
          word_limit: q.word_limit,
          time_limit: q.time_limit,
        })) || []

      setFreeQuestions(formattedQuestions.length > 0 ? formattedQuestions : DEMO_QUESTIONS)
    } catch (error) {
      console.error("Error:", error)
      setFreeQuestions(DEMO_QUESTIONS)
    } finally {
      setLoading(false)
    }
  }

  const handleQuestionClick = (question: string) => {
    setSelectedQuestion(question)
    setError(null)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setUploadedContent(null)
    }
  }

  const handleFileUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Upload failed")
      }

      setUploadedContent(result.extractedText || "File uploaded successfully")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Upload failed")
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedQuestion.trim() || !answer.trim()) {
      setError("Please select a question and write your answer")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("User not authenticated")
      }

      const response = await fetch("/api/generate-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: selectedQuestion,
          answer: answer.trim(),
          attachedFile: uploadedContent,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit answer")
      }

      // Reset form
      setSelectedQuestion("")
      setAnswer("")
      setFile(null)
      setUploadedContent(null)

      alert("Answer submitted successfully! Check your profile for feedback.")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
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
          <p className="text-gray-600">Loading questions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2"> Daily Free Answer-Writing Questions</h1>
          <p className="text-gray-600 text-lg">Practice with free questions and improve your answer writing skills</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-2xl text-slate-800 flex items-center gap-2">
                <PenTool className="w-6 h-6 text-indigo-600" />
                Write Your Answer
              </CardTitle>
              <CardDescription>
                Select a free question below or write your own question to practice answer writing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-700 font-medium">Free Practice Questions (Click to select)</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 bg-transparent"
                      onClick={() => router.push("/pricing")}
                    >
                      <Bell className="w-4 h-4" />
                      Subscribe for Daily Questions
                    </Button>
                  </div>

                  <div className="grid gap-3">
                    {freeQuestions.map((q, index) => (
                      <Card
                        key={q.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedQuestion === q.question ? "ring-2 ring-indigo-500 bg-indigo-50" : "hover:bg-slate-50"
                        }`}
                        onClick={() => handleQuestionClick(q.question)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-semibold text-indigo-600">Question {index + 1}</span>
                                <Badge className={getDifficultyColor(q.difficulty_level)}>{q.difficulty_level}</Badge>
                              </div>
                              <p className="text-sm text-slate-700">{q.question}</p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                                <span className="flex items-center gap-1">
                                  <PenTool className="w-3 h-3" />
                                  {q.word_limit} words
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {q.time_limit} minutes
                                </span>
                              </div>
                            </div>
                            {selectedQuestion === q.question && (
                              <CheckCircle className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                            )}
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="question" className="text-slate-700 font-medium">
                    Question
                  </Label>
                  <Textarea
                    id="question"
                    placeholder="Click a free question above or write your own question here..."
                    value={selectedQuestion}
                    onChange={(e) => setSelectedQuestion(e.target.value)}
                    className="min-h-[100px] resize-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="answer" className="text-slate-700 font-medium">
                    Your Answer
                  </Label>
                  <Textarea
                    id="answer"
                    placeholder="Write your answer here..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="min-h-[300px] resize-none"
                    required
                  />
                  <div className="text-sm text-slate-500">Word count: {wordCount}</div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file" className="text-slate-700 font-medium">
                    Attach Supporting Document (Optional)
                  </Label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <Input
                        id="file"
                        type="file"
                        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                      />
                      {file && !uploadedContent && (
                        <Button
                          type="button"
                          onClick={handleFileUpload}
                          disabled={isUploading}
                          size="sm"
                          className="bg-indigo-600 hover:bg-indigo-700"
                        >
                          {isUploading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 mr-2" />
                              Process File
                            </>
                          )}
                        </Button>
                      )}
                    </div>

                    {file && uploadedContent && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                        <p className="text-sm text-green-800 mb-2 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          File processed successfully!
                        </p>
                        <p className="text-xs text-green-700">Preview: {uploadedContent.substring(0, 200)}...</p>
                      </div>
                    )}

                    <p className="text-xs text-slate-500">
                      Upload reference materials, diagrams, or additional context (Max 10MB)
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">{error}</div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting Answer...
                    </>
                  ) : (
                    <>
                      <PenTool className="w-4 h-4 mr-2" />
                      Submit Answer for Review
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
