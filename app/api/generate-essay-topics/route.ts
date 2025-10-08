import { generateObject } from "ai"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"

const essayTopicsSchema = z.object({
  topics: z.array(
    z.object({
      title: z.string().describe("Essay topic title"),
      description: z.string().describe("Brief description of what the essay should cover"),
      difficulty: z.enum(["Easy", "Medium", "Hard"]).describe("Difficulty level of the topic"),
      wordLimit: z.number().describe("Recommended word limit for the essay"),
    }),
  ),
})

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { content, inputType } = await req.json()

    if (!content?.trim()) {
      return Response.json({ error: "Content is required" }, { status: 400 })
    }

    const { object } = await generateObject({
      model: "openai/gpt-5",
      schema: essayTopicsSchema,
      prompt: `Based on the following ${inputType} content, generate 5 diverse and thought-provoking essay topics suitable for UPSC exam preparation. Each topic should be relevant to current affairs, governance, society, or policy issues in India.

Content: ${content}

Generate topics with varying difficulty levels (Easy, Medium, Hard) and appropriate word limits (200-500 words). Make sure the topics are analytical and require critical thinking.`,
      maxOutputTokens: 2000,
    })

    return Response.json({ topics: object.topics })
  } catch (error) {
    console.error("Error generating essay topics:", error)
    return Response.json({ error: "Failed to generate topics" }, { status: 500 })
  }
}
