import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get MCQ attempts with question details
    const { data: attempts, error: attemptsError } = await supabase
      .from("user_mcq_attempts")
      .select(`
        *,
        mcq_questions (
          question,
          correct_answer,
          explanation,
          subjects (
            name
          )
        )
      `)
      .eq("user_id", userData.user.id)
      .order("attempted_at", { ascending: false })

    if (attemptsError) throw attemptsError

    // Calculate statistics
    const totalAttempts = attempts?.length || 0
    const correctAttempts = attempts?.filter((a) => a.is_correct).length || 0
    const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0

    // Get subject-wise statistics
    const subjectStats = attempts?.reduce((acc: any, attempt: any) => {
      const subjectName = attempt.mcq_questions?.subjects?.name || "General"
      if (!acc[subjectName]) {
        acc[subjectName] = { total: 0, correct: 0 }
      }
      acc[subjectName].total += 1
      if (attempt.is_correct) acc[subjectName].correct += 1
      return acc
    }, {})

    const subjectData = Object.entries(subjectStats || {}).map(([name, data]: [string, any]) => ({
      subject: name,
      total: data.total,
      correct: data.correct,
      accuracy: Math.round((data.correct / data.total) * 100),
    }))

    // Get recent performance (last 10 attempts)
    const recentAttempts = attempts?.slice(0, 10) || []
    const recentCorrect = recentAttempts.filter((a) => a.is_correct).length
    const recentAccuracy = recentAttempts.length > 0 ? Math.round((recentCorrect / recentAttempts.length) * 100) : 0

    return NextResponse.json({
      totalAttempts,
      correctAttempts,
      accuracy,
      recentAccuracy,
      subjectData,
      attempts: attempts || [],
    })
  } catch (error) {
    console.error("[v0] MCQ stats error:", error)
    return NextResponse.json({ error: "Failed to fetch MCQ statistics" }, { status: 500 })
  }
}
