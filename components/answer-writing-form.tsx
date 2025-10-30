"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Loader2,
  Eye,
  Send,
  Coins,
  AlertTriangle,
  Brain,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getUserCredits } from "@/lib/credits";
import { uploadToSupabase } from "@/lib/supabase/uploadFile";
import ExtractedTextModal from "@/components/ExtractedTextModal";

interface AnswerWritingFormProps {
  subjects: Array<{
    id: string;
    name: string;
    description?: string;
    category?: string;
  }>;
}

export default function AnswerWritingForm({ subjects }: AnswerWritingFormProps) {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [language, setLanguage] = useState("english");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [fileCache, setFileCache] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userCredits, setUserCredits] = useState<number>(0);
  const [creditCost, setCreditCost] = useState<number>(5);
  const [loadingCredits, setLoadingCredits] = useState(true);
  const router = useRouter();

  // 🔹 Load user credits and operation cost
  useEffect(() => {
    const fetchCreditsInfo = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { credits } = await getUserCredits(user.id);
          setUserCredits(credits);

          const { data: costData } = await supabase
            .from("credit_costs")
            .select("cost")
            .eq("operation_type", "answer_review")
            .single();

          if (costData) setCreditCost(costData.cost);
        }
      } catch (error) {
        console.error("Error fetching credits info:", error);
      } finally {
        setLoadingCredits(false);
      }
    };

    fetchCreditsInfo();
  }, []);

  // 🔹 Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(newFiles);
      setUploadedUrls([]);
      setExtractedText(null);
    }
  };

  // 🔹 Upload & Extract Text
  const handleFileUploadAndExtract = async () => {
    if (files.length === 0) return;
    setError(null);

    const allCached = files.every((file) => fileCache[file.name]);

    if (allCached) {
      // ✅ All files already processed, use cache
      const cachedText = Object.values(fileCache).join("\n\n");
      setExtractedText(cachedText);
      setShowPreviewModal(true);
      return;
    }

    // 🔄 Otherwise, upload + call OCR API
    setIsUploading(true);
    try {
      const supabase = createClient();
      const urls: string[] = [];

      // Upload each file to Supabase
      for (const file of files) {
        const url = await uploadToSupabase(file, "user_uploaded_answers");
        urls.push(url);
      }

      // Call the OCR endpoint
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/extract-image-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_urls: urls }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to extract text");

      const text = data.text || "";
      setUploadedUrls(urls);
      setExtractedText(text);

      // Cache extracted text
      const updatedCache = { ...fileCache };
      for (const file of files) {
        updatedCache[file.name] = text;
      }
      setFileCache(updatedCache);

      setShowPreviewModal(true);
    } catch (err: any) {
      setError(err.message || "File upload or processing failed");
    } finally {
      setIsUploading(false);
    }
  };

  // 🔹 Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSubject) return setError("Please select a subject");
    if (!question.trim() || !answer.trim())
      return setError("Please provide both question and answer");
    if (userCredits < creditCost)
      return setError(
        `Insufficient credits. You need ${creditCost} credits but only have ${userCredits}.`
      );

    setIsSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: user } = await supabase.auth.getUser();

      if (!user.user) throw new Error("User not authenticated");

      // Step 1: Insert answer record
      const { data: insertedAnswer, error: insertError } = await supabase
        .from("answers")
        .insert({
          user_id: user.user.id,
          subject_id: selectedSubject,
          question: question.trim(),
          answer_text: answer.trim(),
          file_url: uploadedUrls.join(", "),
          language,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Step 2: Generate feedback
      const feedbackResponse = await fetch("/api/generate-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.trim(),
          answer: answer.trim(),
          subject: selectedSubject,
          language,
          file_urls: uploadedUrls,
        }),
      });

      const feedbackResult = await feedbackResponse.json();
      if (!feedbackResponse.ok)
        throw new Error(feedbackResult.error || "Failed to generate feedback");

      // Step 3: Update feedback in DB
      await supabase
        .from("answers")
        .update({
          feedback: feedbackResult.feedback,
          score: feedbackResult.feedback.overall_score,
        })
        .eq("id", insertedAnswer.id);

      router.push(`/answer/${insertedAnswer.id}`);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const mainsSubjects = subjects.filter((s) => s.category === "MAINS");
  const optionalSubjects = subjects.filter((s) => s.category === "OPTIONAL");

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-xl border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-slate-800 flex items-center gap-2">
                <Brain className="w-6 h-6 text-indigo-600" />
                Submit Your Answer for AI Analysis
              </CardTitle>
              <CardDescription>
                Write your answer and receive detailed AI-powered feedback
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
              <Coins className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">
                {loadingCredits ? "..." : userCredits}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {!loadingCredits && userCredits < creditCost && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-medium">Insufficient Credits</span>
              </div>
              <p className="text-red-700 mt-1">
                You need {creditCost} credits for AI feedback but only have{" "}
                {userCredits}. Please purchase more credits.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Subject & Language */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select
                  value={selectedSubject}
                  onValueChange={setSelectedSubject}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {mainsSubjects.length > 0 && (
                      <>
                        <div className="px-2 py-1 text-xs text-gray-500 font-semibold uppercase">
                          Mains
                        </div>
                        {mainsSubjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.name}
                          </SelectItem>
                        ))}
                      </>
                    )}
                    {optionalSubjects.length > 0 && (
                      <>
                        <div className="px-2 py-1 text-xs text-gray-500 font-semibold uppercase mt-2">
                          Optional
                        </div>
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
                <Label htmlFor="language">Language</Label>
                <Select
                  value={language}
                  onValueChange={setLanguage}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="hindi">Hindi (हिंदी)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Question */}
            <div className="space-y-2">
              <Label htmlFor="question">Question</Label>
              <Textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter the UPSC question..."
                className="min-h-[100px]"
              />
            </div>

            {/* Answer */}
            <div className="space-y-2">
              <Label htmlFor="answer">Your Answer</Label>
              <Textarea
                id="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Write your detailed answer..."
                className="min-h-[300px]"
              />
              <div className="text-sm text-slate-500">
                Word count:{" "}
                {
                  answer
                    .trim()
                    .split(/\s+/)
                    .filter((w) => w.length > 0).length
                }
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label>Upload Supporting Files</Label>
              <Input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={handleFileChange}
              />
              {files.length > 0 && (
                <div className="mt-2 space-y-1">
                  {files.map((f) => (
                    <div key={f.name} className="text-sm flex items-center gap-2 text-slate-600">
                      <FileText className="w-4 h-4" /> {f.name}
                    </div>
                  ))}
                </div>
              )}
              {files.length > 0 && (
                <Button
                  type="button"
                  onClick={handleFileUploadAndExtract}
                  disabled={isUploading}
                  className="mt-2"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing Files...
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-2" /> Preview Extracted Text
                    </>
                  )}
                </Button>
              )}
            </div>

            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
              disabled={isSubmitting || userCredits < creditCost}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" /> Submit Answer ({creditCost} credits)
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 🔹 Modal Preview */}
      <ExtractedTextModal
        open={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        extractedText={extractedText}
      />
    </div>
  );
}
