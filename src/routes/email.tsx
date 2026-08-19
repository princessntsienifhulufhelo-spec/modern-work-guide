import { createFileRoute } from "@tanstack/react-router";

import { AppLayout, PageHeader } from "@/components/AppLayout";
import { ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | Workplace AI" },
      {
        name: "description",
        content:
          "Draft professional workplace emails in seconds with structured prompts and editable AI output.",
      },
      { property: "og:title", content: "Smart Email Generator | Workplace AI" },
      {
        property: "og:description",
        content: "Draft professional workplace emails in seconds with editable AI output.",
      },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Smart Email Generator"
        description="Turn a few bullet points into a polished, on-tone email you can edit and send."
      />
      <ToolWorkspace
        system="You are an expert business communication assistant. Write clear, concise, professional emails. Output only the email: a subject line, then the body. Never invent facts that were not provided."
        fields={[
          { name: "recipient", label: "Recipient & relationship", type: "input", placeholder: "e.g. Client, Head of Ops" },
          { name: "purpose", label: "Purpose / key points", type: "textarea", placeholder: "Reschedule Thursday's review to Monday; apologise; propose 10am or 2pm." },
          { name: "tone", label: "Tone", type: "select", options: ["Professional", "Friendly", "Formal", "Direct", "Apologetic", "Persuasive"] },
          { name: "length", label: "Length", type: "select", options: ["Short", "Medium", "Detailed"] },
          { name: "signoff", label: "Sign-off name", type: "input", placeholder: "Thabo, Operations" },
        ]}
        initialValues={{ recipient: "", purpose: "", tone: "Professional", length: "Short", signoff: "" }}
        buildPrompt={(v) =>
          `Write a workplace email.\nRecipient: ${v.recipient}\nTone: ${v.tone}\nLength: ${v.length}\nSign-off: ${v.signoff}\nKey points:\n${v.purpose}`
        }
        submitLabel="Generate email"
        outputLabel="Email draft (editable)"
      />
    </AppLayout>
  );
}
