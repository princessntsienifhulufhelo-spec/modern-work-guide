import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { Loader2, SendHorizonal, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

import { AiDisclaimer } from "@/components/AiDisclaimer";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { runAssistant } from "@/lib/ai.functions";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot Assistant | Workplace AI" },
      {
        name: "description",
        content:
          "Chat with an AI workplace assistant for drafting, planning, analysis and everyday work questions.",
      },
      { property: "og:title", content: "AI Chatbot Assistant | Workplace AI" },
      {
        property: "og:description",
        content: "A conversational AI assistant for everyday workplace tasks.",
      },
    ],
  }),
  component: ChatPage,
});

const SYSTEM =
  "You are Workplace AI, a helpful, concise assistant for professionals. Help with drafting, summarising, planning and analysis. Use markdown. Be honest about uncertainty and never invent facts, sources or figures.";

type Message = { role: "user" | "assistant"; content: string };

function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const callAssistant = useServerFn(runAssistant);

  const mutation = useMutation({
    mutationFn: async (history: Message[]) => {
      const transcript = history
        .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
        .join("\n\n");
      return callAssistant({
        data: { system: SYSTEM, prompt: `${transcript}\n\nAssistant:` },
      });
    },
    onSuccess: (result) =>
      setMessages((m) => [...m, { role: "assistant", content: result.text.trim() }]),
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, mutation.isPending]);

  const send = () => {
    const text = input.trim();
    if (!text || mutation.isPending) return;
    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    mutation.mutate(next);
  };

  return (
    <AppLayout>
      <PageHeader
        title="AI Chatbot"
        description="Ask anything about your work — drafting, analysis, planning or quick explanations."
      />

      <Card className="flex h-[62vh] flex-col overflow-hidden p-0 shadow-[var(--shadow-card)]">
        <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <span className="bg-gradient-brand mb-3 flex size-11 items-center justify-center rounded-xl">
                <Sparkles className="size-5 text-primary-foreground" />
              </span>
              <p className="text-sm font-medium">How can I help with your work today?</p>
              <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                Try: “Draft an agenda for a 30-minute project kickoff.”
              </p>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground",
                )}
              >
                {message.role === "assistant" ? (
                  <div className="markdown-body">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                ) : (
                  message.content
                )}
              </div>
            </div>
          ))}

          {mutation.isPending && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Thinking…
            </div>
          )}
          {mutation.isError && (
            <p className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              {(mutation.error as Error).message}
            </p>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-border bg-card p-3 sm:p-4">
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={2}
              placeholder="Message Workplace AI…"
              className="resize-none"
            />
            <Button onClick={send} disabled={mutation.isPending || !input.trim()} size="icon">
              <SendHorizonal className="size-4" />
            </Button>
          </div>
        </div>
      </Card>

      <AiDisclaimer />
    </AppLayout>
  );
}
