"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2, ListTodo, Sparkles, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const features = [
    {
      icon: <ListTodo className="h-6 w-6" />,
      title: "Smart Organization",
      description: "Categorize and prioritize your tasks with intuitive filtering",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Lightning Fast",
      description: "Instant updates and seamless performance",
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "Clean Design",
      description: "Minimalist interface that keeps you focused",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-8 w-8 text-primary" />
            <span className="text-xl font-semibold">Do</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Stay organized,{" "}
            <span className="text-primary">get things done</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
            A beautifully simple todo app that helps you manage your tasks, 
            organize your life, and achieve your goals with minimal effort.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/sign-up">
              <Button size="lg" className="h-12 px-8">
                Start for Free
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button size="lg" variant="outline" className="h-12 px-8">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group rounded-2xl border bg-card p-8 transition-all hover:shadow-lg hover:border-primary/20"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl bg-primary px-6 py-16 text-center sm:px-12">
            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Join thousands of users who are already staying organized with Do.
            </p>
            <div className="mt-8">
              <Link href="/sign-up">
                <Button
                  size="lg"
                  variant="secondary"
                  className="h-12 px-8"
                >
                  Create Free Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Do</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Do. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
