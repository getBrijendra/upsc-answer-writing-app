"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface SubjectData {
  subject: string
  average: number
  count: number
  highest: number
  lowest: number
}

interface SubjectProgressChartProps {
  subjectData: SubjectData[]
}

export default function SubjectProgressChart({ subjectData }: SubjectProgressChartProps) {
  if (!subjectData || subjectData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500">
        <p>No subject data available yet.</p>
      </div>
    )
  }

  // Truncate long subject names for display
  const chartData = subjectData.map((item) => ({
    ...item,
    displayName: item.subject.length > 20 ? `${item.subject.substring(0, 20)}...` : item.subject,
  }))

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="displayName"
            stroke="#64748b"
            fontSize={10}
            angle={-45}
            textAnchor="end"
            height={80}
            interval={0}
          />
          <YAxis domain={[0, 100]} stroke="#64748b" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            formatter={(value: any, name: string) => {
              if (name === "average") return [`${value}/100`, "Average Score"]
              if (name === "count") return [value, "Total Answers"]
              if (name === "highest") return [`${value}/100`, "Highest Score"]
              if (name === "lowest") return [`${value}/100`, "Lowest Score"]
              return [value, name]
            }}
            labelFormatter={(label) => {
              const item = chartData.find((d) => d.displayName === label)
              return item?.subject || label
            }}
          />
          <Bar dataKey="average" fill="#4f46e5" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
