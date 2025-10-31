"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  Upload,
  LinkIcon,
  FileText,
  Loader2,
  CheckCircle,
  Sparkles,
  PenLine,
  Coins,
  AlertTriangle,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { getUserCredits } from "@/lib/credits"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { uploadToSupabase } from "@/lib/supabase/uploadFile"
import { useRouter } from "next/navigation"

interface Topic {
  title: string
  description: string
  difficulty: "Easy" | "Medium" | "Hard"
  wordLimit: number
}

export default function EssayPracticePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [inputType, setInputType] = useState<"text" | "file" | "link">("text")
  const [textContent, setTextContent] = useState("")
  const [linkUrl, setLinkUrl] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedTopics, setGeneratedTopics] = useState<Topic[]>([])
  const [customTopic, setCustomTopic] = useState("")
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
  const [essay, setEssay] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [userCredits, setUserCredits] = useState<number>(0)
  const [creditCost, setCreditCost] = useState<number>(7)
  const [loadingCredits, setLoadingCredits] = useState(true)
  const [language, setLanguage] = useState("english")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  // 🆕 Image upload states
  const [uploadedEssayImages, setUploadedEssayImages] = useState<File[]>([])
  const [isExtracting, setIsExtracting] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  useEffect(() => {
    const fetchCreditsInfo = async () => {
      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          const { credits } = await getUserCredits(user.id)
          setUserCredits(credits)

          const { data: costData } = await supabase
            .from("credit_costs")
            .select("cost")
            .eq("operation_type", "essay_review")
            .single()

          if (costData) {
            setCreditCost(costData.cost)
          }
        }
      } catch (error) {
        console.error("Error fetching credits info:", error)
      } finally {
        setLoadingCredits(false)
      }
    }

    fetchCreditsInfo()
  }, [])

  // 🧠 Generate AI Topics
  const handleGenerateTopics = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      let content = ""
      if (inputType === "text") content = textContent
      else if (inputType === "link") content = linkUrl
      else if (inputType === "file" && file) {
        const formData = new FormData()
        formData.append("file", file)

        const uploadResponse = await fetch("/api/upload", { method: "POST", body: formData })
        const uploadResult = await uploadResponse.json()
        if (!uploadResponse.ok) throw new Error(uploadResult.error || "File upload failed")
        content = uploadResult.extractedText
      }

      if (!content.trim()) throw new Error("Please provide content to generate topics")

      const response = await fetch("/api/generate-essay-topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, inputType }),
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Failed to generate topics")

      setGeneratedTopics(result.topics)
      setIsModalOpen(false)
      setTextContent("")
      setLinkUrl("")
      setFile(null)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsGenerating(false)
    }
  }

  // ✍️ Topic handling
  const handleCustomTopicSubmit = () => {
    if (!customTopic.trim()) {
      setError("Please enter a topic")
      return
    }

    setSelectedTopic({
      title: customTopic,
      description: "Custom topic",
      difficulty: "Medium",
      wordLimit: 1000,
    })
    setEssay("")
    setUploadedEssayImages([])
    setError(null)
  }

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic)
    setEssay("")
    setUploadedEssayImages([])
  }

  // 🧠 Image -> Text Extraction
  const handlePreviewText = async () => {
    try {
      setIsExtracting(true)
      setError(null)

      const supabase = createClient()
      const imageUrls: string[] = []

      for (const img of uploadedEssayImages) {
        const url = await uploadToSupabase(img, "user_uploaded_answers")
        imageUrls.push(url)
      }

      const response = await fetch("http://localhost:8000/extract-image-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_urls: imageUrls }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Failed to extract text")

      setEssay(data.text)
      setIsPreviewOpen(true)
    } catch (err: any) {
      console.error("Error extracting text:", err)
      setError(err.message || "Error extracting text")
    } finally {
      setIsExtracting(false)
    }
  }

  // 📤 Submit essay for analysis
  const handleSubmitEssay = async () => {
    if (!selectedTopic) return setError("Please select or enter a topic first")
    if (!essay.trim()) return setError("Please write or extract essay text first")
    if (userCredits < creditCost)
      return setError(`Need ${creditCost} credits, but you have ${userCredits}.`)

    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error("User not authenticated")

      const { data: insertedEssay, error: insertError } = await supabase
        .from("essays")
        .insert({
          user_id: user.user.id,
          topic: selectedTopic.title,
          essay_text: essay.trim(),
          language,
        })
        .select()
        .single()
      if (insertError) throw insertError

      const feedbackResponse = await fetch("/api/generate-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: selectedTopic.title,
          answer: essay.trim(),
          language,
          subject: "c1d854b5-35f4-4bf2-91e4-3f48b9de1d04",
        }),
      })

      const feedbackResult = await feedbackResponse.json()
      if (!feedbackResponse.ok) throw new Error(feedbackResult.error || "Failed to generate feedback")

      const feedbackData = feedbackResult.feedback?.feedback || feedbackResult.feedback
      await supabase
        .from("essays")
        .update({
          feedback: feedbackData,
          score: feedbackData?.overall_score || 0,
        })
        .eq("id", insertedEssay.id)

      if (feedbackResult.remaining_credits !== undefined) setUserCredits(feedbackResult.remaining_credits)
      router.push(`/essay/${insertedEssay.id}`)
    } catch (error: any) {
      console.error("Error submitting essay:", error)
      setError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getDifficultyColor = (d: string) =>
    d === "Easy"
      ? "bg-green-100 text-green-800"
      : d === "Medium"
      ? "bg-yellow-100 text-yellow-800"
      : "bg-red-100 text-red-800"

  const wordCount = essay.trim().split(/\s+/).filter(Boolean).length

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-black mb-2">Essay Writing Practice</h1>
            <p className="text-gray-600 text-lg">Choose or generate a topic to practice essay writing</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
            <Coins className="w-5 h-5 text-yellow-500" />
            <span className="text-lg font-medium">{loadingCredits ? "..." : userCredits}</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Custom Topic */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <PenLine className="w-6 h-6 text-indigo-600" />
                Write Your Own Topic
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter your essay topic..."
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
              />
              <Button
                onClick={handleCustomTopicSubmit}
                className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700"
                disabled={!customTopic.trim()}
              >
                <PenLine className="w-4 h-4 mr-2" /> Use This Topic
              </Button>
            </CardContent>
          </Card>

          {/* AI Topic Generation */}
          <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Sparkles className="w-6 h-6 text-indigo-600" /> Generate AI Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                <Sparkles className="w-4 h-4 mr-2" /> Generate AI Topics
              </Button>

              {generatedTopics.length > 0 && (
                <div className="mt-6">
                  <Label className="text-slate-700 font-medium mb-2 block">
                    AI Generated Topics
                  </Label>
                  <div className="grid gap-3">
                    {generatedTopics.map((t, i) => (
                      <Card
                        key={i}
                        onClick={() => handleTopicSelect(t)}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedTopic?.title === t.title
                            ? "ring-2 ring-indigo-500 bg-indigo-50"
                            : "hover:bg-slate-50"
                        }`}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex justify-between">
                            <div>
                              <div className="flex gap-2 mb-2">
                                <Badge className={getDifficultyColor(t.difficulty)}>{t.difficulty}</Badge>
                              </div>
                              <h3 className="font-semibold">{t.title}</h3>
                              <p className="text-sm text-slate-600">{t.description}</p>
                            </div>
                            {selectedTopic?.title === t.title && (
                              <CheckCircle className="w-5 h-5 text-indigo-600" />
                            )}
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Essay Writing Section */}
          {selectedTopic && (
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Brain className="w-6 h-6 text-indigo-600" />
                  Write Your Essay
                </CardTitle>
                <CardDescription>Upload handwritten images or type your essay</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Topic Card */}
                <Card className="bg-indigo-50 border-indigo-200">
                  <CardHeader>
                    <h3 className="font-semibold">{selectedTopic.title}</h3>
                    <p className="text-sm text-slate-600">{selectedTopic.description}</p>
                  </CardHeader>
                </Card>

                {/* 🆕 Image Upload */}
                <div className="space-y-2">
                  <Label>Upload Essay Images</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      if (e.target.files) {
                        const files = Array.from(e.target.files)
                        setUploadedEssayImages((p) => [...p, ...files])
                      }
                    }}
                  />
                  {uploadedEssayImages.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-2">
                      {uploadedEssayImages.map((img, i) => (
                        <div key={i} className="relative group">
                          <img
                            src={URL.createObjectURL(img)}
                            alt={`img-${i}`}
                            className="w-28 h-28 object-cover border rounded-lg"
                          />
                          <button
                            onClick={() =>
                              setUploadedEssayImages((prev) => prev.filter((_, idx) => idx !== i))
                            }
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {uploadedEssayImages.length > 0 && (
                    <Button
                      onClick={handlePreviewText}
                      disabled={isExtracting}
                      className="mt-3 bg-indigo-600 hover:bg-indigo-700"
                    >
                      {isExtracting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Extracting Text...
                        </>
                      ) : (
                        <>
                          <FileText className="w-4 h-4 mr-2" /> Preview Text
                        </>
                      )}
                    </Button>
                  )}
                  <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Extracted Text</DialogTitle>
                      </DialogHeader>
                      <DialogDescription>
                        <Textarea
                          value={essay}
                          onChange={(e) => setEssay(e.target.value)}
                          className="min-h-[300px]"
                        />
                      </DialogDescription>
                      <DialogFooter>
                        <Button onClick={() => setIsPreviewOpen(false)}>Close</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Essay Text */}
                <div className="space-y-2">
                  <Label>Essay Text</Label>
                  <Textarea
                    placeholder="Write or review extracted essay text..."
                    value={essay}
                    onChange={(e) => setEssay(e.target.value)}
                    className="min-h-[400px]"
                  />
                  <div className="text-sm text-slate-500 flex justify-between">
                    <span>Word count: {wordCount}</span>
                    <span>Target: {selectedTopic.wordLimit}</span>
                  </div>
                </div>

                {/* Language */}
                <div>
                  <Label>Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="hindi">Hindi (हिंदी)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {error && (
                  <div className="p-3 text-red-600 bg-red-50 border border-red-200 rounded-md">{error}</div>
                )}

                <Button
                  onClick={handleSubmitEssay}
                  disabled={isSubmitting || userCredits < creditCost}
                  className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing Essay...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" /> Submit for AI Analysis
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* AI Topic Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              Generate Essay Topics with AI
            </DialogTitle>
            <DialogDescription>Provide text or file to generate 5 relevant essay topics</DialogDescription>
          </DialogHeader>

          <Tabs value="text">
            <TabsList className="w-full">
              <TabsTrigger value="text">Text</TabsTrigger>
            </TabsList>

            <TabsContent value="text">
              <Label htmlFor="textContent">Enter Text Content</Label>
              <Textarea
                id="textContent"
                placeholder="Paste your notes or text here..."
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                className="min-h-[200px]"
              />
            </TabsContent>
          </Tabs>

          {error && <div className="text-red-600 text-sm bg-red-50 p-2 mt-2 rounded">{error}</div>}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isGenerating}>
              Cancel
            </Button>
            <Button
              onClick={handleGenerateTopics}
              disabled={isGenerating}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" /> Generate Topics
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
