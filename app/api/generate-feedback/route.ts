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

    const { question, answer, subject } = await request.json()

    if (!question || !answer) {
      return NextResponse.json({ error: "Question and answer are required" }, { status: 400 })
    }

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

    // Simulate AI feedback generation
    // In a real implementation, this would call an AI service like OpenAI, Anthropic, or Google AI
    const wordCount = answer.trim().split(/\s+/).length
    const hasStructure = answer.includes("\n") || answer.length > 500
    const hasExamples = answer.toLowerCase().includes("example") || answer.toLowerCase().includes("for instance")

    // Generate dynamic score based on content analysis
    let baseScore = 60
    if (wordCount > 200) baseScore += 10
    if (wordCount > 400) baseScore += 5
    if (hasStructure) baseScore += 10
    if (hasExamples) baseScore += 10
    if (answer.toLowerCase().includes("conclusion")) baseScore += 5

    // Add some randomness
    const finalScore = Math.min(100, Math.max(40, baseScore + Math.floor(Math.random() * 20) - 10))

    const feedback = {
      overall_score: finalScore,
      strengths: [
        wordCount > 300 ? "Comprehensive coverage of the topic" : "Good attempt at addressing the question",
        hasStructure ? "Well-organized structure with clear paragraphs" : "Clear writing style",
        hasExamples ? "Good use of relevant examples" : "Demonstrates understanding of key concepts",
        answer.toLowerCase().includes("current")
          ? "Incorporates current affairs and recent developments"
          : "Shows awareness of the topic",
      ].slice(0, 3),
      improvements: [
        wordCount < 200
          ? "Consider expanding your answer with more detailed explanations"
          : "Could include more diverse perspectives",
        !hasExamples
          ? "Add more concrete examples to support your arguments"
          : "Consider including statistical data where relevant",
        !answer.toLowerCase().includes("conclusion")
          ? "Include a stronger concluding statement"
          : "Could improve the flow between paragraphs",
        "Consider adding more recent case studies or current events",
      ].slice(0, 3),
      detailed_analysis: {
        content:
          finalScore >= 80
            ? "Excellent grasp of the subject matter with comprehensive coverage of key points."
            : finalScore >= 60
              ? "Good understanding demonstrated with room for more depth in analysis."
              : "Basic understanding shown but needs more detailed exploration of the topic.",
        presentation: hasStructure
          ? "Well-structured answer with logical flow and clear organization."
          : "Could benefit from better paragraph structure and logical sequencing.",
        relevance: answer.toLowerCase().includes(question.toLowerCase().split(" ")[0])
          ? "Stays focused on the question and addresses the core requirements."
          : "Generally relevant but could be more directly focused on the specific question asked.",
      },
      suggestions: [
        "Practice writing within time constraints to improve efficiency",
        "Read more current affairs to incorporate recent developments",
        "Study model answers to understand expected depth and structure",
        "Focus on creating stronger introductions and conclusions",
      ].slice(0, 2),
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
