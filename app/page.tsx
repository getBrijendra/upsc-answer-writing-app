"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Brain, Sparkles, Target, FileText, CheckCircle, Zap, BookOpen, BarChart3, Award } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block mb-6 px-4 py-2 bg-secondary rounded-full text-sm font-medium text-secondary-foreground">
            <span className="inline-flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              AI-Powered UPSC Preparation
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-6 text-balance leading-tight">
            Master UPSC with
            <span className="block mt-2 bg-gradient-to-r from-foreground via-muted-foreground to-foreground bg-clip-text text-transparent">
              Ai-Powered Buddy
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto text-pretty leading-relaxed">
            Transform your preparation with intelligent feedback, personalized practice, and comprehensive analytics
            designed for UPSC success.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/signup">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 py-6 text-lg rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 font-semibold">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-10 py-6 text-lg rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 bg-transparent font-semibold"
              >
                View Pricing
              </Button>
            </Link>
          </div>
        </div>

        {/* Trusted By Section */}
        <div className="text-center mb-20 animate-fade-in-delay">
          <p className="text-sm text-muted-foreground mb-6 uppercase tracking-wider font-medium">
            Trusted by thousands of UPSC aspirants
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60">
            <div className="text-2xl font-bold text-foreground">10,000+ Users</div>
            <div className="text-2xl font-bold text-foreground">500K+ Answers</div>
            <div className="text-2xl font-bold text-foreground">95% Success</div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          <Card className="group p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-card border-2 border-border hover:border-primary cursor-pointer">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Brain className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">AI Answer Analysis</h3>
            <p className="text-muted-foreground leading-relaxed">
              Get instant, detailed feedback on your answers with AI-powered evaluation covering content, structure, and
              presentation.
            </p>
          </Card>

          <Card className="group p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-card border-2 border-border hover:border-primary cursor-pointer">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Zap className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">Smart MCQ Generator</h3>
            <p className="text-muted-foreground leading-relaxed">
              Transform any study material into practice questions. Upload PDFs, paste links, or enter topics to
              generate custom MCQs.
            </p>
          </Card>

          <Card className="group p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-card border-2 border-border hover:border-primary cursor-pointer">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <FileText className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">Essay Writing Practice</h3>
            <p className="text-muted-foreground leading-relaxed">
              Practice essay writing with AI-generated topics or your own. Get comprehensive analysis on structure,
              arguments, and language.
            </p>
          </Card>

          <Card className="group p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-card border-2 border-border hover:border-primary cursor-pointer">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Target className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">Daily Questions</h3>
            <p className="text-muted-foreground leading-relaxed">
              Stay consistent with curated daily questions covering all Mains subjects. Build a strong practice routine
              effortlessly.
            </p>
          </Card>

          <Card className="group p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-card border-2 border-border hover:border-primary cursor-pointer">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <BarChart3 className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">Progress Analytics</h3>
            <p className="text-muted-foreground leading-relaxed">
              Track your improvement with detailed analytics. Monitor scores, identify weak areas, and optimize your
              preparation strategy.
            </p>
          </Card>

          <Card className="group p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-card border-2 border-border hover:border-primary cursor-pointer">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">Subject Coverage</h3>
            <p className="text-muted-foreground leading-relaxed">
              Complete coverage of all Mains subjects plus your optional subject. Practice with subject-specific
              questions and feedback.
            </p>
          </Card>
        </div>

        {/* How It Works Section */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">How Lemura Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple, powerful, and designed for your success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Choose Your Subject</h3>
              <p className="text-muted-foreground">Select from Mains subjects or your optional subject</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Write Your Answer</h3>
              <p className="text-muted-foreground">Practice with daily questions or create your own</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Get AI Feedback</h3>
              <p className="text-muted-foreground">Receive detailed analysis and improvement suggestions</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Track Progress</h3>
              <p className="text-muted-foreground">Monitor your improvement with comprehensive analytics</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-primary text-primary-foreground rounded-3xl p-12 md:p-16 mb-24 shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="transform hover:scale-110 transition-transform duration-300">
              <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary-foreground to-muted-foreground bg-clip-text text-transparent">
                10K+
              </div>
              <div className="text-muted-foreground text-sm md:text-base">Active Users</div>
            </div>
            <div className="transform hover:scale-110 transition-transform duration-300">
              <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary-foreground to-muted-foreground bg-clip-text text-transparent">
                500K+
              </div>
              <div className="text-muted-foreground text-sm md:text-base">Answers Analyzed</div>
            </div>
            <div className="transform hover:scale-110 transition-transform duration-300">
              <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary-foreground to-muted-foreground bg-clip-text text-transparent">
                95%
              </div>
              <div className="text-muted-foreground text-sm md:text-base">Success Rate</div>
            </div>
            <div className="transform hover:scale-110 transition-transform duration-300">
              <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary-foreground to-muted-foreground bg-clip-text text-transparent">
                4.9/5
              </div>
              <div className="text-muted-foreground text-sm md:text-base">User Rating</div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Why Choose Lemura?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to excel in UPSC Mains
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4 p-6 rounded-2xl hover:bg-secondary transition-colors duration-300">
              <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Instant AI Feedback</h3>
                <p className="text-muted-foreground">
                  Get detailed analysis within seconds, not days. Improve faster with immediate insights.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 rounded-2xl hover:bg-secondary transition-colors duration-300">
              <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Personalized Learning</h3>
                <p className="text-muted-foreground">
                  AI adapts to your writing style and identifies your unique strengths and weaknesses.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 rounded-2xl hover:bg-secondary transition-colors duration-300">
              <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Comprehensive Coverage</h3>
                <p className="text-muted-foreground">
                  All Mains subjects plus optional subjects. Practice everything in one place.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 rounded-2xl hover:bg-secondary transition-colors duration-300">
              <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Affordable Pricing</h3>
                <p className="text-muted-foreground">
                  Credit-based system means you only pay for what you use. No expensive subscriptions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-br from-secondary to-background rounded-3xl p-12 md:p-16 border-2 border-border shadow-xl">
          <Award className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Ready to Ace UPSC Mains?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of successful aspirants who transformed their preparation with Lemura's AI-powered platform.
          </p>
          <Link href="/auth/signup">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-12 py-6 text-xl rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 font-semibold">
              Start Your Free Trial
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground mt-4">No credit card required • Get started in 2 minutes</p>
        </div>
      </div>

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

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in 0.8s ease-out 0.3s both;
        }
      `}</style>
    </div>
  )
}
