"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileText, ImageIcon, Loader2, Brain, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface Subject {
  id: string
  name: string
}

interface MCQGeneratorFormProps {
  subjects: Subject[]
}

export default function MCQGeneratorForm({ subjects }: MCQGeneratorFormProps) {
  const [inputType, setInputType] = useState<"text" | "file">("text")
  const [textContent, setTextContent] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [uploadedContent, setUploadedContent] = useState<string | null>(null)
  const [selectedSubject, setSelectedSubject] = useState("")
  const [numQuestions, setNumQuestions] = useState("5")
  const [difficulty, setDifficulty] = useState("medium")
  const [isUploading, setIsUploading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setUploadedContent(null) // Reset uploaded content
    }
  }

  const handleFileUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Upload failed")
      }

      setUploadedContent(result.extractedText || "File uploaded successfully")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Upload failed")
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const content = inputType === "text" ? textContent : uploadedContent

    if (!content?.trim()) {
      setError(inputType === "text" ? "Please provide text content" : "Please upload and process a file first")
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: user } = await supabase.auth.getUser()

      if (!user.user) {
        throw new Error("User not authenticated")
      }

      const response = await fetch("/api/generate-mcq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: content.trim(),
          numQuestions: Number.parseInt(numQuestions),
          difficulty,
          subject: selectedSubject,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to generate questions")
      }

      // Insert questions into database
      const questionsToInsert = result.questions.map((q: any) => ({
        user_id: user.user.id,
        subject_id: selectedSubject || null,
        question: q.question,
        options: q.options,
        correct_answer: q.correct_answer,
        explanation: q.explanation,
        source_content: q.source_content,
      }))

      const { error: insertError } = await supabase.from("mcq_questions").insert(questionsToInsert)

      if (insertError) throw insertError

      // Redirect to practice page with generated questions
      router.push(`/mcq/practice?generated=true`)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-xl border-0">
        <CardHeader>
          <CardTitle className="text-2xl text-slate-800 flex items-center gap-2">
            <Brain className="w-6 h-6 text-indigo-600" />
            Generate MCQ Questions with AI
          </CardTitle>
          <CardDescription>
            Upload content or paste text to automatically generate intelligent multiple choice questions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Input Type Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card
                className={`cursor-pointer transition-all ${
                  inputType === "text" ? "ring-2 ring-indigo-500 bg-indigo-50" : "hover:bg-slate-50"
                }`}
                onClick={() => setInputType("text")}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    <CardTitle className="text-lg">Text Input</CardTitle>
                  </div>
                  <CardDescription>Paste or type your study content directly</CardDescription>
                </CardHeader>
              </Card>

              <Card
                className={`cursor-pointer transition-all ${
                  inputType === "file" ? "ring-2 ring-indigo-500 bg-indigo-50" : "hover:bg-slate-50"
                }`}
                onClick={() => setInputType("file")}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Upload className="w-5 h-5 text-indigo-600" />
                    <CardTitle className="text-lg">File Upload</CardTitle>
                  </div>
                  <CardDescription>Upload PDF, DOC, or image files with AI text extraction</CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Content Input */}
            {inputType === "text" ? (
              <div className="space-y-2">
                <Label htmlFor="content" className="text-slate-700 font-medium">
                  Study Content
                </Label>
                <Textarea
                  id="content"
                  placeholder="Paste your study material, notes, or any text content here..."
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  className="min-h-[200px] resize-none"
                  required
                />
                <div className="text-sm text-slate-500">
                  Word count:{" "}
                  {
                    textContent
                      .trim()
                      .split(/\s+/)
                      .filter((word) => word.length > 0).length
                  }
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="file" className="text-slate-700 font-medium">
                  Upload File for AI Processing
                </Label>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <Input
                      id="file"
                      type="file"
                      accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                      required
                    />
                    {file && !uploadedContent && (
                      <Button
                        type="button"
                        onClick={handleFileUpload}
                        disabled={isUploading}
                        size="sm"
                        className="bg-indigo-600 hover:bg-indigo-700"
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Process File
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  {file && (
                    <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded">
                      <ImageIcon className="w-4 h-4" />
                      {file.name}
                      {uploadedContent && (
                        <div className="flex items-center gap-1 text-green-600 ml-auto">
                          <CheckCircle className="w-4 h-4" />
                          Processed
                        </div>
                      )}
                    </div>
                  )}

                  {uploadedContent && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-sm text-green-800 mb-2">✓ Content extracted successfully!</p>
                      <p className="text-xs text-green-700">Preview: {uploadedContent.substring(0, 200)}...</p>
                    </div>
                  )}

                  <p className="text-xs text-slate-500">
                    Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG (Max 10MB)
                    <br />
                    AI will extract and analyze text content to generate relevant questions.
                  </p>
                </div>
              </div>
            )}

            {/* Generation Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-slate-700 font-medium">
                  Subject (Optional)
                </Label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No specific subject</SelectItem>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="numQuestions" className="text-slate-700 font-medium">
                  Number of Questions
                </Label>
                <Select value={numQuestions} onValueChange={setNumQuestions}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 Questions</SelectItem>
                    <SelectItem value="5">5 Questions</SelectItem>
                    <SelectItem value="10">10 Questions</SelectItem>
                    <SelectItem value="15">15 Questions</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty" className="text-slate-700 font-medium">
                  Difficulty Level
                </Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">{error}</div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  AI is Generating Questions...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Generate Questions with AI
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
