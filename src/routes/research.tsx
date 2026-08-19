import { createFileRoute } from "@tanstack/react-router";

import { AppLayout, PageHeader } from "@/components/AppLayout";
import { ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant | Workplace AI" },
      {
        name: "description",
        content:
          "Get structured briefings on any work topic: key points, comparisons, risks and open questions.",
      },
      { property: "og:title", content: "AI Research Assistant | Workplace AI" },
      {
        property: "og:description",
        content: "Structured briefings with key points, trade-offs and open questions.",
      },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  return (
    <AppLayout>
      <PageHeader
        title="AI Research Assistant"
        description="Ask a work question and get a structured briefing, with clearly flagged uncertainty."
      />
      <ToolWorkspace
        system="You are a careful research analyst. Produce a markdown briefing: Overview, Key Findings, Comparison or Options, Risks & Caveats, Open Questions to verify. Clearly state when something is uncertain, time-sensitive, or outside your knowledge. Do not fabricate statistics, citations or sources."
        fields={[
          { name: "topic", label: "Research question", type: "textarea", placeholder: "What should we consider when choosing a CRM for a 40-person services firm?" },
          { name: "audience", label: "Audience", type: "input", placeholder: "Exec team, non-technical" },
          { name: "format", label: "Output format", type: "select", options: ["Briefing note", "Bullet summary", "Pros & cons comparison", "FAQ"] },
          { name: "depth", label: "Depth", type: "select", options: ["Quick scan", "Standard", "In-depth"] },
        ]}
        initialValues={{ topic: "", audience: "", format: "Briefing note", depth: "Standard" }}
        buildPrompt={(v) =>
          `Research request: ${v.topic}\nAudience: ${v.audience}\nFormat: ${v.format}\nDepth: ${v.depth}`
        }
        submitLabel="Run research"
        outputLabel="Briefing (editable)"
      />
    </AppLayout>
  );
}
