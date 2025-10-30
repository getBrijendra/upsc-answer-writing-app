import { createClient } from "@/lib/supabase/server"
import { deductCredits } from "@/lib/credits-server"
import { calculateCreditCost } from "@/lib/modelPricing"

const DEMO_MINDMAP = {
  title: "Indian Constitution",
  nodes: [
    {
      id: "1",
      type: "default",
      position: { x: 250, y: 0 },
      data: {
        label: "Indian Constitution",
        description: "The supreme law of India, adopted on 26 January 1950",
      },
    },
    {
      id: "2",
      type: "default",
      position: { x: 100, y: 100 },
      data: {
        label: "Fundamental Rights",
        description: "Basic human rights guaranteed to all citizens (Articles 12-35)",
      },
    },
    {
      id: "3",
      type: "default",
      position: { x: 400, y: 100 },
      data: {
        label: "Directive Principles",
        description: "Guidelines for the government to establish social and economic democracy (Articles 36-51)",
      },
    },
    {
      id: "4",
      type: "default",
      position: { x: 0, y: 200 },
      data: {
        label: "Right to Equality",
        description: "Articles 14-18: Equality before law, prohibition of discrimination",
      },
    },
    {
      id: "5",
      type: "default",
      position: { x: 200, y: 200 },
      data: {
        label: "Right to Freedom",
        description: "Articles 19-22: Freedom of speech, assembly, movement, etc.",
      },
    },
    {
      id: "6",
      type: "default",
      position: { x: 400, y: 200 },
      data: {
        label: "Social Welfare",
        description: "Securing social order for welfare of the people",
      },
    },
    {
      id: "7",
      type: "default",
      position: { x: 600, y: 200 },
      data: {
        label: "Economic Welfare",
        description: "Promoting economic justice and reducing inequalities",
      },
    },
  ],
  edges: [
    { id: "e1-2", source: "1", target: "2", animated: true },
    { id: "e1-3", source: "1", target: "3", animated: true },
    { id: "e2-4", source: "2", target: "4" },
    { id: "e2-5", source: "2", target: "5" },
    { id: "e3-6", source: "3", target: "6" },
    { id: "e3-7", source: "3", target: "7" },
  ],
}

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

    const model_name = "deepseek-chat"
    const payload = { topic: content, model_name, input_type: inputType || "text" }  

    const response = await fetch(process.env.AI_BASE_URL + "/generate-mindmap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("FastAPI mindmap generation failed:", errorData)
      return Response.json(
        { error: "Mindmap generation failed in FastAPI service" },
        { status: 500 },
      )
    }

    let responseData = await response.json()
    console.log("Mindmap generation response data:", responseData)

    // Fallback to demo mindmap if response data is incomplete
    const creditResult = await deductCredits({
      operation_type: "mindmap_generation" as any,
      user_id: user.id,
      cost: calculateCreditCost({
        model: "deepseek-chat",
        prompt_tokens: responseData.prompt_tokens,
        completion_tokens: responseData.completion_tokens,
      }),
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

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return Response.json({
      mindmap: {
        id: `temp-${Date.now()}`,
        title: responseData.title,
        content,
        nodes: responseData.nodes,
        edges: responseData.edges,
        user_id: user.id,
      },
      remaining_credits: creditResult.remaining_credits,
    })
  } catch (error) {
    console.error("Error generating mindmap:", error)
    return Response.json({ error: "Failed to generate mindmap" }, { status: 500 })
  }
}
