"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"

interface Subject {
  id: string
  name: string
}

interface AnswerHistoryFiltersProps {
  subjects: Subject[]
  currentFilters: {
    subject?: string
    month?: string
    year?: string
  }
}

export default function AnswerHistoryFilters({ subjects, currentFilters }: AnswerHistoryFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedSubject, setSelectedSubject] = useState(currentFilters.subject || "all")
  const [selectedMonth, setSelectedMonth] = useState(currentFilters.month || "all")
  const [selectedYear, setSelectedYear] = useState(currentFilters.year || "all")

  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ]

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i)

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (selectedSubject !== "all") params.set("subject", selectedSubject)
    if (selectedMonth !== "all") params.set("month", selectedMonth)
    if (selectedYear !== "all") params.set("year", selectedYear)

    router.push(`/profile?${params.toString()}`)
  }

  const clearFilters = () => {
    setSelectedSubject("all")
    setSelectedMonth("all")
    setSelectedYear("all")
    router.push("/profile")
  }

  const hasActiveFilters = selectedSubject !== "all" || selectedMonth !== "all" || selectedYear !== "all"

  return (
    <div className="mb-6 p-4 bg-slate-50 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">Subject</label>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger>
              <SelectValue placeholder="All subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All subjects</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">Year</label>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger>
              <SelectValue placeholder="All years" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All years</SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">Month</label>
          <Select value={selectedMonth} onValueChange={setSelectedMonth} disabled={selectedYear === "all"}>
            <SelectTrigger>
              <SelectValue placeholder="All months" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All months</SelectItem>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end gap-2">
          <Button onClick={applyFilters} className="bg-indigo-600 hover:bg-indigo-700">
            Apply Filters
          </Button>
          {hasActiveFilters && (
            <Button onClick={clearFilters} variant="outline" size="icon">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedSubject !== "all" && (
            <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
              Subject: {subjects.find((s) => s.id === selectedSubject)?.name}
            </div>
          )}
          {selectedYear !== "all" && (
            <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">Year: {selectedYear}</div>
          )}
          {selectedMonth !== "all" && (
            <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
              Month: {months.find((m) => m.value === selectedMonth)?.label}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
