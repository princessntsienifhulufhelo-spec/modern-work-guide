import { createFileRoute } from "@tanstack/react-router";

import { AppLayout, PageHeader } from "@/components/AppLayout";
import { ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer | Workplace AI" },
      {
        name: "description",
        content:
          "Turn raw meeting notes or transcripts into structured summaries, decisions and action items.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer | Workplace AI" },
      {
        property: "og:description",
        content: "Structured summaries, decisions and owners from raw meeting notes.",
      },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Meeting Notes Summarizer"
        description="Paste a transcript or messy notes and get a summary, decisions, action items and owners."
      />
      <ToolWorkspace
        system="You are a meticulous meeting analyst. Summarise only what is present in the notes. Return markdown with sections: Summary, Key Decisions, Action Items (owner + due date if stated), Risks/Open Questions. If information is missing, write 'Not stated'."
        fields={[
          { name: "title", label: "Meeting title", type: "input", placeholder: "Q3 Product Review" },
          { name: "attendees", label: "Attendees", type: "input", placeholder: "Lerato, Sam, Nia" },
          { name: "notes", label: "Raw notes or transcript", type: "textarea", rows: 12, placeholder: "Paste your notes here…" },
          { name: "detail", label: "Summary depth", type: "select", options: ["Executive brief", "Balanced", "Detailed minutes"] },
        ]}
        initialValues={{ title: "", attendees: "", notes: "", detail: "Balanced" }}
        buildPrompt={(v) =>
          `Summarise this meeting.\nTitle: ${v.title}\nAttendees: ${v.attendees}\nDepth: ${v.detail}\n\nNotes:\n${v.notes}`
        }
        submitLabel="Summarize notes"
        outputLabel="Summary (editable)"
      />
    </AppLayout>
  );
}
