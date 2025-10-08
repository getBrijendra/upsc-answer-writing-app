"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Calendar, Brain } from "lucide-react"

interface MCQAttempt {
  id: string
  selected_answer: string
  is_correct: boolean
  attempted_at: string
  mcq_questions: {
    question: string
    correct_answer: string
    explanation: string
    subjects: {
      name: string
    } | null
  }
}

interface MCQHistoryGridProps {
  attempts: MCQAttempt[]
}

export default function MCQHistoryGrid({ attempts }: MCQHistoryGridProps) {
  if (attempts.length === 0) {
    return (
      <div className="text-center py-12">
        <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No MCQ attempts yet</h3>
        <p className="text-gray-500">Start practicing MCQ questions to see your history here.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {attempts.slice(0, 12).map((attempt) => (
        <Card key={attempt.id} className="hover:shadow-lg transition-shadow bg-white border border-gray-200">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg line-clamp-2">
                  {attempt.mcq_questions?.subjects?.name || "General"}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(attempt.attempted_at).toLocaleDateString()}
                </CardDescription>
              </div>
              <Badge
                variant={attempt.is_correct ? "default" : "destructive"}
                className={`ml-2 ${attempt.is_correct ? "bg-green-600" : "bg-red-600"}`}
              >
                {attempt.is_correct ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                {attempt.is_correct ? "Correct" : "Incorrect"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-black text-sm mb-1">Question:</h4>
                <p className="text-sm text-gray-600 line-clamp-2">{attempt.mcq_questions?.question}</p>
              </div>
              <div>
                <h4 className="font-medium text-black text-sm mb-1">Your Answer:</h4>
                <p className="text-sm text-gray-600">{attempt.selected_answer}</p>
              </div>
              {!attempt.is_correct && (
                <div>
                  <h4 className="font-medium text-green-600 text-sm mb-1">Correct Answer:</h4>
                  <p className="text-sm text-gray-600">{attempt.mcq_questions?.correct_answer}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
