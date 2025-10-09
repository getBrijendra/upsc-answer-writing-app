"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Brain,
  Sparkles,
  Target,
  FileText,
  Zap,
  BookOpen,
  Award,
  Network,
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  // Text rotation setup
const texts = [
  "AI Intelligence & Insight",
  "AI Mentorship",
  "AI Support & Success"
];

  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length)
    }, 2500) // Change every 2.5s
    return () => clearInterval(interval)
  }, [texts.length])

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Announcement Banner */}
      <div className="w-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white py-3 px-4 text-center font-semibold tracking-wide shadow-md animate-pulse">
        🎙️ Get Ready!{" "}
        <span className="underline underline-offset-4">AI Voice Buddy</span> Is
        Coming Soon !!!!!
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block mb-6 px-4 py-2 bg-secondary rounded-full text-sm font-medium text-secondary-foreground">
            <span className="inline-flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              India's #1 AI-Powered UPSC Buddy
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-6 leading-tight">
            Crack UPSC with
            <span className="block mt-2 text-primary h-[1.5em] overflow-hidden relative pb-2">

              <span
                key={index}
                className="absolute inset-0 animate-fade-text transition-all duration-700 ease-in-out"
              >
                {texts[index]}
              </span>
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            Write, analyze, and learn smarter with AI-powered tools — from answer
            reviews to mind maps. Your UPSC prep just got a next-gen upgrade.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/signup">
              <Button className="bg-primary text-primary-foreground hover:opacity-90 px-10 py-6 text-lg rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 font-semibold">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-10 py-6 text-lg rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-semibold"
              >
                View Pricing
              </Button>
            </Link>
          </div>
        </div>

        {/* Trusted By Section */}
        <div className="text-center mb-20 animate-fade-in-delay">
          <p className="text-sm text-muted-foreground mb-6 uppercase tracking-wider font-medium">
            Trusted by aspirants across India 🇮🇳
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-80">
            <div className="text-2xl font-bold text-foreground">
              10,000+ Active Learners
            </div>
            <div className="text-2xl font-bold text-foreground">
              500K+ Answers Reviewed
            </div>
            <div className="text-2xl font-bold text-foreground">
              95% User Satisfaction
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          <Card className="group p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-card border-2 hover:border-primary cursor-pointer">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Brain className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-3">AI Answer Review</h3>
            <p className="text-muted-foreground">
              Get instant, accurate feedback on your written answers — clarity,
              structure, and content, all analyzed by AI.
            </p>
          </Card>

          <Card className="group p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-card border-2 hover:border-primary cursor-pointer">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Zap className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-3">AI MCQ Generator</h3>
            <p className="text-muted-foreground">
              Generate custom MCQs instantly — just upload a document, paste a
              link, or type your topic. Perfect for smart revision.
            </p>
          </Card>

          <Card className="group p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-card border-2 hover:border-primary cursor-pointer">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <FileText className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Essay Writing Practice</h3>
            <p className="text-muted-foreground">
              Write, refine, and perfect your essays with detailed AI evaluation
              on argument flow, grammar, and structure.
            </p>
          </Card>

          <Card className="group p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-card border-2 hover:border-primary cursor-pointer">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Network className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Mind Map Generator</h3>
            <p className="text-muted-foreground">
              Visualize any topic with AI-generated mind maps — from polity to
              ethics. Input text, docs, or links and watch magic unfold.
            </p>
          </Card>

          <Card className="group p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-card border-2 hover:border-primary cursor-pointer">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Topic Q&A Generator</h3>
            <p className="text-muted-foreground">
              Instantly generate detailed questions and answers for any topic —
              from static GS to current affairs.
            </p>
          </Card>

          <Card className="group p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-card border-2 hover:border-primary cursor-pointer">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Target className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Daily Essay Questions</h3>
            <p className="text-muted-foreground">
              Free daily essay prompts inspired by UPSC standards to sharpen your
              writing and build consistency.
            </p>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-secondary rounded-3xl p-12 md:p-16 border-2 border-border shadow-xl">
          <Award className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Your UPSC Journey, Supercharged by AI
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            From answer reviews to mind maps — everything you need, all in one
            intelligent UPSC preparation platform.
          </p>
          <Link href="/auth/signup">
            <Button className="bg-primary text-primary-foreground hover:opacity-90 px-12 py-6 text-xl rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 font-semibold">
              Start Free Trial Today
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required • Start in 2 minutes
          </p>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeText {
          0% {
            opacity: 0;
            transform: translateY(20%);
          }
          20% {
            opacity: 1;
            transform: translateY(0);
          }
          80% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-20%);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in 0.8s ease-out 0.3s both;
        }

        .animate-fade-text {
          animation: fadeText 2.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}
