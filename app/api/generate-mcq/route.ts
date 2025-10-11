import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { deductCredits } from "@/lib/credits-server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { content, numQuestions, difficulty, subject, language } = await request.json()

    if (!content || !numQuestions) {
      return NextResponse.json(
        { error: "Content and number of questions are required" },
        { status: 400 },
      )
    }

    const totalCost = Number.parseInt(numQuestions)
    const creditResult = await deductCredits({
      operation_type: "quiz_generation",
      user_id: user.id,
      cost: totalCost,
    })

    if (!creditResult.success) {
      return NextResponse.json(
        {
          error: creditResult.error || "Failed to process payment",
          insufficient_credits: creditResult.error === "Insufficient credits",
        },
        { status: 402 },
      )
    }

    // Call external MCQ generation API (your Python backend)
    const response = await fetch(process.env.AI_BASE_URL + "/generate-mcq-questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        content,
        num_questions: numQuestions,
        difficulty,
        subject,
        language: language || "english",
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`External API failed: ${errorText}`)
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      questions: data.questions,
      remaining_credits: creditResult.remaining_credits,
    })
  } catch (error) {
    console.error("MCQ generation error:", error)
    return NextResponse.json({ error: "Failed to generate questions" }, { status: 500 })
  }
}
