"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
// import RobotModel from "@/components/robot-model"
import type { LucideIcon } from "lucide-react"
import {
  Award,
  BarChart2,
  BookOpen,
  Brain,
  FileText,
  Layers,
  Mic,
  Network,
  PenTool,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react"

const viewportOptions = { once: true, amount: 0.3 } as const
const motionEase: [number, number, number, number] = [0.22, 0.8, 0.4, 1]

const fadeIn = (direction: "left" | "right" = "left") => ({
  hidden: {
    opacity: 0,
    x: direction === "left" ? -60 : 60,
    filter: "blur(6px)",
  },
  show: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: motionEase },
  },
})

const motionSectionProps = (direction: "left" | "right" = "left") => ({
  variants: fadeIn(direction),
  initial: "hidden" as const,
  whileInView: "show" as const,
  viewport: viewportOptions,
})

export default function HomePage() {
  const rotatingText = [
    "AI Mentorship",
    "Precision Feedback",
  ]

  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % rotatingText.length)
    }, 2600)
    return () => clearInterval(interval)
  }, [rotatingText.length])

  useEffect(() => {
  }, [])

  // Real feature links (avoid unverifiable marketing metrics)
  const featureLinks = [
    { label: "Answer Writing & Feedback", href: "/practice", detail: "Submit answers for AI scoring" },
    { label: "Essay Practice & Analysis", href: "/essay-practice", detail: "Generate topics & get structured review" },
    { label: "MCQ Generator", href: "/mcq", detail: "Create practice sets from your notes" },
    { label: "Daily Questions", href: "/daily-questions", detail: "Fresh practice prompts each day" },
    { label: "Mindmaps & Flashcards", href: "/dashboard", detail: "Generate visual summaries & revision cards" },
    { label: "Progress Dashboard", href: "/progress", detail: "Track scores & subject trends" },
  ]

  const capabilityTiles: Array<{
    title: string
    description: string
    icon: LucideIcon
    accent: string
  }> = [
      {
        title: "Answer Feedback",
        description: "Submit GS answers and receive AI-generated score & improvement pointers.",
        icon: Brain,
        accent: "from-orange-400/30 via-orange-500/10 to-transparent",
      },
      {
        title: "Essay Practice",
        description: "Generate topics or use your own, then get structured essay analysis.",
        icon: FileText,
        accent: "from-fuchsia-400/30 via-fuchsia-500/10 to-transparent",
      },
      {
        title: "MCQ Generator",
        description: "Turn uploaded text or notes into practice MCQs with explanations.",
        icon: Zap,
        accent: "from-emerald-400/30 via-emerald-500/10 to-transparent",
      },
      {
        title: "Mindmaps & Flashcards",
        description: "Create visual maps and revision cards from custom content (dashboard tools).",
        icon: Network,
        accent: "from-sky-400/30 via-sky-500/10 to-transparent",
      },
      {
        title: "Optional Subjects",
        description: "Subject tagging supports Mains & Optional classification for tracking.",
        icon: Layers,
        accent: "from-violet-400/30 via-violet-500/10 to-transparent",
      },
      {
        title: "Daily Questions",
        description: "Auto-generated practice questions stored once fetched each day.",
        icon: Target,
        accent: "from-blue-400/30 via-blue-500/10 to-transparent",
      },
    ]

  const workflow = [
    {
      title: "Brief the AI mentor",
      description: "Drop a topic, upload notes, or paste a link. The buddy extracts themes, bias, and context for you.",
      stat: "90-sec setup",
      icon: PenTool,
    },
    {
      title: "Write with immersion mode",
      description: "Latency-free editor with tone guardrails, timer, and distraction-free mode to mimic exam halls.",
      stat: "25-min sprint",
      icon: BookOpen,
    },
    {
      title: "Receive deep diagnostics",
      description: "Get macro feedback (structure, balance) + micro notes (keywords, intro/outro) on the same screen.",
      stat: "Under 30s",
      icon: BarChart2,
    },
    {
      title: "Upgrade the next draft",
      description: "One-tap rewrites, counter-arguments, and checklist tracking keep each attempt sharper.",
      stat: "+1 notch score",
      icon: ShieldCheck,
    },
  ]

  const testimonials = [
    {
      name: "Riya Sharma",
      role: "AIR 128 (2024) | PSIR Optional",
      quote:
        "The platform became my night coach. Every essay came back with precise reasons for a mark drop — it shaved weeks off my prep cycle.",
      result: "+64 score jump in Essay",
    },
    {
      name: "Gaurav Singh",
      role: "Working Professional | 2nd Attempt",
      quote:
        "Mind maps + MCQ battleground meant I could revise entire GS II dossiers on Monday mornings before court hearings.",
      result: "4X faster revision loops",
    },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="absolute inset-x-0 top-[-220px] h-[420px] bg-gradient-to-b from-primary/40 via-transparent to-transparent blur-3xl opacity-70" aria-hidden />
      <div className="absolute inset-y-0 right-[-200px] w-[420px] bg-gradient-to-b from-fuchsia-500/20 via-transparent to-transparent blur-3xl opacity-70" aria-hidden />

      {/* Removed upcoming feature banner to reflect only current functionality */}

      <main className="relative mx-auto w-full max-w-6xl space-y-10 px-4 pb-24 pt-12 md:max-w-7xl md:space-y-24 md:px-10 md:pt-16">

        <motion.section
          {...motionSectionProps("left")}
          className="relative -mt-12 flex flex-col gap-6 rounded-3xl border border-primary/30 px-4 py-4 text-primary overflow-hidden sm:flex-row sm:items-center sm:justify-between sm:px-6"
        >
          {/* Vibrant animated gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#ff4d4d]/40 via-[#ff9d00]/40 via-[#00e0ff]/40 to-[#8b5cf6]/40 opacity-80 animate-gradient-x" />

          {/* soft shimmer overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.35),_transparent_70%)] animate-pulse-slow" />

          <div className="relative flex w-full flex-col items-center gap-4 text-center sm:w-auto sm:flex-row sm:items-center sm:gap-3 sm:text-left">
            <span className="rounded-2xl bg-primary/10 p-3 text-primary backdrop-blur">
              <Mic className="h-5 w-5" aria-hidden />
            </span>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em]">Coming soon</p>
              <p className="text-lg font-semibold text-foreground">Voice Answer Coach agent</p>
            </div>
          </div>

          <p className="relative max-w-xl text-center text-sm text-muted-foreground sm:text-left">
            Natural-language prompts + spoken feedback designed for Civil Service Examination mains, essays, and interview drills.
          </p>
        </motion.section>




        <motion.section
          {...motionSectionProps("right")}
          className="relative isolate -mt-6 rounded-[32px] border border-white/10 bg-gradient-to-b from-muted/40 via-background to-background px-4 py-12 sm:px-6 sm:py-16 md:-mt-10 md:px-12"
        >
          <div className="absolute inset-0 rounded-[32px] bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.25),_transparent_55%)]" aria-hidden />
          <div className="relative grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="text-center lg:text-left">
              <div className="mb-6 flex justify-center lg:justify-start">
                <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-background/60 px-4 py-2 text-sm font-medium text-muted-foreground backdrop-blur">
                  <Sparkles className="h-4 w-4 text-primary" />
                  India's definitive AI-powered Civil Service Examination lab
                </div>
              </div>

              <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Start your Civil Services prep with
                <span className="block text-primary">
                  <span className="relative mt-2 block h-10 overflow-hidden pb-25">
                    <span key={index} className="animate-hero-text text-5xl font-black sm:text-6xl">
                      {rotatingText[index]}
                    </span>
                  </span>
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
                A single platform for answer writing, essay mastery, MCQs, and reflective revision. Designed with toppers, tuned by faculty, and powered by GenAI that understands Civil Service exam patterns.
              </p>

              <div className="mt-10 flex flex-wrap justify-center gap-4 lg:justify-start">
                <Link href="/auth/signup">
                  <Button size="lg" className="rounded-full bg-primary px-8 py-6 text-base font-semibold shadow-xl transition hover:shadow-2xl">
                    Start free trial
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full border-2 border-primary/60 px-8 py-6 text-base font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
                  >
                    Explore pricing
                  </Button>
                </Link>
              </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featureLinks.map((feat) => (
            <Link key={feat.label} href={feat.href} className="h-full">
              <Card
                className="group flex h-full flex-col gap-1 rounded-2xl border bg-background p-5 shadow-[0_25px_45px_rgba(15,23,42,0.12)] transition">
                <p className="text-xs uppercase tracking-[0.2em] font-bold text-black">
                  {feat.label}
                </p>

                <p className="text-sm text-black">{feat.detail}</p>
              </Card>
            </Link>
          ))}
        </div>


            </div>

            <div className="relative mx-auto mt-4 w-full max-w-xl sm:mt-6 lg:-mt-45 lg:mx-0 lg:max-w-none">

              <div className="absolute -left-10 -top-10 hidden h-40 w-40 rounded-full bg-primary/30 blur-3xl sm:block" aria-hidden />
              <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900/80 to-slate-900 p-6 text-white shadow-[0_40px_90px_rgba(15,23,42,0.55)]">
                <div className="absolute inset-x-10 top-0 h-32 rounded-full bg-primary/30 blur-3xl" aria-hidden />
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70">
                  <Image
                    src="/robot.png"
                    alt="AI mentor interface"
                    fill
                    sizes="(min-width: 1024px) 520px, 80vw"
                    className="object-contain lg:object-top drop-shadow-[0_25px_55px_rgba(15,23,42,0.85)]"
                    priority
                  />
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {[
                    {
                      title: "Civil Service Exams tuned mentor",
                      description: "Trained on past papers, toppers' answers, and faculty inputs",
                    },
                    {
                      title: "360° feedback",
                      description: "Examine your submitted answer with all round diagnostics",
                    },
                    {
                      title: "Multi-format lab",
                      description: "Answers, essays, MCQs, mindmaps, flashcards",
                    },
                    {
                      title: "Voice Agent - Coming Soon",
                      description: "Helps you to get direct interview level pratice and will tell you how to improve",
                    },
                  ].map((chip) => (
                    <div key={chip.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-white/70">{chip.title}</p>
                      <p className="mt-2 text-sm text-white/80">{chip.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.section>


<motion.section
  {...motionSectionProps("left")}
  className="flex flex-wrap items-center justify-center gap-4 rounded-3xl 
  border border-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 
  px-8 py-8 text-center text-xs uppercase tracking-[0.3em] text-white shadow-xl"
>
  <span className="font-bold">Answers</span>
  <span className="font-bold">Essays</span>
  <span className="font-bold">MCQs</span>
  <span className="font-bold">Daily Practice</span>
  <span className="font-bold">Mindmaps</span>
  <span className="font-bold">Flashcards</span>
  <span className="font-bold">Progress Tracking</span>
</motion.section>


        <motion.section
          {...motionSectionProps("right")}
          className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr]"
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Platform Overview</p>
            <h2 className="mt-4 text-3xl font-bold text-foreground sm:text-4xl">Integrated preparation tools in one workspace</h2>
            <p className="mt-4 text-lg text-muted-foreground">All listed modules are active and usable today—no placeholder claims.</p>

            <div className="mt-8 space-y-6">
              {["AI answer feedback", "Essay topic generation", "MCQ creation from notes"].map((point) => (
                <div key={point} className="flex items-start gap-4">
                  <div className="mt-1 h-8 w-8 rounded-full border border-primary/40 bg-primary/10 text-primary">
                    <div className="flex h-full w-full items-center justify-center text-sm font-semibold">★</div>
                  </div>
                  <p className="text-base text-foreground">{point}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative rounded-[28px] border border-border/40 bg-card/70 p-1 shadow-2xl">
            <div className="rounded-[24px] bg-background/80 p-6 sm:p-8 lg:p-10">
              <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">Live systems view</p>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent p-6">
                  <p className="text-xs text-muted-foreground">Essay readiness</p>
                  <p className="text-4xl font-bold text-primary">87%</p>
                  <p className="text-sm text-muted-foreground">Streak: 11 days</p>
                </div>
                <div className="rounded-3xl border border-border/50 bg-card p-6">
                  <p className="text-xs text-muted-foreground">MCQ accuracy (GS II)</p>
                  <p className="text-4xl font-bold text-foreground">78%</p>
                  <p className="text-sm text-muted-foreground">+9% vs last week</p>
                </div>
                <div className="rounded-3xl border border-border/50 bg-card p-6">
                  <p className="text-xs text-muted-foreground">Reflection queue</p>
                  <p className="text-lg font-semibold text-foreground">3 essays awaiting review</p>
                  <p className="text-sm text-muted-foreground">Avg response: 28s</p>
                </div>
                <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-emerald-400/10 to-transparent p-6">
                  <p className="text-xs text-muted-foreground">Free credits</p>
                  <p className="text-4xl font-bold text-foreground">50</p>
                  <p className="text-sm text-muted-foreground">Auto add on sign-up</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section {...motionSectionProps("left")}>
          <div className="mb-10 flex flex-col gap-3 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-primary">Capabilities</p>
            <h2 className="text-3xl font-bold sm:text-4xl">Current implemented modules</h2>
            <p className="text-lg text-muted-foreground">Write answers, practice essays, generate MCQs, build mindmaps & flashcards, view progress, and fetch daily questions.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {capabilityTiles.map((tile) => (
              <Card
                key={tile.title}
                className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card/80 p-7 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className={`absolute inset-0 opacity-0 transition group-hover:opacity-100 bg-gradient-to-br ${tile.accent}`} aria-hidden />
                <div className="relative flex gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <tile.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">{tile.title}</h3>
                    <p className="mt-2 text-base text-muted-foreground">{tile.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.section>

        <motion.section
          {...motionSectionProps("right")}
          className="rounded-[32px] border border-border/40 bg-secondary/30 p-6 sm:p-8 md:p-12"
        >
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-secondary-foreground">Workflow</p>
            <h2 className="mt-4 text-3xl font-bold text-foreground">Typical usage flow</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {workflow.map((step, idx) => (
              <div key={step.title} className="rounded-3xl border border-border/50 bg-background/70 p-6 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <div className="text-sm font-semibold text-muted-foreground">Step {idx + 1}</div>
                </div>
                <h3 className="mt-4 text-2xl font-semibold text-foreground">{step.title}</h3>
                <p className="mt-3 text-base text-muted-foreground">{step.description}</p>
                <p className="mt-5 inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">{step.stat}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* <section className="mt-24">
          <div className="mb-10 flex flex-col gap-3 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-primary">Proof on record</p>
            <h2 className="text-3xl font-bold">Aspirants who turned the tide</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {testimonials.map((voice) => (
              <Card key={voice.name} className="relative rounded-3xl border border-border/40 bg-card/80 p-8 shadow-lg">
                <div className="absolute right-8 top-8 text-4xl text-primary" aria-hidden>“</div>
                <p className="text-lg text-foreground">{voice.quote}</p>
                <div className="mt-6 flex flex-col">
                  <span className="text-base font-semibold text-foreground">{voice.name}</span>
                  <span className="text-sm text-muted-foreground">{voice.role}</span>
                  <span className="mt-2 inline-flex w-fit rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold text-primary">{voice.result}</span>
                </div>
              </Card>
            ))}
          </div>
        </section> */}

        <motion.section
          {...motionSectionProps("left")}
          className="rounded-[32px] border border-primary/30 bg-gradient-to-br from-primary/15 via-background to-background p-6 sm:p-8 lg:p-10 text-center shadow-2xl"
        >
          <Award className="mx-auto h-14 w-14 text-primary" />
          <h2 className="mt-6 text-3xl font-bold sm:text-4xl">Start using the active modules today</h2>
          <p className="mt-4 text-lg text-muted-foreground">Sign up, generate daily questions, submit answers, practice essays, build MCQs, and view your progress—all live.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/auth/signup">
              <Button size="lg" className="rounded-full bg-primary px-10 py-6 text-base font-semibold">
                Get Started
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="rounded-full border-2 px-10 py-6 text-base font-semibold">
                View Pricing
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Credit-based usage • Cancel anytime</p>
        </motion.section>
      </main>

      <style jsx>{`
        @keyframes heroShift {
          0% {
            opacity: 0;
            transform: translateY(100%);
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
            transform: translateY(-60%);
          }
        }

        .animate-hero-text {
          animation: heroShift 2.6s ease-in-out;
        }

        /* ⚡ Ultra-Vibrant Horizontal Gradient */
@keyframes gradient-x {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* ✨ Glow Pulse */
@keyframes pulse-slow {
  0%, 100% { opacity: 0.45; }
  50% { opacity: 0.9; }
}

/* 🎆 Apply to background */
.animate-gradient-x {
  background-size: 400% 400%;
  animation: gradient-x 6s ease infinite;
}

/* 🌟 Shimmer */
.animate-pulse-slow {
  animation: pulse-slow 5s ease-in-out infinite;
}`}</style>
    </div>
  )
}
