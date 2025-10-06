// lib/credits.ts
import { createClient } from "@/lib/supabase/server"

export interface CreditOperation {
  operation_type: "answer_review" | "quiz_generation" | "essay_review" | "daily_question_review"
  user_id: string
  cost?: number
}

export async function deductCredits({
  operation_type,
  user_id,
  cost,
}: CreditOperation): Promise<{ success: boolean; remaining_credits?: number; error?: string }> {
  try {
    const supabase = await createClient() //

    // Get the cost for this operation if not provided
    let operationCost = cost
    if (!operationCost) {
      const { data: costData, error: costError } = await supabase
        .from("credit_costs")
        .select("cost")
        .eq("operation_type", operation_type)
        .single()

      if (costError || !costData) {
        return { success: false, error: "Failed to get operation cost" }
      }
      operationCost = costData.cost
    }

    // Get current user credits
    const { data: userCredits, error: creditsError } = await supabase
      .from("user_credits")
      .select("credits")
      .eq("user_id", user_id)
      .single()

    if (creditsError || !userCredits) {
      return { success: false, error: "Failed to get user credits" }
    }

    // Check if user has enough credits
    if (userCredits.credits < operationCost) {
      return { success: false, error: "Insufficient credits" }
    }

    // Deduct credits
    const newCredits = userCredits.credits - operationCost
    const { error: updateError } = await supabase
      .from("user_credits")
      .update({ credits: newCredits, updated_at: new Date().toISOString() })
      .eq("user_id", user_id)

    if (updateError) {
      return { success: false, error: "Failed to deduct credits" }
    }

    return { success: true, remaining_credits: newCredits }
  } catch (error) {
    console.error("Error deducting credits:", error)
    return { success: false, error: "Unexpected error occurred" }
  }
}

export async function getUserCredits(user_id: string): Promise<{ credits: number; error?: string }> {
  try {
    const supabase = await createClient() // ✅ server client
    const { data, error } = await supabase
      .from("user_credits")
      .select("credits")
      .eq("user_id", user_id)
      .single()

    if (error || !data) {
      return { credits: 0, error: "Failed to get user credits" }
    }

    return { credits: data.credits }
  } catch (error) {
    console.error("Error getting user credits:", error)
    return { credits: 0, error: "Unexpected error occurred" }
  }
}

export async function addCredits(
  user_id: string,
  amount: number
): Promise<{ success: boolean; new_credits?: number; error?: string }> {
  try {
    const supabase = await createClient() // ✅ server client

    // Get current credits
    const { data: userCredits, error: creditsError } = await supabase
      .from("user_credits")
      .select("credits")
      .eq("user_id", user_id)
      .single()

    if (creditsError || !userCredits) {
      return { success: false, error: "Failed to get user credits" }
    }

    // Add credits
    const newCredits = userCredits.credits + amount
    const { error: updateError } = await supabase
      .from("user_credits")
      .update({ credits: newCredits, updated_at: new Date().toISOString() })
      .eq("user_id", user_id)

    if (updateError) {
      return { success: false, error: "Failed to add credits" }
    }

    return { success: true, new_credits: newCredits }
  } catch (error) {
    console.error("Error adding credits:", error)
    return { success: false, error: "Unexpected error occurred" }
  }
}
