import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { deductCredits } from "@/lib/credits"

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

    const { content, numQuestions, difficulty, subject } = await request.json()

    if (!content || !numQuestions) {
      return NextResponse.json({ error: "Content and number of questions are required" }, { status: 400 })
    }

    const creditResult = await deductCredits({
      operation_type: "quiz_generation",
      user_id: user.id,
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

    // Simulate AI MCQ generation based on content
    // In a real implementation, this would use AI services to analyze content and generate relevant questions

    const questionTemplates = [
      {
        type: "factual",
        templates: [
          "What is the main concept discussed in the content?",
          "According to the text, which of the following is correct?",
          "The content primarily focuses on which aspect?",
          "What is the key principle mentioned in the material?",
        ],
      },
      {
        type: "analytical",
        templates: [
          "Which of the following best explains the relationship between the concepts?",
          "What can be inferred from the given information?",
          "The most significant implication of the discussed topic is:",
          "Which factor is most crucial according to the content?",
        ],
      },
      {
        type: "application",
        templates: [
          "In which scenario would this concept be most applicable?",
          "How would you apply this principle in a real-world situation?",
          "Which example best demonstrates the concept?",
          "What would be the most appropriate approach based on the content?",
        ],
      },
    ]

    const difficultyOptions = {
      easy: {
        distractors: ["Simple incorrect option", "Obviously wrong choice", "Clearly false statement"],
        complexity: "basic",
      },
      medium: {
        distractors: ["Partially correct but incomplete", "Related but not accurate", "Common misconception"],
        complexity: "moderate",
      },
      hard: {
        distractors: ["Subtly incorrect option", "Technically wrong but plausible", "Advanced misconception"],
        complexity: "complex",
      },
    }

    const selectedDifficulty =
      difficultyOptions[difficulty as keyof typeof difficultyOptions] || difficultyOptions.medium

    const questions = []
    const contentWords = content.split(" ").slice(0, 50).join(" ") // Use first 50 words for context

    for (let i = 0; i < Number.parseInt(numQuestions); i++) {
      const templateCategory = questionTemplates[i % questionTemplates.length]
      const questionTemplate = templateCategory.templates[i % templateCategory.templates.length]

      // Generate options based on content and difficulty
      const correctAnswer = `Correct answer based on: ${contentWords.substring(0, 100)}...`
      const options = [
        correctAnswer,
        ...selectedDifficulty.distractors.map((distractor, idx) => `${distractor} ${idx + 1} related to the content`),
      ].sort(() => Math.random() - 0.5) // Shuffle options

      questions.push({
        question: `${questionTemplate} (Based on provided content)`,
        options,
        correct_answer: correctAnswer,
        explanation: `This is correct because the content specifically mentions this concept. The other options are ${selectedDifficulty.complexity} distractors that test your understanding of the material.`,
        difficulty,
        source_content: contentWords,
      })
    }

    return NextResponse.json({
      success: true,
      questions,
      remaining_credits: creditResult.remaining_credits,
    })
  } catch (error) {
    console.error("MCQ generation error:", error)
    return NextResponse.json({ error: "Failed to generate questions" }, { status: 500 })
  }
}
