import { createClient } from "@/lib/supabase/server"

export interface CreditOperation {
  operation_type: "answer_review" | "quiz_generation" | "essay_review" | "daily_question_review"
  user_id: string
  cost?: number
}

export async function addCreditsServer(
  user_id: string,
  amount: number,
): Promise<{ success: boolean; new_credits?: number; error?: string }> {
  try {
    const supabase = await createClient()

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
