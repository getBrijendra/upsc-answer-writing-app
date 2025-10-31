import { createClient } from "@/lib/supabase/server"
import { deductCredits } from "@/lib/credits-server"

const DEMO_FLASHCARDS = {
  title: "Indian Polity - Fundamental Rights",
  cards: [
    {
      question: "What are the six Fundamental Rights guaranteed by the Indian Constitution?",
      answer:
        "1. Right to Equality (Articles 14-18)\n2. Right to Freedom (Articles 19-22)\n3. Right against Exploitation (Articles 23-24)\n4. Right to Freedom of Religion (Articles 25-28)\n5. Cultural and Educational Rights (Articles 29-30)\n6. Right to Constitutional Remedies (Article 32)",
    },
    {
      question: "Which Article is known as the 'Heart and Soul' of the Indian Constitution?",
      answer:
        "Article 32 - Right to Constitutional Remedies. Dr. B.R. Ambedkar called it the heart and soul of the Constitution as it provides the right to move the Supreme Court for enforcement of Fundamental Rights.",
    },
    {
      question: "What does Article 14 guarantee?",
      answer:
        "Article 14 guarantees 'Equality before law' and 'Equal protection of laws'. It ensures that the State shall not deny to any person equality before the law or equal protection of the laws within the territory of India.",
    },
    {
      question: "Which Fundamental Right was removed by the 44th Amendment Act, 1978?",
      answer:
        "The Right to Property was removed as a Fundamental Right by the 44th Amendment Act, 1978. It is now a Constitutional Right under Article 300A.",
    },
    {
      question: "What are the six freedoms guaranteed under Article 19?",
      answer:
        "1. Freedom of speech and expression\n2. Freedom to assemble peacefully without arms\n3. Freedom to form associations or unions\n4. Freedom to move freely throughout India\n5. Freedom to reside and settle in any part of India\n6. Freedom to practice any profession or occupation",
    },
    {
      question: "What does Article 21 protect?",
      answer:
        "Article 21 protects the Right to Life and Personal Liberty. It states that no person shall be deprived of his life or personal liberty except according to procedure established by law. This is one of the most important articles.",
    },
    {
      question: "Which Articles prohibit discrimination?",
      answer:
        "Article 15 prohibits discrimination on grounds of religion, race, caste, sex, or place of birth. Article 16 provides for equality of opportunity in matters of public employment.",
    },
    {
      question: "What is the scope of Article 32?",
      answer:
        "Article 32 empowers citizens to move the Supreme Court for enforcement of Fundamental Rights. The Supreme Court can issue writs: Habeas Corpus, Mandamus, Prohibition, Certiorari, and Quo Warranto.",
    },
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

    let payload: any = { topic: content, input_type: inputType, use_case: "generate-flashcards" }

    const flashcards = await fetch(`${process.env.AI_BASE_URL}/generate-essay-topics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((res) => res.json())
    if (flashcards.error) {
      throw new Error(flashcards.error)
    }
    const creditResult = await deductCredits({
      operation_type: "flashcard_generation" as any,
      user_id: user.id,
      cost: 1,
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
      flashcardSet: {
        id: `temp-${Date.now()}`,
        title: flashcards.title,
        content,
        cards: flashcards.cards,
        user_id: user.id,
      },
      remaining_credits: creditResult.remaining_credits,
    })
  } catch (error) {
    console.error("Error generating flashcards:", error)
    return Response.json({ error: "Failed to generate flashcards" }, { status: 500 })
  }
}
