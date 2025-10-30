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

const HARDCODED_TOPICS: Topic[] = [
  {
    title: "Digital India and Rural Transformation",
    description: "Discuss how digital initiatives are transforming rural India and the challenges in implementation.",
    difficulty: "Medium",
    wordLimit: 1000,
  },
  {
    title: "Climate Change and Sustainable Development",
    description: "Analyze the relationship between climate change mitigation and sustainable development goals.",
    difficulty: "Hard",
    wordLimit: 1200,
  },
  {
    title: "Women Empowerment in Modern India",
    description: "Evaluate the progress and challenges in women empowerment in contemporary Indian society.",
    difficulty: "Medium",
    wordLimit: 1000,
  },
  {
    title: "Role of Youth in Nation Building",
    description: "Examine the role of youth in shaping India's future and their contribution to nation building.",
    difficulty: "Easy",
    wordLimit: 800,
  },
  {
    title: "Technology and Education Reform",
    description: "Discuss how technology is revolutionizing education and the challenges in its implementation.",
    difficulty: "Medium",
    wordLimit: 1000,
  },
]

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
  const [uploadedEssay, setUploadedEssay] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [userCredits, setUserCredits] = useState<number>(0)
  const [creditCost, setCreditCost] = useState<number>(7)
  const [loadingCredits, setLoadingCredits] = useState(true)
  const [language, setLanguage] = useState("english")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleEssayFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedEssay(e.target.files[0])
    }
  }

  const handleGenerateTopics = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      let content = ""

      if (inputType === "text") {
        content = textContent
      } else if (inputType === "link") {
        content = linkUrl
      } else if (inputType === "file" && file) {
        const formData = new FormData()
        formData.append("file", file)

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        let uploadResult
        try {
          uploadResult = await uploadResponse.json()
        } catch (jsonError) {
          console.error("[v0] Failed to parse upload response as JSON:", jsonError)
          throw new Error("Server returned an invalid response for file upload")
        }

        if (!uploadResponse.ok) {
          throw new Error(uploadResult.error || "File upload failed")
        }

        content = uploadResult.extractedText
      }

      if (!content.trim()) {
        throw new Error("Please provide content to generate topics")
      }

      const response = await fetch("/api/generate-essay-topics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, inputType }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to generate topics")
      }

      setGeneratedTopics(result.topics)
      setIsModalOpen(false)
      setTextContent("")
      setLinkUrl("")
      setFile(null)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic)
    setCustomTopic("")
    setEssay("")
    setUploadedEssay(null)
  }

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
    setUploadedEssay(null)
    setError(null)
  }

  const handleSubmitEssay = async () => {
    if (!selectedTopic) {
      setError("Please select or enter a topic first")
      return
    }

    if (!essay.trim() && !uploadedEssay) {
      setError("Please write an essay or upload a PDF")
      return
    }

    if (userCredits < creditCost) {
      setError(
        `Insufficient credits. You need ${creditCost} credits for AI analysis, but you only have ${userCredits} credits.`,
      )
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: user } = await supabase.auth.getUser()

      if (!user.user) throw new Error("User not authenticated")

      const essayContent = essay
      let uploadResponseUrl = null

      // Upload essay file if provided
      if (uploadedEssay) {
        uploadResponseUrl = await uploadToSupabase(uploadedEssay, "user_uploaded_essays")
      }

      // Step 1: Insert essay record
      const { data: insertedEssay, error: insertError } = await supabase
        .from("essays")
        .insert({
          user_id: user.user.id,
          topic: selectedTopic.title,
          essay_text: essayContent.trim(),
          file_url: uploadResponseUrl || null,
          language,
        })
        .select()
        .single()

      if (insertError) throw insertError

      // Step 2: Generate feedback
      const feedbackResponse = await fetch("/api/analyze-essay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: selectedTopic.title,
          essay: essayContent.trim(),
          language,
          file_url: uploadResponseUrl || null,
        }),
      })

      const feedbackResult = await feedbackResponse.json()
      if (!feedbackResponse.ok) throw new Error(feedbackResult.error || "Failed to generate feedback")

      // Step 3: Update essay with feedback and score
      await supabase
        .from("essays")
        .update({
          feedback: feedbackResult,
          score: feedbackResult.feedback?.overall_score || 0,
        })
        .eq("id", insertedEssay.id)

      // Update credits display
      if (feedbackResult.remaining_credits !== undefined) {
        setUserCredits(feedbackResult.remaining_credits)
      }

      // Redirect to essay feedback page
      router.push(`/essay/${insertedEssay.id}`)
    } catch (error: unknown) {
      console.error("[v0] Error submitting essay:", error)
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const wordCount = essay
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-black mb-2">Essay Writing Practice</h1>
              <p className="text-gray-600 text-lg">Select a topic or write your own to practice essay writing</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
              <Coins className="w-5 h-5 text-yellow-500" />
              <span className="text-lg font-medium">{loadingCredits ? "..." : userCredits}</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {!loadingCredits && userCredits < creditCost && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-medium">Insufficient Credits</span>
                </div>
                <p className="text-red-700 mt-1">
                  You need {creditCost} credits for AI essay analysis, but you only have {userCredits} credits. Please
                  purchase more credits from the pricing page.
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-2xl text-slate-800 flex items-center gap-2">
                <FileText className="w-6 h-6 text-indigo-600" />
                Popular Essay Topics
              </CardTitle>
              <CardDescription>Click on any topic to start practicing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {HARDCODED_TOPICS.map((topic, index) => (
                  <Card
                    key={index}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedTopic?.title === topic.title ? "ring-2 ring-indigo-500 bg-indigo-50" : "hover:bg-slate-50"
                    }`}
                    onClick={() => handleTopicSelect(topic)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-semibold text-indigo-600">Topic {index + 1}</span>
                            <Badge className={getDifficultyColor(topic.difficulty)}>{topic.difficulty}</Badge>
                          </div>
                          <h3 className="font-semibold text-slate-800 mb-1">{topic.title}</h3>
                          <p className="text-sm text-slate-600">{topic.description}</p>
                          <p className="text-xs text-slate-500 mt-2">Word Limit: {topic.wordLimit} words</p>
                        </div>
                        {selectedTopic?.title === topic.title && (
                          <CheckCircle className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                        )}
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-2xl text-slate-800 flex items-center gap-2">
                <PenLine className="w-6 h-6 text-indigo-600" />
                Write Your Own Topic
              </CardTitle>
              <CardDescription>Enter a custom essay topic to practice</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customTopic" className="text-slate-700 font-medium">
                  Custom Essay Topic
                </Label>
                <Textarea
                  id="customTopic"
                  placeholder="Enter your essay topic here..."
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
              </div>
              <Button
                onClick={handleCustomTopicSubmit}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                disabled={!customTopic.trim()}
              >
                <PenLine className="w-4 h-4 mr-2" />
                Use This Topic
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-gradient-to-br from-indigo-50 to-purple-50">
            <CardHeader>
              <CardTitle className="text-2xl text-slate-800 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-indigo-600" />
                Generate AI Topics
              </CardTitle>
              <CardDescription>Use AI to generate custom topics based on your study material</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Generate AI Topics
              </Button>

              {generatedTopics.length > 0 && (
                <div className="mt-6 space-y-3">
                  <Label className="text-slate-700 font-medium">AI Generated Topics</Label>
                  <div className="grid gap-3">
                    {generatedTopics.map((topic, index) => (
                      <Card
                        key={index}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedTopic?.title === topic.title
                            ? "ring-2 ring-indigo-500 bg-indigo-50"
                            : "hover:bg-slate-50"
                        }`}
                        onClick={() => handleTopicSelect(topic)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-semibold text-indigo-600">AI Topic {index + 1}</span>
                                <Badge className={getDifficultyColor(topic.difficulty)}>{topic.difficulty}</Badge>
                              </div>
                              <h3 className="font-semibold text-slate-800 mb-1">{topic.title}</h3>
                              <p className="text-sm text-slate-600">{topic.description}</p>
                              <p className="text-xs text-slate-500 mt-2">Word Limit: {topic.wordLimit} words</p>
                            </div>
                            {selectedTopic?.title === topic.title && (
                              <CheckCircle className="w-5 h-5 text-indigo-600 flex-shrink-0" />
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

          {selectedTopic && (
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-800 flex items-center gap-2">
                  <Brain className="w-6 h-6 text-indigo-600" />
                  Write Your Essay
                </CardTitle>
                <CardDescription>Write your essay or upload a PDF for AI analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">Selected Topic</Label>
                  <Card className="bg-indigo-50 border-indigo-200">
                    <CardHeader className="pb-3">
                      <h3 className="font-semibold text-slate-800">{selectedTopic.title}</h3>
                      {selectedTopic.description !== "Custom topic" && (
                        <p className="text-sm text-slate-600">{selectedTopic.description}</p>
                      )}
                    </CardHeader>
                  </Card>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="essay" className="text-slate-700 font-medium">
                    Write Your Essay
                  </Label>
                  <Textarea
                    id="essay"
                    placeholder="Start writing your essay here..."
                    value={essay}
                    onChange={(e) => setEssay(e.target.value)}
                    className="min-h-[400px] resize-none"
                  />
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>Word count: {wordCount}</span>
                    <span>Target: {selectedTopic.wordLimit} words</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="essayFile" className="text-slate-700 font-medium">
                    Or Upload Essay PDF
                  </Label>
                  <Input
                    id="essayFile"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleEssayFileChange}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                  {uploadedEssay && (
                    <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded">
                      <CheckCircle className="w-4 h-4" />
                      {uploadedEssay.name}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language" className="text-slate-700 font-medium">
                    Language
                  </Label>
                  <Select value={language} onValueChange={setLanguage} required>
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
                  <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">{error}</div>
                )}

                <Button
                  onClick={handleSubmitEssay}
                  className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
                  disabled={isSubmitting || userCredits < creditCost}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing Essay...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Submit for AI Analysis ({creditCost} Credits)
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              Generate Essay Topics with AI
            </DialogTitle>
            <DialogDescription>
              Provide content through text, file, or link to generate 5 relevant essay topics
            </DialogDescription>
          </DialogHeader>

          <Tabs value={inputType} onValueChange={(v) => setInputType(v as "text" | "file" | "link")}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="text" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Text
              </TabsTrigger>
              <TabsTrigger value="file" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                File
              </TabsTrigger>
              <TabsTrigger value="link" className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                Link
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="textContent">Enter Text Content</Label>
                <Textarea
                  id="textContent"
                  placeholder="Paste your study material, notes, or any text content here..."
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  className="min-h-[200px] resize-none"
                />
              </div>
            </TabsContent>

            <TabsContent value="file" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fileUpload">Upload File</Label>
                <Input
                  id="fileUpload"
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileChange}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                {file && (
                  <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded">
                    <FileText className="w-4 h-4" />
                    {file.name}
                  </div>
                )}
                <p className="text-xs text-slate-500">Supported formats: PDF, DOC, DOCX, TXT (Max 10MB)</p>
              </div>
            </TabsContent>

            <TabsContent value="link" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="linkUrl">Enter URL</Label>
                <Input
                  id="linkUrl"
                  type="url"
                  placeholder="https://example.com/article"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                />
                <p className="text-xs text-slate-500">AI will extract content from the provided URL</p>
              </div>
            </TabsContent>
          </Tabs>

          {error && <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">{error}</div>}

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
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate 5 Topics
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
