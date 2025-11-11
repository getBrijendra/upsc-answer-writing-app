"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Copy } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { it } from "node:test"

interface FreeQuestion {
  id: string
  question: string
  difficulty_level: "Easy" | "Medium" | "Hard"
  source: string
}

export default function EssayWritingPage() {
  const [questions, setQuestions] = useState<FreeQuestion[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

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

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true)
      const supabase = createClient()
      const today = new Date().toISOString().split("T")[0]

      // Check if today's questions already exist
      const { data: existing, error: existingError } = await supabase
        .from("daily_questions")
        .select("question_id, question, difficulty_level, source")
        .eq("question_date", today)

      if (existingError) {
        console.error("Error fetching Supabase data:", existingError)
        setLoading(false)
        return
      }

      if (existing && existing.length > 0) {
        // Already have today's questions
        setQuestions(
          existing.map((item) => ({
            id: item.question_id,
            question: item.question,
            difficulty_level: item.difficulty_level as FreeQuestion["difficulty_level"],
            source: item.source as string || "Not Provided",
          })),
        )
        setLoading(false)
        return
      }

      // Fetch new questions from API
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate-daily-questions`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
      })

      const data = await res.json()

      if (data?.questions?.length > 0) {
        const formattedQuestions: FreeQuestion[] = data.questions.map((q: any) => ({
          id: q.id ?? q.question_id ?? crypto.randomUUID(),
          question: q.question,
          difficulty_level: q.difficulty_level as FreeQuestion["difficulty_level"],
          source: q.source || "Not Provided",
        }))

        setQuestions(formattedQuestions)

        // Save to Supabase
        const toInsert = formattedQuestions.map((q: FreeQuestion) => ({
          question_id: q.id,
          question: q.question,
          difficulty_level: q.difficulty_level,
          question_date: today,
          source: q.source,
        }))

        const { error: insertError } = await supabase
          .from("daily_questions")
          .upsert(toInsert, { onConflict: "question_id, question_date" })


        if (insertError) {
          console.error("Error saving to Supabase:", insertError)
        }
      }

      setLoading(false)
    }

    fetchQuestions()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-black mb-4">Daily Civil Service Examination Practice Questions</h1>
        <p className="text-gray-600 mb-8">
          New questions are generated every day at first access. Click the copy button to copy a question for your answer writing practice.
        </p>

        {loading ? (
          <p className="text-gray-500 text-center">Loading questions...</p>
        ) : (
          <div className="grid gap-4 max-w-3xl mx-auto">
            {questions.map((q) => (
              <Card key={q.id} className="shadow-md border border-gray-200">
                <CardHeader className="flex flex-row justify-between items-start gap-3">
                  <div className="flex flex-col gap-2">
                    <CardTitle className="text-base text-slate-800">{q.question}</CardTitle>

                    <Badge className={getDifficultyColor(q.difficulty_level)}>
                      {q.difficulty_level}
                    </Badge>

                    {/* {q.source && (
                      <a
                        href={q.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-indigo-600 hover:underline"
                      >
                        Source: {new URL(q.source).hostname || q.source}
                      </a>
                    )} */}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => handleCopy(q.id, q.question)}
                  >
                    {copiedId === q.id ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </CardHeader>
              </Card>

            ))}
          </div>
        )}
      </div>
    </div>
  )
}
