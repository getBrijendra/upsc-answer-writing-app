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

const DEMO_TOPICS = [
  {
    title: "Digital Governance and E-Democracy in India",
    description:
      "Analyze how digital platforms are transforming governance and citizen participation in democratic processes.",
    difficulty: "Hard" as const,
    wordLimit: 1200,
  },
  {
    title: "Sustainable Agriculture and Food Security",
    description: "Discuss the role of sustainable agricultural practices in ensuring long-term food security in India.",
    difficulty: "Medium" as const,
    wordLimit: 1000,
  },
  {
    title: "Urban Planning and Smart Cities Mission",
    description:
      "Evaluate the progress and challenges of the Smart Cities Mission in addressing urban infrastructure needs.",
    difficulty: "Medium" as const,
    wordLimit: 1000,
  },
  {
    title: "Healthcare Accessibility in Rural India",
    description: "Examine the barriers to healthcare access in rural areas and potential solutions.",
    difficulty: "Easy" as const,
    wordLimit: 800,
  },
  {
    title: "Artificial Intelligence and Employment",
    description: "Critically analyze the impact of AI on employment patterns and the future of work in India.",
    difficulty: "Hard" as const,
    wordLimit: 1200,
  },
]

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

    await new Promise((resolve) => setTimeout(resolve, 1500))

    return Response.json({ topics: DEMO_TOPICS })

    /* Original AI implementation - commented out for demo mode
    const { object } = await generateObject({
      model: "openai/gpt-5",
      schema: essayTopicsSchema,
      prompt: `Based on the following ${inputType} content, generate 5 diverse and thought-provoking essay topics suitable for UPSC exam preparation. Each topic should be relevant to current affairs, governance, society, or policy issues in India.

Content: ${content}

Generate topics with varying difficulty levels (Easy, Medium, Hard) and appropriate word limits (200-500 words). Make sure the topics are analytical and require critical thinking.`,
      maxOutputTokens: 2000,
    })

    return Response.json({ topics: object.topics })
    */
  } catch (error) {
    console.error("Error generating essay topics:", error)
    return Response.json({ error: "Failed to generate topics" }, { status: 500 })
  }
}
