"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PenTool, BookOpen, BarChart3, Brain, Settings, Network, Layers } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [recentAnswers, setRecentAnswers] = useState<any[]>([])
  const [showMindmapModal, setShowMindmapModal] = useState(false)
  const [showFlashcardModal, setShowFlashcardModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [mindmapContent, setMindmapContent] = useState("")
  const [mindmapFile, setMindmapFile] = useState<File | null>(null)
  const [mindmapLinks, setMindmapLinks] = useState("")
  const [flashcardContent, setFlashcardContent] = useState("")
  const [flashcardFile, setFlashcardFile] = useState<File | null>(null)
  const [flashcardLinks, setFlashcardLinks] = useState("")
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data, error }) => {
      if (error || !data?.user) {
        router.push("/auth/login")
      } else {
        setUser(data.user)

        // Get profile
        supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single()
          .then(({ data: profileData }) => {
            setProfile(profileData)
          })

        // Get recent answers
        supabase
          .from("answers")
          .select("*, subjects(name)")
          .eq("user_id", data.user.id)
          .order("created_at", { ascending: false })
          .limit(3)
          .then(({ data: answersData }) => {
            setRecentAnswers(answersData || [])
          })

        setLoading(false)
      }
    })
  }, [router])

  const handleGenerateMindmap = async (inputType: string) => {
    setGenerating(true)
    try {
      let content = ""
      if (inputType === "text") content = mindmapContent
      else if (inputType === "links") content = mindmapLinks
      else if (inputType === "file" && mindmapFile) {
        // Handle file upload
        content = "PDF content placeholder"
      }

      const response = await fetch("/api/generate-mindmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, inputType }),
      })

      const data = await response.json()

      if (response.ok) {
        sessionStorage.setItem(`mindmap-${data.mindmap.id}`, JSON.stringify(data.mindmap))

        toast({
          title: "Success",
          description: "Mindmap generated successfully!",
        })
        setShowMindmapModal(false)
        router.push(`/mindmap/${data.mindmap.id}`)
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to generate mindmap",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate mindmap",
        variant: "destructive",
      })
    } finally {
      setGenerating(false)
    }
  }

  const handleGenerateFlashcards = async (inputType: string) => {
    setGenerating(true)
    try {
      let content = ""
      if (inputType === "text") content = flashcardContent
      else if (inputType === "links") content = flashcardLinks
      else if (inputType === "file" && flashcardFile) {
        // Handle file upload
        content = "PDF content placeholder"
      }

      const response = await fetch("/api/generate-flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, inputType }),
      })

      const data = await response.json()

      if (response.ok) {
        sessionStorage.setItem(`flashcards-${data.flashcardSet.id}`, JSON.stringify(data.flashcardSet))

        toast({
          title: "Success",
          description: "Flashcards generated successfully!",
        })
        setShowFlashcardModal(false)
        router.push(`/flashcards/${data.flashcardSet.id}`)
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to generate flashcards",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate flashcards",
        variant: "destructive",
      })
    } finally {
      setGenerating(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Welcome back, {profile?.full_name || "Aspirant"}!</h1>
          <p className="text-muted-foreground text-lg">Ready to continue your UPSC preparation journey?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-card border-border">
            <CardHeader className="pb-3" onClick={() => setShowMindmapModal(true)}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                  <Network className="w-6 h-6 text-foreground" />
                </div>
                <div>
                  <CardTitle className="text-lg text-foreground">Create Mindmap</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Visualize topics with interactive flow diagrams
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-card border-border">
            <CardHeader className="pb-3" onClick={() => setShowFlashcardModal(true)}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                  <Layers className="w-6 h-6 text-foreground" />
                </div>
                <div>
                  <CardTitle className="text-lg text-foreground">Create Flashcards</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Generate interactive Q&A flashcards for quick revision
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-card border-border">
            <Link href="/practice">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-2">
                  <PenTool className="w-6 h-6 text-foreground" />
                </div>
                <CardTitle className="text-lg text-foreground">Answer Writing</CardTitle>
                <CardDescription className="text-muted-foreground">Practice with real UPSC questions</CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-card border-border">
            <Link href="/mcq">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-2">
                  <Brain className="w-6 h-6 text-foreground" />
                </div>
                <CardTitle className="text-lg text-foreground">MCQ Generator</CardTitle>
                <CardDescription className="text-muted-foreground">Generate practice questions</CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-card border-border">
            <Link href="/profile">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-2">
                  <BookOpen className="w-6 h-6 text-foreground" />
                </div>
                <CardTitle className="text-lg text-foreground">My Answers</CardTitle>
                <CardDescription className="text-muted-foreground">Review past submissions</CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-card border-border">
            <Link href="/progress">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-2">
                  <BarChart3 className="w-6 h-6 text-foreground" />
                </div>
                <CardTitle className="text-lg text-foreground">Progress</CardTitle>
                <CardDescription className="text-muted-foreground">Track your improvement</CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-card border-border">
            <Link href="/admin/subjects">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-2">
                  <Settings className="w-6 h-6 text-foreground" />
                </div>
                <CardTitle className="text-lg text-foreground">Manage Subjects</CardTitle>
                <CardDescription className="text-muted-foreground">Configure UPSC subjects</CardDescription>
              </CardHeader>
            </Link>
          </Card>
        </div>

        {recentAnswers && recentAnswers.length > 0 && (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Activity</CardTitle>
              <CardDescription className="text-muted-foreground">Your latest answer submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAnswers.map((answer: any) => (
                  <div
                    key={answer.id}
                    className="flex items-center justify-between p-4 bg-secondary rounded-lg border border-border"
                  >
                    <div>
                      <p className="font-medium text-foreground">{answer.subjects?.name}</p>
                      <p className="text-sm text-muted-foreground truncate max-w-md">
                        {answer.question.substring(0, 100)}...
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(answer.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {answer.score && (
                      <div className="text-right">
                        <div className="text-lg font-bold text-foreground">{answer.score}/100</div>
                        <div className="text-xs text-muted-foreground">Score</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={showMindmapModal} onOpenChange={setShowMindmapModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Mindmap</DialogTitle>
            <DialogDescription>Provide content to generate an interactive mindmap visualization</DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="text">Text</TabsTrigger>
              <TabsTrigger value="file">PDF</TabsTrigger>
              <TabsTrigger value="links">Links</TabsTrigger>
            </TabsList>
            <TabsContent value="text" className="space-y-4">
              <div>
                <Label htmlFor="mindmap-text">Enter your content</Label>
                <Textarea
                  id="mindmap-text"
                  value={mindmapContent}
                  onChange={(e) => setMindmapContent(e.target.value)}
                  placeholder="Enter the topic or content you want to create a mindmap for..."
                  className="min-h-[200px] mt-2"
                />
              </div>
              <Button className="w-full" onClick={() => handleGenerateMindmap("text")} disabled={generating}>
                {generating ? "Generating..." : "Generate Mindmap"}
              </Button>
            </TabsContent>
            <TabsContent value="file" className="space-y-4">
              <div>
                <Label htmlFor="mindmap-file">Upload PDF</Label>
                <Input
                  id="mindmap-file"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setMindmapFile(e.target.files?.[0] || null)}
                  className="mt-2"
                />
              </div>
              <Button className="w-full" onClick={() => handleGenerateMindmap("file")} disabled={generating}>
                {generating ? "Generating..." : "Generate Mindmap"}
              </Button>
            </TabsContent>
            <TabsContent value="links" className="space-y-4">
              <div>
                <Label htmlFor="mindmap-links">Paste article links (one per line)</Label>
                <Textarea
                  id="mindmap-links"
                  value={mindmapLinks}
                  onChange={(e) => setMindmapLinks(e.target.value)}
                  placeholder="https://example.com/article1&#10;https://example.com/article2"
                  className="min-h-[200px] mt-2"
                />
              </div>
              <Button className="w-full" onClick={() => handleGenerateMindmap("links")} disabled={generating}>
                {generating ? "Generating..." : "Generate Mindmap"}
              </Button>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <Dialog open={showFlashcardModal} onOpenChange={setShowFlashcardModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Flashcards</DialogTitle>
            <DialogDescription>Provide content to generate interactive Q&A flashcards for revision</DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="text">Text</TabsTrigger>
              <TabsTrigger value="file">PDF</TabsTrigger>
              <TabsTrigger value="links">Links</TabsTrigger>
            </TabsList>
            <TabsContent value="text" className="space-y-4">
              <div>
                <Label htmlFor="flashcard-text">Enter your content</Label>
                <Textarea
                  id="flashcard-text"
                  value={flashcardContent}
                  onChange={(e) => setFlashcardContent(e.target.value)}
                  placeholder="Enter the topic or content you want to create flashcards for..."
                  className="min-h-[200px] mt-2"
                />
              </div>
              <Button className="w-full" onClick={() => handleGenerateFlashcards("text")} disabled={generating}>
                {generating ? "Generating..." : "Generate Flashcards"}
              </Button>
            </TabsContent>
            <TabsContent value="file" className="space-y-4">
              <div>
                <Label htmlFor="flashcard-file">Upload PDF</Label>
                <Input
                  id="flashcard-file"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFlashcardFile(e.target.files?.[0] || null)}
                  className="mt-2"
                />
              </div>
              <Button className="w-full" onClick={() => handleGenerateFlashcards("file")} disabled={generating}>
                {generating ? "Generating..." : "Generate Flashcards"}
              </Button>
            </TabsContent>
            <TabsContent value="links" className="space-y-4">
              <div>
                <Label htmlFor="flashcard-links">Paste article links (one per line)</Label>
                <Textarea
                  id="flashcard-links"
                  value={flashcardLinks}
                  onChange={(e) => setFlashcardLinks(e.target.value)}
                  placeholder="https://example.com/article1&#10;https://example.com/article2"
                  className="min-h-[200px] mt-2"
                />
              </div>
              <Button className="w-full" onClick={() => handleGenerateFlashcards("links")} disabled={generating}>
                {generating ? "Generating..." : "Generate Flashcards"}
              </Button>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  )
}
