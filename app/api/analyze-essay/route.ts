import { generateText } from "ai"
import { createClient } from "@/lib/supabase/server"
import { deductCredits } from "@/lib/credits-server"

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { topic, essay } = await req.json()

    if (!topic?.trim() || !essay?.trim()) {
      return Response.json({ error: "Topic and essay are required" }, { status: 400 })
    }

    const creditResult = await deductCredits({
      operation_type: "essay_review",
      user_id: user.id,
    })

    if (!creditResult.success) {
      return Response.json(
        {
          error: creditResult.error || "Failed to process payment",
          insufficient_credits: creditResult.error === "Insufficient credits",
        },
        { status: 402 },
      )
    }

    const { text } = await generateText({
      model: "openai/gpt-5",
      prompt: `You are an expert UPSC essay evaluator. Analyze the following essay and provide detailed feedback.

Topic: ${topic}

Essay:
${essay}

Provide comprehensive feedback covering:
1. Content Quality (relevance, depth, arguments)
2. Structure and Organization
3. Language and Expression
4. Critical Analysis
5. Suggestions for Improvement
6. Overall Score (out of 10)

Be constructive and specific in your feedback.`,
      maxOutputTokens: 2000,
    })

    // Store the analysis in the database
    const { error: insertError } = await supabase.from("essay_analyses").insert({
      user_id: user.id,
      topic,
      essay,
      analysis: text,
    })

    if (insertError) {
      console.error("Error storing analysis:", insertError)
    }

    return Response.json({
      analysis: text,
      remaining_credits: creditResult.remaining_credits,
    })
  } catch (error) {
    console.error("Error analyzing essay:", error)
    return Response.json({ error: "Failed to analyze essay" }, { status: 500 })
  }
}
