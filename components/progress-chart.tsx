"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface Answer {
  id: string
  score: number | null
  created_at: string
  subjects: {
    name: string
  } | null
}

interface ProgressChartProps {
  answers: Answer[]
}

export default function ProgressChart({ answers }: ProgressChartProps) {
  if (!answers || answers.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500">
        <p>No data available. Submit some answers to see your progress!</p>
      </div>
    )
  }

  // Group answers by week and calculate average
  const weeklyData = answers.reduce((acc: any, answer) => {
    const date = new Date(answer.created_at)
    const weekStart = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay())
    const weekKey = weekStart.toISOString().split("T")[0]

    if (!acc[weekKey]) {
      acc[weekKey] = { scores: [], date: weekStart }
    }
    if (answer.score) {
      acc[weekKey].scores.push(answer.score)
    }
    return acc
  }, {})

  const chartData = Object.entries(weeklyData)
    .map(([key, data]: [string, any]) => ({
      week: new Date(key).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      score: Math.round(data.scores.reduce((sum: number, score: number) => sum + score, 0) / data.scores.length),
      count: data.scores.length,
    }))
    .sort((a, b) => new Date(a.week).getTime() - new Date(b.week).getTime())
    .slice(-12) // Show last 12 weeks

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="week" stroke="#64748b" fontSize={12} />
          <YAxis domain={[0, 100]} stroke="#64748b" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            formatter={(value: any, name: string) => [`${value}/100`, name === "score" ? "Average Score" : name]}
            labelFormatter={(label) => `Week of ${label}`}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#4f46e5"
            strokeWidth={3}
            dot={{ fill: "#4f46e5", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "#4f46e5", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
