"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Brain, Upload, LinkIcon, FileText, Loader2, CheckCircle, XCircle, Sparkles } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Subject {
  id: string
  name: string
  category?: string
}

interface MCQQuestion {
  question: string
  options: string[]
  correct_answer: string
  explanation: string
}

interface MCQQuizGeneratorProps {
  subjects: Subject[]
}

export default function MCQQuizGenerator({ subjects }: MCQQuizGeneratorProps) {
  const [showModal, setShowModal] = useState(false)
  const [inputType, setInputType] = useState<"pdf" | "link" | "topic">("topic")
  const [file, setFile] = useState<File | null>(null)
  const [link, setLink] = useState("")
  const [topic, setTopic] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [contentReady, setContentReady] = useState(false)
  const [extractedContent, setExtractedContent] = useState("")

  // Quiz configuration
  const [selectedSubject, setSelectedSubject] = useState("")
  const [difficulty, setDifficulty] = useState("medium")
  const [numQuestions, setNumQuestions] = useState("5")
  const [isGenerating, setIsGenerating] = useState(false)

  // Quiz state
  const [questions, setQuestions] = useState<MCQQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleProcessContent = async () => {
    setIsProcessing(true)
    setError(null)

    try {
      let content = ""

      if (inputType === "pdf" && file) {
        const formData = new FormData()
        formData.append("file", file)
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })
        const result = await response.json()
        if (!response.ok) throw new Error(result.error || "Upload failed")
        content = result.extractedText || ""
      } else if (inputType === "link" && link) {
        const response = await fetch("/api/extract-content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: link }),
        })
        const result = await response.json()
        if (!response.ok) throw new Error(result.error || "Failed to extract content")
        content = result.content || ""
      } else if (inputType === "topic" && topic) {
        content = topic
      }

      setExtractedContent(content)
      setContentReady(true)
      setShowModal(false)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Failed to process content")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleGenerateQuiz = async () => {
    if (!extractedContent) {
      setError("Please provide content first")
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error("User not authenticated")

      const response = await fetch("/api/generate-mcq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: extractedContent,
          numQuestions: Number.parseInt(numQuestions),
          difficulty,
          subject: selectedSubject,
        }),
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Failed to generate questions")

      setQuestions(result.questions)
      setCurrentQuestionIndex(0)
      setUserAnswers({})
      setShowResults(false)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAnswerSelect = (answer: string) => {
    setUserAnswers({ ...userAnswers, [currentQuestionIndex]: answer })
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmitQuiz = async () => {
    // Calculate score
    let correctCount = 0
    questions.forEach((q, index) => {
      if (userAnswers[index] === q.correct_answer) {
        correctCount++
      }
    })
    setScore(correctCount)
    setShowResults(true)

    // Save to database
    try {
      const supabase = createClient()
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) return

      // Insert questions and attempts
      const questionsToInsert = questions.map((q) => ({
        user_id: user.user.id,
        subject_id: selectedSubject || null,
        question: q.question,
        options: q.options,
        correct_answer: q.correct_answer,
        explanation: q.explanation,
        source_content: extractedContent.substring(0, 500),
      }))

      const { data: insertedQuestions, error: insertError } = await supabase
        .from("mcq_questions")
        .insert(questionsToInsert)
        .select()

      if (insertError) throw insertError

      // Insert attempts
      const attemptsToInsert = insertedQuestions.map((q, index) => ({
        user_id: user.user.id,
        mcq_question_id: q.id,
        selected_answer: userAnswers[index] || "",
        is_correct: userAnswers[index] === questions[index].correct_answer,
      }))

      await supabase.from("user_mcq_attempts").insert(attemptsToInsert)
    } catch (error) {
      console.error("Failed to save quiz results:", error)
    }
  }

  const currentQuestion = questions[currentQuestionIndex]

  const prelimsSubjects = subjects.filter((s) => s.category === "PRELIMS")
  const mainsSubjects = subjects.filter((s) => s.category === "MAINS")
  const optionalSubjects = subjects.filter((s) => s.category === "OPTIONAL")

  return (
    <div className="max-w-4xl mx-auto">
      {!contentReady && !questions.length && (
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-800 flex items-center gap-2">
              <Brain className="w-6 h-6 text-indigo-600" />
              Generate MCQ Quiz
            </CardTitle>
            <CardDescription>Create a quiz from your study materials and test your knowledge</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setShowModal(true)}
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Quiz
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Content Input Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Provide Study Material</DialogTitle>
            <DialogDescription>
              Upload a PDF, provide a link, or enter a topic to generate quiz questions
            </DialogDescription>
          </DialogHeader>

          <Tabs value={inputType} onValueChange={(v) => setInputType(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="topic">
                <FileText className="w-4 h-4 mr-2" />
                Topic
              </TabsTrigger>
              <TabsTrigger value="pdf">
                <Upload className="w-4 h-4 mr-2" />
                PDF
              </TabsTrigger>
              <TabsTrigger value="link">
                <LinkIcon className="w-4 h-4 mr-2" />
                Link
              </TabsTrigger>
            </TabsList>

            <TabsContent value="topic" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Enter Topic or Question</Label>
                <Textarea
                  id="topic"
                  placeholder="e.g., Indian Constitution, Photosynthesis, World War II..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </TabsContent>

            <TabsContent value="pdf" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pdf">Upload PDF File</Label>
                <Input
                  id="pdf"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium"
                />
                {file && <p className="text-sm text-gray-600">Selected: {file.name}</p>}
              </div>
            </TabsContent>

            <TabsContent value="link" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="link">Article or Content URL</Label>
                <Input
                  id="link"
                  type="url"
                  placeholder="https://example.com/article"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </div>
            </TabsContent>
          </Tabs>

          {error && <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">{error}</div>}

          <Button
            onClick={handleProcessContent}
            disabled={isProcessing || (!file && !link && !topic)}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </DialogContent>
      </Dialog>

      {/* Quiz Configuration */}
      {contentReady && !questions.length && (
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-800">Configure Your Quiz</CardTitle>
            <CardDescription>Select subject, difficulty, and number of questions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800">✓ Content ready for quiz generation</p>
              <p className="text-xs text-green-700 mt-1">Preview: {extractedContent.substring(0, 150)}...</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Subject (Optional)</Label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No specific subject</SelectItem>

                    {prelimsSubjects.length > 0 && (
                      <>
                        <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase">Prelims</div>
                        {prelimsSubjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.name}
                          </SelectItem>
                        ))}
                      </>
                    )}

                    {mainsSubjects.length > 0 && (
                      <>
                        <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase">Mains</div>
                        {mainsSubjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.name}
                          </SelectItem>
                        ))}
                      </>
                    )}

                    {optionalSubjects.length > 0 && (
                      <>
                        <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase">Optional</div>
                        {optionalSubjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.name}
                          </SelectItem>
                        ))}
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Difficulty Level</Label>
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

              <div className="space-y-2">
                <Label>Number of Questions</Label>
                <Select value={numQuestions} onValueChange={setNumQuestions}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 Questions</SelectItem>
                    <SelectItem value="10">10 Questions</SelectItem>
                    <SelectItem value="15">15 Questions</SelectItem>
                    <SelectItem value="20">20 Questions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">{error}</div>
            )}

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setContentReady(false)
                  setExtractedContent("")
                }}
                className="flex-1"
              >
                Change Content
              </Button>
              <Button
                onClick={handleGenerateQuiz}
                disabled={isGenerating}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Generate Quiz
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quiz Taking Interface */}
      {questions.length > 0 && !showResults && currentQuestion && (
        <Card className="shadow-xl border-0">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="text-sm font-medium text-indigo-600">
                {Object.keys(userAnswers).length} / {questions.length} Answered
              </span>
            </div>
            <CardTitle className="text-2xl text-slate-800">{currentQuestion.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup
              value={userAnswers[currentQuestionIndex] || ""}
              onValueChange={handleAnswerSelect}
              className="space-y-3"
            >
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors ${
                    userAnswers[currentQuestionIndex] === option
                      ? "bg-indigo-50 border-indigo-200"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <RadioGroupItem value={option} id={`q${currentQuestionIndex}-option-${index}`} />
                  <Label htmlFor={`q${currentQuestionIndex}-option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="flex-1 bg-transparent"
              >
                Previous
              </Button>
              {currentQuestionIndex === questions.length - 1 ? (
                <Button
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(userAnswers).length !== questions.length}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Submit Quiz
                </Button>
              ) : (
                <Button onClick={handleNextQuestion} className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                  Next
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {showResults && (
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-slate-800">Quiz Results</CardTitle>
            <div className="text-center mt-4">
              <div className="text-6xl font-bold text-indigo-600">
                {score} / {questions.length}
              </div>
              <p className="text-xl text-gray-600 mt-2">{Math.round((score / questions.length) * 100)}% Correct</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {questions.map((q, index) => {
              const userAnswer = userAnswers[index]
              const isCorrect = userAnswer === q.correct_answer

              return (
                <Card key={index} className={isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 mt-1" />
                      )}
                      <div className="flex-1">
                        <CardTitle className="text-lg">{q.question}</CardTitle>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm">
                            <span className="font-medium">Your answer:</span>{" "}
                            <span className={isCorrect ? "text-green-700" : "text-red-700"}>{userAnswer}</span>
                          </p>
                          {!isCorrect && (
                            <p className="text-sm">
                              <span className="font-medium">Correct answer:</span>{" "}
                              <span className="text-green-700">{q.correct_answer}</span>
                            </p>
                          )}
                          <p className="text-sm text-gray-700 mt-2">
                            <span className="font-medium">Explanation:</span> {q.explanation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              )
            })}

            <Button
              onClick={() => {
                setQuestions([])
                setContentReady(false)
                setExtractedContent("")
                setUserAnswers({})
                setShowResults(false)
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              Generate New Quiz
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
