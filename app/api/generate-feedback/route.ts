import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { deductCredits } from "@/lib/credits-server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // --- Check authentication ---
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // --- Parse request body ---
    const { question, answer, subject, language = "english", file_url } = await request.json()
    // console.log("Received question:", question)
    // console.log("Received answer:", answer)
    // console.log("Received subject:", subject)
    // console.log("Received file_url:", file_url)

    if (!question || !answer) {
      return NextResponse.json({ error: "Question and answer are required" }, { status: 400 })
    }

    // --- Deduct credits ---
    const creditResult = await deductCredits({
      operation_type: "answer_review",
      user_id: user.id,
      cost: 6,
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

    // --- Send request to FastAPI microservice ---
    const payload = {
      question,
      answer,
      subject,
      language,
      file_url,
    }

    const response = await fetch(process.env.AI_BASE_URL + "/generate-mcq-questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("FastAPI feedback generation failed:", errorData)
      return NextResponse.json(
        { error: "Feedback generation failed in FastAPI service" },
        { status: 500 },
      )
    }

    const feedback = await response.json()

    // --- Return success response ---
    return NextResponse.json({
      success: true,
      feedback,
      remaining_credits: creditResult.remaining_credits,
    })
  } catch (error) {
    console.error("Feedback generation error:", error)
    return NextResponse.json({ error: "Failed to generate feedback" }, { status: 500 })
  }
}
