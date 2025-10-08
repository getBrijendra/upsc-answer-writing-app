"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Send, Loader2, FileText, CheckCircle, Coins, AlertTriangle, Brain } from "lucide-react"
import { useRouter } from "next/navigation"
import { getUserCredits } from "@/lib/credits"

interface AnswerWritingFormProps {
  subjects: Array<{ id: string; name: string; description?: string; category?: string }>
}

export default function AnswerWritingForm({ subjects }: AnswerWritingFormProps) {
  const [selectedSubject, setSelectedSubject] = useState("")
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userCredits, setUserCredits] = useState<number>(0)
  const [creditCost, setCreditCost] = useState<number>(5)
  const [loadingCredits, setLoadingCredits] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchCreditsInfo = async () => {
      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          const { credits } = await getUserCredits(user.id)
          setUserCredits(credits)

          const { data: costData } = await supabase
            .from("credit_costs")
            .select("cost")
            .eq("operation_type", "answer_review")
            .single()

          if (costData) {
            setCreditCost(costData.cost)
          }
        }
      } catch (error) {
        console.error("Error fetching credits info:", error)
      } finally {
        setLoadingCredits(false)
      }
    }

    fetchCreditsInfo()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setUploadedFileUrl(null) // Reset uploaded file URL
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

      setUploadedFileUrl(result.fileUrl)

      if (result.extractedText) {
        const shouldAppend = confirm("Would you like to append the extracted text from your file to your answer?")
        if (shouldAppend) {
          setAnswer((prev) => prev + (prev ? "\n\n" : "") + "Extracted from uploaded file:\n" + result.extractedText)
        }
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Upload failed")
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedSubject) {
      setError("Please select a subject")
      return
    }

    if (!question.trim() || !answer.trim()) {
      setError("Please provide both question and answer")
      return
    }

    if (userCredits < creditCost) {
      setError(
        `Insufficient credits. You need ${creditCost} credits for AI feedback, but you only have ${userCredits} credits.`,
      )
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: user } = await supabase.auth.getUser()

      if (!user.user) {
        throw new Error("User not authenticated")
      }

      const selectedSubjectData = subjects.find((s) => s.id === selectedSubject)
      const subjectName = selectedSubjectData?.name || "General"

      const { data: insertedAnswer, error: insertError } = await supabase
        .from("answers")
        .insert({
          user_id: user.user.id,
          subject_id: selectedSubject,
          question: question.trim(),
          answer_text: answer.trim(),
          file_url: uploadedFileUrl,
        })
        .select()
        .single()

      if (insertError) throw insertError

      const feedbackResponse = await fetch("/api/generate-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.trim(),
          answer: answer.trim(),
          subject: subjectName,
        }),
      })

      const feedbackResult = await feedbackResponse.json()

      if (!feedbackResponse.ok) {
        if (feedbackResult.insufficient_credits) {
          setError(`Insufficient credits. You need ${creditCost} credits for AI feedback.`)
          return
        }
        throw new Error(feedbackResult.error || "Failed to generate feedback")
      }

      await supabase
        .from("answers")
        .update({
          feedback: feedbackResult.feedback,
          score: feedbackResult.feedback.overall_score,
        })
        .eq("id", insertedAnswer.id)

      if (feedbackResult.remaining_credits !== undefined) {
        setUserCredits(feedbackResult.remaining_credits)
      }

      router.push(`/answer/${insertedAnswer.id}`)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const mainsSubjects = subjects.filter((s) => s.category === "MAINS")
  const optionalSubjects = subjects.filter((s) => s.category === "OPTIONAL")

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-xl border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-slate-800 flex items-center gap-2">
                <Brain className="w-6 h-6 text-indigo-600" />
                Submit Your Answer for AI Analysis
              </CardTitle>
              <CardDescription>Write your answer and receive detailed AI-powered feedback</CardDescription>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
              <Coins className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">{loadingCredits ? "..." : userCredits}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!loadingCredits && userCredits < creditCost && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-medium">Insufficient Credits</span>
              </div>
              <p className="text-red-700 mt-1">
                You need {creditCost} credits for AI feedback, but you only have {userCredits} credits. Please purchase
                more credits from the pricing page.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-slate-700 font-medium">
                Subject
              </Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {mainsSubjects.length > 0 && (
                    <>
                      <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase">Mains</div>
                      {mainsSubjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </>
                  )}
                  {optionalSubjects.length > 0 && (
                    <>
                      <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase mt-2">
                        Your Optional Subject
                      </div>
                      {optionalSubjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="question" className="text-slate-700 font-medium">
                Question
              </Label>
              <Textarea
                id="question"
                placeholder="Enter the UPSC question you're answering..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
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
                placeholder="Write your detailed answer here..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="min-h-[300px] resize-none"
                required
              />
              <div className="text-sm text-slate-500">
                Word count:{" "}
                {
                  answer
                    .trim()
                    .split(/\s+/)
                    .filter((word) => word.length > 0).length
                }
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="file" className="text-slate-700 font-medium">
                Upload Supporting File (Optional)
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
                  {file && !uploadedFileUrl && (
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
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload
                        </>
                      )}
                    </Button>
                  )}
                </div>

                {file && (
                  <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded">
                    <FileText className="w-4 h-4" />
                    {file.name}
                    {uploadedFileUrl && (
                      <div className="flex items-center gap-1 text-green-600 ml-auto">
                        <CheckCircle className="w-4 h-4" />
                        Uploaded
                      </div>
                    )}
                  </div>
                )}

                <p className="text-xs text-slate-500">
                  Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG (Max 10MB)
                  <br />
                  Files will be processed to extract text content for better feedback analysis.
                </p>
              </div>
            </div>

            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">{error}</div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
              disabled={isSubmitting || userCredits < creditCost || !selectedSubject}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating AI Feedback...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Answer for AI Analysis ({creditCost} credits)
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
