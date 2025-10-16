import { generateText } from "ai"
import { createClient } from "@/lib/supabase/server"
import { deductCredits } from "@/lib/credits-server"
import { file } from "zod"

const USE_DEMO_RESPONSE = true

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    let topic, essay, language, file_url
    try {
      const body = await req.json()
      topic = body.topic
      essay = body.essay
      language = body.language || "english"
      file_url = body.file_url || null
    } catch (parseError) {
      console.error("[v0] Error parsing request body:", parseError)
      return Response.json({ error: "Invalid request body" }, { status: 400 })
    }

    if (!topic?.trim() || !essay?.trim()) {
      return Response.json({ error: "Topic and essay are required" }, { status: 400 })
    }

    let creditResult
    try {
      creditResult = await deductCredits({
        operation_type: "essay_review",
        user_id: user.id,
        cost: 7,
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
    } catch (creditError) {
      console.error("[v0] Error deducting credits:", creditError)
      return Response.json({ error: "Failed to process credits" }, { status: 500 })
    }

    if (USE_DEMO_RESPONSE) {
      const demoAnalysis = `**COMPREHENSIVE ESSAY ANALYSIS**

**1. Content Quality (7/10)**

Your essay demonstrates a solid understanding of the topic with relevant arguments and examples. The content shows depth in discussing the main themes, though some areas could benefit from more nuanced analysis.

**Strengths:**
- Clear articulation of key concepts
- Good use of contemporary examples
- Balanced perspective on the issue
- Relevant statistical data and facts

**Areas for Improvement:**
- Some arguments could be developed more thoroughly
- Consider adding more diverse perspectives
- Include more recent case studies or examples
- Strengthen the connection between different arguments

**2. Structure and Organization (8/10)**

The essay follows a logical structure with a clear introduction, body paragraphs, and conclusion. The flow of ideas is generally smooth, making it easy to follow your argument.

**Strengths:**
- Well-defined introduction that sets the context
- Logical progression of ideas
- Effective use of transitions between paragraphs
- Strong concluding paragraph that summarizes key points

**Areas for Improvement:**
- Some paragraphs could be more focused on a single idea
- Consider using more explicit topic sentences
- The middle section could benefit from better internal organization

**3. Language and Expression (7.5/10)**

Your language is clear and appropriate for an academic essay. The vocabulary is varied and demonstrates good command of English, though there are occasional lapses in precision.

**Strengths:**
- Clear and concise expression
- Good vocabulary range
- Minimal grammatical errors
- Appropriate formal tone maintained throughout

**Areas for Improvement:**
- Avoid repetition of certain phrases
- Use more sophisticated sentence structures
- Be more precise in word choice in some instances
- Proofread for minor grammatical inconsistencies

**4. Critical Analysis (6.5/10)**

The essay shows analytical thinking, but there's room for deeper critical engagement with the topic. More critical evaluation of different viewpoints would strengthen your argument.

**Strengths:**
- Attempts to analyze causes and effects
- Shows awareness of multiple perspectives
- Makes connections between different aspects of the topic

**Areas for Improvement:**
- Develop more critical evaluation of sources and claims
- Challenge assumptions more explicitly
- Provide more in-depth analysis of implications
- Consider counter-arguments more thoroughly

**5. Suggestions for Improvement**

1. **Deepen Your Analysis:** Go beyond describing the issue to critically examining why it matters and what the implications are.

2. **Strengthen Evidence:** Use more specific examples, data, and case studies to support your arguments.

3. **Enhance Critical Thinking:** Question assumptions, evaluate different perspectives, and show awareness of complexity.

4. **Improve Coherence:** Ensure each paragraph clearly relates to your main argument and flows logically to the next.

5. **Refine Language:** Work on varying sentence structure and using more precise vocabulary where appropriate.

6. **Add Contemporary Relevance:** Include more recent developments and current affairs related to the topic.

**6. Overall Score: 7.2/10**

This is a competent essay that demonstrates good understanding and writing ability. With more depth of analysis, stronger evidence, and refined expression, you can significantly improve your score. Focus on developing critical thinking skills and providing more nuanced arguments in your future essays.

**Key Takeaway:** Your foundation is strong. Now work on adding layers of complexity, critical analysis, and sophisticated argumentation to elevate your essay to the next level.`

      try {
        const { error: insertError } = await supabase.from("essay_analyses").insert({
          user_id: user.id,
          topic,
          essay,
          analysis: demoAnalysis,
          language,
        })

        if (insertError) {
          console.error("[v0] Error storing analysis:", insertError)
          // Continue anyway - analysis was generated successfully
        }
      } catch (dbError) {
        console.error("[v0] Database error:", dbError)
        // Continue anyway - analysis was generated successfully
      }

      return Response.json({
        analysis: demoAnalysis,
        remaining_credits: creditResult.remaining_credits,
      })
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

    try {
      const { error: insertError } = await supabase.from("essay_analyses").insert({
        user_id: user.id,
        topic,
        essay,
        analysis: text,
        language,
      })

      if (insertError) {
        console.error("[v0] Error storing analysis:", insertError)
        // Continue anyway - analysis was generated successfully
      }
    } catch (dbError) {
      console.error("[v0] Database error:", dbError)
      // Continue anyway - analysis was generated successfully
    }

    return Response.json({
      analysis: text,
      remaining_credits: creditResult.remaining_credits,
    })
  } catch (error) {
    console.error("[v0] Error analyzing essay:", error)
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Failed to analyze essay",
        details: "An unexpected error occurred while processing your essay",
      },
      { status: 500 },
    )
  }
}
