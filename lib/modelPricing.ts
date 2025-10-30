// lib/modelPricing.ts

export type ModelPricing = {
  prompt: number
  completion: number
}

// Pricing expressed in USD per token (provider list prices as of Oct 2025)
const TOKENS_PER_MILLION = 1000000

export const MODEL_PRICING: Record<string, ModelPricing> = {
  "gpt-4o": {
    prompt: 5 / TOKENS_PER_MILLION,
    completion: 15 / TOKENS_PER_MILLION,
  },
  "gpt-4o-mini": {
    prompt: 0.15 / TOKENS_PER_MILLION,
    completion: 0.6 / TOKENS_PER_MILLION,
  },
  "gpt-4-turbo": {
    prompt: 10 / TOKENS_PER_MILLION,
    completion: 30 / TOKENS_PER_MILLION,
  },
  "gpt-3.5-turbo": {
    prompt: 0.5 / TOKENS_PER_MILLION,
    completion: 1.5 / TOKENS_PER_MILLION,
  },
  "claude-3-opus": {
    prompt: 15 / TOKENS_PER_MILLION,
    completion: 75 / TOKENS_PER_MILLION,
  },
  "claude-3.5-sonnet": {
    prompt: 3 / TOKENS_PER_MILLION,
    completion: 15 / TOKENS_PER_MILLION,
  },
  "claude-3-haiku": {
    prompt: 0.25 / TOKENS_PER_MILLION,
    completion: 1.25 / TOKENS_PER_MILLION,
  },
  "deepseek-chat": {
    prompt: 0.28 / TOKENS_PER_MILLION,
    completion: 0.42 / TOKENS_PER_MILLION,
  },
  "gemini-1.5-pro": {
    prompt: 3.5 / TOKENS_PER_MILLION,
    completion: 10.5 / TOKENS_PER_MILLION,
  },
  "gemini-1.5-flash": {
    prompt: 0.35 / TOKENS_PER_MILLION,
    completion: 1.05 / TOKENS_PER_MILLION,
  },
}

export function calculateCreditCost({
  model,
  prompt_tokens,
  completion_tokens,
}: {
  model: string
  prompt_tokens: number
  completion_tokens: number
}): number {
  const pricing = MODEL_PRICING[model]
  if (!pricing) throw new Error(`Pricing not found for model: ${model}`)

  const total =
    prompt_tokens * pricing.prompt + completion_tokens * pricing.completion
  // console.log("Intermediate total cost before multiplier:", total)

  const userUsageCost = Number(Math.ceil(total * 50))
  // console.log("Total cost after multiplier:", userUsageCost)
  return userUsageCost
}
