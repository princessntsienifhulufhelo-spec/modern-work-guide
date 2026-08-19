import { createFileRoute } from "@tanstack/react-router";

import { AppLayout, PageHeader } from "@/components/AppLayout";
import { ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner | Workplace AI" },
      {
        name: "description",
        content:
          "Break goals into prioritised tasks with time estimates, owners and a realistic schedule.",
      },
      { property: "og:title", content: "AI Task Planner | Workplace AI" },
      {
        property: "og:description",
        content: "Prioritised task plans with estimates and a realistic schedule.",
      },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  return (
    <AppLayout>
      <PageHeader
        title="AI Task Planner"
        description="Describe your goal and constraints — get a prioritised, time-boxed plan you can adjust."
      />
      <ToolWorkspace
        system="You are a pragmatic project planner. Produce a markdown plan with: Objective, Prioritised Tasks (table: Task | Priority | Estimate | Owner), Suggested Schedule, Dependencies and Risks. Keep estimates realistic and never exceed the stated capacity."
        fields={[
          { name: "goal", label: "Goal or project", type: "textarea", placeholder: "Launch the new onboarding flow" },
          { name: "deadline", label: "Deadline", type: "input", placeholder: "In 2 weeks / 30 Sept" },
          { name: "capacity", label: "Available capacity", type: "input", placeholder: "10 hours per week, 2 people" },
          { name: "style", label: "Planning style", type: "select", options: ["Daily breakdown", "Weekly sprints", "Kanban backlog"] },
        ]}
        initialValues={{ goal: "", deadline: "", capacity: "", style: "Weekly sprints" }}
        buildPrompt={(v) =>
          `Create a task plan.\nGoal: ${v["goal"]}\nDeadline: ${v["deadline"]}\nCapacity: ${v["capacity"]}\nStyle: ${v["style"]}`
        }
        submitLabel="Build plan"
        outputLabel="Task plan (editable)"
      />
    </AppLayout>
  );
}
