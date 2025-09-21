"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle, ArrowLeft, RotateCcw } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Question {
  id: string
  question: string
  options: string[]
  correct_answer: string
  explanation: string
  source_content: string
  subjects: {
    name: string
  } | null
}

interface Attempt {
  id: string
  selected_answer: string
  is_correct: boolean
  attempted_at: string
}

interface MCQQuestionPracticeProps {
  question: Question
  existingAttempt: Attempt | null
}

export default function MCQQuestionPractice({ question, existingAttempt }: MCQQuestionPracticeProps) {
  const [selectedAnswer, setSelectedAnswer] = useState(existingAttempt?.selected_answer || "")
  const [showResult, setShowResult] = useState(!!existingAttempt)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async () => {
    if (!selectedAnswer) {
      setError("Please select an answer")
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

      const isCorrect = selectedAnswer === question.correct_answer

      // Save the attempt
      const { error: insertError } = await supabase.from("user_mcq_attempts").insert({
        user_id: user.user.id,
        mcq_question_id: question.id,
        selected_answer: selectedAnswer,
        is_correct: isCorrect,
      })

      if (insertError) throw insertError

      setShowResult(true)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRetry = () => {
    setSelectedAnswer("")
    setShowResult(false)
    setError(null)
  }

  const isCorrect = selectedAnswer === question.correct_answer

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/mcq/practice">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Practice
          </Button>
        </Link>
      </div>

      <Card className="shadow-xl border-0">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline">{question.subjects?.name || "General"}</Badge>
            {showResult && (
              <Badge variant={isCorrect ? "default" : "destructive"} className="flex items-center gap-1">
                {isCorrect ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                {isCorrect ? "Correct" : "Incorrect"}
              </Badge>
            )}
          </div>
          <CardTitle className="text-2xl text-slate-800">{question.question}</CardTitle>
          {question.source_content && (
            <CardDescription className="mt-4 p-3 bg-slate-50 rounded-lg">
              <strong>Source Context:</strong> {question.source_content}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Options */}
            <div className="space-y-3">
              <Label className="text-lg font-medium text-slate-800">Choose your answer:</Label>
              <RadioGroup
                value={selectedAnswer}
                onValueChange={setSelectedAnswer}
                disabled={showResult}
                className="space-y-3"
              >
                {question.options.map((option, index) => {
                  const optionLetter = String.fromCharCode(65 + index) // A, B, C, D
                  const isSelected = selectedAnswer === option
                  const isCorrectOption = option === question.correct_answer

                  return (
                    <div
                      key={index}
                      className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors ${
                        showResult
                          ? isCorrectOption
                            ? "bg-green-50 border-green-200"
                            : isSelected && !isCorrectOption
                              ? "bg-red-50 border-red-200"
                              : "bg-slate-50 border-slate-200"
                          : isSelected
                            ? "bg-indigo-50 border-indigo-200"
                            : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        <span className="font-medium text-slate-700 mr-2">{optionLetter}.</span>
                        {option}
                      </Label>
                      {showResult && isCorrectOption && <CheckCircle className="w-5 h-5 text-green-600" />}
                      {showResult && isSelected && !isCorrectOption && <XCircle className="w-5 h-5 text-red-600" />}
                    </div>
                  )
                })}
              </RadioGroup>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">{error}</div>
            )}

            {/* Explanation */}
            {showResult && question.explanation && (
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-800">Explanation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-700">{question.explanation}</p>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              {!showResult ? (
                <Button
                  onClick={handleSubmit}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                  disabled={isSubmitting || !selectedAnswer}
                >
                  {isSubmitting ? "Submitting..." : "Submit Answer"}
                </Button>
              ) : (
                <>
                  <Button onClick={handleRetry} variant="outline" className="flex items-center gap-2 bg-transparent">
                    <RotateCcw className="w-4 h-4" />
                    Try Again
                  </Button>
                  <Link href="/mcq/practice" className="flex-1">
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Continue Practice</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
