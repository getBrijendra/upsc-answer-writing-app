import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { deductCredits } from "@/lib/credits-server"
import { calculateCreditCost } from "@/lib/modelPricing"

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
    const { question, answer, subject, language = "english", file_urls } = await request.json()
    // console.log("Received question:", question)
    // console.log("Received answer:", answer)
    // console.log("Received subject:", subject)
    // console.log("Received file_urls:", file_urls)

    if (!question || !answer) {
      return NextResponse.json({ error: "Question and answer are required" }, { status: 400 })
    }
    // --- Send request to FastAPI microservice ---
    const model_name = "deepseek-chat"
    const payload = {
      question,
      answer,
      subject,
      language,
      file_urls,
      model_name,
    }
    
    const response = await fetch(process.env.AI_BASE_URL + "/generate-feedback", {
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
    const dynamicCost = calculateCreditCost({
      model: model_name,
      prompt_tokens: feedback.prompt_tokens,
      completion_tokens: feedback.completion_tokens,
    })

    console.log("Calculated dynamic cost:", dynamicCost)

    // --- Deduct credits ---
    const creditResult = await deductCredits({
      operation_type: "answer_review",
      user_id: user.id,
      cost: dynamicCost,
    })

    console.log("Credit deduction result:", creditResult)
    if (!creditResult.success) {
      return NextResponse.json(
        {
          error: creditResult.error || "Failed to process payment",
          insufficient_credits: creditResult.error === "Insufficient credits",
        },
        { status: 402 },
      )
    }
    
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
