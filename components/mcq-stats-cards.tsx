"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Target, TrendingUp, Award } from "lucide-react"

interface MCQStatsCardsProps {
  totalAttempts: number
  accuracy: number
  recentAccuracy: number
  subjectData: Array<{
    subject: string
    total: number
    correct: number
    accuracy: number
  }>
}

export default function MCQStatsCards({ totalAttempts, accuracy, recentAccuracy, subjectData }: MCQStatsCardsProps) {
  const bestSubject =
    subjectData.length > 0
      ? subjectData.reduce((best, current) => (current.accuracy > best.accuracy ? current : best))
      : null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-white border border-gray-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-black">Total Attempts</CardTitle>
            <Brain className="w-5 h-5 text-black" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-black">{totalAttempts}</div>
          <p className="text-sm text-gray-600">MCQ questions attempted</p>
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-black">Overall Accuracy</CardTitle>
            <Target className="w-5 h-5 text-green-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-black">{accuracy}%</div>
          <p className="text-sm text-gray-600">Correct answers</p>
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-black">Recent Performance</CardTitle>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-black">{recentAccuracy}%</div>
          <p className="text-sm text-gray-600">Last 10 attempts</p>
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-black">Best Subject</CardTitle>
            <Award className="w-5 h-5 text-yellow-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-black">{bestSubject?.accuracy || 0}%</div>
          <p className="text-sm text-gray-600">{bestSubject?.subject || "N/A"}</p>
        </CardContent>
      </Card>
    </div>
  )
}
