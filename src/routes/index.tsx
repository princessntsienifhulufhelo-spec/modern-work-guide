import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bot, CalendarCheck, Mail, NotebookPen, Search } from "lucide-react";

import { AiDisclaimer } from "@/components/AiDisclaimer";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Automate workplace tasks with AI: draft emails, summarise meetings, plan work, research topics and chat with an assistant.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Draft emails, summarise meetings, plan tasks and research faster with AI.",
      },
    ],
  }),
  component: Dashboard,
});

const tools = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    description: "Turn bullet points into polished, on-tone emails ready to review and send.",
  },
  {
    to: "/notes",
    icon: NotebookPen,
    title: "Meeting Notes Summarizer",
    description: "Summaries, decisions and action items extracted from raw notes or transcripts.",
  },
  {
    to: "/planner",
    icon: CalendarCheck,
    title: "AI Task Planner",
    description: "Prioritised, time-boxed plans that respect your deadline and real capacity.",
  },
  {
    to: "/research",
    icon: Search,
    title: "AI Research Assistant",
    description: "Structured briefings with options, trade-offs and questions still to verify.",
  },
  {
    to: "/chat",
    icon: Bot,
    title: "AI Chatbot",
    description: "A conversational assistant for anything that doesn't fit a template.",
  },
] as const;

function Dashboard() {
  return (
    <AppLayout>
      <section className="bg-gradient-brand mb-10 rounded-2xl px-6 py-10 text-primary-foreground shadow-[var(--shadow-elevated)] sm:px-10 sm:py-12">
        <p className="text-xs font-medium uppercase tracking-[0.2em] opacity-80">
          Workplace AI Suite
        </p>
        <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
          Automate the busywork. Keep the judgement.
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed opacity-90">
          Five focused AI tools for professionals — structured prompts in, editable drafts out.
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        {tools.map(({ to, icon: Icon, title, description }) => (
          <Link key={to} to={to} className="group">
            <Card className="h-full transition-shadow shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)]">
              <CardHeader>
                <span className="mb-2 flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <Icon className="size-5" />
                </span>
                <CardTitle className="text-base">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Open tool
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <AiDisclaimer />
    </AppLayout>
  );
}
