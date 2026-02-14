import Link from "next/link";
import Image from "next/image";
import {
  CheckSquare,
  ArrowRight,
  Zap,
  Shield,
  Calendar,
  BarChart3,
  Moon,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="fixed left-1/2 top-6 z-50 w-[calc(100%-2rem)] max-w-4xl -translate-x-1/2 sm:w-[calc(100%-4rem)]">
        <div className="flex h-14 items-center justify-between rounded-full border border-border/40 bg-background/80 px-3 shadow-xl backdrop-blur-md">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 font-bold text-lg"
          >
            <CheckSquare className="h-5 w-5 text-primary" />
            <span>TodoApp</span>
          </Link>

          <nav className="hidden items-center gap-6 sm:flex">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Pricing
            </Link>
            <Link
              href="#about"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              About
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="hidden rounded-full text-sm sm:inline-flex"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="rounded-full px-5 text-sm shadow-md">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-28">
        <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[14px_24px]" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_800px_at_100%_200px,#e4e4e7,transparent)] dark:bg-[radial-gradient(circle_800px_at_100%_200px,#27272a,transparent)]" />

          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col items-center justify-center gap-6 py-20 text-center sm:py-24 md:py-32">
              <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-sm shadow-sm">
                <Sparkles className="h-4 w-4 text-yellow-500" />
                <span className="text-muted-foreground">
                  New: Calendar view now available
                </span>
              </div>

              <div className="mx-auto max-w-4xl space-y-4">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                  Stay Organized,
                  <br />
                  <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Achieve More
                  </span>
                </h1>

                <p className="mx-auto max-w-[650px] text-lg text-muted-foreground sm:text-xl md:text-2xl">
                  The intelligent todo app that helps you manage tasks, set
                  priorities, and track productivity — all in one focused,
                  minimal interface.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="h-12 gap-2 px-8 text-base shadow-lg transition hover:scale-[1.02]"
                  >
                    Start for Free
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 px-8 text-base"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap justify-center gap-8 pt-8 text-center sm:gap-12">
                <div>
                  <div className="text-2xl font-bold sm:text-3xl">10K+</div>
                  <div className="text-sm text-muted-foreground">
                    Active Users
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold sm:text-3xl">1M+</div>
                  <div className="text-sm text-muted-foreground">
                    Tasks Completed
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold sm:text-3xl">99.9%</div>
                  <div className="text-sm text-muted-foreground">Uptime</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="border-y bg-muted/50 px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
        >
          <div className="container mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need to stay productive
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Carefully designed features that help you focus and execute.
              </p>
            </div>

            <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: <CheckSquare className="h-6 w-6" />,
                  title: "Smart Task Management",
                  desc: "Create, organize, and track tasks with intuitive workflows.",
                  color: "bg-primary/10 text-primary",
                },
                {
                  icon: <Zap className="h-6 w-6" />,
                  title: "Priority Levels",
                  desc: "Focus on what matters most with smart prioritization.",
                  color: "bg-orange-500/10 text-orange-500",
                },
                {
                  icon: <Calendar className="h-6 w-6" />,
                  title: "Calendar View",
                  desc: "Visual planning for better time management.",
                  color: "bg-blue-500/10 text-blue-500",
                },
                {
                  icon: <BarChart3 className="h-6 w-6" />,
                  title: "Productivity Analytics",
                  desc: "Track completion rates and performance insights.",
                  color: "bg-green-500/10 text-green-500",
                },
                {
                  icon: <Moon className="h-6 w-6" />,
                  title: "Dark Mode",
                  desc: "Comfortable viewing experience, day or night.",
                  color: "bg-purple-500/10 text-purple-500",
                },
                {
                  icon: <Shield className="h-6 w-6" />,
                  title: "Secure & Private",
                  desc: "JWT authentication with encrypted data storage.",
                  color: "bg-red-500/10 text-red-500",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-xl border bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div
                    className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg ${feature.color}`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        
        <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="container mx-auto max-w-4xl">
            <div className="rounded-2xl bg-primary px-6 py-12 text-center text-primary-foreground shadow-xl sm:px-12 sm:py-16">
              <h2 className="text-3xl font-bold sm:text-4xl">
                Ready to get started?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/80">
                Join thousands organizing their work with clarity.
              </p>

              <div className="mt-8">
                <Link href="/register">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="h-12 gap-2 px-8 shadow-md"
                  >
                    Create Free Account
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t px-4 py-8 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-primary" />
              <span className="font-semibold">TodoApp</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built with Next.js, shadcn/ui, TanStack Query & Zustand
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
