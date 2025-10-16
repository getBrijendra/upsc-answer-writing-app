"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, RotateCcw, Save } from "lucide-react"
import { toast } from "sonner"

interface Flashcard {
  question: string
  answer: string
}

export default function FlashcardsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = React.use(params)
  const [flashcardSet, setFlashcardSet] = React.useState<any>(null)
  const [cards, setCards] = React.useState<Flashcard[]>([])
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [isFlipped, setIsFlipped] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const [isSaved, setIsSaved] = React.useState(false)
  const [saving, setSaving] = React.useState(false)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data, error }) => {
      if (error || !data?.user) {
        router.push("/auth/login")
        return
      }

      if (id.startsWith("temp-")) {
        const storedData = sessionStorage.getItem(`flashcards-${id}`)
        if (storedData) {
          const flashcardData = JSON.parse(storedData)
          setFlashcardSet(flashcardData)
          setCards(flashcardData.cards || [])
          setIsSaved(false)
          setLoading(false)
        } else {
          toast.error("Flashcard data not found")
          router.push("/dashboard")
        }
      } else {
        supabase
          .from("flashcard_sets")
          .select("*")
          .eq("id", id)
          .single()
          .then(({ data: flashcardData, error: flashcardError }) => {
            if (flashcardError || !flashcardData) {
              toast.error("Failed to load flashcards")
              router.push("/dashboard")
              return
            }

            setFlashcardSet(flashcardData)
            setCards(flashcardData.cards || [])
            setIsSaved(true)
            setLoading(false)
          })
      }
    })
  }, [id, router])

  const handleSave = async () => {
    setSaving(true)
    const supabase = createClient()

    try {
      if (isSaved && !id.startsWith("temp-")) {
        const { error } = await supabase
          .from("flashcard_sets")
          .update({
            cards,
            updated_at: new Date().toISOString(),
          })
          .eq("id", id)

        if (error) {
          toast.error("Failed to save flashcards")
        } else {
          toast.success("Flashcards saved successfully")
        }
      } else {
        const { data: newFlashcardSet, error } = await supabase
          .from("flashcard_sets")
          .insert({
            user_id: flashcardSet.user_id,
            title: flashcardSet.title,
            content: flashcardSet.content,
            cards,
          })
          .select()
          .single()

        if (error) {
          toast.error("Failed to save flashcards")
        } else {
          toast.success("Flashcards saved successfully")
          setIsSaved(true)
          sessionStorage.removeItem(`flashcards-${id}`)
          router.push(`/flashcards/${newFlashcardSet.id}`)
        }
      }
    } catch (error) {
      toast.error("Failed to save flashcards")
    } finally {
      setSaving(false)
    }
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setIsFlipped(false)
      setTimeout(() => setCurrentIndex(currentIndex + 1), 300)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setIsFlipped(false)
      setTimeout(() => setCurrentIndex(currentIndex - 1), 300)
    }
  }

  const handleReset = () => {
    setCurrentIndex(0)
    setIsFlipped(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading flashcards...</p>
      </div>
    )
  }

  if (cards.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">No flashcards available</p>
      </div>
    )
  }

  const currentCard = cards[currentIndex]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{flashcardSet?.title}</h1>
              <p className="text-muted-foreground">
                Card {currentIndex + 1} of {cards.length} • {isSaved ? "Saved" : "Unsaved"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving} variant="outline">
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Saving..." : isSaved ? "Update" : "Save"}
              </Button>
              <Button onClick={handleReset} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>

          <div className="perspective-1000 mb-8">
            <Card
              className="relative h-[400px] cursor-pointer transition-transform duration-500 preserve-3d"
              style={{
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                transformStyle: "preserve-3d",
              }}
              onClick={handleFlip}
            >
              <div
                className="absolute inset-0 backface-hidden flex items-center justify-center p-8"
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">Question</p>
                  <p className="text-2xl font-medium text-foreground">{currentCard.question}</p>
                  <p className="text-sm text-muted-foreground mt-8">Click to reveal answer</p>
                </div>
              </div>

              <div
                className="absolute inset-0 backface-hidden flex items-center justify-center p-8 bg-secondary"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">Answer</p>
                  <p className="text-xl text-foreground">{currentCard.answer}</p>
                  <p className="text-sm text-muted-foreground mt-8">Click to see question</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="flex items-center justify-between">
            <Button onClick={handlePrevious} disabled={currentIndex === 0} variant="outline">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex gap-2">
              {cards.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>

            <Button onClick={handleNext} disabled={currentIndex === cards.length - 1} variant="outline">
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  )
}
